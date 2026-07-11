import MiniSearch from 'minisearch';
import type { SearchDocument } from '@enterprise-design/contracts';
import type { SearchIndex } from './types.js';
import { MIN_PREFIX_FUZZY_LENGTH, processTerm } from './stopwords.js';

const FIELDS = ['title', 'summary', 'text', 'tags'] as const;

/**
 * Field boosts: an exact/near-exact hit in `title` matters far more than one
 * buried in the full lexical blob. `tags` are curated keywords an author
 * chose deliberately, so they outrank `summary` prose; `text` (title +
 * summary + tags + extra searchText already folded in by the registry
 * compiler) is the lowest-weighted catch-all.
 */
const FIELD_BOOST: Record<(typeof FIELDS)[number], number> = {
  title: 5,
  tags: 3,
  summary: 2,
  text: 1,
};

/** MiniSearch's default `extractField` assumes string properties; `tags` is `string[]`, so join it into a space-separated string for tokenizing. */
function extractField(document: SearchDocument, fieldName: string): string {
  if (fieldName === 'tags') return document.tags.join(' ');
  const value = (document as unknown as Record<string, unknown>)[fieldName];
  return typeof value === 'string' ? value : '';
}

/** Stable browsable order: title (case-insensitive), then id as a deterministic tie-break. */
function compareBrowsable(a: SearchDocument, b: SearchDocument): number {
  const titleA = a.title.toLowerCase();
  const titleB = b.title.toLowerCase();
  if (titleA !== titleB) return titleA < titleB ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * Build a lexical search index over `documents`. Pure and synchronous —
 * identical input produces an identical index every time. MiniSearch itself
 * is pure TypeScript with no `fs`/`path`/platform APIs, so this function is
 * safe to call from a browser tab (the gallery) or a Node process (the MCP
 * server) alike; this package never reads the documents from disk itself.
 */
export function createSearchIndex(documents: SearchDocument[]): SearchIndex {
  const mini = new MiniSearch<SearchDocument>({
    idField: 'id',
    fields: [...FIELDS],
    extractField,
    // Drop stop-words / single-char tokens from both index and query.
    processTerm,
    searchOptions: {
      boost: FIELD_BOOST,
      // Prefix and fuzzy matching only for terms long enough to be meaningful:
      // this stops short tokens ("ai", "kpi") from prefix-exploding across the
      // corpus while still matching them exactly.
      prefix: (term) => term.length >= MIN_PREFIX_FUZZY_LENGTH,
      fuzzy: (term) => (term.length >= MIN_PREFIX_FUZZY_LENGTH ? 0.2 : false),
      combineWith: 'OR',
    },
  });
  mini.addAll(documents);

  return {
    mini,
    documentsById: new Map(documents.map((doc) => [doc.id, doc])),
    documents: [...documents].sort(compareBrowsable),
  };
}
