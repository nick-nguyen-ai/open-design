import type { SurfaceType } from '@enterprise-design/contracts';
import { templateCountsBySurface } from '../data/registry.js';
import { SURFACE_LABEL, SURFACE_USE_CASE, surfaceAccent } from '../data/labels.js';
import { ArrowRightIcon } from './icons.js';

const SURFACE_ORDER: SurfaceType[] = [
  'dashboard',
  'project-page',
  'slide-deck',
  'personal-page',
  'technical-explainer',
];

export interface TemplateShortcutsProps {
  activeSurface: SurfaceType | undefined;
  onSelect: (surface: SurfaceType) => void;
}

/** Five surface shortcut cards; clicking applies the surface filter (toggles). */
export function TemplateShortcuts({ activeSurface, onSelect }: TemplateShortcutsProps) {
  return (
    <section aria-labelledby="shortcuts-heading" className="flex flex-col gap-4">
      <h2 id="shortcuts-heading" className="font-heading text-lg font-semibold text-text-primary">
        Browse by template type
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {SURFACE_ORDER.map((surface) => {
          const count = templateCountsBySurface[surface] ?? 0;
          const isActive = activeSurface === surface;
          return (
            <button
              key={surface}
              type="button"
              onClick={() => onSelect(surface)}
              aria-pressed={isActive}
              className={
                'group relative flex h-full flex-col gap-2 overflow-hidden rounded-lg border p-4 text-left transition-colors duration-feedback ease-settle ' +
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ' +
                (isActive
                  ? 'border-accent bg-accent-muted'
                  : 'border-border-subtle bg-surface-raised hover:bg-surface-sunken')
              }
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: surfaceAccent(surface) }}
              />
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-heading text-md font-semibold text-text-primary">
                  {SURFACE_LABEL[surface]}
                </span>
                <span className="font-numeric text-sm text-text-muted">{count}</span>
              </span>
              <span className="text-xs leading-normal text-text-secondary">
                {SURFACE_USE_CASE[surface]}
              </span>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-accent opacity-0 transition-opacity duration-feedback ease-settle group-hover:opacity-100">
                {isActive ? 'Filtering' : 'Filter'} <ArrowRightIcon />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
