import type { ReactNode } from 'react';
import type {
  ApprovalState,
  Audience,
  ComponentCategory,
  ContentDensity,
  CorporateSuitability,
  MotionLevel,
  SurfaceType,
} from '@enterprise-design/contracts';
import { Chip } from '@enterprise-design/primitives';
import { facets } from '../data/registry.js';
import {
  APPROVAL_LABEL,
  AUDIENCE_LABEL,
  COST_LABEL,
  DENSITY_LABEL,
  grammarName,
  motionLevelLabel,
  SUITABILITY_LABEL,
  SURFACE_LABEL,
} from '../data/labels.js';
import type { BrowseMode, FilterState } from '../state/browseState.js';

interface FacetGroupProps {
  legend: string;
  children: ReactNode;
}

function FacetGroup({ legend, children }: FacetGroupProps) {
  if (!children) return null;
  return (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

export interface FacetFiltersProps {
  mode: BrowseMode;
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

/**
 * Filter controls built from {@link availableFacets} over the real catalogue.
 * Scalar facets (surface, grammar, category, motion, approval, cost) are
 * single-select; array facets (audiences, density, suitability) multi-select
 * and match on any intersection. Which groups show depends on the mode, since
 * e.g. `surface`/`grammar` don't describe components.
 */
export function FacetFilters({ mode, filters, onChange }: FacetFiltersProps) {
  const setScalar = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value });
  };

  const toggleInArray = <T,>(key: 'audiences' | 'density' | 'corporateSuitability', value: T) => {
    const current = filters[key] as T[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next } as FilterState);
  };

  const showSurface = mode === 'all' || mode === 'templates';
  const showGrammar = mode !== 'components';
  const showCategory = mode === 'all' || mode === 'components';
  const showCost = mode === 'all' || mode === 'components';

  return (
    <div className="flex flex-col gap-5">
      {showSurface && facets.surface.length > 0 && (
        <FacetGroup legend="Surface">
          {facets.surface.map((s: SurfaceType) => (
            <Chip key={s} selected={filters.surface === s} onClick={() => setScalar('surface', s)}>
              {SURFACE_LABEL[s]}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {showGrammar && facets.grammarId.length > 0 && (
        <FacetGroup legend="Grammar">
          {facets.grammarId.map((g: string) => (
            <Chip key={g} selected={filters.grammarId === g} onClick={() => setScalar('grammarId', g)}>
              {grammarName(g)}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {showCategory && facets.category.length > 0 && (
        <FacetGroup legend="Category">
          {facets.category.map((c: ComponentCategory) => (
            <Chip
              key={c}
              selected={filters.category === c}
              onClick={() => setScalar('category', c)}
              className="capitalize"
            >
              {c}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {facets.audiences.length > 0 && (
        <FacetGroup legend="Audience">
          {facets.audiences.map((a: Audience) => (
            <Chip
              key={a}
              selected={filters.audiences.includes(a)}
              onClick={() => toggleInArray<Audience>('audiences', a)}
            >
              {AUDIENCE_LABEL[a]}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {facets.density.length > 0 && (
        <FacetGroup legend="Density">
          {facets.density.map((d: ContentDensity) => (
            <Chip
              key={d}
              selected={filters.density.includes(d)}
              onClick={() => toggleInArray<ContentDensity>('density', d)}
            >
              {DENSITY_LABEL[d]}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {facets.motionLevel.length > 0 && (
        <FacetGroup legend="Motion level">
          {facets.motionLevel.map((m: MotionLevel) => (
            <Chip
              key={m}
              selected={filters.motionLevel === m}
              onClick={() => setScalar('motionLevel', m)}
            >
              {motionLevelLabel(m)}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {facets.corporateSuitability.length > 0 && (
        <FacetGroup legend="Corporate suitability">
          {facets.corporateSuitability.map((s: CorporateSuitability) => (
            <Chip
              key={s}
              selected={filters.corporateSuitability.includes(s)}
              onClick={() => toggleInArray<CorporateSuitability>('corporateSuitability', s)}
            >
              {SUITABILITY_LABEL[s]}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {showCost && facets.renderingCost.length > 0 && (
        <FacetGroup legend="Rendering cost">
          {facets.renderingCost.map((c) => (
            <Chip
              key={c}
              selected={filters.renderingCost === c}
              onClick={() => setScalar('renderingCost', c)}
            >
              {COST_LABEL[c]}
            </Chip>
          ))}
        </FacetGroup>
      )}

      {facets.approval.length > 0 && (
        <FacetGroup legend="Approval">
          {facets.approval.map((a: ApprovalState) => (
            <Chip key={a} selected={filters.approval === a} onClick={() => setScalar('approval', a)}>
              {APPROVAL_LABEL[a]}
            </Chip>
          ))}
        </FacetGroup>
      )}
    </div>
  );
}
