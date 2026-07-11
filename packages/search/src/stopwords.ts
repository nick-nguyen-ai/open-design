/**
 * A small English stop-word list plus the term-processing rules shared by the
 * index and the query (MiniSearch applies `processTerm` to both, so indexing
 * and search stay consistent).
 *
 * Why this matters for retrieval quality: without it, function words like
 * "to"/"the"/"a" and stray single-character tokens (e.g. the "s" left over
 * from tokenizing "platform's") match across the corpus and, combined with
 * OR-combination and prefix search, inflate the score of documents that
 * merely contain many common words — burying the genuinely relevant result.
 * Dropping them is standard lexical-search hygiene, not test-specific tuning.
 */
export const STOP_WORDS: ReadonlySet<string> = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by',
  'can', 'did', 'do', 'does', 'for', 'from', 'had', 'has', 'have', 'how',
  'i', 'in', 'into', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'once',
  'one', 'or', 'our', 'ours', 'out', 'over', 'own', 'so', 'that', 'the',
  'their', 'them', 'then', 'there', 'these', 'they', 'this', 'to', 'up',
  'us', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
  'who', 'will', 'with', 'you', 'your', 'yours',
]);

/** Below this length, prefix and fuzzy matching are disabled for a query term (short tokens like "ai"/"kpi" still match exactly). */
export const MIN_PREFIX_FUZZY_LENGTH = 4;

/**
 * Normalize a single term for both indexing and search: lower-case, then drop
 * stop-words and single-character tokens (which carry no retrieval signal and
 * only add noise). Returns `null` to reject the term, matching MiniSearch's
 * `processTerm` contract.
 */
export function processTerm(term: string): string | null {
  const lowered = term.toLowerCase();
  if (lowered.length < 2) return null;
  if (STOP_WORDS.has(lowered)) return null;
  return lowered;
}
