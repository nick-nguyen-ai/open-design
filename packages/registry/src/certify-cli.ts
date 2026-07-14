/**
 * `certify` CLI — runs the world-template certifier over the real workspace.
 *
 * Usage:
 *   corepack pnpm --filter @enterprise-design/registry certify            # all
 *   corepack pnpm --filter @enterprise-design/registry certify tminus     # one
 *
 * Discovers every `*.worldtemplate.manifest.ts` (the same suffix + IGNORE
 * conventions as discovery), certifies each, prints PASS or the findings, and
 * exits non-zero if any template has a finding.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { globSync } from 'tinyglobby';
import { DISCOVERY_GLOBS, IGNORE } from './discovery.js';
import { certifyWorld } from './certify.js';

const here = path.dirname(fileURLToPath(import.meta.url));
// packages/registry/src -> repo root
const REPO_ROOT = path.resolve(here, '..', '..', '..');

async function templateIdOf(manifestPath: string): Promise<string> {
  try {
    const mod = (await import(pathToFileURL(manifestPath).href)) as { default?: { id?: unknown } };
    const id = mod.default?.id;
    return typeof id === 'string' ? id : path.basename(manifestPath);
  } catch {
    return path.basename(manifestPath);
  }
}

async function main(): Promise<void> {
  const filterId = process.argv[2];

  const manifestPaths = globSync([DISCOVERY_GLOBS.worldTemplate], {
    cwd: REPO_ROOT,
    absolute: true,
    ignore: IGNORE,
  }).sort();

  const entries: { id: string; manifestPath: string }[] = [];
  for (const manifestPath of manifestPaths) {
    entries.push({ id: await templateIdOf(manifestPath), manifestPath });
  }

  const selected = filterId ? entries.filter((e) => e.id === filterId) : entries;

  if (filterId && selected.length === 0) {
    console.error(`No world-template with id "${filterId}". Known: ${entries.map((e) => e.id).join(', ') || '(none)'}.`);
    process.exit(1);
  }

  let totalFindings = 0;
  for (const { id, manifestPath } of selected) {
    const findings = await certifyWorld(manifestPath);
    if (findings.length === 0) {
      console.log(`PASS  ${id}`);
    } else {
      totalFindings += findings.length;
      console.log(`FAIL  ${id}  (${findings.length} finding${findings.length === 1 ? '' : 's'})`);
      for (const finding of findings) {
        console.log(`        · [${finding.check}] ${finding.message}`);
      }
    }
  }

  console.log(
    `\n${selected.length} template${selected.length === 1 ? '' : 's'} certified, ${totalFindings} finding${totalFindings === 1 ? '' : 's'}.`,
  );
  process.exit(totalFindings > 0 ? 1 : 0);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
