/**
 * "The Straight Pitch" — the live full-bleed rendering of `deck-sales-pitch`.
 *
 * A deliberately CONVENTIONAL sales deck — problem → solution → proof → pricing —
 * executed flawlessly: a persistent title bar (deck title left, section right),
 * a 12-column content zone, a footer rule (page number · confidentiality ·
 * synthetic notice), a single fade/rise per slide (motionLevel 1). NO world
 * conceit. Accent: deep teal.
 *
 * Anomaly: a slide headed `WHERE WE ARE NOT A FIT` with three honest bullets —
 * the candour a normal pitch never risks.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { KpiTile } from '@enterprise-design/content-components';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './straight-pitch.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  AFTER_NODES,
  ASK,
  BEFORE_NODES,
  CASE,
  COST,
  DECK,
  DIAGRAM_VIEW,
  NODE_H,
  NODE_W,
  NOT_A_FIT,
  NOT_A_FIT_HEADING,
  NOT_A_FIT_SLIDE_NUMBER,
  PRICING_NOTE,
  PROBLEM,
  PROOF,
  PROOF_METRICS,
  PROOF_SLIDE_NUMBER,
  SLIDES,
  SLIDE_COUNT,
  SOLUTION,
  STEPS,
  TIERS,
  TIMELINE,
  TITLE,
} from './content.js';
import type { DiagramNode, Slide } from './content.js';

/* ------------------------------------------------------------------ */
/* Build wrapper — the single fade/rise per slide                      */
/* ------------------------------------------------------------------ */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
  testid,
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'section';
  testid?: string;
}) {
  return (
    <Tag
      className={className ? `sp-build ${className}` : 'sp-build'}
      style={{ ['--sp-i' as string]: i }}
      data-testid={testid}
    >
      {children}
    </Tag>
  );
}

function SlideHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Build i={0} className="sp-slidehead">
      <span className="sp-kicker">{kicker}</span>
      <h2 className="sp-heading">{title}</h2>
    </Build>
  );
}

/* ------------------------------------------------------------------ */
/* The before/after diagram (local SVG, exact geometry)                */
/* ------------------------------------------------------------------ */

function DiagramBand({ nodes, label }: { nodes: readonly DiagramNode[]; label: string }) {
  const midY = 33 + NODE_H / 2;
  return (
    <div className="sp-band" data-band={label.toLowerCase()}>
      <span className="sp-band-label">{label}</span>
      <svg
        className="sp-diagram"
        viewBox={DIAGRAM_VIEW}
        role="img"
        aria-label={`${label}: ${nodes.map((n) => `${n.label} (${n.sub})`).join(' then ')}.`}
      >
        {/* two orthogonal arrows between the three nodes */}
        {[0, 1].map((i) => {
          const a = nodes[i]!;
          const b = nodes[i + 1]!;
          const x1 = a.x + NODE_W;
          const x2 = b.x;
          return (
            <g key={i} className="sp-arrow">
              <line x1={x1} y1={midY} x2={x2 - 9} y2={midY} />
              <path className="sp-arrowhead" d={`M ${x2 - 9} ${midY - 5} L ${x2} ${midY} L ${x2 - 9} ${midY + 5} Z`} />
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id} className="sp-node" data-tone={n.tone}>
            <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={7} />
            <text className="sp-node-label" x={n.x + NODE_W / 2} y={n.y + 34} textAnchor="middle">
              {n.label}
            </text>
            <text className="sp-node-sub" x={n.x + NODE_W / 2} y={n.y + 56} textAnchor="middle">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="sp-cover">
          <Build i={0}>
            <p className="sp-cover-eyebrow">{TITLE.eyebrow}</p>
          </Build>
          <h2 className="sp-cover-title">
            <Build i={1}>
              <span className="sp-cover-line">{TITLE.line1}</span>
            </Build>
            <Build i={2}>
              <span className="sp-cover-line sp-cover-accent">{TITLE.line2}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="sp-cover-standfirst">{TITLE.standfirst}</p>
          </Build>
          <Build i={4} className="sp-cover-foot">
            <span>{DECK.vendor}</span>
            <span>{DECK.date}</span>
          </Build>
        </div>
      );

    case 'problem':
      return (
        <div className="sp-quote-body">
          <SlideHeading kicker="THE PROBLEM · IN YOUR WORDS" title="You already named it." />
          <Build i={1} className="sp-quote-wrap">
            <blockquote className="sp-quote">
              <span className="sp-quote-mark" aria-hidden="true">
                “
              </span>
              {PROBLEM.quote}
            </blockquote>
            <cite className="sp-quote-cite">— {PROBLEM.attribution}</cite>
          </Build>
          <Build i={2}>
            <p className="sp-note">{PROBLEM.gloss}</p>
          </Build>
        </div>
      );

    case 'cost':
      return (
        <div className="sp-cost-body">
          <SlideHeading kicker="THE PROBLEM · COST OF DOING NOTHING" title={COST.headline} />
          <div className="sp-cost-grid">
            <Build i={1} className="sp-cost-figure">
              <span className="sp-cost-number">{COST.figure}</span>
              <span className="sp-cost-unit">{COST.unit}</span>
            </Build>
            <Build i={2} className="sp-cost-breakdown">
              <ul>
                {COST.breakdown.map((b) => (
                  <li key={b.label}>
                    <div className="sp-cost-row">
                      <span className="sp-cost-label">{b.label}</span>
                      <span className="sp-cost-value">{b.value}</span>
                    </div>
                    <span className="sp-cost-note">{b.note}</span>
                  </li>
                ))}
              </ul>
            </Build>
          </div>
          <Build i={3}>
            <p className="sp-note">{COST.gloss}</p>
          </Build>
        </div>
      );

    case 'solution':
      return (
        <div className="sp-solution-body">
          <SlideHeading kicker="THE SOLUTION" title={SOLUTION.headline} />
          <Build i={1} className="sp-diagram-frame">
            <DiagramBand nodes={BEFORE_NODES} label="Before" />
            <div className="sp-band-divider" aria-hidden="true" />
            <DiagramBand nodes={AFTER_NODES} label="After" />
          </Build>
          <Build i={2}>
            <p className="sp-note">{SOLUTION.gloss}</p>
          </Build>
        </div>
      );

    case 'how':
      return (
        <div className="sp-how-body">
          <SlideHeading kicker="THE SOLUTION · HOW IT WORKS" title="Three steps, one queue." />
          <ol className="sp-steps">
            {STEPS.map((step, i) => (
              <Build key={step.no} i={i + 1} as="li" className="sp-step">
                <span className="sp-step-no">{step.no}</span>
                <b className="sp-step-title">{step.title}</b>
                <span className="sp-step-detail">{step.detail}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'proof':
      return (
        <div className="sp-proof-body">
          <SlideHeading kicker="THE PROOF" title={PROOF.headline} />
          <Build i={1} className="sp-proof-frame" testid="pitch-proof">
            <KpiTile metrics={[...PROOF_METRICS]} title="Customer outcomes, first year" className="sp-proof-tiles" />
          </Build>
          <Build i={2}>
            <p className="sp-note">{PROOF.gloss}</p>
          </Build>
        </div>
      );

    case 'case':
      return (
        <div className="sp-case-body">
          <SlideHeading kicker="THE PROOF · CASE STUDY" title={CASE.name} />
          <div className="sp-case-grid">
            <Build i={1} className="sp-case-quote-wrap">
              <p className="sp-case-profile">{CASE.profile}</p>
              <blockquote className="sp-case-quote">{CASE.quote}</blockquote>
              <cite className="sp-case-cite">— {CASE.attribution}</cite>
            </Build>
            <Build i={2} className="sp-case-facts">
              {CASE.facts.map((f) => (
                <div key={f.label} className="sp-case-fact">
                  <span className="sp-case-fact-value">{f.value}</span>
                  <span className="sp-case-fact-label">{f.label}</span>
                </div>
              ))}
            </Build>
          </div>
        </div>
      );

    case 'notAFit':
      return (
        <div className="sp-notfit-body">
          <SlideHeading kicker="THE PROOF · CANDOUR" title={NOT_A_FIT_HEADING} />
          <Build i={1}>
            <p className="sp-note sp-notfit-gloss">{NOT_A_FIT.gloss}</p>
          </Build>
          <ol className="sp-notfit-list">
            {NOT_A_FIT.bullets.map((b, i) => (
              <Build key={i} i={i + 2} as="li" className="sp-notfit-item">
                <span className="sp-notfit-x" aria-hidden="true">
                  ✕
                </span>
                <div>
                  <b>{b.lead}</b>
                  <span>{b.body}</span>
                </div>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'pricing':
      return (
        <div className="sp-pricing-body">
          <SlideHeading kicker="PRICING" title="Three tiers. One is right for you." />
          <div className="sp-tiers">
            {TIERS.map((tier, i) => (
              <Build
                key={tier.id}
                i={i + 1}
                className="sp-tier"
                data-recommended={tier.recommended ? 'true' : undefined}
              >
                {tier.recommended ? <span className="sp-tier-badge">RECOMMENDED FOR NORTHWIND</span> : null}
                <span className="sp-tier-name">{tier.name}</span>
                <div className="sp-tier-price">
                  <span className="sp-tier-amount">{tier.price}</span>
                  {tier.cadence ? <span className="sp-tier-cadence">{tier.cadence}</span> : null}
                </div>
                <span className="sp-tier-fit">{tier.fit}</span>
                <ul className="sp-tier-features">
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Build>
            ))}
          </div>
          <Build i={4}>
            <p className="sp-note">{PRICING_NOTE}</p>
          </Build>
        </div>
      );

    case 'ask':
      return (
        <div className="sp-ask-body">
          <SlideHeading kicker="THE ASK" title={ASK.headline} />
          <Build i={1} className="sp-ask-card">
            <p className="sp-ask-lead">{ASK.ask}</p>
            <p className="sp-ask-meeting">{ASK.meeting}</p>
          </Build>
          <Build i={2} className="sp-timeline" as="div">
            {TIMELINE.map((t, i) => (
              <div key={t.when} className="sp-timeline-step" data-last={i === TIMELINE.length - 1 ? 'true' : undefined}>
                <span className="sp-timeline-dot" aria-hidden="true" />
                <span className="sp-timeline-when">{t.when}</span>
                <span className="sp-timeline-label">{t.label}</span>
              </div>
            ))}
          </Build>
        </div>
      );
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function StraightPitchPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Straight Pitch — Proposal for Northwind — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'p' || event.key === 'P') goTo(PROOF_SLIDE_NUMBER);
      if (event.key === 'n' || event.key === 'N') goTo(NOT_A_FIT_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="sp-root" data-testid="live-straight-pitch" data-reduced={reduced ? 'true' : undefined}>
      <header className="sp-titlebar" aria-label="Deck title bar">
        <div className="sp-titlebar-cell">
          <RouterLink to="/" className="sp-back">
            ◄ GALLERY
          </RouterLink>
          <span className="sp-titlebar-rule" aria-hidden="true" />
          <span className="sp-titlebar-title">{DECK.vendor}</span>
          <span className="sp-titlebar-tag">for {DECK.client}</span>
        </div>
        <div className="sp-titlebar-cell">
          <span className="sp-titlebar-section" data-testid="deck-section">
            {activeSlide.section}
          </span>
        </div>
      </header>

      <main className="sp-main">
        <h1>
          <VisuallyHidden>
            The Straight Pitch — the synthetic sales proposal from Cadence Logistics Cloud to
            Northwind Logistics. Ten conventional slides, problem to pricing. The honest slide:
            “{NOT_A_FIT_HEADING}”. Slide {activeNumber} of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <div className="sp-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="sp-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="sp-slide-inner">
                  <SlideBody slide={slide} />
                </div>
                <div className="sp-footer" aria-hidden="true">
                  <span className="sp-footer-page">
                    {String(index + 1).padStart(2, '0')} / {String(SLIDE_COUNT).padStart(2, '0')}
                  </span>
                  <span className="sp-footer-conf">{DECK.confidential}</span>
                  <span className="sp-footer-notice">{DECK.dataNotice}</span>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="sp-controls" aria-label="Deck controls">
        <span className="sp-controls-notice">{DECK.dataNotice}</span>
        <div className="sp-controls-nav">
          <span className="sp-controls-count" data-testid="pitch-counter" aria-live="polite">
            {counter}
          </span>
          <span className="sp-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="sp-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="sp-nav-btn"
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
