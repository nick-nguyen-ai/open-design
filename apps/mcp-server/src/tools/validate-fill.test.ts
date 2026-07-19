/**
 * `validate_fill` render-budget unit tests — the tighter-than-maxChars gate
 * derived from each SHIPPED world's real magnitudes. The motivating case from
 * the opendesign-intro compose run: a dgm-circuit cells `detail` at ~80-120
 * chars validated clean against the 160 cap and then ellipsized at ~50 on
 * screen; the shipped world's 37-char magnitude is the render truth.
 */
import { describe, expect, it } from 'vitest';
import { RENDER_BUDGET_HEADROOM } from '@enterprise-design/contracts';
import { loadRegistryData } from '../registry-data.js';
import { validateFillTool } from './validate-fill.js';
import { SHIPPED_FILL } from '../../../../experiences/slide-decks/deck-dgm-circuit/content.js';

const registry = loadRegistryData();

/** Deep-clone the shipped circuit fill so each test can tamper independently. */
function circuitFill(): Record<string, never> {
  return JSON.parse(JSON.stringify(SHIPPED_FILL)) as Record<string, never>;
}

function findingsFor(fill: unknown) {
  const outcome = validateFillTool(registry, { worldTemplateId: 'dgm-circuit', fill });
  if (!outcome.ok) throw new Error(`unexpected tool error: ${outcome.error.message}`);
  return outcome.data;
}

describe('validate_fill — renderBudget', () => {
  it('accepts the shipped circuit fill untouched (budgets are shipped-derived, so shipped passes)', () => {
    const result = findingsFor(circuitFill());
    expect(result.valid).toBe(true);
    expect(result.findings).toEqual([]);
  });

  it('flags an object-array string field exceeding shipped × headroom while under the hard cap', () => {
    const fill = circuitFill() as { cells: { cells: Array<{ detail?: string }> } };
    // 120 chars: inside the 160-char descriptor cap, far over the shipped ~37.
    fill.cells.cells[0]!.detail = 'x'.repeat(120);
    const result = findingsFor(fill);
    expect(result.valid).toBe(false);
    const budgetFindings = result.findings.filter((f) => f.rule === 'renderBudget');
    expect(budgetFindings).toHaveLength(1);
    expect(budgetFindings[0]?.path).toBe('cells.cells[0].detail');
    expect(budgetFindings[0]?.message).toContain('120 chars');
    expect(budgetFindings[0]?.message).toContain(String(RENDER_BUDGET_HEADROOM));
  });

  it('does NOT budget capped string slots — the (drift-tightened) maxChars governs those', () => {
    // A 55-char heading over a 26-char shipped sample rendered fine in the
    // opendesign-intro run; budgeting capped slots against one sample rejects
    // known-good fills. The heading cap (64) is the contract there.
    const fill = circuitFill() as { flow: { heading: string } };
    fill.flow.heading = 'Compose: a doc goes in, a rendered experience comes out'; // 55 chars, cap 64
    const result = findingsFor(fill);
    expect(result.valid).toBe(true);
    expect(result.findings).toEqual([]);
  });

  it('exempts machine fields (ids, edge endpoints) and stays quiet within budget', () => {
    const fill = circuitFill() as {
      timeline: { eras: Array<{ id: string }> };
      cells: { cells: Array<{ detail?: string }> };
    };
    // Long machine id: never rendered as prose, must not be budgeted.
    fill.timeline.eras[0]!.id = 'a-very-long-machine-identifier';
    // Field value inside budget (shipped + floor).
    const shipped = registry.shippedMagnitudes['dgm-circuit']?.['cells.cells']?.fields?.detail ?? 0;
    fill.cells.cells[0]!.detail = 'y'.repeat(shipped + 10);
    const result = findingsFor(fill);
    expect(result.findings.filter((f) => f.rule === 'renderBudget')).toEqual([]);
  });

  it('does not crash for a template with no derived magnitudes', () => {
    // Simulate a registry whose artefact lacks this template's magnitudes.
    const stripped = { ...registry, shippedMagnitudes: {} };
    const outcome = validateFillTool(stripped, { worldTemplateId: 'dgm-circuit', fill: circuitFill() });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.data.valid).toBe(true);
  });
});
