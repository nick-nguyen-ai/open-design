/**
 * "The Planning Wall" — the live full-bleed rendering of `deck-project-kickoff`.
 *
 * A kickoff staged as a physical planning wall: warm butcher paper, taped
 * index-card slides, red-pencil risk circles, and a hand-sketched milestone
 * route (M0→M5) drawn as ONE continuous pencil line. That route is the
 * persistent device — pinned as a quiet band across every slide, it blows up
 * to own the wall on its own slide (the commanding visual).
 *
 * The excalidraw idiom (wobbly strokes, uneven rounded rectangles, hand-drawn
 * arrowheads, Caveat annotations) is deterministic: the jitter is precomputed
 * in content.ts, never randomised at render.
 *
 * Anomaly: milestone M3 is red-circled and annotated
 * `DEPENDENCY UNCONFIRMED — DATA PLATFORM SIGN-OFF`.
 *
 * Deck mechanics via `useDeckNavigation` (←/→/Home/End, `?slide=` deep link).
 * Theme mood (light) is locked by LiveExperience — not re-locked here.
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
import './planning-wall.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ANOMALY_TEXT,
  ASK,
  DECK,
  FIRST_90,
  FLAG_CIRCLE,
  FLAG_CIRCLE_2,
  MILESTONES,
  RACI_ROLES,
  RACI_ROWS,
  RESOURCING,
  RESOURCING_TOTAL,
  RISKS,
  ROUTE_PATH,
  ROUTE_SLIDE_NUMBER,
  SCOPE_IN,
  SCOPE_OUT,
  SLIDES,
  SLIDE_COUNT,
  WORKSTREAMS,
  roughRect,
} from './content.js';
import type { Slide } from './content.js';

/* ------------------------------------------------------------------ */
/* Build wrapper — staggered entrance per slide                        */
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
    <Tag className={className ? `pw-build ${className}` : 'pw-build'} style={{ ['--pw-i' as string]: i }}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* The milestone route drawing — persistent band + commanding visual   */
/* ------------------------------------------------------------------ */

const ROUTE_VIEW = '0 0 1232 420';

function RouteDrawing({ full, reduced }: { full: boolean; reduced: boolean }) {
  return (
    <svg
      className={reduced ? 'pw-route-svg pw-route-static' : 'pw-route-svg'}
      viewBox={ROUTE_VIEW}
      role="presentation"
      aria-hidden="true"
      data-testid="milestone-route"
      data-full={full ? 'true' : undefined}
    >
      {/* The one continuous pencil line — faint under-draw + firm top stroke */}
      {full ? <path className="pw-route-under" d={ROUTE_PATH} /> : null}
      <path className="pw-route-line" d={ROUTE_PATH} />
      {MILESTONES.map((m) => {
        // Keep the flagged milestone's label clear of its red-pencil circle.
        const labelDy = m.flagged ? 92 : 36;
        const dateDy = m.flagged ? 112 : 56;
        const codeDy = m.flagged ? 46 : 26;
        return (
          <g key={m.id} className="pw-node-g" data-flagged={m.flagged ? 'true' : undefined}>
            <circle className="pw-node-dot" cx={m.x} cy={m.y} r={full ? 13 : 9} />
            {full ? <circle className="pw-node-pin" cx={m.x} cy={m.y} r={3.4} /> : null}
            <text className="pw-node-code" x={m.x} y={m.y - (full ? codeDy : 18)} textAnchor="middle">
              M{m.index}
            </text>
            {full ? (
              <>
                <text className="pw-node-label" x={m.x} y={m.y + labelDy} textAnchor="middle">
                  {m.label}
                </text>
                <text className="pw-node-date" x={m.x} y={m.y + dateDy} textAnchor="middle">
                  {m.date}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
      {/* The anomaly: red-pencil double circle + Caveat annotation on M3 */}
      {full ? (
        <g className="pw-flag" data-testid="route-flag">
          <path className="pw-flag-circle" d={FLAG_CIRCLE} />
          <path className="pw-flag-circle" d={FLAG_CIRCLE_2} />
          <text className="pw-flag-annot" x={760} y={44} textAnchor="middle">
            {ANOMALY_TEXT}
          </text>
          <path className="pw-flag-lead" d="M 762 58 Q 752 92 764 116" />
          <path className="pw-flag-lead-head" d="M 758 108 l 6 10 l 7 -8 Z" />
        </g>
      ) : null}
    </svg>
  );
}

/** Persistent route band across the bottom of every slide. */
function RouteBand({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  const focus = slide.focus;
  return (
    <div className="pw-band" aria-hidden="true" data-testid="route-band">
      <span className="pw-band-tag">
        {focus === -1 ? 'THE ROUTE · M0 → M5' : `NOW NEAR M${Math.max(focus, 0)} · ${MILESTONES[Math.max(focus, 0)]?.label}`}
      </span>
      <div className="pw-band-track" data-focus={focus}>
        <RouteDrawing full={false} reduced={reduced} />
        <span
          className="pw-band-here"
          style={{ left: `${((MILESTONES[Math.max(focus, 0)]?.x ?? 0) / 1232) * 100}%` }}
          data-off={focus === -1 ? 'true' : undefined}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Taped index card — the recurring paper element                      */
/* ------------------------------------------------------------------ */

function TapedCard({
  children,
  rot = 0,
  className,
  seed = 11,
}: {
  children: React.ReactNode;
  rot?: number;
  className?: string;
  seed?: number;
}) {
  return (
    <div
      className={className ? `pw-card ${className}` : 'pw-card'}
      style={{ ['--pw-rot' as string]: `${rot}deg` }}
    >
      <span className="pw-tape pw-tape-tl" aria-hidden="true" />
      <span className="pw-tape pw-tape-br" aria-hidden="true" />
      <svg className="pw-card-edge" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
        <path d={roughRect(300, 200, seed)} />
      </svg>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function KickerRow({ slide }: { slide: Slide }) {
  return (
    <Build i={0} className="pw-kickerrow">
      <span className="pw-kicker">{slide.kicker}</span>
      <span className="pw-scrawl">{DECK.cadre}</span>
    </Build>
  );
}

function SlideBody({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="pw-cover">
          <Build i={0} className="pw-kickerrow">
            <span className="pw-kicker">{slide.kicker}</span>
            <span className="pw-scrawl">{DECK.programme}</span>
          </Build>
          <h2 className="pw-display">
            <Build i={1}>
              <span className="pw-line">A plan you can</span>
            </Build>
            <Build i={2}>
              <span className="pw-line pw-underline">point at.</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="pw-standfirst">
              Nine months to put automated underwriting decisions into production, drawn as one
              route on one wall. Six milestones, four workstreams, and the single dependency that
              can move everything — pinned where nobody can pretend not to see it.
            </p>
          </Build>
          <Build i={4} className="pw-cover-index">
            {SLIDES.slice(1).map((s) => (
              <span key={s.id}>
                <b>{s.kicker.split(' · ')[0]}</b>
                {s.section}
              </span>
            ))}
          </Build>
        </div>
      );

    case 'why-now':
      return (
        <div className="pw-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="pw-heading">Manual underwriting can’t carry the new lines.</h2>
          </Build>
          <Build i={2}>
            <p className="pw-body">
              Volume is up 34% year on year and every case is still read by hand. Decision time sits
              at nine days; competitors quote in two. The rules already exist — they live in
              underwriters’ heads and a 200-page manual. This programme writes them down once, as a
              governed decision service, and puts a model score beside them.
            </p>
          </Build>
          <Build i={3} className="pw-stat-row">
            <div className="pw-stat">
              <span className="pw-stat-num">9 days</span>
              <span className="pw-stat-cap">current decision time</span>
            </div>
            <div className="pw-stat">
              <span className="pw-stat-num">+34%</span>
              <span className="pw-stat-cap">new-business volume, YoY</span>
            </div>
            <div className="pw-stat">
              <span className="pw-stat-num">1 pipeline</span>
              <span className="pw-stat-cap">rules + score, governed</span>
            </div>
          </Build>
        </div>
      );

    case 'scope':
      return (
        <div className="pw-scope">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="pw-heading">What’s on the wall — and what isn’t.</h2>
          </Build>
          <div className="pw-scope-grid">
            <Build i={2}>
              <TapedCard rot={-1.4} seed={21} className="pw-scope-card">
                <p className="pw-card-head pw-card-head-in">IN</p>
                <ul className="pw-tick-list">
                  {SCOPE_IN.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </TapedCard>
            </Build>
            <Build i={3}>
              <TapedCard rot={1.2} seed={42} className="pw-scope-card">
                <p className="pw-card-head pw-card-head-out">OUT</p>
                <ul className="pw-cross-list">
                  {SCOPE_OUT.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </TapedCard>
            </Build>
          </div>
        </div>
      );

    case 'route':
      return (
        <div className="pw-route-body">
          <Build i={0} className="pw-kickerrow">
            <span className="pw-kicker">{slide.kicker}</span>
            <span className="pw-scrawl">ONE CONTINUOUS LINE · M0 → M5</span>
          </Build>
          <Build i={1}>
            <h2 className="pw-heading pw-heading-tight">Nine months, one route.</h2>
          </Build>
          <Build i={2} className="pw-route-frame">
            <RouteDrawing full reduced={reduced} />
          </Build>
        </div>
      );

    case 'raci':
      return (
        <div className="pw-raci-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="pw-heading">Who owns what, before anyone codes.</h2>
          </Build>
          <Build i={2} className="pw-raci-wrap">
            <table className="pw-raci" data-testid="raci-grid">
              <caption className="pw-visually-hidden">
                RACI grid: responsibility, accountability, consultation and information for each
                kickoff activity across five roles.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Activity</th>
                  {RACI_ROLES.map((r) => (
                    <th key={r} scope="col">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RACI_ROWS.map((row) => (
                  <tr key={row.activity}>
                    <th scope="row">{row.activity}</th>
                    {row.marks.map((mark, i) => (
                      <td key={RACI_ROLES[i]} data-mark={mark || undefined}>
                        <span className="pw-raci-mark">{mark}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
          <Build i={3}>
            <p className="pw-raci-key">
              <b>R</b> responsible · <b>A</b> accountable · <b>C</b> consulted · <b>I</b> informed
            </p>
          </Build>
        </div>
      );

    case 'workstreams':
      return (
        <div className="pw-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="pw-heading">Four workstreams, one of them exposed.</h2>
          </Build>
          <Build i={2}>
            <TapedCard rot={-0.8} seed={63} className="pw-ws-card">
              <StatusList title="Kickoff workstreams and their standing" items={[...WORKSTREAMS]} />
            </TapedCard>
          </Build>
        </div>
      );

    case 'risks':
      return (
        <div className="pw-risks-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="pw-heading">The wall doesn’t hide its risks.</h2>
          </Build>
          <div className="pw-risk-grid" data-testid="risk-wall">
            {RISKS.map((risk, i) => (
              <Build key={risk.id} i={i + 2}>
                <TapedCard rot={risk.rot} seed={80 + i * 11} className="pw-risk-card">
                  <div className="pw-risk-circle" data-sev={risk.severity} aria-hidden="true">
                    <svg viewBox="0 0 96 72" preserveAspectRatio="none">
                      <path d={roughRect(96, 72, 120 + i * 9, 5)} />
                    </svg>
                  </div>
                  <p className="pw-risk-title">{risk.title}</p>
                  <p className="pw-risk-note">{risk.note}</p>
                  <p className="pw-risk-sev" data-sev={risk.severity}>
                    {risk.severity === 'high' ? 'HIGH · OWNED BY SPONSOR' : 'MEDIUM · MITIGATION IN PLAN'}
                  </p>
                </TapedCard>
              </Build>
            ))}
          </div>
        </div>
      );

    case 'resourcing':
      return (
        <div className="pw-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="pw-heading">Eleven people, named, not notional.</h2>
          </Build>
          <Build i={2} className="pw-res-wrap">
            <ul className="pw-res-list">
              {RESOURCING.map((r) => (
                <li key={r.team}>
                  <span className="pw-res-fte">{r.fte}</span>
                  <span className="pw-res-team">{r.team}</span>
                  <span className="pw-res-note">{r.note}</span>
                </li>
              ))}
            </ul>
            <div className="pw-res-total">
              <span className="pw-res-total-num">{RESOURCING_TOTAL}</span>
              <span className="pw-res-total-cap">FTE at peak · shared validator part-time</span>
            </div>
          </Build>
        </div>
      );

    case 'calendar':
      return (
        <div className="pw-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="pw-heading">The first ninety days, week by week.</h2>
          </Build>
          <Build i={2} className="pw-cal-strip">
            {FIRST_90.map((w) => (
              <div key={w.week} className="pw-cal-cell" data-mile={w.milestone ? 'true' : undefined}>
                <span className="pw-cal-week">{w.week}</span>
                <span className="pw-cal-focus">{w.focus}</span>
                {w.milestone ? <span className="pw-cal-mile">{w.milestone}</span> : null}
              </div>
            ))}
          </Build>
        </div>
      );

    case 'closing':
      return (
        <div className="pw-closing">
          <Build i={0}>
            <h2 className="pw-closing-quote pw-underline">{ASK.statement}</h2>
          </Build>
          <Build i={1}>
            <p className="pw-standfirst">{ASK.detail}</p>
          </Build>
          <Build i={2} className="pw-ask-list">
            <span className="pw-scrawl pw-ask-head">DECISIONS WE NEED TODAY</span>
            <ol>
              {ASK.decisions.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ol>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Accessible mirror — route + RACI as text                            */
/* ------------------------------------------------------------------ */

function AccessibleMirror() {
  return (
    <VisuallyHidden>
      <h2>Milestone route, in order</h2>
      <ol>
        {MILESTONES.map((m) => (
          <li key={m.id}>
            M{m.index} · {m.label} ({m.date}): {m.detail}
            {m.flagged ? ` — ${ANOMALY_TEXT}` : ''}
          </li>
        ))}
      </ol>
      <h2>RACI grid</h2>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            {RACI_ROLES.map((r) => (
              <th key={r}>{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RACI_ROWS.map((row) => (
            <tr key={row.activity}>
              <th>{row.activity}</th>
              {row.marks.map((mark, i) => (
                <td key={RACI_ROLES[i]}>{mark || '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </VisuallyHidden>
  );
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function PlanningWallPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Planning Wall — Atlas Kickoff — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'r' || event.key === 'R') goTo(ROUTE_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="pw-root" data-testid="live-planning-wall" data-reduced={reduced ? 'true' : undefined}>
      <header className="pw-chrome pw-chrome-top" aria-label="Deck chrome">
        <div className="pw-chrome-cell">
          <RouterLink to="/" className="pw-back">
            ◄ GALLERY
          </RouterLink>
          <span className="pw-chrome-rule" aria-hidden="true" />
          <span>
            {DECK.code} · {DECK.world}
          </span>
        </div>
        <div className="pw-chrome-cell">
          <span data-testid="wall-counter" aria-live="polite">
            {counter} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="pw-main">
        <h1>
          <VisuallyHidden>
            The Planning Wall — the Atlas underwriting programme kickoff, staged as a hand-drawn
            planning wall. A milestone route from M0 (Mobilise) to M5 (Scaled rollout) runs across
            every slide; milestone M3 (Platform cutover) is red-circled with the note “
            {ANOMALY_TEXT}”. Slide {activeNumber} of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <AccessibleMirror />
        <div className="pw-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="pw-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="pw-slide-inner">
                  <SlideBody slide={slide} reduced={reduced} />
                </div>
                <RouteBand slide={slide} reduced={reduced} />
                <div className="pw-print-foot" aria-hidden="true">
                  {DECK.code} · {slide.section} · SLIDE {String(index + 1).padStart(2, '0')} /{' '}
                  {SLIDE_COUNT} · {DECK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="pw-chrome pw-chrome-bottom" aria-label="Deck controls">
        <span className="pw-notice">{DECK.dataNotice}</span>
        <div className="pw-footer-nav">
          <span className="pw-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="pw-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="pw-nav-btn"
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
