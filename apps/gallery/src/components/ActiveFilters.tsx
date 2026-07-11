import { RemovableChip } from '@enterprise-design/primitives';
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
import { activeFilterCount, type FilterState } from '../state/browseState.js';

interface ChipSpec {
  key: string;
  label: string;
  remove: () => void;
}

export interface ActiveFiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
}

/** Removable chips for every active facet filter, plus a clear-all control. */
export function ActiveFilters({ filters, onChange, onClear }: ActiveFiltersProps) {
  const chips: ChipSpec[] = [];

  if (filters.surface)
    chips.push({
      key: `surface:${filters.surface}`,
      label: SURFACE_LABEL[filters.surface],
      remove: () => onChange({ ...filters, surface: undefined }),
    });
  if (filters.grammarId)
    chips.push({
      key: `grammar:${filters.grammarId}`,
      label: grammarName(filters.grammarId),
      remove: () => onChange({ ...filters, grammarId: undefined }),
    });
  if (filters.category)
    chips.push({
      key: `category:${filters.category}`,
      label: filters.category,
      remove: () => onChange({ ...filters, category: undefined }),
    });
  if (filters.motionLevel !== undefined)
    chips.push({
      key: `motion:${filters.motionLevel}`,
      label: motionLevelLabel(filters.motionLevel),
      remove: () => onChange({ ...filters, motionLevel: undefined }),
    });
  if (filters.approval)
    chips.push({
      key: `approval:${filters.approval}`,
      label: APPROVAL_LABEL[filters.approval],
      remove: () => onChange({ ...filters, approval: undefined }),
    });
  if (filters.renderingCost)
    chips.push({
      key: `cost:${filters.renderingCost}`,
      label: COST_LABEL[filters.renderingCost],
      remove: () => onChange({ ...filters, renderingCost: undefined }),
    });
  for (const a of filters.audiences)
    chips.push({
      key: `audience:${a}`,
      label: AUDIENCE_LABEL[a],
      remove: () => onChange({ ...filters, audiences: filters.audiences.filter((v) => v !== a) }),
    });
  for (const d of filters.density)
    chips.push({
      key: `density:${d}`,
      label: DENSITY_LABEL[d],
      remove: () => onChange({ ...filters, density: filters.density.filter((v) => v !== d) }),
    });
  for (const s of filters.corporateSuitability)
    chips.push({
      key: `suitability:${s}`,
      label: SUITABILITY_LABEL[s],
      remove: () =>
        onChange({
          ...filters,
          corporateSuitability: filters.corporateSuitability.filter((v) => v !== s),
        }),
    });

  if (activeFilterCount(filters) === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-text-muted">Active filters:</span>
      {chips.map((chip) => (
        <RemovableChip key={chip.key} removeLabel={`Remove ${chip.label} filter`} onRemove={chip.remove}>
          {chip.label}
        </RemovableChip>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="rounded-md px-2 py-1 text-xs font-medium text-accent underline-offset-2 transition-colors duration-feedback ease-settle hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Clear all
      </button>
    </div>
  );
}
