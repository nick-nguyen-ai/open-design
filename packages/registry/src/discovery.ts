import { pathToFileURL } from 'node:url';
import { glob } from 'tinyglobby';
import type { z } from 'zod';
import {
  ComponentManifest,
  ExperienceManifest,
  DesignGrammar,
  MotionSequence,
} from '@enterprise-design/contracts';
import type { Diagnostic } from './types.js';
import { compareStrings } from './util.js';

/**
 * Manifest discovery is suffix-based (LOCKED): a manifest is any source file
 * whose name ends in one of these suffixes, `export default`-ing a typed object.
 * Component and experience discovery is additionally scoped to their canonical
 * directories; grammars and motion sequences may live anywhere.
 */
export const DISCOVERY_GLOBS = {
  component: 'packages/**/*.component.manifest.ts',
  experience: 'experiences/**/*.experience.manifest.ts',
  grammar: '**/*.grammar.manifest.ts',
  motion: '**/*.motion.manifest.ts',
} as const;

/**
 * Never scan build output, dependencies, generated artefacts, or the registry's
 * own test fixtures. Excluding `__fixtures__` is what lets `registry:validate`
 * succeed on the real (empty) workspace even though the fixtures contain
 * intentionally-invalid manifests.
 */
const IGNORE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/generated/**',
  '**/__fixtures__/**',
  '**/*.test.ts',
  '**/*.spec.ts',
];

/** A successfully-parsed manifest paired with the file it came from. */
export interface Loaded<T> {
  manifest: T;
  path: string;
}

export interface DiscoveredManifests {
  components: Loaded<ComponentManifest>[];
  experiences: Loaded<ExperienceManifest>[];
  grammars: Loaded<DesignGrammar>[];
  motionSequences: Loaded<MotionSequence>[];
}

async function loadAndValidate<T>(
  files: string[],
  schema: z.ZodType<T>,
  kind: string,
  diagnostics: Diagnostic[],
): Promise<Loaded<T>[]> {
  const out: Loaded<T>[] = [];
  // Sort files so import + validation order (and therefore diagnostic order) is deterministic.
  for (const file of [...files].sort(compareStrings)) {
    let mod: unknown;
    try {
      // A file:// URL is required for Node/tsx to import an absolute path on
      // Windows; Vitest's module runner also honours it and transpiles the .ts.
      mod = (await import(/* @vite-ignore */ pathToFileURL(file).href)) as unknown;
    } catch (error) {
      diagnostics.push({
        ruleId: 'IMPORT_FAILED',
        severity: 'error',
        message: `Failed to import ${kind} manifest: ${(error as Error).message}`,
        path: file,
      });
      continue;
    }

    const value = (mod as { default?: unknown }).default;
    if (value === undefined) {
      diagnostics.push({
        ruleId: 'MISSING_DEFAULT_EXPORT',
        severity: 'error',
        message: `${kind} manifest has no default export`,
        path: file,
      });
      continue;
    }

    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const at = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        diagnostics.push({
          ruleId: 'SCHEMA_INVALID',
          severity: 'error',
          message: `${kind} schema violation at ${at}: ${issue.message}`,
          path: file,
        });
      }
      continue;
    }

    out.push({ manifest: parsed.data, path: file });
  }
  return out;
}

/**
 * Glob each suffix under `cwd`, dynamically import every match, and validate it
 * against the matching Zod schema. Errors are collected into `diagnostics` — a
 * single bad manifest never aborts discovery of the rest.
 */
export async function discover(cwd: string, diagnostics: Diagnostic[]): Promise<DiscoveredManifests> {
  const [componentFiles, experienceFiles, grammarFiles, motionFiles] = await Promise.all([
    glob([DISCOVERY_GLOBS.component], { cwd, absolute: true, ignore: IGNORE }),
    glob([DISCOVERY_GLOBS.experience], { cwd, absolute: true, ignore: IGNORE }),
    glob([DISCOVERY_GLOBS.grammar], { cwd, absolute: true, ignore: IGNORE }),
    glob([DISCOVERY_GLOBS.motion], { cwd, absolute: true, ignore: IGNORE }),
  ]);

  const [components, experiences, grammars, motionSequences] = await Promise.all([
    loadAndValidate(componentFiles, ComponentManifest, 'component', diagnostics),
    loadAndValidate(experienceFiles, ExperienceManifest, 'experience', diagnostics),
    loadAndValidate(grammarFiles, DesignGrammar, 'grammar', diagnostics),
    loadAndValidate(motionFiles, MotionSequence, 'motion', diagnostics),
  ]);

  return { components, experiences, grammars, motionSequences };
}
