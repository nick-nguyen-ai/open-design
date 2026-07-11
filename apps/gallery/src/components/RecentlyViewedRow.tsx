import { Link as RouterLink } from 'react-router-dom';
import { ENTITY_LABEL } from '../data/labels.js';
import { useRecentlyViewed } from '../state/useRecentlyViewed.js';
import { ClockIcon } from './icons.js';

/** Recently-viewed items from localStorage (no network); hidden when empty. */
export function RecentlyViewedRow() {
  const { items, clear } = useRecentlyViewed();
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="recent-heading"
          className="inline-flex items-center gap-2 font-heading text-lg font-weight-semibold text-text-primary"
        >
          <ClockIcon aria-hidden /> Recently viewed
        </h2>
        <button
          type="button"
          onClick={clear}
          className="rounded-md px-2 py-1 text-xs font-weight-medium text-accent underline-offset-2 transition-colors duration-feedback ease-settle hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <RouterLink
              to={item.route}
              className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface-raised px-3 py-2 text-sm no-underline transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <span className="text-text-primary">{item.title}</span>
              <span className="text-xs text-text-muted">{ENTITY_LABEL[item.entityType]}</span>
            </RouterLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
