/**
 * Unit tests for the surface-aware compose core.
 *
 * These drive `composeForSurface` directly over FAKE `RegistryData` fixtures
 * (only `worldTemplates` is read), so selection behaviour is exercised without
 * the real registry: the surface pre-filter, the `briefKeywords` intent bonus,
 * the zero-score `NO_TEMPLATE_FIT` outcome, and the deck tie-break.
 */
import { describe, expect, it } from 'vitest';
import type { SurfaceType, WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { composeForSurface, type ComposeContext } from './compose-core.js';
import type { RegistryData } from '../registry-data.js';

/** A minimal-but-valid descriptor; override only what a test cares about. */
function descriptor(overrides: Partial<WorldTemplateDescriptor> = {}): WorldTemplateDescriptor {
  return {
    schemaVersion: '1.1',
    id: 'tpl',
    experienceId: 'exp-tpl',
    surface: 'slide-deck',
    style: 'conventional',
    mood: 'light',
    grammarId: 'grammar.default',
    audiences: ['executive'],
    businessIntents: ['review-quarterly-performance'],
    briefKeywords: [],
    componentsUsed: [],
    sections: [
      {
        kind: 'cover',
        purpose: 'Open the deck.',
        slots: [{ name: 'title', type: 'text', required: true, limits: { maxChars: 80 }, guidance: 'The deck title.' }],
      },
    ],
    guidance: ['The template balances its own grids.'],
    craftRules: [],
    ...overrides,
  };
}

/** A fake registry that only carries the world-template list the core reads. */
function fakeRegistry(worldTemplates: WorldTemplateDescriptor[]): RegistryData {
  return { worldTemplates } as unknown as RegistryData;
}

const baseContext: ComposeContext = {
  audience: ['executive'],
  businessIntent: ['review-quarterly-performance'],
  corporateSuitability: 'restricted',
  motionPreference: 1,
};

describe('composeForSurface', () => {
  it('filters by surface before scoring', () => {
    const registry = fakeRegistry([
      descriptor({ id: 'deck-1', experienceId: 'exp-deck', surface: 'slide-deck' }),
      descriptor({ id: 'dash-1', experienceId: 'exp-dash', surface: 'dashboard' }),
    ]);

    const dashboard = composeForSurface(registry, 'dashboard', baseContext, 'quarterly review', 'compose_dashboard', 'strict');
    expect(dashboard.ok).toBe(true);
    if (dashboard.ok) expect(dashboard.data.worldTemplateId).toBe('dash-1');

    // Asking for a surface with no live template never leaks a sibling surface's descriptor.
    const noneForSurface = composeForSurface(
      fakeRegistry([descriptor({ id: 'deck-1', surface: 'slide-deck' })]),
      'dashboard',
      baseContext,
      'quarterly review',
      'compose_dashboard',
      'strict',
    );
    expect(noneForSurface.ok).toBe(false);
    if (!noneForSurface.ok) expect(noneForSurface.error.code).toBe('NO_TEMPLATE_FIT');
  });

  it('briefKeywords tokens count toward intent match', () => {
    // Two siblings identical apart from briefKeywords + id. The keyword-bearing one
    // has the LATER id, so the tie-break would pick the plain one; the only way it
    // wins is the 'drift' briefKeyword scoring against a brief that mentions drift.
    const registry = fakeRegistry([
      descriptor({ id: 'a-plain', experienceId: 'exp-plain', briefKeywords: [] }),
      descriptor({ id: 'b-keyword', experienceId: 'exp-keyword', briefKeywords: ['drift'] }),
    ]);

    const result = composeForSurface(
      registry,
      'slide-deck',
      baseContext,
      'A review of model drift over the quarter.',
      'compose_slide_deck',
      'strict',
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.worldTemplateId).toBe('b-keyword');
  });

  it('returns NO_TEMPLATE_FIT when the best score is 0', () => {
    // art-directed style + restricted suitability => corporateFit 0; no audience or
    // intent/keyword overlap with the context, so the winning score is 0.
    const registry = fakeRegistry([
      descriptor({
        id: 'mismatch',
        style: 'art-directed',
        audiences: ['technical'],
        businessIntents: ['plan-cloud-migration'],
        briefKeywords: [],
      }),
    ]);

    const result = composeForSurface(
      registry,
      'slide-deck',
      { audience: ['executive'], businessIntent: ['unrelated-topic'], corporateSuitability: 'restricted', motionPreference: 0 },
      'Nothing here overlaps whatsoever.',
      'compose_slide_deck',
      'strict',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NO_TEMPLATE_FIT');
      expect(result.error.details[0]).toContain('mismatch (exp-tpl)');
    }
  });

  it('keeps the deck tie-break: score desc then id asc', () => {
    const registry = fakeRegistry([
      descriptor({ id: 'bbb', experienceId: 'exp-bbb' }),
      descriptor({ id: 'aaa', experienceId: 'exp-aaa' }),
    ]);

    const result = composeForSurface(registry, 'slide-deck', baseContext, 'quarterly review', 'compose_slide_deck', 'strict');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.worldTemplateId).toBe('aaa');
  });

  it('returns ranked alternatives: winner first, zero-score excluded, capped at 3', () => {
    const registry = fakeRegistry([
      // score 5: audience overlap (2) + corporateFit 1... executive overlap ×2 + restricted/conventional fit 2 = 4.
      descriptor({ id: 'winner', experienceId: 'exp-winner' }),
      // Same score as winner, later id -> second by tie-break.
      descriptor({ id: 'zecond', experienceId: 'exp-zecond' }),
      // Lower score: no audience overlap, art-directed under restricted = 0 + intent match only.
      descriptor({
        id: 'third',
        experienceId: 'exp-third',
        audiences: ['technical'],
        briefKeywords: ['quarterly'],
      }),
      // Zero score: nothing matches at all.
      descriptor({
        id: 'zero',
        experienceId: 'exp-zero',
        audiences: ['personal-internal'],
        businessIntents: ['nothing-shared'],
        style: 'art-directed',
      }),
      // A fourth positive candidate that must be cut by the cap of 3.
      descriptor({ id: 'zfourth', experienceId: 'exp-zfourth', audiences: ['technical'], briefKeywords: ['review'] }),
    ]);

    const result = composeForSurface(registry, 'slide-deck', baseContext, 'quarterly review', 'compose_slide_deck', 'strict');
    expect(result.ok).toBe(true);
    if (result.ok) {
      const ids = result.data.alternatives.map((a) => a.worldTemplateId);
      expect(ids).toHaveLength(3);
      expect(ids[0]).toBe(result.data.worldTemplateId);
      expect(ids).not.toContain('zero');
      const first = result.data.alternatives[0]!;
      expect(first.scoreBreakdown).toContain('audienceOverlap');
      expect(first.style).toBe('conventional');
      expect(first.guidance.length).toBeGreaterThan(0);
    }
  });

  it('a surface with a single template degrades to one alternative', () => {
    const registry = fakeRegistry([descriptor({ id: 'only', experienceId: 'exp-only', surface: 'dashboard' })]);
    const result = composeForSurface(registry, 'dashboard', baseContext, 'quarterly review', 'compose_dashboard', 'strict');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.alternatives.map((a) => a.worldTemplateId)).toEqual(['only']);
  });

  it('pinTemplateId short-circuits scoring: a losing candidate wins with its own skeleton', () => {
    const registry = fakeRegistry([
      descriptor({ id: 'aaa', experienceId: 'exp-aaa' }),
      descriptor({
        id: 'loser',
        experienceId: 'exp-loser',
        audiences: ['personal-internal'],
        businessIntents: ['nothing-shared'],
        style: 'art-directed',
        sections: [
          {
            kind: 'pinned-kind',
            purpose: 'Prove the pinned skeleton is returned.',
            slots: [{ name: 'pinned.slot', type: 'text', required: true, limits: {}, guidance: 'g' }],
          },
        ],
      }),
    ]);

    const result = composeForSurface(
      registry,
      'slide-deck',
      { ...baseContext, pinTemplateId: 'loser' },
      'quarterly review',
      'compose_slide_deck',
      'strict',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.worldTemplateId).toBe('loser');
      expect(result.data.rationale).toContain('Pinned');
      expect(result.data.alternatives.map((a) => a.worldTemplateId)).toEqual(['loser']);
      expect(result.data.fillSkeleton.sections[0]?.kind).toBe('pinned-kind');
    }
  });

  it('pinTemplateId resolves by experienceId and bypasses NO_TEMPLATE_FIT for zero scores', () => {
    const registry = fakeRegistry([
      descriptor({
        id: 'zero',
        experienceId: 'exp-zero',
        audiences: ['personal-internal'],
        businessIntents: ['nothing-shared'],
        style: 'art-directed',
      }),
    ]);
    // Unpinned, this pool is a zero-score NO_TEMPLATE_FIT…
    const unpinned = composeForSurface(registry, 'slide-deck', baseContext, 'quarterly review', 'compose_slide_deck', 'strict');
    expect(unpinned.ok).toBe(false);
    // …but an explicit pick is honoured, resolved via the experienceId form.
    const pinned = composeForSurface(
      registry,
      'slide-deck',
      { ...baseContext, pinTemplateId: 'exp-zero' },
      'quarterly review',
      'compose_slide_deck',
      'strict',
    );
    expect(pinned.ok).toBe(true);
    if (pinned.ok) expect(pinned.data.worldTemplateId).toBe('zero');
  });

  it('an unknown or cross-surface pin is UNKNOWN_TEMPLATE', () => {
    const registry = fakeRegistry([
      descriptor({ id: 'deck-1', experienceId: 'exp-deck', surface: 'slide-deck' }),
      descriptor({ id: 'dash-1', experienceId: 'exp-dash', surface: 'dashboard' }),
    ]);

    const unknown = composeForSurface(
      registry,
      'slide-deck',
      { ...baseContext, pinTemplateId: 'no-such-template' },
      'quarterly review',
      'compose_slide_deck',
      'strict',
    );
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.code).toBe('UNKNOWN_TEMPLATE');

    // A dashboard template pinned from the slide-deck tool must not leak across surfaces.
    const crossSurface = composeForSurface(
      registry,
      'slide-deck',
      { ...baseContext, pinTemplateId: 'dash-1' },
      'quarterly review',
      'compose_slide_deck',
      'strict',
    );
    expect(crossSurface.ok).toBe(false);
    if (!crossSurface.ok) expect(crossSurface.error.code).toBe('UNKNOWN_TEMPLATE');
  });
});

// Type-only assertion that the fixture surface list stays in the enum.
const _surfaces: SurfaceType[] = ['slide-deck', 'dashboard'];
void _surfaces;
