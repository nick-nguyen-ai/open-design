/**
 * World-template contract coverage for "The Cutover" (ledger T28).
 *
 * The experiences package is not itself a vitest project, so this lives in the
 * gallery (which already imports the deck source by relative path) and asserts:
 *   • the shipped descriptor is a valid, JSON-serializable WorldTemplateDescriptor;
 *   • the shipped fill satisfies CutoverFill — including the two craft slots
 *     (exactly one locked "stays" anomaly node, the synthetic notice);
 *   • the schema actually enforces those craft constraints (tampered fills fail).
 */
import { describe, expect, it } from 'vitest';
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import cutoverDescriptor from '../../../../experiences/slide-decks/deck-cloud-migration/deck-cloud-migration.worldtemplate.manifest.js';
import { CutoverFill } from '../../../../experiences/slide-decks/deck-cloud-migration/cutover-fill.js';
import { cutoverFill } from '../../../../experiences/slide-decks/deck-cloud-migration/content.js';

describe('The Cutover — world-template descriptor', () => {
  it('is a valid WorldTemplateDescriptor for the shipped experience', () => {
    const parsed = WorldTemplateDescriptor.parse(cutoverDescriptor);
    expect(parsed.experienceId).toBe('deck-cloud-migration');
    expect(parsed.style).toBe('art-directed');
    expect(parsed.slideKinds).toHaveLength(10);
  });

  it('is JSON-serializable (no functions) and round-trips stable — Task 3 compiles it to JSON', () => {
    const json = JSON.stringify(cutoverDescriptor);
    const roundTripped = WorldTemplateDescriptor.parse(JSON.parse(json));
    expect(JSON.stringify(roundTripped)).toBe(json);
  });

  it('every slot declares limits and guidance', () => {
    for (const kind of cutoverDescriptor.slideKinds) {
      expect(kind.slots.length).toBeGreaterThan(0);
      for (const slot of kind.slots) {
        expect(slot.guidance.length).toBeGreaterThan(0);
        expect(slot.limits).toBeDefined();
      }
    }
  });
});

describe('The Cutover — shipped fill', () => {
  it('validates against CutoverFill', () => {
    expect(() => CutoverFill.parse(cutoverFill)).not.toThrow();
  });

  it('carries exactly one locked "stays" anomaly node and the synthetic notice', () => {
    const stays = cutoverFill.nodes.filter((n) => n.disposition === 'stays');
    expect(stays).toHaveLength(1);
    expect(stays[0]?.locked).toBe(true);
    expect(stays[0]?.badge).toBe('MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms');
    expect(cutoverFill.deck.notice).toBe('SYNTHETIC ESTATE — DEMONSTRATION ONLY');
  });

  it('rejects a fill whose estate has no "stays" anomaly node', () => {
    const noAnomaly = {
      ...cutoverFill,
      nodes: cutoverFill.nodes.map((n) =>
        n.disposition === 'stays' ? { ...n, disposition: 'rehost' as const, locked: undefined, badge: undefined } : n,
      ),
    };
    expect(CutoverFill.safeParse(noAnomaly).success).toBe(false);
  });

  it('rejects a fill whose "stays" node is not locked or has no badge', () => {
    const unlocked = {
      ...cutoverFill,
      nodes: cutoverFill.nodes.map((n) =>
        n.disposition === 'stays' ? { ...n, locked: undefined, badge: undefined } : n,
      ),
    };
    expect(CutoverFill.safeParse(unlocked).success).toBe(false);
  });

  it('rejects a fill missing the synthetic notice', () => {
    const noNotice = { ...cutoverFill, deck: { ...cutoverFill.deck, notice: '' } };
    expect(CutoverFill.safeParse(noNotice).success).toBe(false);
  });

  it('rejects a fill whose focus references a missing node id', () => {
    const badFocus = { ...cutoverFill, targetFocus: 'does-not-exist' };
    expect(CutoverFill.safeParse(badFocus).success).toBe(false);
  });

  it('rejects an over-long node badge (canvas overflow guard)', () => {
    const overflow = {
      ...cutoverFill,
      nodes: cutoverFill.nodes.map((n) =>
        n.disposition === 'stays' ? { ...n, badge: 'X'.repeat(65) } : n,
      ),
    };
    expect(CutoverFill.safeParse(overflow).success).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* Descriptor ⇄ Zod lockstep — recurrence guard for F2.               */
/*                                                                     */
/* A future template author who adds a required Zod field/deck leaf    */
/* but forgets its descriptor slot (F2), or advertises a slot whose    */
/* path/shape does not match the schema, gets a red test here — the    */
/* source of truth is walked (the Zod shape + the shipped fill), never */
/* a hand-maintained duplicate list.                                   */
/* ------------------------------------------------------------------ */

/** Slot types that must resolve to an ARRAY in the shipped fill. */
const COLLECTION_SLOT_TYPES = new Set(['items', 'nodes', 'edges', 'tableRows', 'metric']);
/** Slot types that must resolve to a STRING in the shipped fill. */
const STRING_SLOT_TYPES = new Set(['text', 'longtext']);

/** Resolve a dot-path (e.g. `deck.code`, `cutoverFlow.nodes`) against a value. */
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

describe('The Cutover — descriptor ⇄ Zod lockstep', () => {
  const slotNames = new Set(cutoverDescriptor.slideKinds.flatMap((kind) => kind.slots.map((slot) => slot.name)));
  const topShape = objectShape(CutoverFill);
  const deckShape = objectShape(topShape.deck);

  it('advertises a slot for every REQUIRED deck leaf in the Zod schema (guards F2)', () => {
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
    for (const kind of cutoverDescriptor.slideKinds) {
      for (const slot of kind.slots) {
        const value = resolvePath(cutoverFill, slot.name);
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

  it('locks in the F2 fix: deck.code and deck.world are advertised', () => {
    expect([...slotNames]).toContain('deck.code');
    expect([...slotNames]).toContain('deck.world');
  });
});
