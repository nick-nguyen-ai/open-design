/**
 * Runs the client-side search for a browse state and reports per-mode counts
 * for the mode switcher. All pure/deterministic over the frozen registry data.
 */
import { useMemo } from 'react';
import type { SearchResult } from '@enterprise-design/search';
import { search } from '@enterprise-design/search';
import { searchIndex } from '../data/registry.js';
import {
  BROWSE_MODES,
  entityTypesForMode,
  toFacetFilter,
  type BrowseMode,
  type BrowseState,
} from './browseState.js';

export interface BrowseResults {
  results: SearchResult[];
  /** Result count for each mode under the current query + filters. */
  countsByMode: Record<BrowseMode, number>;
}

/** Reorder ranked results per the active sort. `relevance` keeps search order. */
function applySort(results: SearchResult[], sort: BrowseState['sort']): SearchResult[] {
  if (sort === 'relevance') return results;
  const sorted = [...results];
  if (sort === 'name') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Lowest motion intensity first; ties fall back to name for stability.
    sorted.sort((a, b) => {
      const am = a.facets.motionLevel ?? 0;
      const bm = b.facets.motionLevel ?? 0;
      return am - bm || a.title.localeCompare(b.title);
    });
  }
  return sorted;
}

export function useBrowseResults(state: BrowseState): BrowseResults {
  return useMemo(() => {
    const filters = toFacetFilter(state.filters);
    const results = applySort(
      search(searchIndex, state.query, {
        entityTypes: entityTypesForMode(state.mode),
        filters,
      }),
      state.sort,
    );

    const countsByMode = {} as Record<BrowseMode, number>;
    for (const mode of BROWSE_MODES) {
      countsByMode[mode] = search(searchIndex, state.query, {
        entityTypes: entityTypesForMode(mode),
        filters,
      }).length;
    }

    return { results, countsByMode };
  }, [state]);
}
