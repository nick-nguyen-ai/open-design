import { EMPTY_FILTERS, type BrowseMode, type FilterState } from '../state/browseState.js';
import { ArrowRightIcon } from './icons.js';

export interface CollectionPreset {
  query: string;
  mode: BrowseMode;
  filters: FilterState;
}

interface Collection {
  id: string;
  title: string;
  reason: string;
  preset: CollectionPreset;
}

/**
 * Curated, rule-based collections — each is a saved query + filter preset over
 * the real catalogue, never behavioural personalisation. Selecting one applies
 * its preset to the unified browse state.
 */
const COLLECTIONS: Collection[] = [
  {
    id: 'executive-reporting',
    title: 'Executive reporting',
    reason: 'Board-ready surfaces that lead with a single posture statement.',
    preset: { query: '', mode: 'templates', filters: { ...EMPTY_FILTERS, audiences: ['executive'] } },
  },
  {
    id: 'ai-model-risk',
    title: 'AI & model risk',
    reason: 'Templates for governing models under regulatory scrutiny.',
    preset: {
      query: '',
      mode: 'templates',
      filters: { ...EMPTY_FILTERS, grammarId: 'calm-command' },
    },
  },
  {
    id: 'technical-storytelling',
    title: 'Technical storytelling',
    reason: 'Architecture and system explainers that walk the reader through.',
    preset: {
      query: '',
      mode: 'templates',
      filters: { ...EMPTY_FILTERS, surface: 'technical-explainer' },
    },
  },
  {
    id: 'people-and-mentoring',
    title: 'People & mentoring',
    reason: 'Personal hubs and internal profiles with a human register.',
    preset: {
      query: '',
      mode: 'templates',
      filters: { ...EMPTY_FILTERS, surface: 'personal-page' },
    },
  },
];

export interface FeaturedCollectionsProps {
  onApply: (preset: CollectionPreset) => void;
}

export function FeaturedCollections({ onApply }: FeaturedCollectionsProps) {
  return (
    <section aria-labelledby="collections-heading" className="flex flex-col gap-4">
      <h2 id="collections-heading" className="font-heading text-lg font-semibold text-text-primary">
        Featured collections
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COLLECTIONS.map((collection) => (
          <button
            key={collection.id}
            type="button"
            onClick={() => onApply(collection.preset)}
            className="group flex h-full flex-col gap-2 rounded-lg border border-border-subtle bg-surface-raised p-4 text-left transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <span className="font-heading text-md font-semibold text-text-primary">
              {collection.title}
            </span>
            <span className="text-xs leading-normal text-text-secondary">{collection.reason}</span>
            <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-accent">
              View collection <ArrowRightIcon />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
