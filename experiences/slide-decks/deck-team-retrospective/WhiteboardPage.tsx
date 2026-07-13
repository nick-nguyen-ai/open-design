/**
 * "The Whiteboard" — the live full-bleed rendering of
 * `deck-team-retrospective`.
 *
 * A sprint retro photographed mid-session as a whiteboard: a marker-stroke frame
 * around each board, muted yellow and pink sticky notes (rotated, drop-shadowed),
 * hand-drawn arrows and dot-votes, Caveat handwriting for the notes and Inter for
 * structure. Distinct from The Planning Wall — this is marker-on-whiteboard, not
 * pencil-on-paper: thick felt strokes, stickies not taped cards, no route.
 *
 * Anomaly: on the actions board, one action sticky is circled three times in red
 * marker — `CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP`.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { StatusList } from '@enterprise-design/content-components';
import '@fontsource-variable/inter';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './whiteboard.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ACTIONS,
  ACTIONS_SLIDE_NUMBER,
  ANOMALY_CIRCLES,
  ANOMALY_CIRCLE_VIEW,
  ANOMALY_TEXT,
  BADLY_DECO,
  BIG_THING,
  BOARD_FRAME,
  BOARD_FRAME_VIEW,
  CLOSING,
  DECK,
  EXPERIMENT,
  MOOD,
  MOOD_TOTAL,
  OWNER_ARROWS,
  OWNER_LINKS,
  OWNER_VIEW,
  SLIDES,
  SLIDE_COUNT,
  WALL_DECO_VIEW,
  WELL_DECO,
  WENT_BADLY,
  WENT_WELL,
  roughRect,
} from './content.js';
import type { Sticky, Slide, WallDeco } from './content.js';

/* ------------------------------------------------------------------ */
/* Build wrapper                                                       */
/* ------------------------------------------------------------------ */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
  style,
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
  style?: React.CSSProperties;
}) {
  return (
    <Tag className={className ? `wb-build ${className}` : 'wb-build'} style={{ ['--wb-i' as string]: i, ...style }}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky note — the recurring element                                 */
/* ------------------------------------------------------------------ */

function StickyNote({ sticky, seed }: { sticky: Sticky; seed: number }) {
  return (
    <div className="wb-sticky" data-colour={sticky.colour} data-voted={sticky.votes ? 'true' : undefined} style={{ ['--wb-rot' as string]: `${sticky.rot}deg` }}>
      <svg className="wb-sticky-edge" viewBox="0 0 240 200" preserveAspectRatio="none" aria-hidden="true">
        <path d={roughRect(240, 200, seed, 3.2)} />
      </svg>
      <p className="wb-sticky-text">{sticky.text}</p>
      <span className="wb-sticky-by">— {sticky.by}</span>
      {sticky.dots ? (
        <svg className="wb-sticky-votes" viewBox="0 0 96 56" aria-hidden="true">
          {sticky.dots.map((d, di) => (
            <circle key={di} cx={d[0] + 12} cy={d[1] + 12} r={5.5} />
          ))}
        </svg>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky wall — two loose rows, scattered, with mid-session artifacts  */
/* ------------------------------------------------------------------ */

function StickyWall({
  stickies,
  deco,
  testid,
  seedBase,
}: {
  stickies: readonly Sticky[];
  deco: WallDeco;
  testid: string;
  seedBase: number;
}) {
  return (
    <div className="wb-wall" data-testid={testid}>
      {/* marker artifacts under the stickies: an arrow tying two notes, an underline */}
      <svg className="wb-wall-deco" viewBox={WALL_DECO_VIEW} preserveAspectRatio="none" aria-hidden="true">
        <path className="wb-wall-arrow" d={deco.arrow.shaft} />
        <path className="wb-wall-arrow" d={deco.arrow.head} />
        <path className="wb-wall-underline" d={deco.underline} />
      </svg>
      {stickies.map((s, i) => (
        <Build
          key={s.id}
          i={i + 2}
          style={{ ['--wb-x' as string]: `${s.x}%`, ['--wb-y' as string]: `${s.y}%`, ['--wb-z' as string]: s.z }}
        >
          <StickyNote sticky={s} seed={seedBase + i * 13} />
        </Build>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The marker board frame drawn around each slide                      */
/* ------------------------------------------------------------------ */

function BoardFrame() {
  return (
    <svg
      className="wb-frame"
      viewBox={BOARD_FRAME_VIEW}
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      <path d={BOARD_FRAME} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function KickerRow({ slide }: { slide: Slide }) {
  return (
    <Build i={0} className="wb-kickerrow">
      <span className="wb-kicker">{slide.kicker}</span>
      <span className="wb-scrawl">{DECK.facilitator}</span>
    </Build>
  );
}

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="wb-cover">
          <Build i={0} className="wb-kickerrow">
            <span className="wb-kicker">{slide.kicker}</span>
            <span className="wb-scrawl">{DECK.squad}</span>
          </Build>
          <h2 className="wb-marker-title">
            <Build i={1}>
              <span className="wb-line">Sprint 41</span>
            </Build>
            <Build i={2}>
              <span className="wb-line wb-underline">retro.</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="wb-standfirst">
              Twelve people, forty-five minutes, one board. What went well, what didn’t, and the one
              thing we keep routing around instead of fixing.
            </p>
          </Build>
          <Build i={4} className="wb-cover-meta">
            <span>{DECK.sprint}</span>
            <span>{DECK.facilitator}</span>
            <span>ATTENDANCE 11 / 12</span>
          </Build>
        </div>
      );

    case 'mood':
      return (
        <div className="wb-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="wb-heading">How the room felt — {MOOD_TOTAL} dots.</h2>
          </Build>
          <Build i={2} className="wb-mood">
            {MOOD.map((m) => (
              <div key={m.id} className="wb-mood-row" data-heavy={m.votes >= 4 ? 'true' : undefined}>
                <span className="wb-mood-label">{m.label}</span>
                <svg className="wb-mood-dots" viewBox="0 0 110 70" aria-hidden="true">
                  {m.dots.map((d, di) => (
                    <circle key={di} cx={d[0] + 12} cy={d[1] + 14} r={7} />
                  ))}
                </svg>
                <span className="wb-mood-count">{m.votes}</span>
              </div>
            ))}
          </Build>
        </div>
      );

    case 'well':
      return (
        <div className="wb-wall-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="wb-heading">What went well.</h2>
          </Build>
          <StickyWall stickies={WENT_WELL} deco={WELL_DECO} testid="well-wall" seedBase={90} />
        </div>
      );

    case 'badly':
      return (
        <div className="wb-wall-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="wb-heading">What didn’t.</h2>
          </Build>
          <StickyWall stickies={WENT_BADLY} deco={BADLY_DECO} testid="badly-wall" seedBase={160} />
        </div>
      );

    case 'big':
      return (
        <div className="wb-big">
          <Build i={0} className="wb-kickerrow">
            <span className="wb-kicker">{slide.kicker}</span>
          </Build>
          <h2 className="wb-monument">
            <Build i={1}>
              <span className="wb-line">{BIG_THING.line1}</span>
            </Build>
            <Build i={2}>
              <span className="wb-line wb-strike-through">{BIG_THING.line2}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="wb-standfirst wb-standfirst-wide">{BIG_THING.note}</p>
          </Build>
        </div>
      );

    case 'actions':
      return (
        <div className="wb-actions-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="wb-heading">Actions — the only typed thing on the board.</h2>
          </Build>
          <div className="wb-actions-grid">
            <Build i={2} className="wb-printout">
              <span className="wb-tape wb-tape-tl" aria-hidden="true" />
              <span className="wb-tape wb-tape-tr" aria-hidden="true" />
              <StatusList title="Sprint 41 actions and their owners" items={[...ACTIONS]} />
            </Build>
            <Build i={3} className="wb-anomaly-note">
              <svg className="wb-anomaly-circles" viewBox={ANOMALY_CIRCLE_VIEW} aria-hidden="true">
                {ANOMALY_CIRCLES.map((d, i) => (
                  <path key={i} d={d} />
                ))}
                <text className="wb-anomaly-word" x={150} y={68} textAnchor="middle">
                  again
                </text>
              </svg>
              <p className="wb-anomaly-text" data-testid="actions-anomaly">
                {ANOMALY_TEXT}
              </p>
              <p className="wb-anomaly-sub">
                Circled every retro this quarter. It never had an owner — this sprint it gets one.
              </p>
            </Build>
          </div>
        </div>
      );

    case 'ownership':
      return (
        <div className="wb-own-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="wb-heading wb-heading-tight">Every action, a name against it.</h2>
          </Build>
          <Build i={2} className="wb-own-frame">
            <svg className="wb-own-svg" viewBox={OWNER_VIEW} role="img" aria-label="Ownership map: each action links by a hand-drawn arrow to its owner." data-testid="ownership-map">
              {OWNER_LINKS.map((l, i) => (
                <g key={l.id} className="wb-own-link" data-flagged={l.flagged ? 'true' : undefined} style={{ ['--wb-i' as string]: i }}>
                  <path className="wb-own-arrow" d={OWNER_ARROWS[i]!.shaft} />
                  <path className="wb-own-arrowhead" d={OWNER_ARROWS[i]!.head} />
                  <g className="wb-own-node wb-own-action" transform={`translate(${l.ax - 130} ${l.ay - 34})`}>
                    <rect width={260} height={68} rx={6} />
                    <text x={130} y={40} textAnchor="middle">
                      {l.action}
                    </text>
                  </g>
                  <text className="wb-own-name" x={l.ox} y={l.oy + 6} textAnchor="start">
                    {l.owner}
                  </text>
                </g>
              ))}
            </svg>
          </Build>
        </div>
      );

    case 'experiment':
      return (
        <div className="wb-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="wb-heading">One experiment for Sprint 42.</h2>
          </Build>
          <Build i={2} className="wb-exp">
            <div className="wb-exp-row">
              <span className="wb-exp-term">HYPOTHESIS</span>
              <p className="wb-exp-text wb-exp-hand">{EXPERIMENT.hypothesis}</p>
            </div>
            <div className="wb-exp-row">
              <span className="wb-exp-term">WE’LL TRY</span>
              <p className="wb-exp-text">{EXPERIMENT.we}</p>
            </div>
            <div className="wb-exp-row">
              <span className="wb-exp-term">WE’LL MEASURE</span>
              <p className="wb-exp-text">{EXPERIMENT.measure}</p>
            </div>
            <div className="wb-exp-row">
              <span className="wb-exp-term">FOR</span>
              <p className="wb-exp-text">{EXPERIMENT.duration}</p>
            </div>
          </Build>
        </div>
      );

    case 'closing':
      return (
        <div className="wb-closing">
          <Build i={0}>
            <h2 className="wb-marker-title wb-closing-marker wb-underline">{CLOSING.marker}</h2>
          </Build>
          <Build i={1}>
            <p className="wb-standfirst wb-standfirst-wide">{CLOSING.note}</p>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Accessible mirror — sticky walls + actions as lists                 */
/* ------------------------------------------------------------------ */

function AccessibleMirror() {
  return (
    <VisuallyHidden>
      <h2>What went well</h2>
      <ul>
        {WENT_WELL.map((s) => (
          <li key={s.id}>
            {s.text} ({s.by})
          </li>
        ))}
      </ul>
      <h2>What didn’t go well</h2>
      <ul>
        {WENT_BADLY.map((s) => (
          <li key={s.id}>
            {s.text} ({s.by})
          </li>
        ))}
      </ul>
      <h2>Actions and owners</h2>
      <ul>
        {OWNER_LINKS.map((l) => (
          <li key={l.id}>
            {l.action} — {l.owner}
            {l.flagged ? ` (${ANOMALY_TEXT})` : ''}
          </li>
        ))}
      </ul>
    </VisuallyHidden>
  );
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function WhiteboardPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Whiteboard — Sprint 41 retro — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'a' || event.key === 'A') goTo(ACTIONS_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="wb-root" data-testid="live-whiteboard" data-reduced={reduced ? 'true' : undefined}>
      <header className="wb-chrome wb-chrome-top" aria-label="Deck chrome">
        <div className="wb-chrome-cell">
          <RouterLink to="/" className="wb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="wb-chrome-rule" aria-hidden="true" />
          <span>
            {DECK.code} · {DECK.world}
          </span>
        </div>
        <div className="wb-chrome-cell">
          <span data-testid="board-counter" aria-live="polite">
            {counter} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="wb-main">
        <h1>
          <VisuallyHidden>
            The Whiteboard — the synthetic Payments Platform squad’s Sprint 41 retrospective, staged
            as a marker whiteboard. Sticky notes carry what went well and what didn’t; on the actions
            board one sticky is circled three times in red: “{ANOMALY_TEXT}”. Slide {activeNumber} of{' '}
            {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <AccessibleMirror />
        <div className="wb-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="wb-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <BoardFrame />
                <div className="wb-slide-inner">
                  <SlideBody slide={slide} />
                </div>
                <div className="wb-print-foot" aria-hidden="true">
                  {DECK.code} · {slide.section} · SLIDE {String(index + 1).padStart(2, '0')} /{' '}
                  {SLIDE_COUNT} · {DECK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="wb-chrome wb-chrome-bottom" aria-label="Deck controls">
        <span className="wb-notice">{DECK.dataNotice}</span>
        <div className="wb-footer-nav">
          <span className="wb-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="wb-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="wb-nav-btn"
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
