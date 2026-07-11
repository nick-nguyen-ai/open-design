import { describe, expect, it } from 'vitest';
import { expandQuerySynonyms, SYNONYM_GROUPS } from './synonyms.js';
import { createSearchIndex } from './build.js';
import { search } from './query.js';
import { FIXTURE_DOCUMENTS } from './__fixtures__/documents.js';

describe('expandQuerySynonyms', () => {
  it('appends related terms for a query token that appears in a synonym group', () => {
    const expanded = expandQuerySynonyms('observability dashboard');
    expect(expanded).toContain('observability dashboard');
    expect(expanded).toMatch(/\bmonitoring\b/);
    expect(expanded).toMatch(/\bdrift\b/);
  });

  it('does not duplicate a term already present in the query', () => {
    const expanded = expandQuerySynonyms('monitoring dashboard');
    const occurrences = expanded.split(/\s+/).filter((t) => t === 'monitoring').length;
    expect(occurrences).toBe(1);
  });

  it('leaves a query with no known synonyms unchanged', () => {
    expect(expandQuerySynonyms('xylophone quokka')).toBe('xylophone quokka');
  });

  it('does not treat a stop-word fragment of a hyphenated synonym as an expansion trigger', () => {
    // Regression: "go-to-market" splits to go/to/market; the stop-word "to"
    // must NOT become a synonym key, or every query containing "to" would
    // spuriously expand with launch/go/market and derail ranking.
    expect(expandQuerySynonyms('move workloads to the cloud')).toBe('move workloads to the cloud');
  });

  it('is deterministic across repeated calls', () => {
    expect(expandQuerySynonyms('genai llm strategy')).toBe(expandQuerySynonyms('genai llm strategy'));
  });

  it('every synonym group has at least two terms', () => {
    for (const group of SYNONYM_GROUPS) {
      expect(group.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('synonym expansion improves recall', () => {
  it('finds a document via a synonym even though the literal query word never appears in its text', () => {
    const index = createSearchIndex(FIXTURE_DOCUMENTS);
    // db-model-monitoring-cockpit's text says "monitoring" and "drift", never "observability".
    const doc = FIXTURE_DOCUMENTS.find((d) => d.id === 'db-model-monitoring-cockpit');
    expect(doc?.text).not.toContain('observability');

    const results = search(index, 'observability');
    expect(results.map((r) => r.id)).toContain('db-model-monitoring-cockpit');
  });

  it('a query for "llm" (never in the doc text) still matches a document that only says "genai", via the genai/llm group', () => {
    const withSynonym: typeof FIXTURE_DOCUMENTS = [
      ...FIXTURE_DOCUMENTS,
      {
        id: 'deck-genai-model-validation-report',
        entityType: 'experience',
        title: 'GenAI Model Validation Report',
        summary: 'Walks a validation committee through evidence and test results.',
        text: 'genai model validation report walks a validation committee through evidence and test results genai model-validation slide-deck',
        tags: ['genai', 'model-validation', 'slide-deck'],
        facets: { surface: 'slide-deck', density: ['medium'], corporateSuitability: ['standard'] },
        route: '/preview/deck-genai-model-validation-report',
      },
    ];
    const doc = withSynonym.find((d) => d.id === 'deck-genai-model-validation-report');
    expect(doc?.text).not.toContain('llm');

    const index = createSearchIndex(withSynonym);
    const results = search(index, 'llm');
    expect(results.map((r) => r.id)).toContain('deck-genai-model-validation-report');
  });
});
