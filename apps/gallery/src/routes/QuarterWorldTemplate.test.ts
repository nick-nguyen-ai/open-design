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

/* ------------------------------------------------------------------ */
/* Descriptor ⇄ Zod lockstep — recurrence guard for F1/F3.            */
/*                                                                     */
/* A future template author who adds a required Zod field/deck leaf    */
/* but forgets its descriptor slot (F1/F2), or advertises a slot whose */
/* path/shape does not match the schema (F3), gets a red test here —   */
/* the source of truth is walked (the Zod shape + the shipped fill),   */
/* never a hand-maintained duplicate list.                             */
/* ------------------------------------------------------------------ */

/** Slot types that must resolve to an ARRAY in the shipped fill. */
const COLLECTION_SLOT_TYPES = new Set(['items', 'nodes', 'edges', 'tableRows', 'metric']);
/** Slot types that must resolve to a STRING in the shipped fill. */
const STRING_SLOT_TYPES = new Set(['text', 'longtext']);

/** Resolve a dot-path (e.g. `deck.title`, `revenueSeries.points`) against a value. */
function resolvePath(root: unknown, dotPath: string): unknown {
  let current: unknown = root;
  for (const part of dotPath.split('.')) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Minimal structural view of a Zod object schema (zod is not a direct gallery dep). */
function objectShape(schema: unknown): Record<string, { isOptional(): boolean }> {
  return (schema as { shape: Record<string, { isOptional(): boolean }> }).shape;
}

/** Keys of a Zod object shape whose field is NOT optional. */
function requiredKeys(shape: Record<string, { isOptional(): boolean }>): string[] {
  return Object.entries(shape)
    .filter(([, field]) => !field.isOptional())
    .map(([key]) => key);
}

describe('The Quarter — descriptor ⇄ Zod lockstep', () => {
  const slotNames = new Set(quarterDescriptor.slideKinds.flatMap((kind) => kind.slots.map((slot) => slot.name)));
  const topShape = objectShape(QuarterFill);
  const deckShape = objectShape(topShape.deck);

  it('advertises a slot for every REQUIRED deck leaf in the Zod schema (guards F1)', () => {
    for (const leaf of requiredKeys(deckShape)) {
      expect([...slotNames], `descriptor must advertise a "deck.${leaf}" slot`).toContain(`deck.${leaf}`);
    }
  });

  it('advertises every REQUIRED top-level field (by name or a sub-path slot)', () => {
    for (const field of requiredKeys(topShape)) {
      const advertised = [...slotNames].some((name) => name === field || name.startsWith(`${field}.`));
      expect(advertised, `descriptor must advertise top-level field "${field}"`).toBe(true);
    }
  });

  it('every descriptor slot resolves to a real, correctly-shaped path in the shipped fill (guards F3)', () => {
    for (const kind of quarterDescriptor.slideKinds) {
      for (const slot of kind.slots) {
        const value = resolvePath(quarterFill, slot.name);
        expect(value, `slot "${slot.name}" must resolve to a value in the shipped fill`).toBeDefined();
        if (COLLECTION_SLOT_TYPES.has(slot.type)) {
          expect(Array.isArray(value), `slot "${slot.name}" (type ${slot.type}) must be an array`).toBe(true);
        } else if (STRING_SLOT_TYPES.has(slot.type)) {
          expect(typeof value, `slot "${slot.name}" (type ${slot.type}) must be a string`).toBe('string');
        } else if (slot.type === 'number') {
          expect(typeof value, `slot "${slot.name}" (type number) must be a number`).toBe('number');
        }
      }
    }
  });

  it('locks in the F1/F3 fixes: deck.title advertised; revenueSeries bound to its object leaves', () => {
    // F1 — the persistent title-bar slot must exist.
    expect([...slotNames]).toContain('deck.title');
    // F3 — the object series is advertised by its real leaves, not a bare array slot.
    expect([...slotNames]).toContain('revenueSeries.label');
    expect([...slotNames]).toContain('revenueSeries.points');
    expect([...slotNames]).not.toContain('revenueSeries');
    expect(Array.isArray(resolvePath(quarterFill, 'revenueSeries.points'))).toBe(true);
    expect(typeof resolvePath(quarterFill, 'revenueSeries.label')).toBe('string');
  });
});
