import { describe, expect, it } from 'vitest';
import { createSearchIndex } from './build.js';
import { search } from './query.js';
import { availableFacets } from './facets.js';
import { FIXTURE_DOCUMENTS } from './__fixtures__/documents.js';

describe('facet filtering — array-intersection semantics', () => {
  it('a document supporting [low, medium] density matches a "medium" filter', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    // comp.kpi-tile has density ['low', 'medium'].
    const results = search(index, '', { filters: { density: 'medium' } });
    expect(results.map((r) => r.id)).toContain('comp.kpi-tile');
  });

  it('a document supporting [low, medium] density does NOT match a "high"-only filter', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '', { filters: { density: 'high' } });
    expect(results.map((r) => r.id)).not.toContain('comp.kpi-tile');
    // comp.trend-chart (medium, high) and db-model-monitoring-cockpit (high) do match.
    expect(results.map((r) => r.id).sort()).toEqual(['comp.trend-chart', 'db-model-monitoring-cockpit']);
  });

  it('accepts an array of desired values and matches on ANY intersection', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '', { filters: { density: ['low', 'high'] } });
    // low: comp.kpi-tile. high: comp.trend-chart, db-model-monitoring-cockpit.
    expect(results.map((r) => r.id).sort()).toEqual([
      'comp.kpi-tile',
      'comp.trend-chart',
      'db-model-monitoring-cockpit',
    ]);
  });

  it('applies the same intersection semantics to audiences, corporateSuitability, and themeModes', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    expect(search(index, '', { filters: { audiences: 'risk-and-governance' } }).map((r) => r.id)).toEqual([
      'db-model-monitoring-cockpit',
    ]);
    expect(
      search(index, '', { filters: { corporateSuitability: 'expressive' } }).map((r) => r.id),
    ).toEqual(['comp.trend-chart']);
    expect(search(index, '', { filters: { themeModes: 'adaptive' } }).map((r) => r.id).sort()).toEqual([
      'comp.trend-chart',
      'db-model-monitoring-cockpit',
    ]);
  });
});

describe('facet filtering — hard removal', () => {
  it('removes a document that fails a scalar facet filter regardless of text relevance', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    // "chart" text-matches comp.trend-chart strongly, but category:'content' excludes it.
    const results = search(index, 'chart', { filters: { category: 'content' } });
    expect(results.map((r) => r.id)).not.toContain('comp.trend-chart');
  });

  it('removes a document missing the filtered facet entirely (e.g. grammar/motion docs have no `surface`)', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '', { filters: { surface: 'dashboard' } });
    expect(results.map((r) => r.id)).toEqual(['db-model-monitoring-cockpit']);
  });

  it('combines multiple filters with AND', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '', {
      filters: { surface: 'dashboard', approval: 'approved' },
    });
    // db-model-monitoring-cockpit is 'reviewed', not 'approved' — AND excludes it.
    expect(results).toEqual([]);
  });

  it('boolean facet filters (usesCanvas) require exact equality', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '', { filters: { usesCanvas: true } });
    expect(results.map((r) => r.id)).toEqual(['comp.trend-chart']);
  });
});

describe('availableFacets', () => {
  it('enumerates the distinct facet values present across the given documents', () => {
    const facets = availableFacets(FIXTURE_DOCUMENTS);
    expect(facets.category).toEqual(['chart', 'content']);
    expect(facets.density).toEqual(['high', 'low', 'medium']);
    expect(facets.surface).toEqual(['dashboard', 'technical-explainer']);
    expect(facets.usesCanvas).toEqual([false, true]);
    expect(facets.grammarId.sort()).toEqual(['precision-grid', 'technical-blueprint']);
  });

  it('is deterministic and order-independent of document input order', () => {
    const forward = availableFacets(FIXTURE_DOCUMENTS);
    const reversed = availableFacets([...FIXTURE_DOCUMENTS].reverse());
    expect(reversed).toEqual(forward);
  });
});
