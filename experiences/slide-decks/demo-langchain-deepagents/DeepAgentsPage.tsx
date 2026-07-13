/**
 * "The Window" — MCP demo deck: How LangChain Deep Agents Work.
 * NOT a catalogue template.
 *
 * Rendered proof of what an MCP `compose_design` blueprint becomes at full
 * craft: the blueprint for this brief (slide-deck · technical · dark) chose
 * the `kinetic-intelligence` grammar with comp.status-list (summary +
 * evidence) and comp.flow-diagram (primary visual); every slide carries its
 * composed role in the top-right chip.
 *
 * THE WORLD: one luminous column — the orchestrator's context window as a
 * literal capacity gauge — persists across all six slides, re-seating itself
 * per slide. It floods red exactly once (the problem slide): the deck's one
 * anomaly. The corner gauge tracks its load live.
 *
 * Shared deck mechanics via `useDeckNavigation`: ←/→/Home/End, `?slide=`
 * deep link, one section active at a time, printable one-per-page.
 */
import { useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { FlowDiagram } from '@enterprise-design/diagrams';
import { StatusList } from '@enterprise-design/content-components';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './deepagents.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ARCHITECTURE,
  CLOSING,
  DECK,
  LEDGER,
  LEDGER_DELTA_K,
  LEDGER_DISCARD,
  PILLARS,
  PROBLEM_ITEMS,
  SLIDES,
  SLIDE_COUNT,
  TRACE_ITEMS,
} from './content.js';
import type { Slide } from './content.js';

/* ------------------------------------------------------------------ */
/* Build wrapper — staggered entrance per slide                        */
/* ------------------------------------------------------------------ */

function Build({
  i,
  children,
  className,
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `da-build ${className}` : 'da-build'} style={{ ['--da-i' as string]: i }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The persistent window column                                        */
/* ------------------------------------------------------------------ */

const WINDOW_TICKS = [25, 50, 75] as const;

function WindowColumn({ slide }: { slide: Slide }) {
  const { left, width, load, tone } = slide.window;
  return (
    <div
      className="da-window"
      data-tone={tone}
      data-narrow={width < 8 ? 'true' : undefined}
      data-testid="da-window"
      aria-hidden="true"
      style={{ left: `${left}vw`, width: `${width}vw`, ['--da-load' as string]: load }}
    >
      <span className="da-window-cap">CAP {DECK.capK}K</span>
      <div className="da-window-scale">
        {WINDOW_TICKS.map((pct) => (
          <div key={pct} className="da-window-tick" style={{ bottom: `${pct}%` }}>
            <span>{(DECK.capK * pct) / 100}K</span>
          </div>
        ))}
      </div>
      <span className="da-window-readout">{load}%</span>
      <div className="da-window-fill" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The window ledger — bespoke figure on the trace slide               */
/* ------------------------------------------------------------------ */

const LEDGER_W = 360;
const LEDGER_H = 280;
const LEDGER_TOP = 24;
const LEDGER_BOTTOM = 244;
const LEDGER_MAX_K = 40;

function ledgerY(k: number): number {
  return LEDGER_BOTTOM - (k / LEDGER_MAX_K) * (LEDGER_BOTTOM - LEDGER_TOP);
}

function LedgerFigure() {
  const stepW = 300 / LEDGER.length;
  const x0 = 46;
  // Stepped orchestrator line: horizontal run per step, small riser between.
  let path = '';
  LEDGER.forEach((s, i) => {
    const x = x0 + i * stepW;
    const y = ledgerY(s.k);
    path += i === 0 ? `M ${x} ${y}` : ` V ${y}`;
    path += ` H ${x + stepW - 8}`;
  });
  const spikeX = x0 + LEDGER_DISCARD.atStep * stepW + (stepW - 8) / 2;

  return (
    <figure className="da-ledger-figure" data-testid="da-ledger">
      <figcaption className="da-ledger-title">
        <span>ORCHESTRATOR WINDOW · PER STEP</span>
        <span>CAP {DECK.capK}K · 5× ABOVE THIS CHART</span>
      </figcaption>
      <svg
        className="da-ledger-svg"
        viewBox={`0 0 ${LEDGER_W} ${LEDGER_H}`}
        role="img"
        aria-label={`Stepped line of the orchestrator's context window across seven steps: ${LEDGER[0]?.k}K rising only to ${LEDGER[LEDGER.length - 1]?.k}K, while the research sub-agent's ${LEDGER_DISCARD.k}K of scratch is discarded and never enters.`}
      >
        {/* Scale */}
        {[0, 10, 20, 30, 40].map((k) => (
          <g key={k}>
            <line
              x1={x0 - 6}
              y1={ledgerY(k)}
              x2={LEDGER_W - 8}
              y2={ledgerY(k)}
              stroke="rgba(236,231,219,0.09)"
            />
            <text
              x={x0 - 12}
              y={ledgerY(k) + 3}
              textAnchor="end"
              fontSize={9}
              letterSpacing="0.1em"
              fill="#7e8496"
            >
              {k}K
            </text>
          </g>
        ))}
        {/* The discarded sub-agent spike: ghost bar, never part of the line */}
        <rect
          x={spikeX - 13}
          y={ledgerY(LEDGER_DISCARD.k)}
          width={26}
          height={LEDGER_BOTTOM - ledgerY(LEDGER_DISCARD.k)}
          fill="rgba(255,92,71,0.07)"
          stroke="#ff5c47"
          strokeDasharray="3 4"
          strokeWidth={1}
        />
        <text
          x={spikeX}
          y={ledgerY(LEDGER_DISCARD.k) - 8}
          textAnchor="middle"
          fontSize={9}
          letterSpacing="0.12em"
          fill="#ff5c47"
        >
          {LEDGER_DISCARD.label}
        </text>
        {/* The orchestrator line — nearly flat: the whole argument */}
        <path d={path} fill="none" stroke="#e9b158" strokeWidth={2} />
        {/* Step labels */}
        {LEDGER.map((s, i) => (
          <text
            key={s.id}
            x={x0 + i * stepW + (stepW - 8) / 2}
            y={LEDGER_BOTTOM + 16}
            textAnchor="middle"
            fontSize={9}
            letterSpacing="0.1em"
            fill="#7e8496"
          >
            {s.id}
          </text>
        ))}
        {/* End value */}
        <text
          x={x0 + (LEDGER.length - 1) * stepW + (stepW - 8) / 2}
          y={ledgerY(LEDGER[LEDGER.length - 1]?.k ?? 0) - 8}
          textAnchor="middle"
          fontSize={9}
          letterSpacing="0.1em"
          fill="#e9b158"
        >
          {LEDGER[LEDGER.length - 1]?.k}K
        </text>
      </svg>
      <div className="da-ledger-delta">
        <b>Δ +{LEDGER_DELTA_K}K</b>
        <span>ACROSS THE ENTIRE RUN · THE WINDOW BARELY MOVED</span>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function KickerRow({ slide, i = 0 }: { slide: Slide; i?: number }) {
  return (
    <Build i={i} className="da-kickerrow">
      <span className="da-kicker">{slide.kicker}</span>
      <span className="da-role">{slide.role}</span>
    </Build>
  );
}

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'cover':
      return (
        <div className="da-cover">
          <Build i={0} className="da-kickerrow">
            <span className="da-kicker">{slide.kicker}</span>
          </Build>
          <h2 className="da-display">
            <Build i={1}>
              <span className="da-line">A smaller context,</span>
            </Build>
            <Build i={2}>
              <span className="da-line">
                <em>held on purpose.</em>
              </span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="da-standfirst">
              Four mechanisms let an agent hold a long, complex task without losing the plan, the
              thread, or the context window — the luminous column on the right, at 6% and staying
              there.
            </p>
          </Build>
          <Build i={4} className="da-cover-index">
            {SLIDES.slice(1).map((s, i) => (
              <span key={s.id}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                {s.section}
              </span>
            ))}
          </Build>
        </div>
      );

    case 'problem':
      return (
        <div className="da-problem">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="da-heading">Why flat agent loops drown.</h2>
          </Build>
          <Build i={2} className="da-panel">
            <StatusList
              title="Failure modes of a single undifferentiated loop"
              items={[...PROBLEM_ITEMS]}
            />
          </Build>
          <Build i={3}>
            <span className="da-problem-annot">TOOL OUTPUT · VERBATIM · FOREVER</span>
          </Build>
        </div>
      );

    case 'pillars':
      return (
        <div className="da-pillars-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="da-heading">Four ways to keep the window narrow.</h2>
          </Build>
          <div className="da-pillar-grid">
            {PILLARS.map((pillar, i) => (
              <Build key={pillar.id} i={i + 2} className="da-pillar">
                <div className="da-pillar-head">
                  <span className="da-pillar-no">{pillar.index}</span>
                  <span className="da-pillar-tag">{pillar.tag}</span>
                </div>
                <h3 className="da-pillar-name">{pillar.name}</h3>
                <p className="da-pillar-desc">{pillar.description}</p>
                <p className="da-pillar-held">{pillar.held}</p>
              </Build>
            ))}
          </div>
        </div>
      );

    case 'architecture':
      return (
        <div className="da-arch-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="da-heading">One request. Two clean rooms. One answer.</h2>
          </Build>
          <Build i={2} className="da-arch-frame">
            <FlowDiagram
              data={ARCHITECTURE}
              title="Deep agent architecture"
              sourceNote="Sub-agents work in isolated contexts and write through the shared virtual filesystem; only summaries return."
            />
          </Build>
        </div>
      );

    case 'trace':
      return (
        <div className="da-trace-body">
          <KickerRow slide={slide} />
          <Build i={1}>
            <h2 className="da-heading">Seven steps. The window moved 1.7K.</h2>
          </Build>
          <div className="da-trace-grid">
            <Build i={2} className="da-panel">
              <StatusList title="Comparison-doc request, tool by tool" items={[...TRACE_ITEMS]} />
            </Build>
            <Build i={3}>
              <LedgerFigure />
            </Build>
          </div>
        </div>
      );

    case 'closing':
      return (
        <div className="da-closing">
          <Build i={0}>
            <blockquote className="da-quote">
              A deep agent is not a bigger model. It is a smaller context, <em>held on purpose.</em>
            </blockquote>
          </Build>
          <Build i={1} className="da-closing-aside">
            <span className="da-note">USE WHEN</span>
            <p className="da-closing-guidance">{CLOSING.guidance}</p>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function DeepAgentsPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(
    SLIDE_COUNT,
    { reduced },
  );
  const activeSlide = SLIDES[activeIndex] as Slide;

  // The blueprint's theme is enterprise-neutral-dark — lock the document to
  // it for this page's lifetime (this route renders outside RootLayout).
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  useEffect(() => {
    document.title = `${DECK.title} — The Window — MCP demo`;
  }, []);

  const gaugeTokens = ((DECK.capK * activeSlide.window.load) / 100).toFixed(1);

  return (
    <div
      className="da-root"
      data-testid="demo-deepagents-deck"
      data-reduced={reduced ? 'true' : undefined}
    >
      <WindowColumn slide={activeSlide} />

      <header
        className="da-chrome da-chrome-tl"
        aria-label="Deck chrome"
        // On rail slides the column parks at the left edge — seat the chrome
        // just right of it instead of colliding.
        style={
          activeSlide.window.left < 10
            ? { left: `${activeSlide.window.left + activeSlide.window.width + 1.6}vw` }
            : undefined
        }
      >
        <RouterLink to="/" className="da-back">
          ◄ GALLERY
        </RouterLink>
        <span className="da-chrome-rule" aria-hidden="true" />
        <span>
          {DECK.code} · {DECK.world}
        </span>
      </header>
      <div className="da-chrome da-chrome-tr">
        <span data-testid="deck-counter" aria-live="polite">
          {counter} · {activeSlide.section}
        </span>
      </div>

      <main>
        <h1>
          <VisuallyHidden>
            {DECK.title} — an MCP demo deck composed via compose_design on the
            kinetic-intelligence grammar, rendered as “The Window”: the orchestrator’s context
            window as a persistent luminous gauge, currently at {activeSlide.window.load}% of{' '}
            {DECK.capK}K. Slide {activeNumber} of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <div className="da-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="da-slide"
                data-state={state}
                data-testid={`slide-${slide.id}`}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <SlideBody slide={slide} />
              </section>
            );
          })}
        </div>
      </main>

      <footer className="da-chrome da-chrome-bl">
        <span
          className="da-gauge"
          data-tone={activeSlide.window.tone}
          data-testid="window-gauge"
        >
          ORCH WINDOW {gaugeTokens}K / {DECK.capK}K · {activeSlide.window.load}%
        </span>
        <span>{DECK.provenance}</span>
      </footer>
      <div className="da-chrome da-chrome-br">
        <span>{DECK.keyboardHint}</span>
        <button
          type="button"
          className="da-nav-btn"
          onClick={() => goTo((current) => current - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          type="button"
          className="da-nav-btn"
          onClick={() => goTo((current) => current + 1)}
          disabled={activeIndex === SLIDE_COUNT - 1}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </div>
  );
}
