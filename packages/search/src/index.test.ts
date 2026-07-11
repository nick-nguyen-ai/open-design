import { describe, expect, it } from 'vitest';
import { createSearchIndex } from './build.js';
import { search } from './query.js';
import { FIXTURE_DOCUMENTS } from './__fixtures__/documents.js';

describe('createSearchIndex + search — basics', () => {
  it('finds a document by a term present in its text', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, 'kpi metric');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.id).toBe('comp.kpi-tile');
  });

  it('returns no results for a query matching nothing in the corpus', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    expect(search(index, 'zzzznonexistentqueryterm')).toEqual([]);
  });

  it('performs prefix matching (partial word finds the full term)', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, 'monito');
    expect(results.map((r) => r.id)).toContain('db-model-monitoring-cockpit');
  });

  it('returns the shaped SearchResult with facets, route, and matched-term metadata', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const [top] = search(index, 'kpi tile');
    expect(top).toMatchObject({
      id: 'comp.kpi-tile',
      entityType: 'component',
      title: 'KPI Tile',
      route: '/preview/comp.kpi-tile',
    });
    expect(top?.facets.category).toBe('content');
    expect(top?.matchedTerms.length).toBeGreaterThan(0);
    expect(top?.matchedFields.length).toBeGreaterThan(0);
  });

  it('respects entityTypes as a hard filter', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, 'chart', { entityTypes: ['component'] });
    expect(results.every((r) => r.entityType === 'component')).toBe(true);
  });

  it('an empty entityTypes array applies no type constraint', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const withEmpty = search(index, 'monitoring', { entityTypes: [] });
    const withOmitted = search(index, 'monitoring');
    expect(withEmpty.map((r) => r.id)).toEqual(withOmitted.map((r) => r.id));
  });

  it('applies limit and offset for pagination', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const all = search(index, '');
    const page1 = search(index, '', { limit: 2, offset: 0 });
    const page2 = search(index, '', { limit: 2, offset: 2 });
    expect(page1).toEqual(all.slice(0, 2));
    expect(page2).toEqual(all.slice(2, 4));
  });
});

describe('exact-title-first ranking', () => {
  it('ranks an exact title match first even when another document would otherwise score higher', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    // "Precision Grid" appears once as a title, but the word "grid" alone
    // could plausibly match other lexical content; searching the exact
    // title must put it first.
    const results = search(index, 'Precision Grid');
    expect(results[0]?.id).toBe('precision-grid');
  });

  it('is case- and whitespace-insensitive for the exact-title check', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '  precision   grid  ');
    expect(results[0]?.id).toBe('precision-grid');
  });
});

describe('empty-query browsable ordering', () => {
  it('returns every document in stable title order when the query is empty', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '');
    expect(results).toHaveLength(FIXTURE_DOCUMENTS.length);
    const titles = results.map((r) => r.title);
    const sortedTitles = [...titles].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    // Our own comparator is code-unit based; assert directly against it via re-derivation.
    const expectedTitles = [...FIXTURE_DOCUMENTS]
      .sort((a, b) => {
        const ta = a.title.toLowerCase();
        const tb = b.title.toLowerCase();
        if (ta !== tb) return ta < tb ? -1 : 1;
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      })
      .map((d) => d.title);
    expect(titles).toEqual(expectedTitles);
    expect(sortedTitles.length).toBe(titles.length);
  });

  it('a whitespace-only query is treated as empty', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    expect(search(index, '   ')).toEqual(search(index, ''));
  });

  it('still honours filters on an empty query (so the landing page can show a filtered "all templates" view)', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const results = search(index, '', { entityTypes: ['component'] });
    expect(results.map((r) => r.id).sort()).toEqual(['comp.kpi-tile', 'comp.trend-chart']);
  });
});

describe('determinism', () => {
  it('identical query + docs + options yields an identically ordered result array', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    const first = search(index, 'monitoring dashboard model');
    const second = search(index, 'monitoring dashboard model');
    expect(second).toEqual(first);
  });

  it('rebuilding the index from a REVERSED copy of the documents yields identical ordered results', () => {
    // Reversing the input order proves the query path is order-independent
    // (deterministic ranking + tie-breaks), not merely that repeated calls on
    // one index agree.
    const indexForward = createSearchIndex(FIXTURE_DOCUMENTS);
    const indexReversed = createSearchIndex([...FIXTURE_DOCUMENTS].reverse());
    for (const query of ['trend chart', 'monitoring dashboard model', 'grid', 'kpi', '']) {
      expect(search(indexReversed, query)).toEqual(search(indexForward, query));
    }
  });
});

describe('empty / degenerate corpora', () => {
  it('createSearchIndex([]) + a non-empty query returns no results and does not throw', () => {
    const index = createSearchIndex([]);
    expect(search(index, 'anything at all')).toEqual([]);
  });

  it('createSearchIndex([]) + an empty query returns no results and does not throw', () => {
    const index = createSearchIndex([]);
    expect(search(index, '')).toEqual([]);
  });

  it('a filter value present in no document yields graceful empty results', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    // No fixture document has surface 'slide-deck'.
    expect(search(index, '', { filters: { surface: 'slide-deck' } })).toEqual([]);
    // ...nor with a text query in play.
    expect(search(index, 'chart', { filters: { surface: 'slide-deck' } })).toEqual([]);
    // An entityType absent from the (text) result set is likewise empty, not a throw.
    expect(search(index, 'kpi', { entityTypes: ['motion'] })).toEqual([]);
  });
});
