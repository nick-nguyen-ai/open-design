import { processTerm } from './stopwords.js';

/**
 * Curated business-intent synonym / taxonomy map (plan §15.4).
 *
 * Each group is a small set of interchangeable words or short hyphenated
 * phrases that describe the same underlying business intent even though the
 * catalogue's `SearchDocument.text` may only contain one of them — e.g. a
 * request for "observability" should still find a document whose lexical
 * blob only says "monitoring" and "drift".
 *
 * Expansion is a QUERY-TIME operation only: documents are indexed exactly as
 * authored (never rewritten), and {@link expandQuerySynonyms} appends related
 * terms to the query string before it reaches MiniSearch. This keeps the
 * index itself a faithful, inspectable reflection of the source manifests.
 */
export const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ['monitoring', 'observability', 'drift', 'telemetry'],
  ['deck', 'slides', 'slide-deck', 'presentation'],
  ['genai', 'llm', 'ai', 'artificial-intelligence', 'generative-ai'],
  ['dashboard', 'cockpit', 'control-tower', 'operations-centre'],
  ['chart', 'graph', 'visualization', 'visualisation'],
  ['kpi', 'metric', 'scorecard', 'headline-number'],
  ['architecture', 'system-design', 'blueprint'],
  ['incident', 'postmortem', 'outage'],
  ['risk', 'governance', 'compliance', 'controls'],
  ['portfolio', 'performance'],
  ['roadmap', 'timeline', 'schedule'],
  ['explainer', 'walkthrough', 'explanation'],
  ['personal', 'profile'],
  ['lineage', 'provenance'],
  ['status', 'health'],
  ['trend', 'time-series', 'timeseries'],
  ['migration', 'modernisation', 'modernization'],
  ['launch', 'go-to-market'],
  ['validation', 'assessment', 'review'],
  ['workflow', 'process'],
  ['notebook', 'lab-notebook', 'evidence'],
  ['map', 'atlas', 'network'],
] as const;

const WORD_SPLIT = /[\s-]+/;
const QUERY_TOKEN_SPLIT = /[^a-z0-9]+/;

/**
 * Build a word -> related-words lookup from {@link SYNONYM_GROUPS}, expanding
 * hyphenated phrases into their component words. Stop-words and single-char
 * fragments are excluded so a phrase like "go-to-market" contributes only
 * "go"/"market" and NOT the stopword "to" — otherwise every query containing
 * "to" would spuriously expand with that group's terms.
 */
function buildSynonymIndex(groups: readonly (readonly string[])[]): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>();
  for (const group of groups) {
    const words = new Set<string>();
    for (const phrase of group) {
      for (const word of phrase.toLowerCase().split(WORD_SPLIT)) {
        if (processTerm(word) !== null) words.add(word);
      }
    }
    for (const word of words) {
      const bucket = index.get(word) ?? new Set<string>();
      for (const other of words) {
        if (other !== word) bucket.add(other);
      }
      index.set(word, bucket);
    }
  }
  return index;
}

const SYNONYM_INDEX = buildSynonymIndex(SYNONYM_GROUPS);

/**
 * Expand a raw query with synonym terms so recall improves without changing
 * ranking mechanics: the original query text is preserved and related terms
 * are appended, so an exact match on the original wording still scores
 * highest.
 *
 * Deterministic: token order follows the input query, and each token's
 * related words are appended in the group's authored order, skipping any
 * word already present (from the query itself or an earlier expansion).
 */
export function expandQuerySynonyms(query: string): string {
  const tokens = query
    .toLowerCase()
    .split(QUERY_TOKEN_SPLIT)
    .filter((token) => token.length > 0);
  if (tokens.length === 0) return query;

  const present = new Set(tokens);
  const additions: string[] = [];
  for (const token of tokens) {
    const related = SYNONYM_INDEX.get(token);
    if (!related) continue;
    for (const word of related) {
      if (!present.has(word)) {
        present.add(word);
        additions.push(word);
      }
    }
  }
  return additions.length > 0 ? `${query} ${additions.join(' ')}` : query;
}
