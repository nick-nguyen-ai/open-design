import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'tinyglobby';
import { describe, expect, it } from 'vitest';
import { DISCOVERY_GLOBS, IGNORE } from './discovery.js';
import { certifyWorld, type CertFinding } from './certify.js';

const here = path.dirname(fileURLToPath(import.meta.url));
// packages/registry/src -> repo root
const REPO_ROOT = path.resolve(here, '..', '..', '..');

/**
 * Data-driven template certifier (Task 5). Discovers every world-template
 * manifest in the REAL workspace (the same suffix + IGNORE conventions as
 * `discovery.ts`) and proves, with ZERO per-world boilerplate, that each is
 * safe: descriptor⇄fill lockstep, the shipped fill parses, every slot resolves,
 * the craft rules and slot limits hold, no editorial text leaks into the
 * template, and no author markers survive. A safe template yields no findings.
 */
const manifestPaths = globSync([DISCOVERY_GLOBS.worldTemplate], {
  cwd: REPO_ROOT,
  absolute: true,
  ignore: IGNORE,
}).sort();

function describeFindings(findings: CertFinding[]): string {
  return findings.map((f) => `  [${f.templateId} · ${f.check}] ${f.message}`).join('\n');
}

describe('template certifier — every world-template certifies clean', () => {
  it('discovers at least the three pilot world-templates', () => {
    expect(manifestPaths.length).toBeGreaterThanOrEqual(3);
  });

  it.each(manifestPaths)('certifies %s with zero findings', async (manifestPath) => {
    const findings = await certifyWorld(manifestPath);
    expect(findings, `\n${describeFindings(findings)}`).toEqual([]);
  });
});
