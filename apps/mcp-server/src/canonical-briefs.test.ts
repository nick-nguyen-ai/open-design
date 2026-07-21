/**
 * Canonical-brief regression matrix — the behaviour-preserving lock.
 *
 * Drives every {@link CANONICAL_BRIEFS} row through `composeForSurface` against
 * the REAL registry and asserts the deterministic selection matches `expect`.
 * The three seed rows pin the shipped deck outcomes (cutover / tminus / quarter),
 * so any drift in the extracted compose core fails here rather than in the
 * downstream demo/sample/openwiki runs.
 */
import { describe, expect, it } from 'vitest';
import { composeForSurface } from './tools/compose-core.js';
import { loadRegistryData } from './registry-data.js';
import { CANONICAL_BRIEFS } from './canonical-briefs.js';

const registry = loadRegistryData();

describe('canonical-brief matrix', () => {
  it.each(CANONICAL_BRIEFS.map((row) => [`${row.surface} → ${row.expect}`, row] as const))(
    'selects the locked template for %s',
    (_label, row) => {
      const result = composeForSurface(registry, row.surface, row.context, row.brief, 'canonical-briefs', 'strict');
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.data.worldTemplateId).toBe(row.expect);
    },
  );
});
