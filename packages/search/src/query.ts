import type { SearchDocument } from '@enterprise-design/contracts';
import { expandQuerySynonyms } from './synonyms.js';
import { passesFilters } from './filters.js';
import type { SearchIndex, SearchOptions, SearchResult } from './types.js';

/** Normalize a title for exact/near-exact matching: trim, lowercase, collapse internal whitespace. */
function normalizeTitle(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function toSearchResult(
  doc: SearchDocument,
  score: number,
  matchedTerms: string[],
  matchedFields: string[],
): SearchResult {
  const result: SearchResult = {
    id: doc.id,
    entityType: doc.entityType,
    title: doc.title,
    summary: doc.summary,
    facets: doc.facets,
    score,
    matchedTerms,
    matchedFields,
  };
  if (doc.route !== undefined) result.route = doc.route;
  return result;
}

/** Deterministic tie-break for equal-relevance results: code-unit id ordering (never locale-dependent). */
function compareIds(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/**
 * Query a {@link SearchIndex} built by {@link createSearchIndex}.
 *
 * - An empty (or whitespace-only) query returns every filtered document in
 *   the index's stable browsable order (title, then id) — this is what lets
 *   the landing page show "all templates" before the visitor types anything.
 * - A non-empty query is expanded with the synonym/taxonomy map (see
 *   `synonyms.ts`), searched with MiniSearch (prefix + fuzzy matching, field
 *   boosts favouring `title`), then re-ranked so an exact/near-exact title
 *   match always ranks first; remaining results keep MiniSearch's relevance
 *   order with a deterministic id tie-break.
 * - `entityTypes` and `filters` are HARD constraints (plan §15.2): a
 *   document failing either is removed regardless of text score. An omitted
 *   or empty `entityTypes` array applies no type constraint.
 *
 * Deterministic: identical `index` + `query` + `options` always yields an
 * identically ordered result array.
 */
export function search(index: SearchIndex, query: string, options: SearchOptions = {}): SearchResult[] {
  const { entityTypes, filters, limit, offset = 0 } = options;

  const passesCommonFilters = (doc: SearchDocument): boolean => {
    if (entityTypes && entityTypes.length > 0 && !entityTypes.includes(doc.entityType)) return false;
    if (filters && !passesFilters(doc, filters)) return false;
    return true;
  };

  const trimmedQuery = query.trim();
  let results: SearchResult[];

  if (trimmedQuery.length === 0) {
    results = index.documents.filter(passesCommonFilters).map((doc) => toSearchResult(doc, 1, [], []));
  } else {
    const expandedQuery = expandQuerySynonyms(trimmedQuery);
    const normalizedQuery = normalizeTitle(trimmedQuery);

    const scored = index.mini
      .search(expandedQuery)
      .map((raw) => {
        const doc = index.documentsById.get(String(raw.id));
        if (!doc || !passesCommonFilters(doc)) return undefined;
        return {
          doc,
          score: raw.score,
          matchedTerms: raw.terms,
          matchedFields: [...new Set(Object.values(raw.match).flat())],
          isExactTitle: normalizeTitle(doc.title) === normalizedQuery,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);

    scored.sort((a, b) => {
      if (a.isExactTitle !== b.isExactTitle) return a.isExactTitle ? -1 : 1;
      if (a.score !== b.score) return b.score - a.score;
      return compareIds(a.doc.id, b.doc.id);
    });

    results = scored.map((entry) => toSearchResult(entry.doc, entry.score, entry.matchedTerms, entry.matchedFields));
  }

  return limit !== undefined ? results.slice(offset, offset + limit) : results.slice(offset);
}
