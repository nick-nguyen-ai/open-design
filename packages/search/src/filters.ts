import type { SearchDocument } from '@enterprise-design/contracts';
import type { FacetFilter } from './types.js';

/** True if `docValues` (a document's array facet) shares at least one value with `wanted` (a single value or array of values). */
function arrayIntersects<T>(docValues: T[] | undefined, wanted: T | T[]): boolean {
  if (!docValues || docValues.length === 0) return false;
  const wantedArray = Array.isArray(wanted) ? wanted : [wanted];
  return docValues.some((value) => wantedArray.includes(value));
}

/**
 * True if `document` passes every filter set in `filters` (plan §15.2: hard
 * filters, AND-combined across facets). Array-valued facets — `audiences`,
 * `density`, `corporateSuitability`, `themeModes` — use ANY-intersect
 * semantics; the rest require exact equality. Unset filter keys impose no
 * constraint.
 *
 * `surface` is special-cased: experiences carry a single `facets.surface`
 * while components carry a multi-valued `facets.surfaces` (a component can be
 * compatible with several surfaces at once). The filter matches if EITHER
 * representation is satisfied, so a single `surface` filter chip works
 * uniformly across both entity types.
 */
export function passesFilters(document: SearchDocument, filters: FacetFilter): boolean {
  const facets = document.facets;

  if (
    filters.surface !== undefined &&
    facets.surface !== filters.surface &&
    !arrayIntersects(facets.surfaces, filters.surface)
  ) {
    return false;
  }
  if (filters.audiences !== undefined && !arrayIntersects(facets.audiences, filters.audiences)) return false;
  if (filters.grammarId !== undefined && facets.grammarId !== filters.grammarId) return false;
  if (filters.category !== undefined && facets.category !== filters.category) return false;
  if (filters.density !== undefined && !arrayIntersects(facets.density, filters.density)) return false;
  if (
    filters.corporateSuitability !== undefined &&
    !arrayIntersects(facets.corporateSuitability, filters.corporateSuitability)
  ) {
    return false;
  }
  if (filters.motionLevel !== undefined && facets.motionLevel !== filters.motionLevel) return false;
  if (filters.approval !== undefined && facets.approval !== filters.approval) return false;
  if (filters.renderingCost !== undefined && facets.renderingCost !== filters.renderingCost) return false;
  if (filters.themeModes !== undefined && !arrayIntersects(facets.themeModes, filters.themeModes)) return false;
  if (filters.usesCanvas !== undefined && facets.usesCanvas !== filters.usesCanvas) return false;
  if (filters.usesWebGL !== undefined && facets.usesWebGL !== filters.usesWebGL) return false;

  return true;
}
