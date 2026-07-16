import { HorizonSweep } from '@enterprise-design/motion';
import { SearchField } from '@enterprise-design/primitives';
import { TEMPLATE_COUNT } from '../data/registry.js';
import { LIVE_EXPERIENCE_IDS } from '../data/live.js';
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
}

/**
 * The Gallery Ink hero: exhibition-label eyebrow, serif headline, search.
 * A faint column-grid wash sits behind it (decorative only).
 */
export function Hero({ queryInput, onQueryChange, onSuggested }: HeroProps) {
  const headline = (
    <div key="headline" className="max-w-3xl">
      <p className="mb-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.22em] text-accent">
        {LIVE_EXPERIENCE_IDS.length} live worlds · {TEMPLATE_COUNT} templates · 5 surfaces ·
        composed by AI on demand
      </p>
      <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-[3.4rem]">
        Every template here is <em className="italic text-accent">alive</em>.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
        Working decks, dashboards, and pages with locked art direction — browse them running,
        then hand one your content and let the AI compose your design.
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
        <span className="inline-flex items-center gap-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.16em] text-text-muted">
          <SearchIcon aria-hidden /> Suggested
        </span>
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSuggested(q)}
            className="rounded-full border border-border-subtle bg-surface-raised px-3 py-1 text-xs font-medium text-text-secondary transition-colors duration-feedback ease-settle hover:border-border-strong hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section
      aria-label="Discover enterprise design templates"
      className="relative overflow-hidden border-b border-border-subtle"
    >
      {/* Faint plate-grid wash, like the column rules of a printed catalogue. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 3) 100%',
          maskImage: 'linear-gradient(180deg, transparent 0%, black 30%, black 75%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(180deg, transparent 0%, black 30%, black 75%, transparent 100%)',
        }}
      />
      <div className="relative mx-auto w-full max-w-[80rem] px-6 py-16 sm:py-20">
        <HorizonSweep
          className="flex flex-col gap-8"
          items={[
            { id: 'headline', content: headline },
            { id: 'search', content: search },
          ]}
        />
      </div>
    </section>
  );
}
