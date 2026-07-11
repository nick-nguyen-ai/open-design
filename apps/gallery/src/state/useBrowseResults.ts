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

export function useBrowseResults(state: BrowseState): BrowseResults {
  return useMemo(() => {
    const filters = toFacetFilter(state.filters);
    const results = search(searchIndex, state.query, {
      entityTypes: entityTypesForMode(state.mode),
      filters,
    });

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
