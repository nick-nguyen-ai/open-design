/**
 * Binds {@link BrowseState} to the URL. The query is edited through a local,
 * debounced input mirror so typing stays responsive and doesn't spam history,
 * while mode/filter changes commit immediately (they're deliberate actions).
 *
 * Mode/filter commits always carry the LATEST typed query (via a ref), so
 * switching mode before the query debounce has fired never drops what the user
 * just typed.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  browseStateFromParams,
  browseStateToParams,
  emptyBrowseState,
  type BrowseMode,
  type BrowseState,
  type FilterState,
  type SortOption,
} from './browseState.js';

const QUERY_DEBOUNCE_MS = 220;

export interface UseBrowseState {
  state: BrowseState;
  /** The live, un-debounced value bound to the search input. */
  queryInput: string;
  setQueryInput: (value: string) => void;
  setMode: (mode: BrowseMode) => void;
  setSort: (sort: SortOption) => void;
  setFilters: (next: FilterState) => void;
  clearFilters: () => void;
  /** Apply a full state atomically (query + mode + filters), e.g. a collection preset. */
  apply: (next: BrowseState) => void;
  clearAll: () => void;
}

export function useBrowseState(): UseBrowseState {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useMemo(() => browseStateFromParams(searchParams), [searchParams]);

  const [queryInput, setQueryInputState] = useState(state.query);
  const queryInputRef = useRef(queryInput);
  // Keep the ref in sync in an effect (never write a ref during render). Event
  // handlers run after effects have flushed, so setMode/setFilters read the
  // latest typed value.
  useEffect(() => {
    queryInputRef.current = queryInput;
  }, [queryInput]);

  // Track the query we last pushed to the URL so external URL changes (back
  // button, shared link) re-sync the input, but our own debounced writes don't.
  const committedQuery = useRef(state.query);

  useEffect(() => {
    if (state.query !== committedQuery.current) {
      committedQuery.current = state.query;
      setQueryInputState(state.query);
    }
  }, [state.query]);

  const commit = useCallback(
    (next: BrowseState) => {
      committedQuery.current = next.query;
      setSearchParams(browseStateToParams(next), { replace: false });
    },
    [setSearchParams],
  );

  // Debounced commit of the query text into the URL.
  useEffect(() => {
    if (queryInput === state.query) return;
    const handle = window.setTimeout(() => {
      commit({ ...state, query: queryInput });
    }, QUERY_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [queryInput, state, commit]);

  const setQueryInput = useCallback((value: string) => setQueryInputState(value), []);

  const setMode = useCallback(
    (mode: BrowseMode) => commit({ ...state, query: queryInputRef.current, mode }),
    [commit, state],
  );

  const setSort = useCallback(
    (sort: SortOption) => commit({ ...state, query: queryInputRef.current, sort }),
    [commit, state],
  );

  const setFilters = useCallback(
    (next: FilterState) => commit({ ...state, query: queryInputRef.current, filters: next }),
    [commit, state],
  );

  const clearFilters = useCallback(
    () => commit({ ...state, query: queryInputRef.current, filters: emptyBrowseState(state.mode).filters }),
    [commit, state],
  );

  const apply = useCallback(
    (next: BrowseState) => {
      setQueryInputState(next.query);
      commit(next);
    },
    [commit],
  );

  const clearAll = useCallback(() => {
    setQueryInputState('');
    commit(emptyBrowseState());
  }, [commit]);

  return {
    state,
    queryInput,
    setQueryInput,
    setMode,
    setSort,
    setFilters,
    clearFilters,
    apply,
    clearAll,
  };
}
