/**
 * World-template contract coverage for "The T-Minus" (ledger T32).
 *
 * The experiences package is not itself a vitest project, so this lives in the
 * gallery (which already imports the deck source by relative path) and asserts:
 *   • the shipped descriptor is a valid, JSON-serializable WorldTemplateDescriptor;
 *   • the shipped fill satisfies TMinusFill — including the two craft slots
 *     (exactly one flagged "warning" gate, the synthetic notice);
 *   • the schema actually enforces those craft constraints (tampered fills fail).
 */
import { describe, expect, it } from 'vitest';
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import tminusDescriptor from '../../../../experiences/slide-decks/deck-product-launch/deck-product-launch.worldtemplate.manifest.js';
import { TMinusFill } from '../../../../experiences/slide-decks/deck-product-launch/tminus-fill.js';
import { tminusFill } from '../../../../experiences/slide-decks/deck-product-launch/content.js';

describe('The T-Minus — world-template descriptor', () => {
  it('is a valid WorldTemplateDescriptor for the shipped experience', () => {
    const parsed = WorldTemplateDescriptor.parse(tminusDescriptor);
    expect(parsed.experienceId).toBe('deck-product-launch');
    expect(parsed.style).toBe('art-directed');
    expect(parsed.mood).toBe('dark');
    expect(parsed.sections).toHaveLength(10);
  });

  it('is JSON-serializable (no functions) and round-trips stable — Task 3 compiles it to JSON', () => {
    const json = JSON.stringify(tminusDescriptor);
    const roundTripped = WorldTemplateDescriptor.parse(JSON.parse(json));
    expect(JSON.stringify(roundTripped)).toBe(json);
  });

  it('declares its flagged-blocker craft rule and the required notice', () => {
    expect(tminusDescriptor.craftRules).toContainEqual({
      kind: 'exactly-one',
      path: 'gates',
      field: 'status',
      equals: 'warning',
      description: expect.any(String),
    });
    expect(tminusDescriptor.craftRules).toContainEqual({
      kind: 'required-nonempty',
      path: 'deck.notice',
      description: expect.any(String),
    });
  });

  it('every slot declares limits and guidance', () => {
    for (const kind of tminusDescriptor.sections) {
      expect(kind.slots.length).toBeGreaterThan(0);
      for (const slot of kind.slots) {
        expect(slot.guidance.length).toBeGreaterThan(0);
        expect(slot.limits).toBeDefined();
      }
    }
  });
});

describe('The T-Minus — shipped fill', () => {
  it('validates against TMinusFill', () => {
    expect(() => TMinusFill.parse(tminusFill)).not.toThrow();
  });

  it('carries exactly one flagged "warning" gate and the synthetic notice', () => {
    const flagged = tminusFill.gates.filter((g) => g.status === 'warning');
    expect(flagged).toHaveLength(1);
    expect(tminusFill.anomalyLabel).toBe('SECURITY REVIEW PENDING — BLOCKS T-7');
    expect(tminusFill.deck.notice).toBe('SYNTHETIC LAUNCH PLAN — DEMONSTRATION ONLY');
  });

  it('rejects a fill whose readiness board has no flagged gate', () => {
    const noAnomaly = {
      ...tminusFill,
      gates: tminusFill.gates.map((g) =>
        g.status === 'warning' ? { ...g, status: 'success' as const } : g,
      ),
    };
    expect(TMinusFill.safeParse(noAnomaly).success).toBe(false);
  });

  it('rejects a fill with more than one flagged gate', () => {
    const twoFlags = {
      ...tminusFill,
      gates: tminusFill.gates.map((g, i) => (i < 2 ? { ...g, status: 'warning' as const } : g)),
    };
    expect(TMinusFill.safeParse(twoFlags).success).toBe(false);
  });

  it('rejects a fill missing the synthetic notice', () => {
    const noNotice = { ...tminusFill, deck: { ...tminusFill.deck, notice: '' } };
    expect(TMinusFill.safeParse(noNotice).success).toBe(false);
  });

  it('rejects an over-long anomaly label (headline overflow guard)', () => {
    const overflow = { ...tminusFill, anomalyLabel: 'X'.repeat(49) };
    expect(TMinusFill.safeParse(overflow).success).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* Descriptor ⇄ Zod lockstep — recurrence guard.                      */
/*                                                                     */
/* A future template author who adds a required Zod field/deck leaf    */
/* but forgets its descriptor slot, or advertises a slot whose         */
/* path/shape does not match the schema, gets a red test here — the    */
/* source of truth is walked (the Zod shape + the shipped fill), never */
/* a hand-maintained duplicate list.                                   */
/* ------------------------------------------------------------------ */

/** Slot types that must resolve to an ARRAY in the shipped fill. */
const COLLECTION_SLOT_TYPES = new Set(['items', 'nodes', 'edges', 'tableRows', 'metric']);
/** Slot types that must resolve to a STRING in the shipped fill. */
const STRING_SLOT_TYPES = new Set(['text', 'longtext']);

/** Resolve a dot-path (e.g. `deck.code`, `oneSentence.facts`) against a value. */
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

describe('The T-Minus — descriptor ⇄ Zod lockstep', () => {
  const slotNames = new Set(tminusDescriptor.sections.flatMap((kind) => kind.slots.map((slot) => slot.name)));
  const topShape = objectShape(TMinusFill);
  const deckShape = objectShape(topShape.deck);

  it('advertises a slot for every REQUIRED deck leaf in the Zod schema', () => {
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

  it('every descriptor slot resolves to a real, correctly-shaped path in the shipped fill', () => {
    for (const kind of tminusDescriptor.sections) {
      for (const slot of kind.slots) {
        const value = resolvePath(tminusFill, slot.name);
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

  it('advertises the anomaly + notice craft slots', () => {
    expect([...slotNames]).toContain('anomalyLabel');
    expect([...slotNames]).toContain('deck.notice');
    expect([...slotNames]).toContain('gates');
  });
});
