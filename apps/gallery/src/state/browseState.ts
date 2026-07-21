/**
 * The unified browse state — query, mode, and facet filters — and its lossless
 * mapping to/from URL search params, so any browse view is shareable and
 * survives a refresh.
 */
import type {
  ApprovalState,
  Audience,
  ComponentCategory,
  ContentDensity,
  CorporateSuitability,
  EntityType,
  MotionLevel,
  SurfaceType,
} from '@enterprise-design/contracts';
import type { FacetFilter } from '@enterprise-design/search';

export type BrowseMode = 'all' | 'templates' | 'components' | 'grammars';

export const BROWSE_MODES: BrowseMode[] = ['templates', 'components', 'grammars', 'all'];

/** The catalogue opens on Templates; the other modes are opt-in views. */
export const DEFAULT_BROWSE_MODE: BrowseMode = 'templates';

/** Result ordering. `relevance` keeps the search package's ranked order. */
export type SortOption = 'relevance' | 'name' | 'motion';

export const SORT_OPTIONS: SortOption[] = ['relevance', 'name', 'motion'];

export const SORT_LABEL: Record<SortOption, string> = {
  relevance: 'Relevance',
  name: 'Name (A–Z)',
  motion: 'Lowest motion',
};

/** Scalar facets are single-select; array facets match on ANY intersection. */
export interface FilterState {
  surface?: SurfaceType;
  grammarId?: string;
  category?: ComponentCategory;
  motionLevel?: MotionLevel;
  approval?: ApprovalState;
  renderingCost?: 'low' | 'medium' | 'high';
  audiences: Audience[];
  density: ContentDensity[];
  corporateSuitability: CorporateSuitability[];
}

export interface BrowseState {
  query: string;
  mode: BrowseMode;
  filters: FilterState;
  sort: SortOption;
}

export const EMPTY_FILTERS: FilterState = {
  audiences: [],
  density: [],
  corporateSuitability: [],
};

export function emptyBrowseState(mode: BrowseMode = DEFAULT_BROWSE_MODE): BrowseState {
  return { query: '', mode, filters: { ...EMPTY_FILTERS }, sort: 'relevance' };
}

/** Entity types eligible in each mode. `all` spans templates, components, grammars. */
export function entityTypesForMode(mode: BrowseMode): EntityType[] {
  switch (mode) {
    case 'templates':
      return ['experience'];
    case 'components':
      return ['component'];
    case 'grammars':
      return ['grammar'];
    case 'all':
    default:
      return ['experience', 'component', 'grammar'];
  }
}

/** Translate the UI filter state into the search package's {@link FacetFilter}. */
export function toFacetFilter(filters: FilterState): FacetFilter {
  const out: FacetFilter = {};
  if (filters.surface) out.surface = filters.surface;
  if (filters.grammarId) out.grammarId = filters.grammarId;
  if (filters.category) out.category = filters.category;
  if (filters.motionLevel !== undefined) out.motionLevel = filters.motionLevel;
  if (filters.approval) out.approval = filters.approval;
  if (filters.renderingCost) out.renderingCost = filters.renderingCost;
  if (filters.audiences.length) out.audiences = filters.audiences;
  if (filters.density.length) out.density = filters.density;
  if (filters.corporateSuitability.length) out.corporateSuitability = filters.corporateSuitability;
  return out;
}

export function activeFilterCount(filters: FilterState): number {
  let n = 0;
  if (filters.surface) n++;
  if (filters.grammarId) n++;
  if (filters.category) n++;
  if (filters.motionLevel !== undefined) n++;
  if (filters.approval) n++;
  if (filters.renderingCost) n++;
  n += filters.audiences.length;
  n += filters.density.length;
  n += filters.corporateSuitability.length;
  return n;
}

function readList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Parse a shareable URL's params into browse state. Unknown values are dropped. */
export function browseStateFromParams(params: URLSearchParams): BrowseState {
  const modeParam = params.get('mode');
  const mode: BrowseMode = BROWSE_MODES.includes(modeParam as BrowseMode)
    ? (modeParam as BrowseMode)
    : DEFAULT_BROWSE_MODE;

  const motionRaw = params.get('motion');
  const motionLevel =
    motionRaw !== null && ['0', '1', '2', '3'].includes(motionRaw)
      ? (Number(motionRaw) as MotionLevel)
      : undefined;

  const filters: FilterState = {
    surface: (params.get('surface') as SurfaceType) || undefined,
    grammarId: params.get('grammar') || undefined,
    category: (params.get('category') as ComponentCategory) || undefined,
    motionLevel,
    approval: (params.get('approval') as ApprovalState) || undefined,
    renderingCost: (params.get('cost') as 'low' | 'medium' | 'high') || undefined,
    audiences: readList(params.get('audiences')) as Audience[],
    density: readList(params.get('density')) as ContentDensity[],
    corporateSuitability: readList(params.get('suitability')) as CorporateSuitability[],
  };

  const sortParam = params.get('sort');
  const sort: SortOption = SORT_OPTIONS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : 'relevance';

  return { query: params.get('q') ?? '', mode, filters, sort };
}

/**
 * Serialize browse state to URL params. Defaults (empty query, default mode,
 * no filters) are omitted so a pristine browse produces a clean `/` URL.
 */
export function browseStateToParams(state: BrowseState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set('q', state.query);
  if (state.mode !== DEFAULT_BROWSE_MODE) params.set('mode', state.mode);
  if (state.sort !== 'relevance') params.set('sort', state.sort);

  const f = state.filters;
  if (f.surface) params.set('surface', f.surface);
  if (f.grammarId) params.set('grammar', f.grammarId);
  if (f.category) params.set('category', f.category);
  if (f.motionLevel !== undefined) params.set('motion', String(f.motionLevel));
  if (f.approval) params.set('approval', f.approval);
  if (f.renderingCost) params.set('cost', f.renderingCost);
  if (f.audiences.length) params.set('audiences', f.audiences.join(','));
  if (f.density.length) params.set('density', f.density.join(','));
  if (f.corporateSuitability.length) params.set('suitability', f.corporateSuitability.join(','));

  return params;
}
