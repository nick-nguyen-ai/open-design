/**
 * "The Allocation" — the live full-bleed rendering of `deck-budget-planning`.
 *
 * A deliberately CONVENTIONAL budget deck, executed flawlessly: a persistent
 * title bar, a 12-column content zone, a footer rule (page number ·
 * confidentiality · synthetic notice), a single fade/rise per slide
 * (motionLevel 1). NO world conceit. Accent: oxblood.
 *
 * The commanding visual is a bespoke local-SVG waterfall — opening budget →
 * increments and cuts → closing. Each bar is a keyboard-operable target: focus
 * or hover pins a mono readout (mirrored to an aria-live region), and the whole
 * bridge has a visually-hidden table mirror (step, delta, running total).
 *
 * Anomaly: one waterfall bar and one cost-detail row are flagged
 * `CLOUD EGRESS +38% YOY — UNRESOLVED`, oxblood against the neutral bars.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
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
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './allocation.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ANOMALY,
  APPROVAL,
  CAPEX_OPEX,
  CAPEX_OPEX_NOTE,
  CLOUD_EGRESS_ANOMALY,
  CONTEXT,
  COST_DETAIL,
  COST_DETAIL_NOTE,
  DECK,
  FUNCTIONS,
  FUNCTION_NOTE,
  HEADCOUNT,
  HEADCOUNT_NOTE,
  HEADCOUNT_TOTAL,
  SCENARIOS,
  SCENARIO_NOTE,
  SLIDES,
  SLIDE_COUNT,
  WATERFALL,
  WATERFALL_MAX,
  WATERFALL_NOTE,
  WATERFALL_SLIDE_NUMBER,
  WATERFALL_TITLE,
  waterfallReadout,
} from './content.js';
import type { Slide, WaterfallStep } from './content.js';

/* ------------------------------------------------------------------ */
/* Palette shared with the chart (oxblood accent)                      */
/* ------------------------------------------------------------------ */

const INK = {
  oxblood: '#7d2a33',
  oxbloodSoft: '#a56069',
  ink: '#221a1b',
  muted: '#6e6366',
  faint: '#9a9094',
  neutral: '#b9b0b2',
  green: '#3d6b52',
  grid: 'rgba(125, 42, 51, 0.12)',
  gridSoft: 'rgba(125, 42, 51, 0.07)',
} as const;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
type Rec = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* Allocation-by-function chart (comp.category-bar-chart)              */
/* ------------------------------------------------------------------ */

function useFunctionOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...FUNCTIONS], {
      colors: [INK.oxblood],
      unit: '',
      reducedMotion: reduced,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 11 },
    };
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      data: FUNCTIONS.map((d) => ({
        value: d.value,
        itemStyle: {
          color: d.id === 'infrastructure' ? INK.oxblood : INK.oxbloodSoft,
          borderRadius: [3, 3, 0, 0],
        },
      })),
      label: {
        show: true,
        position: 'top',
        color: INK.ink,
        fontFamily: MONO,
        fontSize: 11,
        formatter: (p: { value: number }) => `$${p.value}M`,
      },
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: INK.oxblood,
        borderWidth: 1,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 12 },
      },
      grid: { left: 44, right: 20, top: 28, bottom: 34, containLabel: true },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk,
        axisLabel: { ...axisInk.axisLabel, interval: 0 },
        splitLine: { show: false },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        splitLine: { lineStyle: { color: INK.gridSoft, type: 'dashed' } },
      },
    } as ChartOption;
  }, [reduced]);
}

/* ------------------------------------------------------------------ */
/* The waterfall — bespoke, interactive, keyboard-operable             */
/* ------------------------------------------------------------------ */

const VIEW_W = 980;
const VIEW_H = 430;
const PAD = { left: 48, right: 18, top: 26, bottom: 78 };
const PLOT_W = VIEW_W - PAD.left - PAD.right;
const PLOT_H = VIEW_H - PAD.top - PAD.bottom;
const BASELINE_Y = PAD.top + PLOT_H;
const COL_W = PLOT_W / WATERFALL.length;
const BAR_W = COL_W * 0.56;

function yPix(v: number): number {
  return PAD.top + PLOT_H * (1 - v / WATERFALL_MAX);
}

interface BarGeom {
  step: WaterfallStep;
  colX: number;
  barX: number;
  top: number;
  height: number;
  labelText: string;
}

function computeBars(): BarGeom[] {
  return WATERFALL.map((step, i) => {
    const colX = PAD.left + i * COL_W;
    const barX = colX + (COL_W - BAR_W) / 2;
    let bottomVal: number;
    let topVal: number;
    let labelText: string;
    if (step.kind === 'opening' || step.kind === 'closing') {
      bottomVal = 0;
      topVal = step.running;
      labelText = `$${step.running.toFixed(1)}M`;
    } else {
      const prev = WATERFALL[i - 1]!.running;
      if (step.delta >= 0) {
        bottomVal = prev;
        topVal = step.running;
        labelText = `+$${step.delta.toFixed(1)}M`;
      } else {
        bottomVal = step.running;
        topVal = prev;
        labelText = `−$${Math.abs(step.delta).toFixed(1)}M`;
      }
    }
    const top = yPix(topVal);
    const height = Math.max(2, yPix(bottomVal) - yPix(topVal));
    return { step, colX, barX, top, height, labelText };
  });
}

const Y_TICKS = [0, 20, 40, 60, WATERFALL_MAX];

function Waterfall({ reduced }: { reduced: boolean }) {
  const bars = useMemo(() => computeBars(), []);
  const [activeId, setActiveId] = useState<string>('egress');
  const active = WATERFALL.find((s) => s.id === activeId) ?? WATERFALL[0]!;
  const hitRefs = useRef<(SVGRectElement | null)[]>([]);

  function focusBar(index: number) {
    const clamped = Math.min(Math.max(index, 0), WATERFALL.length - 1);
    hitRefs.current[clamped]?.focus();
  }

  return (
    <div className="al-wf" data-reduced={reduced ? 'true' : undefined}>
      <svg className="al-wf-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
        {/* The interactive bars below carry the accessible labels; the
            visually-hidden table is the full accessible equivalent. */}
        {/* y-axis gridlines + ticks */}
        {Y_TICKS.map((t) => (
          <g key={t} className="al-wf-grid">
            <line x1={PAD.left} y1={yPix(t)} x2={VIEW_W - PAD.right} y2={yPix(t)} />
            <text className="al-wf-tick" x={PAD.left - 8} y={yPix(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}

        {/* connectors between running totals */}
        {bars.slice(0, -1).map((b, i) => {
          const y = yPix(b.step.running);
          const next = bars[i + 1]!;
          return (
            <line
              key={`c-${b.step.id}`}
              className="al-wf-conn"
              x1={b.barX + BAR_W}
              y1={y}
              x2={next.barX}
              y2={y}
            />
          );
        })}

        {/* bars + interactive targets */}
        {bars.map((b, i) => {
          const flagged = Boolean(b.step.flag);
          const isActive = b.step.id === activeId;
          const labelAbove = b.top - 8;
          return (
            <g
              key={b.step.id}
              className="al-wf-col"
              data-kind={b.step.kind}
              data-flagged={flagged ? 'true' : undefined}
              data-active={isActive ? 'true' : undefined}
            >
              <rect className="al-wf-bar" x={b.barX} y={b.top} width={BAR_W} height={b.height} rx={2} />
              <text className="al-wf-dlabel" x={b.barX + BAR_W / 2} y={labelAbove} textAnchor="middle">
                {b.labelText}
              </text>
              {/* short category label under the baseline — never collides */}
              <text className="al-wf-clabel" x={b.colX + COL_W / 2} y={BASELINE_Y + 20} textAnchor="middle">
                {b.step.short}
              </text>
              {flagged ? (
                <text className="al-wf-flagmark" x={b.colX + COL_W / 2} y={BASELINE_Y + 36} textAnchor="middle">
                  UNRESOLVED
                </text>
              ) : null}
              {/* full-column interactive hit target — keyboard + hover */}
              <rect
                ref={(el) => {
                  hitRefs.current[i] = el;
                }}
                className="al-wf-hit"
                x={b.colX}
                y={PAD.top}
                width={COL_W}
                height={PLOT_H}
                role="button"
                tabIndex={0}
                aria-label={waterfallReadout(b.step)}
                data-testid="waterfall-bar"
                data-step={b.step.id}
                onFocus={() => setActiveId(b.step.id)}
                onMouseEnter={() => setActiveId(b.step.id)}
                onClick={() => setActiveId(b.step.id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    focusBar(i + 1);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    focusBar(i - 1);
                  }
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* pinned mono readout, mirrored to assistive tech */}
      <div className="al-wf-readout" data-flagged={active.flag ? 'true' : undefined}>
        <span className="al-wf-readout-label">SELECTED</span>
        <span className="al-wf-readout-body" data-testid="waterfall-readout" aria-live="polite">
          {waterfallReadout(active)}
        </span>
        {active.flag ? <span className="al-wf-readout-flag">{active.flag}</span> : null}
      </div>

      {/* visually-hidden table mirror: step · delta · running total */}
      <VisuallyHidden>
        <table data-testid="waterfall-mirror">
          <caption>Budget bridge, FY26 to FY27 — step, change, running total</caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Change ($M)</th>
              <th scope="col">Running total ($M)</th>
            </tr>
          </thead>
          <tbody>
            {WATERFALL.map((s) => (
              <tr key={s.id}>
                <th scope="row">
                  {s.label}
                  {s.flag ? ` — ${s.flag}` : ''}
                </th>
                <td>
                  {s.kind === 'opening' || s.kind === 'closing'
                    ? '—'
                    : `${s.delta >= 0 ? '+' : '−'}${Math.abs(s.delta).toFixed(1)}`}
                </td>
                <td>{s.running.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </VisuallyHidden>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Build wrapper                                                       */
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
      className={className ? `al-build ${className}` : 'al-build'}
      style={{ ['--al-i' as string]: i }}
      data-testid={testid}
    >
      {children}
    </Tag>
  );
}

function SlideHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Build i={0} className="al-slidehead">
      <span className="al-kicker">{kicker}</span>
      <h2 className="al-heading">{title}</h2>
    </Build>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function SlideBody({
  slide,
  reduced,
  functionOption,
}: {
  slide: Slide;
  reduced: boolean;
  functionOption: ChartOption;
}) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="al-cover">
          <Build i={0}>
            <p className="al-cover-org">{DECK.org}</p>
          </Build>
          <h2 className="al-cover-title">
            <Build i={1}>
              <span className="al-cover-line">The Allocation.</span>
            </Build>
            <Build i={2}>
              <span className="al-cover-line al-cover-sub">{DECK.subtitle}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="al-cover-lead">
              A 12% larger budget, bridged from last year line by line — including the one line we
              have not solved.
            </p>
          </Build>
          <Build i={4} className="al-cover-foot">
            <span>{DECK.confidential}</span>
            <span>{DECK.dataNotice}</span>
          </Build>
        </div>
      );

    case 'context':
      return (
        <div className="al-context-body">
          <SlideHeading kicker="01 · CONTEXT" title={CONTEXT.headline} />
          <div className="al-context-figs">
            <Build i={1} className="al-figblock">
              <span className="al-fig-label">{CONTEXT.last.label}</span>
              <span className="al-fig-value al-fig-muted">{CONTEXT.last.value}</span>
            </Build>
            <Build i={2} className="al-figarrow" aria-hidden="true">
              →
            </Build>
            <Build i={3} className="al-figblock">
              <span className="al-fig-label">{CONTEXT.next.label}</span>
              <span className="al-fig-value">{CONTEXT.next.value}</span>
              <span className="al-fig-delta">{CONTEXT.deltaLabel}</span>
            </Build>
          </div>
          <Build i={4}>
            <p className="al-note">{CONTEXT.gloss}</p>
          </Build>
        </div>
      );

    case 'waterfall':
      return (
        <div className="al-wf-body">
          <SlideHeading kicker="02 · THE BRIDGE" title={WATERFALL_TITLE} />
          <Build i={1} className="al-wf-frame" testid="allocation-waterfall">
            <Waterfall reduced={reduced} />
          </Build>
          <Build i={2}>
            <p className="al-note">{WATERFALL_NOTE}</p>
          </Build>
        </div>
      );

    case 'byFunction':
      return (
        <div className="al-chart-body">
          <SlideHeading kicker="03 · ALLOCATION" title="Where FY27 goes, by function." />
          <Build i={1} className="al-chart-frame" testid="allocation-functions">
            <ChartFigure
              key={reduced ? 'r' : 'f'}
              title="FY27 allocation by function"
              sourceNote={FUNCTION_NOTE}
              option={functionOption}
              tableColumns={buildCategoryBarChartTable([...FUNCTIONS], '$M').columns}
              tableRows={buildCategoryBarChartTable([...FUNCTIONS], '$M').rows}
              height={360}
              reducedMotion={reduced}
              className="al-chart"
            />
          </Build>
        </div>
      );

    case 'headcount':
      return (
        <div className="al-table-body">
          <SlideHeading kicker="03 · ALLOCATION" title="Headcount plan, by team." />
          <Build i={1} className="al-table-frame">
            <table className="al-table">
              <thead>
                <tr>
                  <th scope="col">Team</th>
                  <th scope="col" className="al-num">Q1</th>
                  <th scope="col" className="al-num">Q2</th>
                  <th scope="col" className="al-num">Q3</th>
                  <th scope="col" className="al-num">Q4</th>
                </tr>
              </thead>
              <tbody>
                {HEADCOUNT.map((row) => (
                  <tr key={row.team}>
                    <th scope="row">{row.team}</th>
                    <td className="al-num">{row.q1}</td>
                    <td className="al-num">{row.q2}</td>
                    <td className="al-num">{row.q3}</td>
                    <td className="al-num">{row.q4}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td className="al-num">{HEADCOUNT_TOTAL.q1}</td>
                  <td className="al-num">{HEADCOUNT_TOTAL.q2}</td>
                  <td className="al-num">{HEADCOUNT_TOTAL.q3}</td>
                  <td className="al-num">{HEADCOUNT_TOTAL.q4}</td>
                </tr>
              </tfoot>
            </table>
          </Build>
          <Build i={2}>
            <p className="al-note">{HEADCOUNT_NOTE}</p>
          </Build>
        </div>
      );

    case 'costDetail':
      return (
        <div className="al-table-body">
          <SlideHeading kicker="04 · DETAIL" title="Cost detail, top lines." />
          <Build i={1} className="al-table-frame">
            <table className="al-table">
              <thead>
                <tr>
                  <th scope="col">Line item</th>
                  <th scope="col" className="al-num">FY26</th>
                  <th scope="col" className="al-num">FY27</th>
                  <th scope="col" className="al-num">YoY</th>
                </tr>
              </thead>
              <tbody>
                {COST_DETAIL.map((row) => (
                  <tr key={row.line} data-flagged={row.flag ? 'true' : undefined}>
                    <th scope="row">
                      {row.line}
                      {row.flag ? <span className="al-row-flag">{row.flag}</span> : null}
                    </th>
                    <td className="al-num">{row.fy26}</td>
                    <td className="al-num">{row.fy27}</td>
                    <td className="al-num">{row.yoy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
          <Build i={2}>
            <p className="al-note">{COST_DETAIL_NOTE}</p>
          </Build>
        </div>
      );

    case 'anomaly':
      return (
        <div className="al-anomaly-body">
          <SlideHeading kicker="04 · DETAIL · FLAGGED" title={ANOMALY.headline} />
          <div className="al-anomaly-grid">
            <Build i={1} className="al-anomaly-figure">
              <span className="al-anomaly-flag" data-testid="anomaly-flag">
                {CLOUD_EGRESS_ANOMALY}
              </span>
              <span className="al-anomaly-number">{ANOMALY.figure}</span>
              <span className="al-anomaly-sub">{ANOMALY.sub}</span>
            </Build>
            <Build i={2} className="al-anomaly-points">
              <ol>
                {ANOMALY.points.map((p, i) => (
                  <li key={i}>
                    <span className="al-anomaly-no">{String(i + 1).padStart(2, '0')}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </Build>
          </div>
        </div>
      );

    case 'capexOpex':
      return (
        <div className="al-split-body">
          <SlideHeading kicker="05 · STRUCTURE" title="Capex versus opex." />
          <Build i={1} className="al-split-bar" aria-hidden="true">
            {CAPEX_OPEX.map((s) => (
              <div key={s.label} className="al-split-seg" data-tone={s.label.toLowerCase()} style={{ flex: s.value }}>
                <span className="al-split-seg-label">{s.label}</span>
                <span className="al-split-seg-pct">{s.value}%</span>
              </div>
            ))}
          </Build>
          <div className="al-split-cards">
            {CAPEX_OPEX.map((s, i) => (
              <Build key={s.label} i={i + 2} className="al-split-card" data-tone={s.label.toLowerCase()}>
                <div className="al-split-card-top">
                  <span className="al-split-card-name">{s.label}</span>
                  <span className="al-split-card-amount">{s.amount}</span>
                </div>
                <span className="al-split-card-note">{s.note}</span>
              </Build>
            ))}
          </div>
          <Build i={4}>
            <p className="al-note">{CAPEX_OPEX_NOTE}</p>
          </Build>
        </div>
      );

    case 'scenarios':
      return (
        <div className="al-scenarios-body">
          <SlideHeading kicker="06 · SCENARIOS" title="Three ways to fund the year." />
          <div className="al-scenarios">
            {SCENARIOS.map((sc, i) => (
              <Build key={sc.id} i={i + 1} className="al-scenario" data-tone={sc.tone} data-base={sc.tone === 'base' ? 'true' : undefined}>
                {sc.tone === 'base' ? <span className="al-scenario-badge">RECOMMENDED</span> : null}
                <span className="al-scenario-name">{sc.name}</span>
                <span className="al-scenario-total">{sc.total}</span>
                <span className="al-scenario-delta">{sc.delta}</span>
                <ul className="al-scenario-lines">
                  {sc.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </Build>
            ))}
          </div>
          <Build i={4}>
            <p className="al-note">{SCENARIO_NOTE}</p>
          </Build>
        </div>
      );

    case 'approval':
      return (
        <div className="al-approval-body">
          <Build i={0} className="al-approval-card">
            <span className="al-approval-kicker">07 · APPROVAL</span>
            <h2 className="al-approval-title">{APPROVAL.headline}</h2>
            <p className="al-approval-detail">{APPROVAL.detail}</p>
            <ul className="al-signoffs">
              {APPROVAL.signoffs.map((s) => (
                <li key={s.role}>
                  <span className="al-signoff-role">{s.role}</span>
                  <span className="al-signoff-decision">{s.decision}</span>
                  <span className="al-signoff-box" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function AllocationPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;
  const functionOption = useFunctionOption(reduced);

  useEffect(() => {
    document.title = 'The Allocation — FY27 Budget — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'w' || event.key === 'W') goTo(WATERFALL_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="al-root" data-testid="live-allocation" data-reduced={reduced ? 'true' : undefined}>
      <header className="al-titlebar" aria-label="Deck title bar">
        <div className="al-titlebar-cell">
          <RouterLink to="/" className="al-back">
            ◄ GALLERY
          </RouterLink>
          <span className="al-titlebar-rule" aria-hidden="true" />
          <span className="al-titlebar-title">{DECK.title}</span>
          <span className="al-titlebar-tag">FY27 · BUDGET</span>
        </div>
        <div className="al-titlebar-cell">
          <span className="al-titlebar-section" data-testid="deck-section">
            {activeSlide.section}
          </span>
        </div>
      </header>

      <main className="al-main">
        <h1>
          <VisuallyHidden>
            The Allocation — the synthetic FY27 budget for Meridian Systems. Ten conventional slides,
            bridged from a $61.4M FY26 baseline to a $68.9M FY27 request. The one flagged line:
            “{CLOUD_EGRESS_ANOMALY}”. Slide {activeNumber} of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <div className="al-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="al-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="al-slide-inner">
                  <SlideBody slide={slide} reduced={reduced} functionOption={functionOption} />
                </div>
                <div className="al-footer" aria-hidden="true">
                  <span className="al-footer-page">
                    {String(index + 1).padStart(2, '0')} / {String(SLIDE_COUNT).padStart(2, '0')}
                  </span>
                  <span className="al-footer-conf">{DECK.confidential}</span>
                  <span className="al-footer-notice">{DECK.dataNotice}</span>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="al-controls" aria-label="Deck controls">
        <span className="al-controls-notice">{DECK.dataNotice}</span>
        <div className="al-controls-nav">
          <span className="al-controls-count" data-testid="allocation-counter" aria-live="polite">
            {counter}
          </span>
          <span className="al-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="al-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="al-nav-btn"
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
