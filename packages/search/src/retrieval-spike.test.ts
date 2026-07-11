import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { compileRegistry } from '@enterprise-design/registry';
import { createSearchIndex } from './build.js';
import { search } from './query.js';
import { LABELLED_QUERIES } from './__fixtures__/labelled-queries.js';

const here = path.dirname(fileURLToPath(import.meta.url));
// packages/search/src -> repo root
const REPO_ROOT = path.resolve(here, '..', '..', '..');

/** Real-catalogue top-3 relevance threshold (plan §35 acceptance gate). A real gate — do not lower silently. */
const TOP_3_THRESHOLD = 0.85;

/**
 * Retrieval spike (task 9 / plan §35): build the search index over the REAL
 * compiled catalogue (via `compileRegistry`, not a hand-picked fixture),
 * then run a labelled set of realistic natural-language queries and assert
 * that at least `TOP_3_THRESHOLD` of them surface their expected document
 * within the top 3 results. This proves lexical retrieval is viable on the
 * actual 68-document catalogue, not just on hand-tuned unit fixtures.
 */
describe('retrieval spike — top-3 relevance over the real catalogue', () => {
  it(`meets the ${TOP_3_THRESHOLD} top-3 threshold across ${LABELLED_QUERIES.length} labelled queries`, async () => {
    const compiled = await compileRegistry({ cwd: REPO_ROOT });
    expect(compiled.ok).toBe(true);
    expect(compiled.searchDocuments.length).toBeGreaterThan(0);

    const index = createSearchIndex(compiled.searchDocuments);

    const misses: Array<{ query: string; expected: string[]; got: string[] }> = [];
    for (const { query, expectedTopIds } of LABELLED_QUERIES) {
      const top3 = search(index, query, { limit: 3 }).map((r) => r.id);
      const hit = top3.some((id) => expectedTopIds.includes(id));
      if (!hit) misses.push({ query, expected: expectedTopIds, got: top3 });
    }

    const hits = LABELLED_QUERIES.length - misses.length;
    const top3Accuracy = hits / LABELLED_QUERIES.length;

    if (top3Accuracy < TOP_3_THRESHOLD) {
      // Surface exactly which queries missed and what was returned instead,
      // so a shortfall is immediately actionable (tune synonyms/boosts).
      console.error('Retrieval spike misses:', JSON.stringify(misses, null, 2));
    }

    expect(top3Accuracy).toBeGreaterThanOrEqual(TOP_3_THRESHOLD);
  });

  it('every labelled expected id actually exists in the compiled catalogue (guards against a stale query set)', async () => {
    const compiled = await compileRegistry({ cwd: REPO_ROOT });
    const knownIds = new Set(compiled.searchDocuments.map((d) => d.id));
    const unknown = LABELLED_QUERIES.flatMap((q) => q.expectedTopIds).filter((id) => !knownIds.has(id));
    expect(unknown).toEqual([]);
  });
});
