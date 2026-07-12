/**
 * "The Manifesto" — the live full-bleed rendering of `deck-product-vision`.
 *
 * Pure typographic conviction: each slide is a POSTER set like letterpress
 * poster art — one line, sometimes one word, at monumental scale, placed
 * asymmetrically on a near-white field with ONE electric accent (signal red).
 * No charts, the thinnest chrome in the set. Two or three posters settle
 * letter by letter on entrance (L3), built from the shared motion timeline;
 * reduced motion renders them already set, then absolute stillness.
 *
 * Keyboard-driven (←/→/Home/End, I toggles the index), `?slide=`
 * deep-linkable, printable one poster per page (ink on white throughout).
 *
 * Art-direction licence (task 17): this file and manifesto.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven (var(--ease-*), var(--dur-*)); the
 * letter-settle stagger comes from `buildStaggeredTimeline`.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  buildStaggeredTimeline,
  easings,
  useMotionPreference,
} from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './manifesto.css';
import {
  MANIFESTO,
  SLIDES,
  SLIDE_COUNT,
  ANOMALY_SLIDE,
  lineText,
  slideNumberForId,
} from './content.js';
import type { Line, Seg, Slide } from './content.js';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';

/** The rail pins to the edge opposite the poster block, keeping the sheet balanced. */
function railSide(slide: Slide): 'left' | 'right' {
  if (slide.kind === 'poster' && (slide.place === 'ne' || slide.place === 'se')) return 'left';
  return 'right';
}

const WEIGHT_CLASS: Record<NonNullable<Seg['w']>, string> = {
  thin: 'mf-w-thin',
  reg: 'mf-w-reg',
  mid: 'mf-w-mid',
  black: 'mf-w-black',
};

function segClass(seg: Seg): string {
  const w = WEIGHT_CLASS[seg.w ?? 'black'];
  return seg.accent ? `${w} mf-accent` : w;
}

/* ---------------------------------------------------------------- */
/* Static (non-kinetic) display lines — build in per line            */
/* ---------------------------------------------------------------- */

function DisplayLines({ lines, baseIndex = 0 }: { lines: readonly Line[]; baseIndex?: number }) {
  return (
    <>
      {lines.map((line, li) => (
        <span
          key={li}
          className="mf-line mf-build"
          style={{ ['--mf-i' as string]: baseIndex + li }}
        >
          {line.map((seg, si) => (
            <span key={si} className={segClass(seg)}>
              {seg.t}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Kinetic display lines — letter-settle from buildStaggeredTimeline  */
/* ---------------------------------------------------------------- */

/** Total letters across every segment of every line (spaces included). */
function countLetters(lines: readonly Line[]): number {
  return lines.reduce(
    (n, line) => n + line.reduce((m, seg) => m + [...seg.t].length, 0),
    0,
  );
}

function KineticLines({ lines, reduced }: { lines: readonly Line[]; reduced: boolean }) {
  const delays = useMemo(() => {
    const total = countLetters(lines);
    const ids = Array.from({ length: total }, (_, i) => `l-${i}`);
    // The stagger is the ONLY thing we take from the timeline; each letter's own
    // settle duration comes from --dur-structure in the stylesheet, its curve
    // from --ease-settle. The builder guarantees total <= 1200ms.
    const steps = buildStaggeredTimeline({
      ids,
      staggerMs: 46,
      stepDurationMs: 320,
      ease: easings.settle,
      capMs: 1200,
    });
    return steps.map((s) => s.delayMs);
  }, [lines]);

  let letterCursor = 0;
  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className="mf-line">
          {line.map((seg, si) => {
            const chars = [...seg.t];
            return (
              <span key={si} className={segClass(seg)}>
                {chars.map((ch, ci) => {
                  const delay = delays[letterCursor] ?? 0;
                  letterCursor += 1;
                  if (ch === ' ') return <span key={ci}>&nbsp;</span>;
                  return (
                    <span
                      key={ci}
                      className="mf-kin-letter"
                      aria-hidden="true"
                      style={
                        reduced ? undefined : { ['--mf-delay' as string]: `${delay}ms` }
                      }
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Slide bodies                                                      */
/* ---------------------------------------------------------------- */

function SlideBody({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  switch (slide.kind) {
    case 'cover':
      return (
        <div className="mf-poster mf-poster-cover">
          <span className="mf-kicker mf-build" style={{ ['--mf-i' as string]: 0 }}>
            {slide.kicker}
          </span>
          <h2 className="mf-display mf-display-md">
            <DisplayLines lines={slide.lines} baseIndex={1} />
          </h2>
          <span
            className="mf-attribution mf-build"
            style={{ ['--mf-i' as string]: slide.lines.length + 1 }}
          >
            {slide.attribution}
          </span>
          <div
            className="mf-meta mf-build"
            style={{ ['--mf-i' as string]: slide.lines.length + 2 }}
          >
            {slide.meta.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      );

    case 'poster': {
      // Fit-to-measure for the monumental band: the longest line sets the em so
      // a one-word poster fills the sheet and an eight-letter word still fits.
      // Deterministic (pure content arithmetic), no measurement pass.
      const maxChars = Math.max(...slide.lines.map((line) => lineText(line).length));
      const fit =
        slide.scale === 'xl'
          ? { fontSize: `min(${(84 / (maxChars * 0.74)).toFixed(2)}vw, 21vw)` }
          : undefined;
      return (
        <div
          className="mf-poster"
          data-place={slide.place}
          data-testid={slide.anomaly ? 'indictment' : undefined}
        >
          <span className="mf-kicker mf-build" style={{ ['--mf-i' as string]: 0 }}>
            {slide.kicker}
          </span>
          <h2 className={`mf-display mf-display-${slide.scale}`} style={fit}>
            {slide.kinetic ? (
              <>
                <KineticLines lines={slide.lines} reduced={reduced} />
                <VisuallyHidden>{slide.lines.map(lineText).join(' ')}</VisuallyHidden>
              </>
            ) : (
              <DisplayLines lines={slide.lines} baseIndex={1} />
            )}
          </h2>
          {slide.note ? (
            <span
              className="mf-note mf-build"
              style={{ ['--mf-i' as string]: slide.lines.length + 1 }}
            >
              {slide.note}
            </span>
          ) : null}
        </div>
      );
    }

    case 'measure':
      return (
        <div className="mf-poster mf-poster-measure" data-place="center">
          <span className="mf-kicker mf-build" style={{ ['--mf-i' as string]: 0 }}>
            {slide.kicker}
          </span>
          <p className="mf-measure-lead mf-build" style={{ ['--mf-i' as string]: 1 }}>
            {slide.lead.map((line, li) => (
              <span key={li}>
                {line.map((seg, si) => (
                  <span key={si} className={segClass(seg)}>
                    {seg.t}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <p className="mf-measure-numeral">
            {slide.kinetic ? (
              <>
                <KineticLines lines={[[{ t: slide.numeral, w: 'black' }]]} reduced={reduced} />
                <VisuallyHidden>{slide.numeral}</VisuallyHidden>
              </>
            ) : (
              slide.numeral
            )}
          </p>
          <p className="mf-measure-trail mf-build" style={{ ['--mf-i' as string]: 2 }}>
            {slide.trail.map((line, li) => (
              <span key={li}>
                {line.map((seg, si) => (
                  <span key={si} className={segClass(seg)}>
                    {seg.t}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <span className="mf-note mf-build" style={{ ['--mf-i' as string]: 3 }}>
            {slide.note}
          </span>
        </div>
      );

    case 'close':
      return (
        <div className="mf-poster mf-poster-close" data-place="center">
          <h2 className="mf-display mf-display-lg">
            <DisplayLines lines={slide.lines} baseIndex={0} />
          </h2>
          <p
            className="mf-sub mf-build"
            style={{ ['--mf-i' as string]: slide.lines.length }}
          >
            {slide.sub}
          </p>
          <div
            className="mf-meta mf-build"
            style={{ ['--mf-i' as string]: slide.lines.length + 1 }}
          >
            {slide.meta.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      );
  }
}

/* ---------------------------------------------------------------- */
/* The manifesto                                                     */
/* ---------------------------------------------------------------- */

export default function ManifestoPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(
    SLIDE_COUNT,
    { reduced },
  );
  const [indexOpen, setIndexOpen] = useState(false);
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Manifesto — One-Ask Identity — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'i' || event.key === 'I') setIndexOpen((open) => !open);
      if (event.key === 'x' || event.key === 'X') {
        const n = slideNumberForId(ANOMALY_SLIDE.id);
        if (n) goTo(n);
      }
      if (event.key === 'Escape') setIndexOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  const folio = `${MANIFESTO.code} · ${counter.replace(' / ', '/')} · SYNTHETIC PRODUCT VISION`;

  return (
    <div className="mf-root" data-testid="live-manifesto" data-reduced={reduced ? 'true' : undefined}>
      <header className="mf-chrome" aria-label="Manifesto chrome">
        <RouterLink to="/" className="mf-back">
          ◄ GALLERY
        </RouterLink>
        <div className="mf-chrome-right">
          <span data-testid="poster-counter" aria-live="polite">
            {counter}
          </span>
          <button
            type="button"
            className="mf-index-toggle"
            aria-expanded={indexOpen}
            aria-controls="mf-index"
            onClick={() => setIndexOpen((open) => !open)}
          >
            INDEX
          </button>
        </div>
      </header>

      <nav
        id="mf-index"
        className="mf-index"
        aria-label="All posters"
        data-open={indexOpen ? 'true' : undefined}
        hidden={!indexOpen}
      >
        <p className="mf-index-heading">
          {MANIFESTO.title} · {SLIDE_COUNT} POSTERS
        </p>
        <ol className="mf-index-list" data-testid="manifesto-index">
          {SLIDES.map((slide, index) => (
            <li key={slide.id} data-anomaly={slide.kind === 'poster' && slide.anomaly ? 'true' : undefined}>
              <button
                type="button"
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index + 1);
                  setIndexOpen(false);
                }}
              >
                <span className="mf-index-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{slide.folio}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="mf-main">
        <h1>
          <VisuallyHidden>
            The Manifesto — a product vision for One-Ask Identity, set as {SLIDE_COUNT} letterpress
            posters. Its argument in one breath: a customer should never have to explain herself
            twice; our own systems ask her fourteen times; we will ask once, remember her, and prove
            identity rather than re-demand it — until the fourteen becomes one. Currently on poster{' '}
            {activeNumber} of {SLIDE_COUNT}: {activeSlide.folio}.
          </VisuallyHidden>
        </h1>
        <div className="mf-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="mf-slide"
                data-state={state}
                data-slide-id={slide.id}
                data-rail={railSide(slide)}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Poster ${index + 1} of ${SLIDE_COUNT}: ${slide.folio}`}
              >
                <div className="mf-rail" aria-hidden="true">
                  <span className="mf-rail-tick" />
                  <span className="mf-rail-label">
                    {MANIFESTO.code} {String(index + 1).padStart(2, '0')} — {slide.movement}
                  </span>
                  <span className="mf-rail-line" />
                </div>
                <SlideBody slide={slide} reduced={reduced} />
                <div className="mf-print-foot" aria-hidden="true">
                  {MANIFESTO.code} · POSTER {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} ·{' '}
                  {MANIFESTO.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="mf-footer">
        <span className="mf-folio" data-testid="manifesto-folio">
          {folio}
        </span>
        <span className="mf-footer-movement" data-testid="deck-movement">
          {activeSlide.movement}
        </span>
        <div className="mf-footer-nav">
          <span className="mf-hint">{MANIFESTO.keyboardHint}</span>
          <button
            type="button"
            className="mf-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous poster"
          >
            ←
          </button>
          <button
            type="button"
            className="mf-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === SLIDE_COUNT - 1}
            aria-label="Next poster"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
