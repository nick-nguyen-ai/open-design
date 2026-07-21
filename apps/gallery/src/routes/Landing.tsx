import { useCallback, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { SearchResult } from '@enterprise-design/search';
import { Drawer, SegmentedControl } from '@enterprise-design/primitives';
import { Hero } from '../components/Hero.js';
import { RecentlyViewedRow } from '../components/RecentlyViewedRow.js';
import { FacetFilters } from '../components/FacetFilters.js';
import { ActiveFilters } from '../components/ActiveFilters.js';
import { ResultGrid } from '../components/ResultGrid.js';
import { QuickPreviewDrawer } from '../components/QuickPreviewDrawer.js';
import { ArrowRightIcon, GridIcon } from '../components/icons.js';
import {
  activeFilterCount,
  SORT_LABEL,
  SORT_OPTIONS,
  type BrowseMode,
  type SortOption,
} from '../state/browseState.js';
import { useBrowseState } from '../state/useBrowseState.js';
import { useBrowseResults } from '../state/useBrowseResults.js';

const MODE_LABELS: Record<BrowseMode, string> = {
  templates: 'Templates',
  components: 'Components',
  grammars: 'Grammars',
  all: 'All',
};

export function Landing() {
  const { state, queryInput, setQueryInput, setMode, setSort, setFilters, clearFilters } =
    useBrowseState();
  const { results, countsByMode } = useBrowseResults(state);

  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  const modeOptions = (Object.keys(MODE_LABELS) as BrowseMode[]).map((mode) => ({
    value: mode,
    label: `${MODE_LABELS[mode]} (${countsByMode[mode]})`,
  }));

  const filterCount = activeFilterCount(state.filters);

  return (
    <div>
      <Hero
        queryInput={queryInput}
        onQueryChange={setQueryInput}
        onSuggested={(q) => {
          setQueryInput(q);
          scrollToResults();
        }}
      />

      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-12 px-6 py-12">
        <RecentlyViewedRow />

        <section ref={resultsRef} aria-labelledby="results-heading" className="scroll-mt-20">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2
                id="results-heading"
                className="font-heading text-2xl font-semibold tracking-tight text-text-primary"
              >
                The catalogue
              </h2>
              <SegmentedControl
                aria-label="Browse mode"
                options={modeOptions}
                value={state.mode}
                onChange={(value) => setMode(value as BrowseMode)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                role="status"
                aria-live="polite"
                className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-text-muted"
              >
                {results.length} {results.length === 1 ? 'work' : 'works'}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm text-text-muted">
                  Sort
                </label>
                <select
                  id="sort-select"
                  value={state.sort}
                  onChange={(e) => setSort(e.currentTarget.value as SortOption)}
                  className="h-9 rounded-md border border-border-strong bg-surface-raised px-2 text-sm text-text-primary transition-colors duration-feedback ease-settle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {SORT_LABEL[option]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface-raised px-3 py-2 text-sm font-medium text-text-primary transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:hidden"
              >
                <GridIcon aria-hidden /> Filters{filterCount > 0 ? ` (${filterCount})` : ''}
                </button>
              </div>
            </div>

            <ActiveFilters
              filters={state.filters}
              onChange={setFilters}
              onClear={clearFilters}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_1fr]">
              <section aria-label="Filters" className="hidden lg:block">
                <div className="sticky top-20">
                  <FacetFilters mode={state.mode} filters={state.filters} onChange={setFilters} />
                </div>
              </section>

              <div className="flex flex-col gap-8">
                <ResultGrid results={results} onOpen={setSelected} onClearFilters={clearFilters} />

                <div className="flex flex-col gap-4 border border-border-subtle bg-surface-sunken p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-text-primary">
                      Found your template?
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      Hand it your content — the MCP server and skills compose the design for you.
                      See what others made in the{' '}
                      <RouterLink to="/showcase" className="text-accent no-underline hover:underline">
                        Showcase
                      </RouterLink>
                      .
                    </p>
                  </div>
                  <RouterLink
                    to="/make"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-4 text-md font-medium text-text-on-accent no-underline transition-colors duration-feedback ease-settle hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    Make your design <ArrowRightIcon />
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Drawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        side="left"
        title="Filters"
      >
        <div className="flex flex-col gap-6">
          <FacetFilters mode={state.mode} filters={state.filters} onChange={setFilters} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                clearFilters();
              }}
              className="flex-1 rounded-md border border-border-strong bg-surface-raised px-4 py-2 text-md font-medium text-text-primary transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1 rounded-md bg-accent px-4 py-2 text-md font-medium text-text-on-accent transition-colors duration-feedback ease-settle hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Apply
            </button>
          </div>
        </div>
      </Drawer>

      <QuickPreviewDrawer result={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
