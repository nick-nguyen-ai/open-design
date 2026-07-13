/**
 * "The Preprint" — the live full-bleed rendering of `deck-research-discussion`.
 *
 * The deck is the pages of an annotated preprint under seminar discussion:
 * typeset white paper, a persistent margin of line numbers and a running head,
 * a synthetic DOI footer — and a second voice in the margins (blue-pencil
 * reviewer annotations, slightly rotated) arguing back with the text.
 *
 * The commanding visual is a bespoke confidence-interval dot-whisker plate
 * (Figure 3), drawn from the findings data — F3's interval crosses zero.
 * Figure 2 renders effect sizes through the registered category-bar-chart.
 *
 * Anomaly: finding F3 is stamped `DOES NOT REPLICATE (n=12)` and kept in the
 * body of the paper, reviewer's margin note "report it anyway."
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import {
  ChartFigure,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './preprint.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ABSTRACT,
  ABSTRACT_NOTE,
  ANOMALY_NOTE,
  ANOMALY_TEXT,
  CLOSING,
  DISCUSSION,
  EFFECT_SIZES,
  FIG2,
  FIG3,
  FINDINGS,
  HYPOTHESES,
  LIMITATIONS,
  METHOD,
  METHOD_NOTE,
  PAPER,
  REPLICATION,
  REPLICATION_SLIDE_NUMBER,
  SLIDES,
  SLIDE_COUNT,
  TITLE,
} from './content.js';
import type { MarginNote, Slide } from './content.js';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#1c1c1e',
  soft: '#4a4a4e',
  faint: '#8a8a90',
  blue: '#2b5db8',
  rule: 'rgba(28,28,30,0.16)',
  ruleSoft: 'rgba(28,28,30,0.08)',
} as const;

type Rec = Record<string, unknown>;

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
    <Tag className={className ? `pp-build ${className}` : 'pp-build'} style={{ ['--pp-i' as string]: i }}>
      {children}
    </Tag>
  );
}

/** A blue-pencil reviewer annotation pinned into the margin. */
function Marginalia({ note, className }: { note: MarginNote; className?: string }) {
  return (
    <aside
      className={className ? `pp-margin-note ${className}` : 'pp-margin-note'}
      style={{ ['--pp-rot' as string]: `${note.rot}deg` }}
      aria-label="Reviewer margin note"
    >
      {note.text}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Figure 2 — effect sizes via comp.category-bar-chart                 */
/* ------------------------------------------------------------------ */

function useEffectOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...EFFECT_SIZES], {
      colors: [INK.ink, INK.blue],
      unit: 'd',
      orientation: 'horizontal',
      reducedMotion: reduced,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.rule } },
      axisTick: { show: false },
      axisLabel: { color: INK.soft, fontFamily: MONO, fontSize: 11 },
      nameTextStyle: { color: INK.faint, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) =>
      s.id === 'value'
        ? {
            ...s,
            barWidth: 15,
            itemStyle: { color: INK.ink, borderRadius: 0 },
            data: EFFECT_SIZES.map((r) =>
              r.target !== undefined && r.value < r.target
                ? {
                    value: r.value,
                    itemStyle: { color: INK.faint },
                    label: { color: INK.blue, fontFamily: MONO, formatter: '{c} · n.s.' },
                  }
                : r.value,
            ),
            label: {
              show: true,
              position: 'right',
              color: INK.ink,
              fontFamily: MONO,
              fontSize: 11,
              formatter: 'd = {c}',
            },
          }
        : { ...s, symbol: 'diamond', symbolSize: 11, itemStyle: { color: INK.blue } },
    );
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.soft },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 13,
        itemHeight: 3,
        itemGap: 24,
        textStyle: { color: INK.soft, fontFamily: MONO, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fbfaf7',
        borderColor: INK.rule,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 30, right: 74, top: 36, bottom: 28, containLabel: true },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk,
        splitLine: { lineStyle: { color: INK.ruleSoft, type: 'dashed' } },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        axisLabel: { ...axisInk.axisLabel, interval: 0 },
        splitLine: { show: false },
      },
    } as ChartOption;
  }, [reduced]);
}

function EffectFigure({ reduced }: { reduced: boolean }) {
  const option = useEffectOption(reduced);
  const table = useMemo(() => buildCategoryBarChartTable([...EFFECT_SIZES], 'd'), []);
  return (
    <ChartFigure
      title={FIG2.title}
      sourceNote={FIG2.source}
      option={option}
      tableColumns={table.columns}
      tableRows={table.rows}
      height={330}
      reducedMotion={reduced}
      className="pp-chart"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Figure 3 — bespoke CI dot-whisker plate (commanding visual)         */
/* ------------------------------------------------------------------ */

const CI_W = 900;
const CI_ROW_H = 74;
const CI_TOP = 40;
const CI_LEFT = 250;
const CI_RIGHT = 860;
const CI_MIN = -0.4;
const CI_MAX = 1.15;

function ciX(v: number): number {
  return CI_LEFT + ((v - CI_MIN) / (CI_MAX - CI_MIN)) * (CI_RIGHT - CI_LEFT);
}

function CiPlate({ reduced }: { reduced: boolean }) {
  const height = CI_TOP + FINDINGS.length * CI_ROW_H + 44;
  const zeroX = ciX(0);
  return (
    <figure className="pp-ci-figure" data-testid="ci-plate">
      <figcaption className="pp-ci-caption">
        <span>
          {FIG3.ref} · {FIG3.title}
        </span>
        <span>STANDARDISED EFFECT · 95% CI</span>
      </figcaption>
      <svg
        className={reduced ? 'pp-ci-svg pp-ci-static' : 'pp-ci-svg'}
        viewBox={`0 0 ${CI_W} ${height}`}
        role="img"
        aria-label={`Confidence-interval plate of five findings. ${FINDINGS.map(
          (f) => `${f.code} ${f.label}: estimate ${f.estimate}, interval ${f.low} to ${f.high}, n ${f.n}${f.anomaly ? ', crosses zero — does not replicate' : ''}`,
        ).join('. ')}.`}
      >
        {/* zero reference line */}
        <line className="pp-ci-zero" x1={zeroX} y1={CI_TOP - 14} x2={zeroX} y2={CI_TOP + FINDINGS.length * CI_ROW_H} />
        <text className="pp-ci-zerolabel" x={zeroX} y={CI_TOP - 20} textAnchor="middle">
          0 · NO EFFECT
        </text>
        {/* scale ticks */}
        {[-0.25, 0.25, 0.5, 0.75, 1.0].map((t) => (
          <g key={t}>
            <line className="pp-ci-tick" x1={ciX(t)} y1={CI_TOP + FINDINGS.length * CI_ROW_H} x2={ciX(t)} y2={CI_TOP + FINDINGS.length * CI_ROW_H + 6} />
            <text className="pp-ci-ticklabel" x={ciX(t)} y={CI_TOP + FINDINGS.length * CI_ROW_H + 20} textAnchor="middle">
              {t.toFixed(2)}
            </text>
          </g>
        ))}
        {FINDINGS.map((f, i) => {
          const y = CI_TOP + i * CI_ROW_H + CI_ROW_H / 2;
          return (
            <g
              key={f.id}
              className="pp-ci-row"
              style={{ ['--pp-i' as string]: i }}
              data-anomaly={f.anomaly ? 'true' : undefined}
            >
              {f.anomaly ? (
                <rect
                  className="pp-ci-highlight"
                  x={14}
                  y={y - CI_ROW_H / 2 + 5}
                  width={CI_W - 28}
                  height={CI_ROW_H - 10}
                />
              ) : null}
              <text className="pp-ci-code" x={20} y={y - 8}>
                {f.code}
              </text>
              <text className="pp-ci-label" x={20} y={y + 12}>
                {f.label}
              </text>
              {/* whisker */}
              <line className="pp-ci-bar" x1={ciX(f.low)} y1={y} x2={ciX(f.high)} y2={y} />
              <line className="pp-ci-cap" x1={ciX(f.low)} y1={y - 8} x2={ciX(f.low)} y2={y + 8} />
              <line className="pp-ci-cap" x1={ciX(f.high)} y1={y - 8} x2={ciX(f.high)} y2={y + 8} />
              {/* point estimate */}
              <circle className="pp-ci-dot" cx={ciX(f.estimate)} cy={y} r={7} />
              <text className="pp-ci-n" x={CI_RIGHT + 12} y={y + 4}>
                n={f.n}
              </text>
              {/* the anomaly stamp */}
              {f.anomaly ? (
                <text className="pp-ci-stamp" x={ciX(f.estimate)} y={y - 18} textAnchor="middle">
                  {ANOMALY_TEXT}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <Marginalia note={ANOMALY_NOTE} className="pp-note-ci" />
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function SlideBody({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="pp-title-page">
          <Build i={0}>
            <p className="pp-venue">{PAPER.venue}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-paper-title">{TITLE.headline}</h2>
          </Build>
          <Build i={2}>
            <p className="pp-paper-subtitle">{TITLE.subtitle}</p>
          </Build>
          <Build i={3} className="pp-byline">
            <p className="pp-authors">{TITLE.authors}</p>
            <p className="pp-affil">{TITLE.affiliation}</p>
          </Build>
          <Build i={4}>
            <p className="pp-doi">{PAPER.doi} · {PAPER.dataNotice}</p>
          </Build>
        </div>
      );

    case 'abstract':
      return (
        <div className="pp-column-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head">Abstract</h2>
          </Build>
          <Build i={2}>
            <p className="pp-abstract">{ABSTRACT}</p>
          </Build>
          <Marginalia note={ABSTRACT_NOTE} className="pp-note-abstract" />
        </div>
      );

    case 'hypotheses':
      return (
        <div className="pp-column-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head">A ladder of three claims.</h2>
          </Build>
          <ol className="pp-hyp-ladder">
            {HYPOTHESES.map((h, i) => (
              <Build key={h.id} i={i + 2} as="li" className="pp-hyp">
                <span className="pp-hyp-label">{h.label}</span>
                <span className="pp-hyp-claim">{h.claim}</span>
                <span className="pp-hyp-standing" data-standing={h.standing}>
                  {h.standing === 'supported'
                    ? 'SUPPORTED'
                    : h.standing === 'supported-cost'
                      ? 'SUPPORTED · AT A COST'
                      : 'NOT SUPPORTED'}
                </span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'method':
      return (
        <div className="pp-column-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head">Within-subjects, blind-scored.</h2>
          </Build>
          <ol className="pp-method-flow">
            {METHOD.map((m, i) => (
              <Build key={m.id} i={i + 2} as="li" className="pp-method-step">
                <span className="pp-method-n">{m.n}</span>
                <span className="pp-method-title">{m.title}</span>
                <span className="pp-method-detail">{m.detail}</span>
              </Build>
            ))}
          </ol>
          <Marginalia note={METHOD_NOTE} className="pp-note-method" />
        </div>
      );

    case 'results':
      return (
        <div className="pp-figure-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker} · {FIG2.ref}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head">Two effects clear the bar. Two don’t.</h2>
          </Build>
          <Build i={2} className="pp-fig-frame">
            <EffectFigure reduced={reduced} />
          </Build>
        </div>
      );

    case 'ci-plate':
      return (
        <div className="pp-figure-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker} · {FIG3.ref}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head pp-section-head-tight">Where each effect actually sits.</h2>
          </Build>
          <Build i={2} className="pp-ci-frame">
            <CiPlate reduced={reduced} />
          </Build>
        </div>
      );

    case 'replication':
      return (
        <div className="pp-column-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head" data-testid="replication-head">
              {REPLICATION.lead}
            </h2>
          </Build>
          <div className="pp-repl-grid">
            <Build i={2}>
              <p className="pp-abstract">{REPLICATION.body}</p>
            </Build>
            <Build i={3} className="pp-repl-stat">
              <span className="pp-repl-stamp" data-testid="replication-stamp">
                {ANOMALY_TEXT}
              </span>
              <span className="pp-repl-num">{REPLICATION.stat}</span>
              <span className="pp-repl-cap">{REPLICATION.statCaption}</span>
            </Build>
          </div>
          <Marginalia note={ANOMALY_NOTE} className="pp-note-repl" />
        </div>
      );

    case 'limitations':
      return (
        <div className="pp-column-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head">What this study cannot say.</h2>
          </Build>
          <ol className="pp-limit-list">
            {LIMITATIONS.map((l, i) => (
              <Build key={l.id} i={i + 2} as="li" className="pp-limit">
                <span className="pp-limit-text">{l.text}</span>
                {l.note ? <Marginalia note={l.note} className="pp-note-inline" /> : null}
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'discussion':
      return (
        <div className="pp-column-body">
          <Build i={0}>
            <p className="pp-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="pp-section-head">Questions for the room.</h2>
          </Build>
          <ol className="pp-disc-list">
            {DISCUSSION.map((q, i) => (
              <Build key={q} i={i + 2} as="li" className="pp-disc">
                <span className="pp-disc-q">Q{i + 1}</span>
                <span className="pp-disc-text">{q}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'closing':
      return (
        <div className="pp-closing">
          <Build i={0}>
            <h2 className="pp-closing-statement">{CLOSING.statement}</h2>
          </Build>
          <Build i={1}>
            <p className="pp-cite-head">CITE AS</p>
          </Build>
          <Build i={2}>
            <p className="pp-citation">{CLOSING.citation}</p>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function PreprintPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Preprint — Working Paper 0142 — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'r' || event.key === 'R') goTo(REPLICATION_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="pp-root" data-testid="live-preprint" data-reduced={reduced ? 'true' : undefined}>
      <header className="pp-chrome pp-chrome-top" aria-label="Paper chrome">
        <div className="pp-chrome-cell">
          <RouterLink to="/" className="pp-back">
            ◄ GALLERY
          </RouterLink>
          <span className="pp-chrome-rule" aria-hidden="true" />
          <span>
            {PAPER.code} · {PAPER.world}
          </span>
        </div>
        <div className="pp-chrome-cell">
          <span data-testid="paper-counter" aria-live="polite">
            {counter} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="pp-main">
        <h1>
          <VisuallyHidden>
            The Preprint — a synthetic working paper on retrieval grounding and unsupported claims in
            enterprise assistants, staged as an annotated preprint under seminar discussion. Finding
            F3 (the trust replication) is stamped “{ANOMALY_TEXT}” and kept in the body of the paper.
            Slide {activeNumber} of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        {/* Accessible mirror of the CI plate */}
        <VisuallyHidden>
          <h2>Figure 3 — effect estimates with 95% confidence intervals</h2>
          <table>
            <caption>Standardised effect, lower and upper 95% bound, and n per finding.</caption>
            <thead>
              <tr>
                <th>Finding</th>
                <th>Estimate</th>
                <th>Low</th>
                <th>High</th>
                <th>n</th>
              </tr>
            </thead>
            <tbody>
              {FINDINGS.map((f) => (
                <tr key={f.id}>
                  <td>
                    {f.code} {f.label}
                    {f.anomaly ? ` — ${ANOMALY_TEXT}` : ''}
                  </td>
                  <td>{f.estimate}</td>
                  <td>{f.low}</td>
                  <td>{f.high}</td>
                  <td>{f.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </VisuallyHidden>

        <div className="pp-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="pp-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="pp-page">
                  {/* persistent margin: line numbers + running head */}
                  <div className="pp-margin" aria-hidden="true">
                    <span className="pp-runhead">{TITLE.headline}</span>
                    <div className="pp-linenos">
                      {Array.from({ length: 9 }, (_, n) => (
                        <span key={n}>{(n + 1) * 5}</span>
                      ))}
                    </div>
                    <span className="pp-folio">{slide.folio}</span>
                  </div>
                  <div className="pp-page-body">
                    <SlideBody slide={slide} reduced={reduced} />
                  </div>
                </div>
                <div className="pp-print-foot" aria-hidden="true">
                  {PAPER.code} · {slide.section} · {slide.folio} · {PAPER.doi} · {PAPER.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="pp-chrome pp-chrome-bottom" aria-label="Paper controls">
        <span className="pp-notice">{PAPER.dataNotice}</span>
        <div className="pp-footer-nav">
          <span className="pp-hint">{PAPER.keyboardHint}</span>
          <button
            type="button"
            className="pp-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous page"
          >
            ←
          </button>
          <button
            type="button"
            className="pp-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === SLIDE_COUNT - 1}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
