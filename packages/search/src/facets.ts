import type {
  ApprovalState,
  Audience,
  ComponentCategory,
  ContentDensity,
  CorporateSuitability,
  MotionLevel,
  SearchDocument,
  SurfaceType,
  ThemeMode,
} from '@enterprise-design/contracts';

/** The set of values actually present per facet, across a document collection. Built by {@link availableFacets}. */
export interface AvailableFacets {
  surface: SurfaceType[];
  audiences: Audience[];
  grammarId: string[];
  category: ComponentCategory[];
  density: ContentDensity[];
  corporateSuitability: CorporateSuitability[];
  motionLevel: MotionLevel[];
  approval: ApprovalState[];
  renderingCost: Array<'low' | 'medium' | 'high'>;
  themeModes: ThemeMode[];
  usesCanvas: boolean[];
  usesWebGL: boolean[];
}

/** Sorted, de-duplicated values — code-unit ordering for strings/numbers, `false` before `true` for booleans — so output is deterministic. */
function sortedUnique<T extends string | number | boolean>(values: Iterable<T>): T[] {
  return [...new Set(values)].sort((a, b) => (a === b ? 0 : a < b ? -1 : 1));
}

/**
 * Enumerate the facet values actually present across `documents`, so the
 * gallery can build its filter controls (chips, selects) from the real
 * catalogue rather than a hardcoded enum list that can drift from it.
 */
export function availableFacets(documents: SearchDocument[]): AvailableFacets {
  const surface = new Set<SurfaceType>();
  const audiences = new Set<Audience>();
  const grammarId = new Set<string>();
  const category = new Set<ComponentCategory>();
  const density = new Set<ContentDensity>();
  const corporateSuitability = new Set<CorporateSuitability>();
  const motionLevel = new Set<MotionLevel>();
  const approval = new Set<ApprovalState>();
  const renderingCost = new Set<'low' | 'medium' | 'high'>();
  const themeModes = new Set<ThemeMode>();
  const usesCanvas = new Set<boolean>();
  const usesWebGL = new Set<boolean>();

  for (const doc of documents) {
    const f = doc.facets;
    if (f.surface !== undefined) surface.add(f.surface);
    for (const value of f.audiences ?? []) audiences.add(value);
    if (f.grammarId !== undefined) grammarId.add(f.grammarId);
    if (f.category !== undefined) category.add(f.category);
    for (const value of f.density ?? []) density.add(value);
    for (const value of f.corporateSuitability ?? []) corporateSuitability.add(value);
    if (f.motionLevel !== undefined) motionLevel.add(f.motionLevel);
    if (f.approval !== undefined) approval.add(f.approval);
    if (f.renderingCost !== undefined) renderingCost.add(f.renderingCost);
    for (const value of f.themeModes ?? []) themeModes.add(value);
    if (f.usesCanvas !== undefined) usesCanvas.add(f.usesCanvas);
    if (f.usesWebGL !== undefined) usesWebGL.add(f.usesWebGL);
  }

  return {
    surface: sortedUnique(surface),
    audiences: sortedUnique(audiences),
    grammarId: sortedUnique(grammarId),
    category: sortedUnique(category),
    density: sortedUnique(density),
    corporateSuitability: sortedUnique(corporateSuitability),
    motionLevel: sortedUnique(motionLevel),
    approval: sortedUnique(approval),
    renderingCost: sortedUnique(renderingCost),
    themeModes: sortedUnique(themeModes),
    usesCanvas: sortedUnique(usesCanvas),
    usesWebGL: sortedUnique(usesWebGL),
  };
}
