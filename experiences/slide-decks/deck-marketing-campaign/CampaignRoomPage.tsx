/**
 * "The Campaign Room" — the live full-bleed rendering of
 * `deck-marketing-campaign`.
 *
 * A campaign proposal staged as a launch war-room at night: near-black field,
 * one electric coral signal, monumental condensed type for the beats. The
 * spine visual is a hand-sketched funnel (deterministic wobbly trapezoids);
 * the centrepiece is an INTERACTIVE channel-mix bar — hover or key a segment
 * and it lifts, pinning a mono tooltip (budget, CAC, reach) that mirrors to an
 * aria-live region. A comp.kpi-tile row carries the headline numbers.
 *
 * Anomaly: one funnel channel is struck through —
 * `PAID SOCIAL — CUT · CAC 4.1× TARGET`.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (dark) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { KpiTile } from '@enterprise-design/content-components';
import '@fontsource-variable/inter';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './campaign-room.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ANOMALY_TEXT,
  ASK,
  AUDIENCE,
  CHANNELS,
  CHANNEL_BUDGET_TOTAL,
  CHANNELS_SLIDE_NUMBER,
  CREATIVE,
  CUT_CHANNEL,
  DECK,
  FLIGHT_WEEKS,
  FUNNEL,
  FUNNEL_SLIDE_NUMBER,
  FUNNEL_VIEW,
  KPIS,
  MEASUREMENT,
  PHASES,
  SLIDES,
  SLIDE_COUNT,
  THESIS,
} from './content.js';
import type { Channel, Slide } from './content.js';

/* ------------------------------------------------------------------ */
/* Build wrapper                                                       */
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
    <Tag className={className ? `cr-build ${className}` : 'cr-build'} style={{ ['--cr-i' as string]: i }}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* The funnel — spine visual                                           */
/* ------------------------------------------------------------------ */

function FunnelDrawing({ reduced }: { reduced: boolean }) {
  return (
    <svg
      className={reduced ? 'cr-funnel-svg cr-funnel-static' : 'cr-funnel-svg'}
      viewBox={FUNNEL_VIEW}
      role="img"
      aria-label={`Conversion funnel: ${FUNNEL.map((s) => `${s.label}, ${s.metric}${s.toNext ? `, ${s.toNext}` : ''}`).join('; ')}. ${ANOMALY_TEXT}.`}
      data-testid="funnel"
    >
      {FUNNEL.map((stage, i) => {
        const isLast = i === FUNNEL.length - 1;
        return (
        <g key={stage.id} className="cr-funnel-stage" style={{ ['--cr-i' as string]: i }}>
          <path
            className="cr-funnel-band"
            d={stage.path}
            style={{ ['--cr-depth' as string]: i }}
            data-last={isLast ? 'true' : undefined}
          />
          {isLast ? (
            /* The narrowest band can't hold its label — lead it out to the
               right on a coral leader, in the same voice as the % carry notes. */
            <>
              <line className="cr-funnel-drop cr-funnel-lead" x1={338} y1={stage.cy} x2={382} y2={stage.cy} />
              <text className="cr-funnel-label cr-funnel-label-out" x={392} y={stage.cy + 2} textAnchor="start">
                {stage.label}
              </text>
              <text className="cr-funnel-metric cr-funnel-metric-out" x={392} y={stage.cy + 24} textAnchor="start">
                {stage.metric}
              </text>
            </>
          ) : (
            <>
              <text className="cr-funnel-label" x={296} y={stage.cy} textAnchor="middle">
                {stage.label}
              </text>
              <text className="cr-funnel-metric" x={296} y={stage.cy + 24} textAnchor="middle">
                {stage.metric}
              </text>
            </>
          )}
          {stage.toNext ? (
            <>
              <line
                className="cr-funnel-drop"
                x1={stage.convX! - 26}
                y1={stage.convY! - 4}
                x2={stage.convX! - 8}
                y2={stage.convY! - 4}
              />
              <text className="cr-funnel-conv" x={stage.convX} y={stage.convY} textAnchor="start">
                {stage.toNext}
              </text>
            </>
          ) : null}
        </g>
        );
      })}
      {/* The anomaly: struck-through cut channel, clear above the funnel */}
      <g className="cr-funnel-cut" data-testid="funnel-cut">
        <text className="cr-cut-text" x={48} y={56}>
          {CUT_CHANNEL.note}
        </text>
        <line className="cr-cut-strike" x1={40} y1={48} x2={470} y2={46} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The interactive channel-mix bar                                     */
/* ------------------------------------------------------------------ */

function ChannelBar() {
  const [active, setActive] = useState(0);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (delta: number) => {
    const next = (active + delta + CHANNELS.length) % CHANNELS.length;
    setActive(next);
    btnRefs.current[next]?.focus();
  };

  const activeChannel = CHANNELS[active] as Channel;

  return (
    <div className="cr-channels" data-testid="channel-mix">
      <div
        className="cr-channel-bar"
        role="group"
        aria-label="Channel budget mix — use arrow keys to inspect each channel"
      >
        {CHANNELS.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            className="cr-channel-seg"
            style={{ flexGrow: ch.share }}
            data-active={i === active ? 'true' : undefined}
            data-testid={`channel-seg-${ch.id}`}
            tabIndex={i === active ? 0 : -1}
            aria-label={`${ch.label}: ${ch.budget} budget, ${ch.cac} CAC, ${ch.reach}`}
            aria-pressed={i === active}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                move(1);
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
                move(-1);
              } else if (e.key === 'Home') {
                e.preventDefault();
                e.stopPropagation();
                setActive(0);
                btnRefs.current[0]?.focus();
              } else if (e.key === 'End') {
                e.preventDefault();
                e.stopPropagation();
                setActive(CHANNELS.length - 1);
                btnRefs.current[CHANNELS.length - 1]?.focus();
              }
            }}
          >
            <span className="cr-seg-fill" />
            <span className="cr-seg-label">{ch.label}</span>
            <span className="cr-seg-share">{Math.round(ch.share * 100)}%</span>
          </button>
        ))}
      </div>

      {/* The pinned tooltip for the active channel */}
      <div className="cr-channel-readout" data-testid="channel-readout">
        <span className="cr-readout-name">{activeChannel.label}</span>
        <dl className="cr-readout-stats">
          <div>
            <dt>BUDGET</dt>
            <dd>{activeChannel.budget}</dd>
          </div>
          <div>
            <dt>CAC</dt>
            <dd>{activeChannel.cac}</dd>
          </div>
          <div>
            <dt>REACH</dt>
            <dd>{activeChannel.reach}</dd>
          </div>
        </dl>
        <p className="cr-readout-note">{activeChannel.note}</p>
      </div>

      {/* aria-live mirror for keyboard/AT users */}
      <VisuallyHidden>
        <span className="cr-sr-live" aria-live="polite" data-testid="channel-live">
          {activeChannel.label}: {activeChannel.budget} budget, {activeChannel.cac} CAC,{' '}
          {activeChannel.reach}. {activeChannel.note}
        </span>
      </VisuallyHidden>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function KickerRow({ slide }: { slide: Slide }) {
  return (
    <Build i={0} className="cr-kickerrow">
      <span className="cr-kicker">{slide.kicker}</span>
      <span className="cr-codename">{DECK.name}</span>
    </Build>
  );
}

function SlideBody({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="cr-cover">
          <Build i={0} className="cr-kickerrow">
            <span className="cr-kicker">{slide.kicker}</span>
            <span className="cr-codename">{DECK.client}</span>
          </Build>
          <Build i={1}>
            <p className="cr-campaign-name">{DECK.name}</p>
          </Build>
          <h2 className="cr-display">
            <Build i={2}>
              <span className="cr-line">{THESIS.line1}</span>
            </Build>
            <Build i={3}>
              <span className="cr-line cr-accent">{THESIS.line2}</span>
            </Build>
          </h2>
          <Build i={4}>
            <p className="cr-standfirst">{THESIS.standfirst}</p>
          </Build>
        </div>
      );

    case 'audience':
      return (
        <div className="cr-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cr-heading">{AUDIENCE.who}</h2>
          </Build>
          <Build i={2}>
            <p className="cr-body">{AUDIENCE.body}</p>
          </Build>
          <Build i={3} className="cr-fact-row">
            {AUDIENCE.facts.map((f) => (
              <div key={f.cap} className="cr-fact">
                <span className="cr-fact-stat">{f.stat}</span>
                <span className="cr-fact-cap">{f.cap}</span>
              </div>
            ))}
          </Build>
        </div>
      );

    case 'big-idea':
      return (
        <div className="cr-bigidea">
          <Build i={0} className="cr-kickerrow">
            <span className="cr-kicker">{slide.kicker}</span>
          </Build>
          <h2 className="cr-monument">
            <Build i={1}>
              <span className="cr-line">Say one</span>
            </Build>
            <Build i={2}>
              <span className="cr-line cr-accent">true thing.</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="cr-standfirst cr-standfirst-wide">
              One promise — transparent pricing, switch in a day — said so plainly it can’t be
              mistaken for noise. Not a slogan for everyone. A signal for the four hundred founders a
              week who are already looking for the door.
            </p>
          </Build>
        </div>
      );

    case 'funnel':
      return (
        <div className="cr-funnel-body">
          <Build i={0} className="cr-kickerrow">
            <span className="cr-kicker">{slide.kicker}</span>
            <span className="cr-codename">3.2M → 39K · ONE ROUTE DOWN</span>
          </Build>
          <div className="cr-funnel-grid">
            <Build i={1} className="cr-funnel-frame">
              <FunnelDrawing reduced={reduced} />
            </Build>
            <Build i={2} className="cr-funnel-aside">
              <h2 className="cr-heading cr-heading-tight">From reach to resonance.</h2>
              <p className="cr-body">
                The funnel is narrow on purpose. We would rather convert 39,000 of the right founders
                than impress three million of the wrong ones.
              </p>
              <p className="cr-cut-reason">
                <span className="cr-cut-flag">CUT</span>
                {CUT_CHANNEL.reason}
              </p>
            </Build>
          </div>
        </div>
      );

    case 'channels':
      return (
        <div className="cr-channels-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cr-heading cr-heading-tight">
              {CHANNEL_BUDGET_TOTAL} of working budget, five channels.
            </h2>
          </Build>
          <Build i={2}>
            <ChannelBar />
          </Build>
          <Build i={3} className="cr-kpi-frame">
            <KpiTile title="Campaign headline metrics" metrics={[...KPIS]} />
          </Build>
        </div>
      );

    case 'flight':
      return (
        <div className="cr-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cr-heading">Twelve weeks, four phases.</h2>
          </Build>
          <Build i={2} className="cr-flight">
            <div className="cr-flight-scale" aria-hidden="true">
              {Array.from({ length: FLIGHT_WEEKS }, (_, w) => (
                <span key={w}>W{w + 1}</span>
              ))}
            </div>
            <ul className="cr-flight-bars">
              {PHASES.map((p) => (
                <li
                  key={p.id}
                  className="cr-flight-bar"
                  data-accent={p.accent ? 'true' : undefined}
                  style={{
                    ['--cr-start' as string]: p.start,
                    ['--cr-span' as string]: p.weeks,
                  }}
                >
                  <span className="cr-flight-label">{p.label}</span>
                  <span className="cr-flight-weeks">
                    W{p.start + 1}–W{p.start + p.weeks}
                  </span>
                </li>
              ))}
            </ul>
          </Build>
        </div>
      );

    case 'creative':
      return (
        <div className="cr-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cr-heading">{CREATIVE.headline}</h2>
          </Build>
          <div className="cr-creative-grid">
            {CREATIVE.principles.map((p, i) => (
              <Build key={p.id} i={i + 2} className="cr-creative-card">
                <span className="cr-creative-term">{p.term}</span>
                <p className="cr-creative-text">{p.text}</p>
              </Build>
            ))}
          </div>
        </div>
      );

    case 'measurement':
      return (
        <div className="cr-prose">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="cr-heading">Four numbers we’ll be judged on.</h2>
          </Build>
          <Build i={2}>
            <table className="cr-measure" data-testid="measurement-table">
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">Target</th>
                  <th scope="col">Guardrail</th>
                </tr>
              </thead>
              <tbody>
                {MEASUREMENT.map((m) => (
                  <tr key={m.id}>
                    <th scope="row">{m.metric}</th>
                    <td className="cr-measure-target">{m.target}</td>
                    <td className="cr-measure-guard">{m.guardrail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
        </div>
      );

    case 'ask':
      return (
        <div className="cr-closing">
          <Build i={0}>
            <h2 className="cr-monument cr-monument-close">
              <span className="cr-line">Fund the signal.</span>
              <span className="cr-line cr-accent">Cut the noise.</span>
            </h2>
          </Build>
          <Build i={1}>
            <p className="cr-standfirst cr-standfirst-wide">{ASK.detail}</p>
          </Build>
          <Build i={2} className="cr-ask-list">
            <span className="cr-kicker cr-ask-head">DECISIONS WE NEED TODAY</span>
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
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function CampaignRoomPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Campaign Room — SIGNAL & NOISE — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) return;
      if (event.key === 'f' || event.key === 'F') goTo(FUNNEL_SLIDE_NUMBER);
      if (event.key === 'c' || event.key === 'C') goTo(CHANNELS_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="cr-root" data-testid="live-campaign-room" data-reduced={reduced ? 'true' : undefined}>
      {/* the persistent coral horizon line */}
      <div className="cr-horizon" aria-hidden="true" />

      <header className="cr-chrome cr-chrome-top" aria-label="Deck chrome">
        <div className="cr-chrome-cell">
          <RouterLink to="/" className="cr-back">
            ◄ GALLERY
          </RouterLink>
          <span className="cr-chrome-rule" aria-hidden="true" />
          <span>
            {DECK.code} · {DECK.world}
          </span>
        </div>
        <div className="cr-chrome-cell">
          <span data-testid="campaign-counter" aria-live="polite">
            {counter} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="cr-main">
        <h1>
          <VisuallyHidden>
            The Campaign Room — the SIGNAL & NOISE launch proposal for Meridian Business Banking
            (synthetic), staged as a war-room at night. A hand-drawn conversion funnel is the spine;
            the channel mix is an interactive bar. One funnel channel is struck through: “
            {ANOMALY_TEXT}”. Slide {activeNumber} of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>

        {/* Accessible mirrors: funnel + channel mix as tables */}
        <VisuallyHidden>
          <h2>Conversion funnel</h2>
          <table>
            <thead>
              <tr>
                <th>Stage</th>
                <th>Volume</th>
                <th>Conversion to next</th>
              </tr>
            </thead>
            <tbody>
              {FUNNEL.map((s) => (
                <tr key={s.id}>
                  <td>{s.label}</td>
                  <td>{s.metric}</td>
                  <td>{s.toNext ?? '—'}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3}>{ANOMALY_TEXT}</td>
              </tr>
            </tbody>
          </table>
          <h2>Channel mix</h2>
          <table>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Budget share</th>
                <th>Budget</th>
                <th>CAC</th>
                <th>Reach</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.id}>
                  <td>{c.label}</td>
                  <td>{Math.round(c.share * 100)}%</td>
                  <td>{c.budget}</td>
                  <td>{c.cac}</td>
                  <td>{c.reach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </VisuallyHidden>

        <div className="cr-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="cr-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="cr-slide-inner">
                  <SlideBody slide={slide} reduced={reduced} />
                </div>
                <div className="cr-print-foot" aria-hidden="true">
                  {DECK.code} · {DECK.name} · {slide.section} · SLIDE{' '}
                  {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} · {DECK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="cr-chrome cr-chrome-bottom" aria-label="Deck controls">
        <span className="cr-notice">{DECK.dataNotice}</span>
        <div className="cr-footer-nav">
          <span className="cr-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="cr-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="cr-nav-btn"
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
