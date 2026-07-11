import type MiniSearch from 'minisearch';
import type {
  ApprovalState,
  Audience,
  ComponentCategory,
  ContentDensity,
  CorporateSuitability,
  EntityType,
  MotionLevel,
  SearchDocument,
  SearchFacets,
  SurfaceType,
  ThemeMode,
} from '@enterprise-design/contracts';

/**
 * A built lexical index over a set of {@link SearchDocument}s. Opaque to
 * callers beyond its shape — build it with {@link createSearchIndex} and
 * query it with {@link search}. Holds no I/O handles, so it is safe to build
 * and hold in a browser tab or a long-lived Node process alike.
 */
export interface SearchIndex {
  /** The underlying MiniSearch instance, indexed on title/summary/text/tags. */
  readonly mini: MiniSearch<SearchDocument>;
  /** O(1) lookup from document id back to the full {@link SearchDocument}. */
  readonly documentsById: ReadonlyMap<string, SearchDocument>;
  /**
   * All documents in a stable browsable order (title, then id as a
   * tie-break) — used to answer the empty-query "show everything" case.
   */
  readonly documents: readonly SearchDocument[];
}

/**
 * Hard facet filters (plan §15.2): a document failing any given filter is
 * removed from the result set regardless of text relevance — filters are
 * never used to merely re-rank.
 *
 * `audiences`, `density`, `corporateSuitability`, and `themeModes` are
 * array-valued on {@link SearchFacets} (a component can support several
 * density levels at once) and match on ANY intersection: a document passes
 * if its facet array shares at least one value with the filter. Pass either
 * a single value (one filter chip) or an array (several chips selected at
 * once). The remaining facets are scalar and require exact equality.
 */
export interface FacetFilter {
  surface?: SurfaceType;
  audiences?: Audience | Audience[];
  grammarId?: string;
  category?: ComponentCategory;
  density?: ContentDensity | ContentDensity[];
  corporateSuitability?: CorporateSuitability | CorporateSuitability[];
  motionLevel?: MotionLevel;
  approval?: ApprovalState;
  renderingCost?: 'low' | 'medium' | 'high';
  themeModes?: ThemeMode | ThemeMode[];
  usesCanvas?: boolean;
  usesWebGL?: boolean;
}

/** Options for {@link search}. */
export interface SearchOptions {
  /** Restrict to these entity types. Omitted or empty means every type is eligible. */
  entityTypes?: EntityType[];
  /** Hard facet filters — see {@link FacetFilter}. */
  filters?: FacetFilter;
  /** Maximum number of results to return, applied after `offset`. */
  limit?: number;
  /** Number of leading results to skip (for pagination). Defaults to 0. */
  offset?: number;
}

/** One ranked search result, shaped for direct rendering by the gallery or the MCP `search_components` tool. */
export interface SearchResult {
  id: string;
  entityType: EntityType;
  title: string;
  summary: string;
  route?: string;
  facets: SearchFacets;
  /** Relevance score. Exact-title matches are ranked first regardless of this value; ties break deterministically by id. */
  score: number;
  /** Document-side terms that matched the query, for highlight-friendly UI. Never HTML — the caller highlights. */
  matchedTerms: string[];
  /** Document fields (`title` | `summary` | `text` | `tags`) the match was found in. */
  matchedFields: string[];
}
