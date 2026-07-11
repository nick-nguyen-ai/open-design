import { HorizonSweep } from '@enterprise-design/motion';
import { Button, SearchField } from '@enterprise-design/primitives';
import { TEMPLATE_COUNT } from '../data/registry.js';
import { SearchIcon } from './icons.js';

/** Static suggested queries derived from the registry's dominant themes. */
export const SUGGESTED_QUERIES = [
  'model monitoring',
  'AI risk posture',
  'board reporting',
  'system architecture',
  'operating model',
  'onboarding',
] as const;

export interface HeroProps {
  queryInput: string;
  onQueryChange: (value: string) => void;
  onSuggested: (query: string) => void;
  onBrowseTemplates: () => void;
  onFindComponents: () => void;
}

export function Hero({
  queryInput,
  onQueryChange,
  onSuggested,
  onBrowseTemplates,
  onFindComponents,
}: HeroProps) {
  const headline = (
    <div key="headline" className="max-w-3xl">
      <p className="mb-3 text-sm font-weight-medium uppercase tracking-wider text-accent">
        Enterprise Design Intelligence
      </p>
      <h1 className="font-display text-4xl font-weight-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
        {TEMPLATE_COUNT} bank-credible templates, one considered system.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
        Search a curated catalogue of enterprise experiences, the live components behind them, and
        the design grammars that hold them to a standard. Built to be read by someone senior.
      </p>
    </div>
  );

  const search = (
    <div key="search" className="max-w-2xl">
      <SearchField
        value={queryInput}
        onChange={(e) => onQueryChange(e.currentTarget.value)}
        onClear={() => onQueryChange('')}
        aria-label="Search templates, components, and grammars"
        placeholder="Try “model monitoring”, “AI strategy deck”, “system architecture”…"
        className="text-md"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <SearchIcon aria-hidden /> Suggested:
        </span>
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSuggested(q)}
            className="rounded-full border border-border-subtle bg-surface-raised px-3 py-1 text-xs font-weight-medium text-text-secondary transition-colors duration-feedback ease-settle hover:bg-surface-sunken hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );

  const actions = (
    <div key="actions" className="flex flex-wrap gap-3">
      <Button variant="primary" onClick={onBrowseTemplates}>
        Browse templates
      </Button>
      <Button variant="secondary" onClick={onFindComponents}>
        Find components
      </Button>
    </div>
  );

  return (
    <section aria-label="Discover enterprise design templates" className="relative border-b border-border-subtle">
      <div className="mx-auto w-full max-w-[80rem] px-6 py-16 sm:py-20">
        <HorizonSweep
          className="flex flex-col gap-8"
          items={[
            { id: 'headline', content: headline },
            { id: 'search', content: search },
            { id: 'actions', content: actions },
          ]}
        />
      </div>
    </section>
  );
}
