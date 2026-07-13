/**
 * "T-Minus" — the live full-bleed rendering of `deck-product-launch`.
 *
 * A launch plan staged as a countdown sequence: every slide carries a
 * monumental T-minus stamp (T-30 → T-0) that counts down as the deck advances,
 * over a midnight field with a single thin amber horizon line that RISES slide
 * by slide toward launch. On the final T-0 slide the horizon reaches the top and
 * the field turns GO-green. The countdown + rising horizon is the persistent
 * device; the day-0 runbook timeline is the commanding bespoke visual.
 *
 * Anomaly: the readiness board's security gate stands amber against otherwise
 * green gates — `SECURITY REVIEW PENDING — BLOCKS T-7`.
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
import {
  ABORTS,
  ANOMALY_TEXT,
  CLOSING,
  COMMS,
  DECK,
  GATES,
  METRICS,
  METRICS_NOTE,
  ONE_SENTENCE,
  PRICING,
  ROLLBACK_NOTE,
  RUNBOOK,
  RUNBOOK_POS,
  RUNBOOK_RAIL_Y,
  RUNBOOK_SLIDE_NUMBER,
  RUNBOOK_VIEW,
  SLIDES,
  SLIDE_COUNT,
  THESIS,
} from './content.js';
import type { Slide } from './content.js';

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

function RunbookDrawing({ reduced }: { reduced: boolean }) {
  return (
    <svg
      className={reduced ? 'tm-run-svg tm-run-static' : 'tm-run-svg'}
      viewBox={RUNBOOK_VIEW}
      role="img"
      aria-label={`Day-0 launch runbook, in order: ${RUNBOOK.map((s) => `${s.time} ${s.label}`).join('; ')}.`}
      data-testid="runbook"
    >
      {/* The rail — a single horizon that draws in left to right */}
      <line className="tm-run-rail" x1={RUNBOOK_POS[0]!.x} y1={RUNBOOK_RAIL_Y} x2={RUNBOOK_POS[RUNBOOK_POS.length - 1]!.x} y2={RUNBOOK_RAIL_Y} />
      {RUNBOOK_POS.map((s, i) => {
        const labelY = s.above ? RUNBOOK_RAIL_Y - 34 : RUNBOOK_RAIL_Y + 50;
        const timeY = s.above ? RUNBOOK_RAIL_Y - 62 : RUNBOOK_RAIL_Y + 78;
        return (
          <g key={s.id} className="tm-run-step" style={{ ['--tm-i' as string]: i }} data-gate={s.gate ? 'true' : undefined}>
            <line className="tm-run-stem" x1={s.x} y1={RUNBOOK_RAIL_Y} x2={s.x} y2={s.above ? RUNBOOK_RAIL_Y - 22 : RUNBOOK_RAIL_Y + 22} />
            {s.gate ? (
              <path className="tm-run-diamond" d={`M ${s.x} ${RUNBOOK_RAIL_Y - 12} L ${s.x + 12} ${RUNBOOK_RAIL_Y} L ${s.x} ${RUNBOOK_RAIL_Y + 12} L ${s.x - 12} ${RUNBOOK_RAIL_Y} Z`} />
            ) : (
              <circle className="tm-run-node" cx={s.x} cy={RUNBOOK_RAIL_Y} r={7} />
            )}
            <text className="tm-run-time" x={s.x} y={timeY} textAnchor="middle">
              {s.time}
            </text>
            <text className="tm-run-label" x={s.x} y={labelY} textAnchor="middle">
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

function KickerRow({ slide }: { slide: Slide }) {
  return (
    <Build i={0} className="tm-kickerrow">
      <span className="tm-kicker">{slide.kicker}</span>
      <span className="tm-war">{DECK.war}</span>
    </Build>
  );
}

function SlideBody({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="tm-cover">
          <Build i={0} className="tm-kickerrow">
            <span className="tm-kicker">{slide.kicker}</span>
            <span className="tm-war">{DECK.programme}</span>
          </Build>
          <Build i={1}>
            <p className="tm-product">{DECK.product}</p>
          </Build>
          <h2 className="tm-display">
            <Build i={2}>
              <span className="tm-line">A launch is a</span>
            </Build>
            <Build i={3}>
              <span className="tm-line tm-accent">countdown, not a date.</span>
            </Build>
          </h2>
          <Build i={4}>
            <p className="tm-standfirst">
              Thirty days to real-time payments in production. This is the sequence — every gate,
              every ramp, and the one amber square still standing between us and go.
            </p>
          </Build>
        </div>
      );

    case 'one-sentence':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <span className="tm-eyebrow">{ONE_SENTENCE.lead}</span>
          </Build>
          <Build i={2}>
            <h2 className="tm-oneliner">{ONE_SENTENCE.sentence}</h2>
          </Build>
          <Build i={3} className="tm-fact-row">
            {ONE_SENTENCE.facts.map((f) => (
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
              <span className="tm-line">{THESIS.line1}</span>
            </Build>
            <Build i={2}>
              <span className="tm-line tm-accent">{THESIS.line2}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="tm-standfirst tm-standfirst-wide">{THESIS.standfirst}</p>
          </Build>
        </div>
      );

    case 'readiness':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="tm-heading">Five gates. Four are green.</h2>
          </Build>
          <Build i={2} className="tm-gates-frame">
            <StatusList title="Launch readiness gates" items={[...GATES]} />
          </Build>
          <Build i={3}>
            <p className="tm-gate-note" data-testid="readiness-anomaly">
              <span className="tm-gate-flag">HOLD</span>
              {ANOMALY_TEXT} — the retest is booked; sign-off is the single thing between amber and go.
            </p>
          </Build>
        </div>
      );

    case 'comms':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="tm-heading">Nobody hears it before the right people do.</h2>
          </Build>
          <Build i={2} className="tm-comms-wrap">
            <ul className="tm-comms">
              {COMMS.map((c) => (
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
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="tm-heading">One flat price does most of the selling.</h2>
          </Build>
          <div className="tm-price-grid">
            {PRICING.map((t, i) => (
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
            <span className="tm-war">ONE DAY · 05:00 → NIGHT WATCH</span>
          </Build>
          <Build i={1}>
            <h2 className="tm-heading tm-heading-tight">Launch day, hour by hour.</h2>
          </Build>
          <Build i={2} className="tm-runbook-frame">
            <RunbookDrawing reduced={reduced} />
          </Build>
          <Build i={3}>
            <p className="tm-runbook-cap">
              One code freeze at 05:00, one go/no-go on the readiness board at 07:45, then a staged
              ramp — staff, 10%, 50%, 100% — before the announcement lifts at general availability.
              Every step is reversible with one switch until we choose to open the doors.
            </p>
          </Build>
        </div>
      );

    case 'risk':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="tm-heading">What stops the clock — and how fast we’re back.</h2>
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
                {ABORTS.map((a) => (
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
              {ROLLBACK_NOTE}
            </p>
          </Build>
        </div>
      );

    case 'metrics':
      return (
        <div className="tm-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="tm-heading">Four numbers tell us it worked.</h2>
          </Build>
          <Build i={2} className="tm-kpi-frame">
            <KpiTile title="Launch metrics — day 7 and day 30" metrics={[...METRICS]} />
          </Build>
          <Build i={3}>
            <p className="tm-metrics-note">{METRICS_NOTE}</p>
          </Build>
        </div>
      );

    case 'closing':
      return (
        <div className="tm-closing">
          <Build i={0}>
            <p className="tm-go" aria-hidden="true">
              {CLOSING.word}
            </p>
          </Build>
          <Build i={1}>
            <h2 className="tm-closing-line">{CLOSING.line}</h2>
          </Build>
          <Build i={2}>
            <p className="tm-standfirst tm-standfirst-wide">{CLOSING.detail}</p>
          </Build>
          <Build i={3} className="tm-ask-list">
            <span className="tm-kicker tm-ask-head">DECISIONS WE NEED TODAY</span>
            <ol>
              {CLOSING.decisions.map((d) => (
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

function AccessibleMirror() {
  return (
    <VisuallyHidden>
      <h2>Day-0 launch runbook, in order</h2>
      <ol>
        {RUNBOOK.map((s) => (
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

export default function TMinusPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'T-Minus — Meridian Instant launch — Live';
  }, []);

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
            {DECK.code} · {DECK.world}
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
            T-Minus — the Meridian Instant real-time-payments launch (synthetic), staged as a
            countdown from T-30 to T-0. A rising amber horizon reaches the top at launch. On the
            readiness board the security gate is amber: “{ANOMALY_TEXT}”. Slide {activeNumber} of{' '}
            {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <AccessibleMirror />
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
                  <SlideBody slide={slide} reduced={reduced} />
                </div>
                <div className="tm-print-foot" aria-hidden="true">
                  {DECK.code} · {slide.stamp} · {slide.section} · SLIDE{' '}
                  {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} · {DECK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="tm-chrome tm-chrome-bottom" aria-label="Deck controls">
        <span className="tm-notice">{DECK.dataNotice}</span>
        <div className="tm-footer-nav">
          <span className="tm-hint">{DECK.keyboardHint}</span>
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
