import { useCallback, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { SurfaceType } from '@enterprise-design/contracts';
import type { SearchResult } from '@enterprise-design/search';
import { Drawer, SegmentedControl } from '@enterprise-design/primitives';
import { Hero } from '../components/Hero.js';
import { TemplateShortcuts } from '../components/TemplateShortcuts.js';
import { FeaturedCollections, type CollectionPreset } from '../components/FeaturedCollections.js';
import { RecentlyViewedRow } from '../components/RecentlyViewedRow.js';
import { FacetFilters } from '../components/FacetFilters.js';
import { ActiveFilters } from '../components/ActiveFilters.js';
import { ResultGrid } from '../components/ResultGrid.js';
import { QuickPreviewDrawer } from '../components/QuickPreviewDrawer.js';
import { ArrowRightIcon, GridIcon } from '../components/icons.js';
import {
  activeFilterCount,
  browseStateToParams,
  type BrowseMode,
} from '../state/browseState.js';
import { useBrowseState } from '../state/useBrowseState.js';
import { useBrowseResults } from '../state/useBrowseResults.js';

const MODE_LABELS: Record<BrowseMode, string> = {
  all: 'All',
  templates: 'Templates',
  components: 'Components',
  grammars: 'Grammars',
};

export function Landing() {
  const { state, queryInput, setQueryInput, setMode, setFilters, clearFilters, apply } =
    useBrowseState();
  const { results, countsByMode } = useBrowseResults(state);

  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  const applyPreset = useCallback(
    (preset: CollectionPreset) => {
      apply({ query: preset.query, mode: preset.mode, filters: preset.filters });
      scrollToResults();
    },
    [apply, scrollToResults],
  );

  const selectSurface = useCallback(
    (surface: SurfaceType) => {
      const next = state.filters.surface === surface ? undefined : surface;
      setFilters({ ...state.filters, surface: next });
      if (state.mode === 'components') setMode('templates');
      scrollToResults();
    },
    [setFilters, setMode, state.filters, state.mode, scrollToResults],
  );

  const modeOptions = (Object.keys(MODE_LABELS) as BrowseMode[]).map((mode) => ({
    value: mode,
    label: `${MODE_LABELS[mode]} (${countsByMode[mode]})`,
  }));

  const blueprintParams = browseStateToParams(state).toString();
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
        onBrowseTemplates={() => {
          setMode('templates');
          scrollToResults();
        }}
        onFindComponents={() => {
          setMode('components');
          scrollToResults();
        }}
      />

      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-12 px-6 py-12">
        <TemplateShortcuts activeSurface={state.filters.surface} onSelect={selectSurface} />
        <FeaturedCollections onApply={applyPreset} />
        <RecentlyViewedRow />

        <section ref={resultsRef} aria-labelledby="results-heading" className="scroll-mt-20">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2
                id="results-heading"
                className="font-heading text-xl font-weight-semibold text-text-primary"
              >
                Browse the catalogue
              </h2>
              <SegmentedControl
                aria-label="Browse mode"
                options={modeOptions}
                value={state.mode}
                onChange={(value) => setMode(value as BrowseMode)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p role="status" aria-live="polite" className="text-sm text-text-secondary">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface-raised px-3 py-2 text-sm font-weight-medium text-text-primary transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:hidden"
              >
                <GridIcon aria-hidden /> Filters{filterCount > 0 ? ` (${filterCount})` : ''}
              </button>
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

                <div className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-raised p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-heading text-md font-weight-semibold text-text-primary">
                      Ready to compose a blueprint?
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      Carry this query, filters, and shortlist into the Blueprint Lab.
                    </p>
                  </div>
                  <RouterLink
                    to={`/blueprint-lab${blueprintParams ? `?${blueprintParams}` : ''}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-4 text-md font-weight-medium text-text-on-accent no-underline transition-colors duration-feedback ease-settle hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    Open Blueprint Lab <ArrowRightIcon />
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
              className="flex-1 rounded-md border border-border-strong bg-surface-raised px-4 py-2 text-md font-weight-medium text-text-primary transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1 rounded-md bg-accent px-4 py-2 text-md font-weight-medium text-text-on-accent transition-colors duration-feedback ease-settle hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
