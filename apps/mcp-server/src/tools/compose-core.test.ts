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

    const dashboard = composeForSurface(registry, 'dashboard', baseContext, 'quarterly review', 'compose_dashboard');
    expect(dashboard.ok).toBe(true);
    if (dashboard.ok) expect(dashboard.data.worldTemplateId).toBe('dash-1');

    // Asking for a surface with no live template never leaks a sibling surface's descriptor.
    const noneForSurface = composeForSurface(
      fakeRegistry([descriptor({ id: 'deck-1', surface: 'slide-deck' })]),
      'dashboard',
      baseContext,
      'quarterly review',
      'compose_dashboard',
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

    const result = composeForSurface(registry, 'slide-deck', baseContext, 'quarterly review', 'compose_slide_deck');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.worldTemplateId).toBe('aaa');
  });
});

// Type-only assertion that the fixture surface list stays in the enum.
const _surfaces: SurfaceType[] = ['slide-deck', 'dashboard'];
void _surfaces;
