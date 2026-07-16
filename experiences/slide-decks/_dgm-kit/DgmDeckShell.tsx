import { useEffect, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import type { DgmFillT } from './dgm-fill.js';

/**
 * Shared MECHANICS of the five grammar-tour decks (`deck-dgm-<family>`) —
 * the same role `useDeckNavigation` plays for every deck, one level up: the
 * ten-slide state machine, keyboard/deep-link nav, chrome skeleton (back
 * link, code · world, counter, notice, prev/next), and the visually hidden
 * deck summary. Part-id anchors live in each family template — the static
 * borrow contract wants the experience prefix as a source literal there.
 *
 * NO craft lives here: every class name derives from the family's
 * `classPrefix`, all colour/type/motion comes from the family's own CSS, and
 * each slide body is rendered by the family template via `renderSlide`. The
 * `*Template.tsx` files remain the craft owners the certifier leak-scans.
 */

export const DGM_SECTION_KINDS = [
  'cover',
  'flow-slide',
  'sequence-slide',
  'layers-slide',
  'zones-slide',
  'cycle-slide',
  'compare-slide',
  'cells-slide',
  'timeline-slide',
  'close',
] as const;
export type DgmSectionKind = (typeof DGM_SECTION_KINDS)[number];

const SLIDE_COUNT = DGM_SECTION_KINDS.length;

export interface DgmDeckShellProps {
  fill: DgmFillT;
  /** Root test anchor, e.g. `live-dgm-sketchnote`. */
  rootTestId: string;
  /** Family class prefix, e.g. `skd` — every chrome class derives from it. */
  classPrefix: string;
  /** One line describing the world for the hidden deck summary. */
  summary: string;
  /** The family template's craft: render one slide body. */
  renderSlide: (kind: DgmSectionKind, reduced: boolean) => ReactNode;
}

export function DgmDeckShell({ fill, rootTestId, classPrefix, summary, renderSlide }: DgmDeckShellProps) {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, { reduced });
  const p = classPrefix;

  useEffect(() => {
    document.title = `${fill.deck.world} — ${fill.deck.title} — Live`;
  }, [fill.deck.world, fill.deck.title]);

  return (
    <div className={`${p}-root`} data-testid={rootTestId} data-reduced={reduced ? 'true' : undefined}>
      <header className={`${p}-chrome ${p}-chrome-top`} aria-label="Deck chrome">
        <div className={`${p}-chrome-cell`}>
          <RouterLink to="/" className={`${p}-back`}>
            ← gallery
          </RouterLink>
          <span className={`${p}-chrome-rule`} aria-hidden="true" />
          <span>
            {fill.deck.code} · {fill.deck.world}
          </span>
        </div>
        <div className={`${p}-chrome-cell`}>
          <span data-testid={`${rootTestId}-counter`} aria-live="polite">
            {counter}
          </span>
        </div>
      </header>

      <main className={`${p}-main`}>
        <h1>
          <VisuallyHidden>
            {fill.deck.world} — {fill.deck.title}. {summary} Slide {activeNumber} of {SLIDE_COUNT}:{' '}
            {DGM_SECTION_KINDS[activeIndex]}.
          </VisuallyHidden>
        </h1>
        <div className={`${p}-stage`}>
          {DGM_SECTION_KINDS.map((kind, index) => {
            const state = index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={kind}
                className={`${p}-slide`}
                data-state={state}
                data-slide-id={kind}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${kind}`}
              >
                {renderSlide(kind, reduced)}
              </section>
            );
          })}
        </div>
      </main>

      <footer className={`${p}-chrome ${p}-chrome-bottom`} aria-label="Deck controls">
        <span className={`${p}-notice`}>{fill.deck.notice}</span>
        <div className={`${p}-footer-nav`}>
          <span className={`${p}-hint`}>← → · home/end</span>
          <button
            type="button"
            className={`${p}-nav-btn`}
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className={`${p}-nav-btn`}
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === SLIDE_COUNT - 1}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
