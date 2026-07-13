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
