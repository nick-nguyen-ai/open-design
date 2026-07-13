/**
 * "The Quarter" — the live full-bleed rendering of
 * `deck-quarterly-business-review`.
 *
 * Deliberately CONVENTIONAL slide anatomy: a persistent title bar (deck title
 * left, section right), a content zone on a visible 12-column grid, and a footer
 * rule carrying the page number, a confidentiality line, and the synthetic
 * notice. A numbered agenda, restrained single fade/rise motion (motionLevel 1).
 * The craft is typographic scale, grid alignment, and considered charts — the
 * best conventional QBR a human could make, not a world conceit.
 *
 * Anomaly: the KPI row flags `NRR 96% — BELOW 100% FLOOR`, the single red figure
 * in a green row, echoed in the executive summary.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { KpiTile } from '@enterprise-design/content-components';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './quarter.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  AGENDA,
  DATA_NOTES,
  DECK,
  KPIS,
  KPI_NOTE,
  KPI_SLIDE_NUMBER,
  KPI_VS_PLAN,
  LOSSES,
  NRR_ANOMALY,
  PIPELINE,
  PIPELINE_NOTE,
  PRIORITIES,
  REVENUE_NOTE,
  REVENUE_SERIES,
  RISKS,
  SEGMENTS,
  SEGMENT_NOTE,
  SLIDES,
  SLIDE_COUNT,
  SUMMARY,
  WINS,
} from './content.js';
import type { Slide } from './content.js';

/* ------------------------------------------------------------------ */
/* Palette shared with the charts (navy accent)                        */
/* ------------------------------------------------------------------ */

const INK = {
  navy: '#1f3a67',
  navySoft: '#5a6f92',
  ink: '#1a2230',
  muted: '#6b7484',
  faint: '#9aa1ad',
  grid: 'rgba(31, 58, 103, 0.12)',
  gridSoft: 'rgba(31, 58, 103, 0.07)',
  red: '#b03a3a',
  panel: '#ffffff',
} as const;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
type Rec = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* Chart options                                                       */
/* ------------------------------------------------------------------ */

function useRevenueOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...REVENUE_SERIES], {
      colors: [INK.navy],
      variant: 'area',
      unit: '',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 11 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 7,
      lineStyle: { ...(s.lineStyle as Rec), width: 2.4, color: INK.navy },
      itemStyle: { color: INK.navy },
      areaStyle: { color: INK.navy, opacity: 0.1 },
      label: {
        show: true,
        position: 'top',
        color: INK.navy,
        fontFamily: MONO,
        fontSize: 11,
        formatter: '{@[1]}',
      },
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      // The conventional hover tooltip — navy header, mono figures, quiet card.
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: INK.navy,
        borderWidth: 1,
        padding: [8, 12],
        extraCssText: 'box-shadow: 0 8px 24px -12px rgba(31,58,103,0.4); border-radius: 4px;',
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 12 },
        formatter: (params: unknown) => {
          const arr = params as { axisValue: string; data: number }[];
          const p = arr[0];
          if (!p) return '';
          return `<span style="color:${INK.muted};letter-spacing:0.08em">${p.axisValue}</span><br/><b style="color:${INK.navy};font-size:14px">$${p.data}M</b>`;
        },
      },
      grid: { left: 44, right: 22, top: 30, bottom: 34, containLabel: true },
      xAxis: { ...(base.xAxis as Rec), ...axisInk, splitLine: { show: false } },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        min: 30,
        splitLine: { lineStyle: { color: INK.gridSoft } },
      },
    } as ChartOption;
  }, [reduced]);
}

function useSegmentOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...SEGMENTS], {
      colors: [INK.navy, INK.navySoft],
      unit: '',
      reducedMotion: reduced,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 11 },
    };
    const series = (base.series as Rec[]).map((s) => {
      if (s.id === 'value') {
        return {
          ...s,
          data: SEGMENTS.map((d) => ({
            value: d.value,
            itemStyle: {
              color: d.value >= (d.target ?? 0) ? INK.navy : INK.navySoft,
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
        };
      }
      return { ...s, itemStyle: { color: INK.ink } };
    });
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: {
        top: 0,
        right: 0,
        icon: 'diamond',
        itemWidth: 10,
        itemHeight: 10,
        data: ['Target'],
        textStyle: { color: INK.muted, fontFamily: MONO, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: INK.navy,
        borderWidth: 1,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 12 },
      },
      grid: { left: 44, right: 22, top: 40, bottom: 34, containLabel: true },
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
/* Build wrapper — the single fade/rise per slide (motionLevel 1)      */
/* ------------------------------------------------------------------ */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
  testid,
}: {
  i: number;
  children?: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'section';
  testid?: string;
}) {
  return (
    <Tag
      className={className ? `q-build ${className}` : 'q-build'}
      style={{ ['--q-i' as string]: i }}
      data-testid={testid}
    >
      {children}
    </Tag>
  );
}

function SlideHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Build i={0} className="q-slidehead">
      <span className="q-kicker">{kicker}</span>
      <h2 className="q-heading">{title}</h2>
    </Build>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function SlideBody({
  slide,
  reduced,
  revenueOption,
  segmentOption,
}: {
  slide: Slide;
  reduced: boolean;
  revenueOption: ChartOption;
  segmentOption: ChartOption;
}) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="q-cover">
          <Build i={0}>
            <p className="q-cover-org">{DECK.org}</p>
          </Build>
          <h2 className="q-cover-title">
            <Build i={1}>
              <span className="q-cover-line">The Quarter.</span>
            </Build>
            <Build i={2}>
              <span className="q-cover-line q-cover-sub">{DECK.subtitle}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="q-cover-lead">{SUMMARY.lead}</p>
          </Build>
          <Build i={4} className="q-cover-foot">
            <span>{DECK.confidential}</span>
            <span>{DECK.dataNotice}</span>
          </Build>
        </div>
      );

    case 'agenda':
      return (
        <div className="q-agenda-body">
          <SlideHeading kicker="AGENDA" title="What we will cover." />
          <ol className="q-agenda">
            {AGENDA.map((item, i) => (
              <Build key={item.no} i={i + 1} as="li" className="q-agenda-item">
                <span className="q-agenda-no">{item.no}</span>
                <span className="q-agenda-title">{item.title}</span>
                <span className="q-agenda-detail">{item.detail}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'summary':
      return (
        <div className="q-summary-body">
          <SlideHeading kicker="01 · PERFORMANCE" title="Executive summary." />
          <ol className="q-summary">
            {SUMMARY.sentences.map((sentence, i) => (
              <Build key={i} i={i + 1} as="li" className="q-summary-line" data-anomaly={i === 2 ? 'true' : undefined}>
                <span className="q-summary-mark" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{sentence}</span>
              </Build>
            ))}
          </ol>
          <Build i={4}>
            <p className="q-summary-flag" data-testid="summary-anomaly">
              {NRR_ANOMALY}
            </p>
          </Build>
        </div>
      );

    case 'kpi':
      return (
        <div className="q-kpi-body">
          <SlideHeading kicker="01 · PERFORMANCE" title="The quarter, in four numbers." />
          <Build i={1} className="q-kpi-frame">
            <KpiTile metrics={[...KPIS]} title="Q3 FY26 headline metrics" className="q-kpi-tiles" />
          </Build>
          <Build i={2} className="q-kpi-foot">
            <p className="q-kpi-flag" data-testid="kpi-anomaly">
              <span className="q-flag-dot" aria-hidden="true" />
              {NRR_ANOMALY}
            </p>
            <p className="q-note">{KPI_NOTE}</p>
          </Build>
          <Build i={3} className="q-vsplan-frame">
            <table className="q-vsplan">
              <caption className="q-vsplan-cap">Q3 FY26 actual vs. operating plan</caption>
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col" className="q-num">Actual</th>
                  <th scope="col" className="q-num">Plan</th>
                  <th scope="col" className="q-num">Δ vs plan</th>
                </tr>
              </thead>
              <tbody>
                {KPI_VS_PLAN.map((row) => (
                  <tr key={row.metric}>
                    <th scope="row">{row.metric}</th>
                    <td className="q-num">{row.actual}</td>
                    <td className="q-num">{row.plan}</td>
                    <td className="q-num">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
        </div>
      );

    case 'trend':
      return (
        <div className="q-chart-body">
          <SlideHeading kicker="01 · PERFORMANCE" title="Revenue, eight quarters." />
          <Build i={1} className="q-chart-frame" testid="quarter-trend">
            <ChartFigure
              key={reduced ? 'r' : 'f'}
              title="Recognised revenue by quarter"
              sourceNote={REVENUE_NOTE}
              option={revenueOption}
              tableColumns={buildTrendChartTable([...REVENUE_SERIES]).columns}
              tableRows={buildTrendChartTable([...REVENUE_SERIES]).rows}
              height={360}
              reducedMotion={reduced}
              className="q-chart"
            />
          </Build>
        </div>
      );

    case 'segment':
      return (
        <div className="q-chart-body">
          <SlideHeading kicker="02 · SEGMENTS" title="Where the growth came from." />
          <Build i={1} className="q-chart-frame" testid="quarter-segment">
            <ChartFigure
              key={reduced ? 'r' : 'f'}
              title="Revenue by segment vs. plan"
              sourceNote={SEGMENT_NOTE}
              option={segmentOption}
              tableColumns={buildCategoryBarChartTable([...SEGMENTS], '$M').columns}
              tableRows={buildCategoryBarChartTable([...SEGMENTS], '$M').rows}
              height={360}
              reducedMotion={reduced}
              className="q-chart"
            />
          </Build>
        </div>
      );

    case 'winsLosses':
      return (
        <div className="q-twocol-body">
          <SlideHeading kicker="03 · EXECUTION" title="Wins and losses." />
          <div className="q-twocol">
            <Build i={1} className="q-col" data-tone="win">
              <span className="q-col-head">WON</span>
              <ul>
                {WINS.map((d) => (
                  <li key={d.name}>
                    <div className="q-deal-top">
                      <b>{d.name}</b>
                      <span className="q-deal-value">{d.value}</span>
                    </div>
                    <span className="q-deal-note">{d.note}</span>
                  </li>
                ))}
              </ul>
            </Build>
            <Build i={2} className="q-col" data-tone="loss">
              <span className="q-col-head">LOST</span>
              <ul>
                {LOSSES.map((d) => (
                  <li key={d.name}>
                    <div className="q-deal-top">
                      <b>{d.name}</b>
                      <span className="q-deal-value">{d.value}</span>
                    </div>
                    <span className="q-deal-note">{d.note}</span>
                  </li>
                ))}
              </ul>
            </Build>
          </div>
        </div>
      );

    case 'pipeline':
      return (
        <div className="q-table-body">
          <SlideHeading kicker="03 · EXECUTION" title="The pipeline." />
          <Build i={1} className="q-table-frame">
            <table className="q-table">
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col" className="q-num">Deals</th>
                  <th scope="col" className="q-num">Weighted value</th>
                  <th scope="col" className="q-num">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {PIPELINE.map((row) => (
                  <tr key={row.stage} data-thin={row.coverage === '1.0×' ? 'true' : undefined}>
                    <th scope="row">{row.stage}</th>
                    <td className="q-num">{row.deals}</td>
                    <td className="q-num">{row.value}</td>
                    <td className="q-num">{row.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
          <Build i={2}>
            <p className="q-note">{PIPELINE_NOTE}</p>
          </Build>
        </div>
      );

    case 'risks':
      return (
        <div className="q-table-body">
          <SlideHeading kicker="04 · RISK" title="Risks and mitigations." />
          <Build i={1} className="q-table-frame">
            <table className="q-table q-risk-table">
              <thead>
                <tr>
                  <th scope="col">Risk</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {RISKS.map((row) => (
                  <tr key={row.risk}>
                    <th scope="row">{row.risk}</th>
                    <td>
                      <span className="q-sev" data-sev={row.severity.toLowerCase()}>
                        {row.severity}
                      </span>
                    </td>
                    <td>{row.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
        </div>
      );

    case 'priorities':
      return (
        <div className="q-priorities-body">
          <SlideHeading kicker="05 · OUTLOOK" title="Next quarter, four priorities." />
          <ol className="q-priorities">
            {PRIORITIES.map((p, i) => (
              <Build key={p.no} i={i + 1} as="li" className="q-priority">
                <span className="q-priority-no">{p.no}</span>
                <div className="q-priority-text">
                  <b>{p.title}</b>
                  <span>{p.detail}</span>
                </div>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'appendix':
      return (
        <div className="q-appendix-body">
          <Build i={0} className="q-divider-rule" aria-hidden="true" />
          <SlideHeading kicker="APPENDIX" title="Data notes & method." />
          <ul className="q-datanotes">
            {DATA_NOTES.map((note, i) => (
              <Build key={i} i={i + 1} as="li">
                {note}
              </Build>
            ))}
          </ul>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function QuarterPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;
  const revenueOption = useRevenueOption(reduced);
  const segmentOption = useSegmentOption(reduced);

  useEffect(() => {
    document.title = 'The Quarter — Q3 FY26 QBR — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'k' || event.key === 'K') goTo(KPI_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="q-root" data-testid="live-quarter" data-reduced={reduced ? 'true' : undefined}>
      {/* Persistent title bar — deck title left, section right */}
      <header className="q-titlebar" aria-label="Deck title bar">
        <div className="q-titlebar-cell">
          <RouterLink to="/" className="q-back">
            ◄ GALLERY
          </RouterLink>
          <span className="q-titlebar-rule" aria-hidden="true" />
          <span className="q-titlebar-title">{DECK.title}</span>
          <span className="q-titlebar-tag">Q3 FY26 · QBR</span>
        </div>
        <div className="q-titlebar-cell">
          <span className="q-titlebar-section" data-testid="deck-section">
            {activeSlide.section}
          </span>
        </div>
      </header>

      <main className="q-main">
        <h1>
          <VisuallyHidden>
            The Quarter — the synthetic Q3 FY26 quarterly business review for Meridian Systems.
            Eleven conventional slides. The one flagged figure: “{NRR_ANOMALY}”. Slide {activeNumber}{' '}
            of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <div className="q-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="q-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="q-slide-inner">
                  <SlideBody
                    slide={slide}
                    reduced={reduced}
                    revenueOption={revenueOption}
                    segmentOption={segmentOption}
                  />
                </div>
                {/* Footer rule — page number · confidentiality · synthetic notice.
                    The single page counter lives here (the active slide carries the
                    testid); the outer chrome no longer duplicates it. */}
                <div className="q-footer" aria-hidden="true">
                  <span
                    className="q-footer-page"
                    data-testid={state === 'active' ? 'quarter-counter' : undefined}
                  >
                    {String(index + 1).padStart(2, '0')} / {String(SLIDE_COUNT).padStart(2, '0')}
                  </span>
                  <span className="q-footer-conf">{DECK.confidential}</span>
                  <span className="q-footer-notice">{DECK.dataNotice}</span>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="q-controls" aria-label="Deck controls">
        <div className="q-controls-nav">
          <span className="q-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="q-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="q-nav-btn"
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
