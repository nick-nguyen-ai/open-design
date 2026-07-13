/**
 * World-template contract coverage for "The Quarter" (ledger T27).
 *
 * The experiences package is not itself a vitest project, so this lives in the
 * gallery (which already imports the deck source by relative path) and asserts:
 *   • the shipped descriptor is a valid, JSON-serializable WorldTemplateDescriptor;
 *   • the shipped fill satisfies QuarterFill — including the two craft slots
 *     (exactly one flagged anomaly KPI, the synthetic notice);
 *   • the schema actually enforces those craft constraints (tampered fills fail).
 */
import { describe, expect, it } from 'vitest';
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import quarterDescriptor from '../../../../experiences/slide-decks/deck-quarterly-business-review/deck-quarterly-business-review.worldtemplate.manifest.js';
import { QuarterFill } from '../../../../experiences/slide-decks/deck-quarterly-business-review/quarter-fill.js';
import { quarterFill } from '../../../../experiences/slide-decks/deck-quarterly-business-review/content.js';

describe('The Quarter — world-template descriptor', () => {
  it('is a valid WorldTemplateDescriptor for the shipped experience', () => {
    const parsed = WorldTemplateDescriptor.parse(quarterDescriptor);
    expect(parsed.experienceId).toBe('deck-quarterly-business-review');
    expect(parsed.style).toBe('conventional');
    expect(parsed.slideKinds).toHaveLength(11);
  });

  it('is JSON-serializable (no functions) and round-trips stable — Task 3 compiles it to JSON', () => {
    const json = JSON.stringify(quarterDescriptor);
    const roundTripped = WorldTemplateDescriptor.parse(JSON.parse(json));
    expect(JSON.stringify(roundTripped)).toBe(json);
  });

  it('every slot declares limits and guidance', () => {
    for (const kind of quarterDescriptor.slideKinds) {
      expect(kind.slots.length).toBeGreaterThan(0);
      for (const slot of kind.slots) {
        expect(slot.guidance.length).toBeGreaterThan(0);
        expect(slot.limits).toBeDefined();
      }
    }
  });
});

describe('The Quarter — shipped fill', () => {
  it('validates against QuarterFill', () => {
    expect(() => QuarterFill.parse(quarterFill)).not.toThrow();
  });

  it('carries exactly one flagged-anomaly KPI and the synthetic notice', () => {
    const offTrack = quarterFill.kpis.filter((k) => k.status === 'off-track');
    expect(offTrack).toHaveLength(1);
    expect(quarterFill.anomalyLabel).toBe('NRR 96% — BELOW 100% FLOOR');
    expect(quarterFill.deck.notice).toBe('SYNTHETIC RESULTS — DEMONSTRATION ONLY');
  });

  it('rejects a fill whose KPI row has no flagged anomaly', () => {
    const noAnomaly = {
      ...quarterFill,
      kpis: quarterFill.kpis.map((k) => ({ ...k, status: 'on-track' as const })),
    };
    expect(QuarterFill.safeParse(noAnomaly).success).toBe(false);
  });

  it('rejects a fill missing the synthetic notice', () => {
    const noNotice = { ...quarterFill, deck: { ...quarterFill.deck, notice: '' } };
    expect(QuarterFill.safeParse(noNotice).success).toBe(false);
  });

  it('rejects an over-long anomaly label (headline overflow guard)', () => {
    const overflow = { ...quarterFill, anomalyLabel: 'X'.repeat(41) };
    expect(QuarterFill.safeParse(overflow).success).toBe(false);
  });
});
