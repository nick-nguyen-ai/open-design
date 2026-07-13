import path from 'node:path';
import { discover } from './discovery.js';
import { runValidationRules } from './validation.js';
import { buildCompatibilityGraph } from './compatibility.js';
import { buildSearchDocuments } from './search.js';
import { writeArtefacts } from './emit.js';
import { sortBy } from './util.js';
import type { CompileOptions, CompileResult, Diagnostic } from './types.js';

/** Default artefact output directory, relative to the compile `cwd`. */
export function defaultOutDir(cwd: string): string {
  return path.resolve(cwd, 'packages', 'registry', 'generated');
}

/**
 * Discover, validate, and compile every co-located manifest under `options.cwd`
 * into the deterministic registry artefacts.
 *
 * Never throws on invalid input: schema and cross-manifest problems are returned
 * as structured {@link Diagnostic}s. In `write` mode the JSON artefacts are only
 * emitted when the compile has zero errors, so a failing build never overwrites
 * good artefacts with invalid ones.
 */
export async function compileRegistry(options: CompileOptions = {}): Promise<CompileResult> {
  const cwd = options.cwd ?? process.cwd();
  const diagnostics: Diagnostic[] = [];

  const discovered = await discover(cwd, diagnostics);
  runValidationRules(discovered, diagnostics);

  const components = sortBy(
    discovered.components.map((entry) => entry.manifest),
    (component) => component.id,
  );
  const experiences = sortBy(
    discovered.experiences.map((entry) => entry.manifest),
    (experience) => experience.id,
  );
  const grammars = sortBy(
    discovered.grammars.map((entry) => entry.manifest),
    (grammar) => grammar.id,
  );
  const motionSequences = sortBy(
    discovered.motionSequences.map((entry) => entry.manifest),
    (motion) => motion.sequenceId,
  );
  const worldTemplates = sortBy(
    discovered.worldTemplates.map((entry) => entry.manifest),
    (worldTemplate) => worldTemplate.id,
  );

  const compatibility = buildCompatibilityGraph(components);
  const searchDocuments = buildSearchDocuments({
    components,
    experiences,
    grammars,
    motionSequences,
  });

  const errorCount = diagnostics.filter((diagnostic) => diagnostic.severity === 'error').length;
  const warningCount = diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length;

  const result: CompileResult = {
    components,
    experiences,
    grammars,
    motionSequences,
    worldTemplates,
    compatibility,
    searchDocuments,
    diagnostics,
    errorCount,
    warningCount,
    ok: errorCount === 0,
  };

  if (options.write && result.ok) {
    await writeArtefacts(result, options.outDir ?? defaultOutDir(cwd));
  }

  return result;
}
