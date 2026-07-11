import type { SearchResult } from '@enterprise-design/search';
import { LedgerReveal } from '@enterprise-design/motion';
import { EmptyState } from '@enterprise-design/primitives';
import { ResultCard } from './ResultCard.js';

export interface ResultGridProps {
  results: SearchResult[];
  onOpen: (result: SearchResult) => void;
  onClearFilters: () => void;
}

/**
 * The unified result grid. Cards enter with the `ledger-reveal` signature
 * sequence in reading order (keyed by id, so narrowing a filter doesn't
 * re-animate the survivors); reduced-motion collapses this to an opacity step.
 */
export function ResultGrid({ results, onOpen, onClearFilters }: ResultGridProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        title="No matches"
        description="Nothing in the catalogue matches this combination of query and filters. Try removing a filter or broadening your search."
        action={
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-md bg-accent px-4 py-2 text-md font-medium text-text-on-accent transition-colors duration-feedback ease-settle hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Clear filters
          </button>
        }
      />
    );
  }

  return (
    <LedgerReveal
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      items={results.map((result) => ({
        id: result.id,
        content: <ResultCard result={result} onOpen={onOpen} />,
      }))}
    />
  );
}
