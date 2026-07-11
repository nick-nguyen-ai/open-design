import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { compileRegistry } from '@enterprise-design/registry';
import { createSearchIndex } from './build.js';
import { search } from './query.js';
import { LABELLED_QUERIES, type LabelledQuery } from './__fixtures__/labelled-queries.js';

const here = path.dirname(fileURLToPath(import.meta.url));
// packages/search/src -> repo root
const REPO_ROOT = path.resolve(here, '..', '..', '..');

/** Real-catalogue top-3 relevance threshold (plan §35 acceptance gate). A real gate — do not lower silently. */
const TOP_3_THRESHOLD = 0.85;

interface CohortResult {
  n: number;
  top3Accuracy: number;
  misses: Array<{ query: string; expected: string[]; got: string[] }>;
}

/** Run every query in `queries` and report top-3 accuracy + the misses. */
function measureCohort(
  index: ReturnType<typeof createSearchIndex>,
  queries: LabelledQuery[],
): CohortResult {
  const misses: CohortResult['misses'] = [];
  for (const { query, expectedTopIds } of queries) {
    const top3 = search(index, query, { limit: 3 }).map((r) => r.id);
    if (!top3.some((id) => expectedTopIds.includes(id))) {
      misses.push({ query, expected: expectedTopIds, got: top3 });
    }
  }
  return { n: queries.length, top3Accuracy: (queries.length - misses.length) / queries.length, misses };
}

/**
 * Retrieval spike (task 9 / plan §35): build the search index over the REAL
 * compiled catalogue (via `compileRegistry`, not a hand-picked fixture),
 * then run a labelled set of realistic natural-language queries and assert
 * that at least `TOP_3_THRESHOLD` of them surface their expected document
 * within the top 3 results. This proves lexical retrieval is viable on the
 * actual 68-document catalogue, not just on hand-tuned unit fixtures.
 *
 * The gate is asserted TWICE: once over the full labelled set, and — more
 * importantly — once over the `paraphrased` cohort alone (queries that
 * describe intent WITHOUT reusing the target's title words). Title-echo
 * queries are near-guaranteed hits with a 5x title boost, so the paraphrased
 * cohort is what actually de-risks the plan's riskiest assumption (§15.4:
 * lexical search over business-intent phrasing). Both must clear the bar.
 */
describe('retrieval spike — top-3 relevance over the real catalogue', () => {
  it(`meets the ${TOP_3_THRESHOLD} top-3 threshold on the full set AND the paraphrased cohort`, async () => {
    const compiled = await compileRegistry({ cwd: REPO_ROOT });
    expect(compiled.ok).toBe(true);
    expect(compiled.searchDocuments.length).toBeGreaterThan(0);

    const index = createSearchIndex(compiled.searchDocuments);

    const paraphrased = LABELLED_QUERIES.filter((q) => q.paraphrased);
    // Guard: the harder cohort must be substantial, not a token handful.
    expect(paraphrased.length).toBeGreaterThanOrEqual(12);

    const full = measureCohort(index, LABELLED_QUERIES);
    const para = measureCohort(index, paraphrased);

    if (full.top3Accuracy < TOP_3_THRESHOLD || para.top3Accuracy < TOP_3_THRESHOLD) {
      // Surface exactly which queries missed and what was returned instead,
      // so a shortfall is immediately actionable (tune synonyms/boosts).
      console.error('Full-set misses:', JSON.stringify(full.misses, null, 2));
      console.error('Paraphrased-cohort misses:', JSON.stringify(para.misses, null, 2));
    }

    expect(para.top3Accuracy).toBeGreaterThanOrEqual(TOP_3_THRESHOLD);
    expect(full.top3Accuracy).toBeGreaterThanOrEqual(TOP_3_THRESHOLD);
  });

  it('every labelled expected id actually exists in the compiled catalogue (guards against a stale query set)', async () => {
    const compiled = await compileRegistry({ cwd: REPO_ROOT });
    const knownIds = new Set(compiled.searchDocuments.map((d) => d.id));
    const unknown = LABELLED_QUERIES.flatMap((q) => q.expectedTopIds).filter((id) => !knownIds.has(id));
    expect(unknown).toEqual([]);
  });
});
