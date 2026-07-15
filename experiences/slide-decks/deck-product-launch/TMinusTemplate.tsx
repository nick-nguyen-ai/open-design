/**
 * "The T-Minus" — the world-TEMPLATE. Carries the whole craft of
 * `deck-product-launch` and renders it from a typed {@link TMinusFill} (content
 * slots only). `TMinusPage` is now a thin wrapper that hands this component the
 * shipped fill; the rendered output is byte-for-byte what the page rendered
 * before templatization (the `LiveWorldsDecksE` + `live-decks-e` parity oracles
 * prove it).
 *
 * A launch plan staged as a countdown sequence: every slide carries a monumental
 * T-minus stamp (T-30 → T-0) that counts down as the deck advances, over a
 * midnight field with a single thin amber horizon line that RISES slide by slide
 * toward launch. On the final T-0 slide the horizon reaches the top and the field
 * turns GO-green. The countdown + rising horizon is the persistent device; the
 * day-0 runbook timeline is the commanding bespoke visual.
 *
 * Anomaly: the readiness board's flagged gate stands amber against otherwise
 * green gates — the fill's single `warning` gate, its verbatim text in
 * `anomalyLabel`.
 *
 * Deck mechanics via `useDeckNavigation` (←/→/Home/End, `?slide=` deep link).
 * Theme mood (dark) is locked by LiveExperience — not re-locked here.
 */
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { StatusList, KpiTile } from '@enterprise-design/content-components';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './t-minus.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import type { TMinusFill, TMinusRunStep } from './tminus-fill.js';

/* ------------------------------------------------------------------ */
/* Slide structure (template-fixed anatomy, not content)              */
/*                                                                     */
/* The countdown sequence — the T-minus stamp and the rising horizon  */
/* per slide — IS the template's persistent device, so the per-slide  */
/* stamp/horizon/kicker/section live here, not in the fill.           */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'one-sentence'
  | 'thesis'
  | 'readiness'
  | 'comms'
  | 'pricing'
  | 'runbook'
  | 'risk'
  | 'metrics'
  | 'closing';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
  /** Monumental countdown stamp. */
  stamp: string;
  /** 0→1 height the amber horizon line has risen on this slide. */
  horizon: number;
  /** GO slide flips the field green. */
  go?: boolean;
}

const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Launch', kicker: 'PRODUCT LAUNCH', stamp: 'T-30', horizon: 0.12 },
  { id: 'one-sentence', kind: 'one-sentence', section: 'The product', kicker: '01 · IN ONE SENTENCE', stamp: 'T-24', horizon: 0.2 },
  { id: 'thesis', kind: 'thesis', section: 'Launch thesis', kicker: '02 · THE THESIS', stamp: 'T-21', horizon: 0.3 },
  { id: 'readiness', kind: 'readiness', section: 'Readiness board', kicker: '03 · ARE WE READY', stamp: 'T-14', horizon: 0.42 },
  { id: 'comms', kind: 'comms', section: 'Comms plan', kicker: '04 · WHO HEARS, WHEN', stamp: 'T-10', horizon: 0.52 },
  { id: 'pricing', kind: 'pricing', section: 'Pricing', kicker: '05 · PRICING & PACKAGING', stamp: 'T-7', horizon: 0.62 },
  { id: 'runbook', kind: 'runbook', section: 'Day-0 runbook', kicker: '06 · THE SEQUENCE', stamp: 'T-3', horizon: 0.74 },
  { id: 'risk', kind: 'risk', section: 'Risk & rollback', kicker: '07 · WHAT ABORTS IT', stamp: 'T-2', horizon: 0.82 },
  { id: 'metrics', kind: 'metrics', section: 'Metrics', kicker: '08 · DAY 7 / DAY 30', stamp: 'T-1', horizon: 0.9 },
  { id: 'closing', kind: 'closing', section: 'Go', kicker: '09 · LAUNCH', stamp: 'T-0', horizon: 1, go: true },
];

const SLIDE_COUNT = SLIDES.length;

/** The day-0 runbook slide — used for the 'r' deep-link shortcut. */
const RUNBOOK_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'runbook') + 1;

const KEYBOARD_HINT = '← → NAVIGATE · HOME/END';

/* The runbook rail geometry (template-fixed 1200-wide drawing). */
const RUN_X0 = 70;
const RUN_X1 = 1130;
const RUNBOOK_RAIL_Y = 150;
const RUNBOOK_VIEW = '0 0 1200 300';

/** A runbook step with its precomputed rail x-position and label side. */
type RunPos = TMinusRunStep & { x: number; above: boolean };

/** Keep a centred SVG text run inside the runbook viewBox (6px safe margin). */
function clampTextX(x: number, halfWidth: number): number {
  const min = halfWidth + 6;
  const max = 1200 - halfWidth - 6;
  return Math.min(Math.max(x, min), max);
}

/** Precompute x-positions for the runbook rail from the fill's steps. */
function layoutRunbook(runbook: readonly TMinusRunStep[]): RunPos[] {
  return runbook.map((s, i) => ({
    ...s,
    x: RUN_X0 + ((RUN_X1 - RUN_X0) * i) / (runbook.length - 1),
    // alternate labels above / below the rail so nothing collides
    above: i % 2 === 0,
  }));
}

/* ------------------------------------------------------------------ */
/* Build wrapper — staggered entrance                                  */
/* ------------------------------------------------------------------ */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  return (
    <Tag className={className ? `tm-build ${className}` : 'tm-build'} style={{ ['--tm-i' as string]: i }}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* The day-0 runbook — commanding horizontal sequence (local SVG)      */
/* ------------------------------------------------------------------ */

function RunbookDrawing({
  reduced,
  runbook,
  runbookPos,
}: {
  reduced: boolean;
  runbook: readonly TMinusRunStep[];
  runbookPos: readonly RunPos[];
}) {
  return (
    <svg
      className={reduced ? 'tm-run-svg tm-run-static' : 'tm-run-svg'}
      viewBox={RUNBOOK_VIEW}
      role="img"
      aria-label={`Day-0 launch runbook, in order: ${runbook.map((s) => `${s.time} ${s.label}`).join('; ')}.`}
      data-testid="runbook"
    >
      {/* The rail — a single horizon that draws in left to right */}
      <line className="tm-run-rail" x1={runbookPos[0]!.x} y1={RUNBOOK_RAIL_Y} x2={runbookPos[runbookPos.length - 1]!.x} y2={RUNBOOK_RAIL_Y} />
      {runbookPos.map((s, i) => {
        const labelY = s.above ? RUNBOOK_RAIL_Y - 34 : RUNBOOK_RAIL_Y + 50;
        const timeY = s.above ? RUNBOOK_RAIL_Y - 62 : RUNBOOK_RAIL_Y + 78;
        // Clamp centred text into the viewBox so in-spec labels near the rail
        // ends never clip (estimated half-widths: 21px sans ≈ 5.6/char,
        // 19px mono ≈ 5.8/char). Steps away from the edges are unaffected.
        const labelX = clampTextX(s.x, s.label.length * 5.6);
        const timeX = clampTextX(s.x, s.time.length * 5.8);
        return (
          <g key={s.id} className="tm-run-step" style={{ ['--tm-i' as string]: i }} data-gate={s.gate ? 'true' : undefined}>
            <line className="tm-run-stem" x1={s.x} y1={RUNBOOK_RAIL_Y} x2={s.x} y2={s.above ? RUNBOOK_RAIL_Y - 22 : RUNBOOK_RAIL_Y + 22} />
            {s.gate ? (
              <path className="tm-run-diamond" d={`M ${s.x} ${RUNBOOK_RAIL_Y - 12} L ${s.x + 12} ${RUNBOOK_RAIL_Y} L ${s.x} ${RUNBOOK_RAIL_Y + 12} L ${s.x - 12} ${RUNBOOK_RAIL_Y} Z`} />
            ) : (
              <circle className="tm-run-node" cx={s.x} cy={RUNBOOK_RAIL_Y} r={7} />
            )}
            <text className="tm-run-time" x={timeX} y={timeY} textAnchor="middle">
              {s.time}
            </text>
            <text className="tm-run-label" x={labelX} y={labelY} textAnchor="middle">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function KickerRow({ slide, war }: { slide: Slide; war: string }) {
  return (
    <Build i={0} className="tm-kickerrow">
      <span className="tm-kicker">{slide.kicker}</span>
      <span className="tm-war">{war}</span>
    </Build>
  );
}

function SlideBody({
  slide,
  fill,
  reduced,
  runbookPos,
}: {
  slide: Slide;
  fill: TMinusFill;
  reduced: boolean;
  runbookPos: readonly RunPos[];
}) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="tm-cover">
          <Build i={0} className="tm-kickerrow">
            <span className="tm-kicker">{slide.kicker}</span>
            <span className="tm-war">{fill.deck.programme}</span>
          </Build>
          <Build i={1}>
            <p className="tm-product">{fill.deck.product}</p>
          </Build>
          <h2 className="tm-display">
            <Build i={2}>
              <span className="tm-line">{fill.cover.line1}</span>
            </Build>
            <Build i={3}>
              <span className="tm-line tm-accent">{fill.cover.line2}</span>
            </Build>
          </h2>
          <Build i={4}>
            <p className="tm-standfirst">{fill.cover.standfirst}</p>
          </Build>
        </div>
      );

    case 'one-sentence':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} war={fill.deck.war} />
          <Build i={1}>
            <span className="tm-eyebrow">{fill.oneSentence.lead}</span>
          </Build>
          <Build i={2}>
            <h2 className="tm-oneliner">{fill.oneSentence.sentence}</h2>
          </Build>
          <Build i={3} className="tm-fact-row">
            {fill.oneSentence.facts.map((f) => (
              <div key={f.cap} className="tm-fact">
                <span className="tm-fact-stat">{f.stat}</span>
                <span className="tm-fact-cap">{f.cap}</span>
              </div>
            ))}
          </Build>
        </div>
      );

    case 'thesis':
      return (
        <div className="tm-thesis">
          <Build i={0} className="tm-kickerrow">
            <span className="tm-kicker">{slide.kicker}</span>
          </Build>
          <h2 className="tm-monument">
            <Build i={1}>
              <span className="tm-line">{fill.thesis.line1}</span>
            </Build>
            <Build i={2}>
              <span className="tm-line tm-accent">{fill.thesis.line2}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="tm-standfirst tm-standfirst-wide">{fill.thesis.standfirst}</p>
          </Build>
        </div>
      );

    case 'readiness':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} war={fill.deck.war} />
          <Build i={1}>
            <h2 className="tm-heading">{fill.headlines.readiness}</h2>
          </Build>
          <Build i={2} className="tm-gates-frame">
            <StatusList title="Launch readiness gates" items={[...fill.gates]} />
          </Build>
          <Build i={3}>
            <p className="tm-gate-note" data-testid="readiness-anomaly">
              <span className="tm-gate-flag">HOLD</span>
              {fill.anomalyLabel} — {fill.anomalyNote}
            </p>
          </Build>
        </div>
      );

    case 'comms':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} war={fill.deck.war} />
          <Build i={1}>
            <h2 className="tm-heading">{fill.headlines.comms}</h2>
          </Build>
          <Build i={2} className="tm-comms-wrap">
            <ul className="tm-comms">
              {fill.comms.map((c) => (
                <li key={c.id}>
                  <span className="tm-comms-when">{c.moment}</span>
                  <span className="tm-comms-ch">{c.channel}</span>
                  <span className="tm-comms-detail">{c.detail}</span>
                </li>
              ))}
            </ul>
          </Build>
        </div>
      );

    case 'pricing':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} war={fill.deck.war} />
          <Build i={1}>
            <h2 className="tm-heading">{fill.headlines.pricing}</h2>
          </Build>
          <div className="tm-price-grid">
            {fill.pricing.map((t, i) => (
              <Build key={t.id} i={i + 2}>
                <div className="tm-price-card" data-feature={t.feature ? 'true' : undefined}>
                  {t.feature ? <span className="tm-price-tag">LAUNCH FOCUS</span> : null}
                  <span className="tm-price-name">{t.name}</span>
                  <span className="tm-price-amt">{t.price}</span>
                  <span className="tm-price-unit">{t.unit}</span>
                  <p className="tm-price-inc">{t.includes}</p>
                </div>
              </Build>
            ))}
          </div>
        </div>
      );

    case 'runbook':
      return (
        <div className="tm-runbook-body">
          <Build i={0} className="tm-kickerrow">
            <span className="tm-kicker">{slide.kicker}</span>
            <span className="tm-war">
              {/* Derived from the runbook fill: the day's span in one breath. */}
              {`ONE DAY · ${fill.runbook[0]!.time} → ${fill.runbook[fill.runbook.length - 1]!.label.toUpperCase()}`}
            </span>
          </Build>
          <Build i={1}>
            <h2 className="tm-heading tm-heading-tight">{fill.headlines.runbook}</h2>
          </Build>
          <Build i={2} className="tm-runbook-frame">
            <RunbookDrawing reduced={reduced} runbook={fill.runbook} runbookPos={runbookPos} />
          </Build>
          <Build i={3}>
            <p className="tm-runbook-cap">{fill.runbookNote}</p>
          </Build>
        </div>
      );

    case 'risk':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} war={fill.deck.war} />
          <Build i={1}>
            <h2 className="tm-heading">{fill.headlines.risk}</h2>
          </Build>
          <Build i={2} className="tm-abort-wrap">
            <table className="tm-abort" data-testid="abort-table">
              <thead>
                <tr>
                  <th scope="col">Signal</th>
                  <th scope="col">Abort threshold</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {fill.aborts.map((a) => (
                  <tr key={a.id}>
                    <th scope="row">{a.metric}</th>
                    <td className="tm-abort-th">{a.threshold}</td>
                    <td>{a.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
          <Build i={3}>
            <p className="tm-rollback">
              <span className="tm-rollback-flag">ROLLBACK</span>
              {fill.rollbackNote}
            </p>
          </Build>
        </div>
      );

    case 'metrics':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} war={fill.deck.war} />
          <Build i={1}>
            <h2 className="tm-heading">{fill.headlines.metrics}</h2>
          </Build>
          <Build i={2} className="tm-kpi-frame">
            <KpiTile title="Launch metrics — day 7 and day 30" metrics={[...fill.metrics]} />
          </Build>
          <Build i={3}>
            <p className="tm-metrics-note">{fill.metricsNote}</p>
          </Build>
        </div>
      );

    case 'closing':
      return (
        <div className="tm-closing">
          <Build i={0}>
            <p className="tm-go" aria-hidden="true">
              {fill.closing.word}
            </p>
          </Build>
          <Build i={1}>
            <h2 className="tm-closing-line">{fill.closing.line}</h2>
          </Build>
          <Build i={2}>
            <p className="tm-standfirst tm-standfirst-wide">{fill.closing.detail}</p>
          </Build>
          <Build i={3} className="tm-ask-list">
            <span className="tm-kicker tm-ask-head">DECISIONS WE NEED TODAY</span>
            <ol>
              {fill.closing.decisions.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ol>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* The countdown chrome — monumental stamp + rising horizon            */
/* ------------------------------------------------------------------ */

function CountdownField({ slide }: { slide: Slide }) {
  return (
    <div className="tm-field" aria-hidden="true" data-go={slide.go ? 'true' : undefined}>
      {/* the rising amber (or, at T-0, green) horizon line */}
      <span className="tm-horizon" style={{ ['--tm-h' as string]: slide.horizon }} />
      <span className="tm-horizon-glow" style={{ ['--tm-h' as string]: slide.horizon }} />
      {/* the monumental countdown stamp */}
      <span className="tm-stamp" data-go={slide.go ? 'true' : undefined}>
        {slide.stamp}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accessible mirror — runbook as an ordered list                      */
/* ------------------------------------------------------------------ */

function AccessibleMirror({ runbook }: { runbook: readonly TMinusRunStep[] }) {
  return (
    <VisuallyHidden>
      <h2>Day-0 launch runbook, in order</h2>
      <ol>
        {runbook.map((s) => (
          <li key={s.id}>
            {s.time} · {s.label}: {s.detail}
            {s.gate ? ' (go / no-go decision point)' : ''}
          </li>
        ))}
      </ol>
    </VisuallyHidden>
  );
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function TMinusTemplate({ fill }: { fill: TMinusFill }) {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;
  const runbookPos = layoutRunbook(fill.runbook);

  useEffect(() => {
    // Derived from the fill: a different launch gets a truthful tab title
    // (" — Live" and the deck name are chrome, not content).
    document.title = `T-Minus — ${fill.deck.product} launch — Live`;
  }, [fill.deck.product]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'r' || event.key === 'R') goTo(RUNBOOK_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="tm-root" data-testid="live-t-minus" data-reduced={reduced ? 'true' : undefined}>
      <header className="tm-chrome tm-chrome-top" aria-label="Deck chrome">
        <div className="tm-chrome-cell">
          <RouterLink to="/" className="tm-back">
            ◄ GALLERY
          </RouterLink>
          <span className="tm-chrome-rule" aria-hidden="true" />
          <span>
            {fill.deck.code} · {fill.deck.world}
          </span>
        </div>
        <div className="tm-chrome-cell">
          <span data-testid="launch-counter" aria-live="polite">
            {counter} · {activeSlide.stamp} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="tm-main">
        <h1>
          <VisuallyHidden>
            T-Minus — the {fill.deck.product} launch, staged as a countdown from T-30 to T-0. A
            rising amber horizon reaches the top at launch. On the readiness board one gate is
            amber: “{fill.anomalyLabel}”. Slide {activeNumber} of {SLIDE_COUNT}:{' '}
            {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <AccessibleMirror runbook={fill.runbook} />
        <div className="tm-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="tm-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <CountdownField slide={slide} />
                <div className="tm-slide-inner">
                  <SlideBody slide={slide} fill={fill} reduced={reduced} runbookPos={runbookPos} />
                </div>
                <div className="tm-print-foot" aria-hidden="true">
                  {fill.deck.code} · {slide.stamp} · {slide.section} · SLIDE{' '}
                  {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} · {fill.deck.notice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="tm-chrome tm-chrome-bottom" aria-label="Deck controls">
        <span className="tm-notice">{fill.deck.notice}</span>
        <div className="tm-footer-nav">
          <span className="tm-hint">{KEYBOARD_HINT}</span>
          <button
            type="button"
            className="tm-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="tm-nav-btn"
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
