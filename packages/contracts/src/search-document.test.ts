import { describe, expect, it } from 'vitest';
import { SearchDocument } from './search-document.js';

const validSearchDocument = {
  id: 'comp.kpi-tile',
  entityType: 'component',
  title: 'KPI Tile',
  summary: 'Displays a single KPI value with a trend indicator.',
  text: 'kpi tile metric performance trend indicator dashboard',
  tags: ['kpi', 'metric'],
  facets: {
    category: 'content',
    density: ['medium'],
    motionLevel: 1,
    corporateSuitability: ['standard'],
    renderingCost: 'low',
    usesCanvas: false,
    usesWebGL: false,
  },
  route: '/preview/kpi-tile',
};

describe('SearchDocument', () => {
  it('round-trips a valid search document', () => {
    const parsed = SearchDocument.parse(validSearchDocument);
    expect(parsed).toEqual(validSearchDocument);
  });

  it('round-trips a valid search document with minimal facets', () => {
    const minimal = {
      id: 'exp.risk-dashboard',
      entityType: 'experience',
      title: 'Enterprise Risk Dashboard',
      summary: 'A dense risk exposure dashboard for executives.',
      text: 'risk dashboard exposure governance executive',
      tags: ['risk'],
      facets: { surface: 'dashboard', grammarId: 'precision-grid' },
    };
    const parsed = SearchDocument.parse(minimal);
    expect(parsed).toEqual(minimal);
  });

  it('rejects an entityType value outside EntityType', () => {
    const result = SearchDocument.safeParse({ ...validSearchDocument, entityType: 'theme' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('entityType'))).toBe(true);
    }
  });

  it('rejects an empty text blob', () => {
    const result = SearchDocument.safeParse({ ...validSearchDocument, text: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('text'))).toBe(true);
    }
  });

  it('round-trips multi-value density and corporateSuitability facets', () => {
    const multi = {
      ...validSearchDocument,
      facets: {
        ...validSearchDocument.facets,
        density: ['low', 'medium'],
        corporateSuitability: ['standard', 'expressive'],
      },
    };
    const parsed = SearchDocument.parse(multi);
    expect(parsed.facets.density).toEqual(['low', 'medium']);
    expect(parsed.facets.corporateSuitability).toEqual(['standard', 'expressive']);
  });

  it('round-trips a component document with a multi-value surfaces facet alongside the single surface facet', () => {
    const withSurfaces = {
      ...validSearchDocument,
      facets: {
        ...validSearchDocument.facets,
        surfaces: ['dashboard', 'project-page', 'technical-explainer'],
      },
    };
    const parsed = SearchDocument.parse(withSurfaces);
    expect(parsed.facets.surfaces).toEqual(['dashboard', 'project-page', 'technical-explainer']);
    // The single `surface` facet is untouched — the two coexist for backward compatibility.
    expect(parsed.facets.surface).toBeUndefined();
  });

  it('rejects a single (non-array) surfaces facet', () => {
    const result = SearchDocument.safeParse({
      ...validSearchDocument,
      facets: { ...validSearchDocument.facets, surfaces: 'dashboard' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a single (non-array) density facet', () => {
    const result = SearchDocument.safeParse({
      ...validSearchDocument,
      facets: { ...validSearchDocument.facets, density: 'medium' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a facets.motionLevel value outside 0-3', () => {
    const result = SearchDocument.safeParse({
      ...validSearchDocument,
      facets: { ...validSearchDocument.facets, motionLevel: 9 },
    });
    expect(result.success).toBe(false);
  });
});
