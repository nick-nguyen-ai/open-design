/**
 * `scaffold-template` CLI — the generation front door for templatizing a world.
 *
 * Usage:
 *   corepack pnpm --filter @enterprise-design/registry scaffold-template <experience-id> <template-id>
 *
 * It locates the experience by globbing `experiences/**\/<experience-id>.experience.manifest.ts`,
 * reads the sibling `content.ts`, takes its FIRST exported object value as the
 * shipped shape, and writes two SKELETONS into the experience directory:
 *   - `<template-id>-fill.ts`                       (the proposed fill schema + sections)
 *   - `<experience-id>.worldtemplate.manifest.ts`   (the descriptor shell)
 *
 * Both are riddled with `AUTHOR:` markers the certifier refuses, so a scaffold
 * cannot ship unfinished. It REFUSES to overwrite either output (exit 1), and
 * prints the next steps a templatization must complete.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { globSync } from 'tinyglobby';
import { IGNORE } from './discovery.js';
import { buildFillModule, buildManifest } from './scaffold.js';

const here = path.dirname(fileURLToPath(import.meta.url));
// packages/registry/src -> repo root
const REPO_ROOT = path.resolve(here, '..', '..', '..');

function fail(message: string): never {
  console.error(`scaffold-template: ${message}`);
  process.exit(1);
}

/** Take the first exported value that is a plain (non-array, non-null) object. */
function firstObjectExport(mod: Record<string, unknown>): unknown {
  for (const [key, value] of Object.entries(mod)) {
    if (key === 'default') continue;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) return value;
  }
  return undefined;
}

async function main(): Promise<void> {
  const experienceId = process.argv[2];
  const templateId = process.argv[3];
  if (!experienceId || !templateId) {
    fail('usage: scaffold-template <experience-id> <template-id>');
  }

  // Locate the experience directory by its manifest.
  const manifestGlob = `experiences/**/${experienceId}.experience.manifest.ts`;
  const matches = globSync([manifestGlob], { cwd: REPO_ROOT, absolute: true, ignore: IGNORE }).sort();
  if (matches.length === 0) {
    fail(`no experience manifest found for "${experienceId}" (glob: ${manifestGlob}).`);
  }
  if (matches.length > 1) {
    fail(`ambiguous experience id "${experienceId}" — ${matches.length} manifests match.`);
  }
  const experienceManifestPath = matches[0]!;
  const dir = path.dirname(experienceManifestPath);

  // Read the shipped content shape.
  const contentPath = path.join(dir, 'content.ts');
  if (!fs.existsSync(contentPath)) {
    fail(`experience "${experienceId}" has no sibling content.ts at ${contentPath}.`);
  }
  let contentMod: Record<string, unknown>;
  try {
    contentMod = (await import(/* @vite-ignore */ pathToFileURL(contentPath).href)) as Record<string, unknown>;
  } catch (error) {
    return fail(`failed to import content.ts: ${(error as Error).message}`);
  }
  const shape = firstObjectExport(contentMod);
  if (shape === undefined) {
    fail(`content.ts for "${experienceId}" has no exported object value to derive a shape from.`);
  }

  // Refuse to overwrite existing outputs.
  const fillPath = path.join(dir, `${templateId}-fill.ts`);
  const worldManifestPath = path.join(dir, `${experienceId}.worldtemplate.manifest.ts`);
  for (const out of [fillPath, worldManifestPath]) {
    if (fs.existsSync(out)) {
      fail(`refusing to overwrite existing file: ${path.relative(REPO_ROOT, out)}`);
    }
  }

  fs.writeFileSync(fillPath, buildFillModule({ templateId, experienceId, shape }));
  fs.writeFileSync(worldManifestPath, buildManifest({ templateId, experienceId }));

  const rel = (p: string): string => path.relative(REPO_ROOT, p).replace(/\\/g, '/');
  console.log(`Scaffolded world-template "${templateId}" from "${experienceId}":`);
  console.log(`  + ${rel(fillPath)}`);
  console.log(`  + ${rel(worldManifestPath)}`);
  console.log('');
  console.log('Next steps (each resolves AUTHOR: markers the certifier refuses):');
  console.log(`  1. Extract <Name>Template.tsx that renders the whole experience from a ${templateId} fill;`);
  console.log('     make the Page a thin wrapper (theme lock + <Template fill={SHIPPED_FILL} />).');
  console.log(`  2. Author ${rel(fillPath)}: real char caps + item bounds from the shipped magnitudes,`);
  console.log('     split the single page section into the real regions, write concrete guidance.');
  console.log(`  3. Author ${rel(worldManifestPath)}: surface/style/mood/grammarId, audiences,`);
  console.log('     businessIntents, briefKeywords, and the craftRules (exactly-one + required-nonempty).');
  console.log('  4. Add `export const SHIPPED_FILL = ...` to content.ts (parse the shipped instance).');
  console.log(`  5. Run: corepack pnpm --filter @enterprise-design/registry certify ${templateId}`);
  console.log('     (it refuses AUTHOR: markers, so a scaffold cannot ship unfinished).');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
