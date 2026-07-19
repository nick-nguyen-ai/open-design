import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'tinyglobby';
import { describe, expect, it } from 'vitest';
import { DISCOVERY_GLOBS, IGNORE } from './discovery.js';
import { budgetDriftViolation, certifyWorld, leakCandidates, type CertFinding } from './certify.js';

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

describe('budget-drift — maxChars vs shipped magnitude', () => {
  const slot = (maxChars: number) => ({
    name: 'cells.detail',
    type: 'text' as const,
    required: true,
    limits: { maxChars },
    guidance: 'g',
  });

  it('flags a cap far beyond the shipped magnitude (the ellipsize-on-screen drift)', () => {
    // The motivating shape: dgm-circuit shipped ~37 chars under a 160 cap.
    const violation = budgetDriftViolation(slot(160), 'a'.repeat(37));
    expect(violation).toContain('maxChars 160');
    expect(violation).toContain('ships 37');
  });

  it('stays quiet for a cap near shipped, for tiny slots, and for capless slots', () => {
    expect(budgetDriftViolation(slot(48), 'a'.repeat(37))).toBeUndefined();
    // Tiny slot: ratio trips but the absolute slack does not.
    expect(budgetDriftViolation(slot(24), 'DGM-CX-01')).toBeUndefined();
    expect(
      budgetDriftViolation({ ...slot(160), limits: {} }, 'a'.repeat(37)),
    ).toBeUndefined();
    // No measurable shipped content -> nothing to compare against.
    expect(budgetDriftViolation(slot(160), 42)).toBeUndefined();
  });

  it('measures string arrays by their max element (itemChars)', () => {
    const violation = budgetDriftViolation(slot(160), ['short', 'a'.repeat(30)]);
    expect(violation).toContain('ships 30');
  });
});

describe('leak scan — JSX text-node extraction', () => {
  it('scans a MULTILINE-formatted text node (Prettier wrapping cannot hide a leak)', () => {
    const source = [
      'return (',
      '  <h2 className="heading">',
      '    Three weekends, three waves across the estate.',
      '  </h2>',
      ');',
    ].join('\n');
    expect(leakCandidates(source)).toEqual(['Three weekends, three waves across the estate.']);
  });

  it('normalizes internal whitespace so a wrapped sentence compares like a single-line one', () => {
    const source = '<p>\n  An editorial sentence\n  wrapped over two lines.\n</p>';
    expect(leakCandidates(source)).toEqual(['An editorial sentence wrapped over two lines.']);
  });

  it('ignores the code fragment between two sibling JSX returns (ends at an opening tag)', () => {
    const source = [
      '        </section>',
      '      );',
      '',
      "    case 'waves':",
      '      return (',
      '        <section className="slide">',
      '          <span>ok</span>',
      '        </section>',
    ].join('\n');
    expect(leakCandidates(source)).toEqual([]);
  });

  it('skips short chrome below both thresholds (<4 words and <25 chars)', () => {
    expect(leakCandidates('<span>OK · DONE</span>')).toEqual([]);
  });
});

describe('template certifier — every world-template certifies clean', () => {
  it('discovers at least the three pilot world-templates', () => {
    expect(manifestPaths.length).toBeGreaterThanOrEqual(3);
  });

  it.each(manifestPaths)('certifies %s with zero findings', async (manifestPath) => {
    const findings = await certifyWorld(manifestPath);
    expect(findings, `\n${describeFindings(findings)}`).toEqual([]);
  });
});
