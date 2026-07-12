/**
 * "The Lab Report" — the live full-bleed rendering of
 * `deck-genai-model-validation-report`.
 *
 * A validation team's findings as numbered FIGURE PLATES from a laboratory
 * notebook. Cool grey-blue technical stock over a fine modular grid; one
 * stamp accent, verdict green. Eight plates — a cover and seven numbered
 * PLATES. Two evidence plates carry real charts (hallucination by prompt
 * class; factuality drift). The findings register is a real table and the
 * page's accessible mirror. Keyboard-driven (←/→/Home/End), `?slide=`
 * deep-linkable, printable one plate per page.
 *
 * Art-direction licence (task 15): this file and lab.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven; reduced motion collapses plate turns
 * to stepped opacity.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-mono/700.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import './lab.css';
import {
  REPORT,
  PLATES,
  PLATE_COUNT,
  HALLUCINATION_BY_CLASS,
  HALLUCINATION_APPETITE,
  HALLUCINATION_BREACH_INDEX,
  DRIFT_SERIES,
  plateNumberForId,
} from './content.js';
import type { Plate } from './content.js';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#182430',
  slate: '#3f5b74',
  steel: '#6d8399',
  muted: '#69788a',
  grid: 'rgba(24, 36, 48, 0.14)',
  green: '#2f7d57',
  warn: '#a4402f',
  panel: 'rgba(232, 237, 241, 0.6)',
} as const;

type Rec = Record<string, unknown>;

/* ---------------------------------------------------------------- */
/* FIG 1 — hallucination by prompt class (bar)                       */
/* ---------------------------------------------------------------- */

function useHallucinationOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...HALLUCINATION_BY_CLASS], {
      colors: [INK.slate, INK.green],
      unit: '%',
      reducedMotion: reduced,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 11 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) => {
      if (s.id === 'value') {
        return {
          ...s,
          // Per-bar ink: the breaching class in warn, the rest in slate — the
          // eye lands on the one bar over appetite (never colour alone: it is
          // also the only bar above the green diamond and carries a ▲ label).
          data: HALLUCINATION_BY_CLASS.map((d, i) => ({
            value: d.value,
            itemStyle: {
              color: i === HALLUCINATION_BREACH_INDEX ? INK.warn : INK.slate,
              borderRadius: [3, 3, 0, 0],
            },
          })),
          label: {
            show: true,
            position: 'top',
            color: INK.ink,
            fontFamily: MONO,
            fontSize: 11,
            formatter: (p: { dataIndex: number; value: number }) =>
              p.dataIndex === HALLUCINATION_BREACH_INDEX ? `▲ ${p.value}%` : `${p.value}%`,
          },
          // The appetite reads as a threshold the eye can trace across every
          // class — the breaching bar visibly crosses it (the diamonds sit on
          // this line). Shape + position, never colour alone.
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: INK.green, type: 'dashed', width: 1 },
            label: { show: false },
            data: [{ yAxis: HALLUCINATION_APPETITE }],
          },
        };
      }
      // target (appetite) diamonds — verdict green
      return { ...s, itemStyle: { color: INK.green }, symbolSize: 13 };
    });
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: undefined,
      grid: { left: 44, right: 20, top: 26, bottom: 34, containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#eef2f5',
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: { ...(base.xAxis as Rec), ...axisInk, splitLine: { show: false } },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        max: 10,
        splitLine: { lineStyle: { color: INK.grid, type: 'dashed' } },
      },
    } as ChartOption;
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* FIG 2 — factuality drift (trend)                                 */
/* ---------------------------------------------------------------- */

function useDriftOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...DRIFT_SERIES], {
      colors: [INK.slate, INK.steel],
      unit: '%',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 10 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 6,
      lineStyle: { ...(s.lineStyle as Rec), width: s.id === 'factuality' ? 2.25 : 1.5 },
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 2,
        itemGap: 24,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#eef2f5',
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 48, right: 20, top: 40, bottom: 30, containLabel: true },
      xAxis: { ...(base.xAxis as Rec), ...axisInk, splitLine: { show: false } },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        min: 88,
        max: 95,
        splitLine: { lineStyle: { color: INK.grid, type: 'dashed' } },
      },
    } as ChartOption;
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* Build wrapper                                                     */
/* ---------------------------------------------------------------- */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'tr';
}) {
  return (
    <Tag
      className={className ? `lr-build ${className}` : 'lr-build'}
      style={{ ['--lr-i' as string]: i }}
    >
      {children}
    </Tag>
  );
}

function PlateHead({ plate }: { plate: Extract<Plate, { plate: number }> }) {
  return (
    <Build i={0}>
      <p className="lr-plate-head">
        <span aria-hidden="true" className="lr-plate-no">
          PLATE {String(plate.plate).padStart(2, '0')}
        </span>
        <span className="lr-plate-title">{plate.heading}</span>
      </p>
    </Build>
  );
}

/* ---------------------------------------------------------------- */
/* Plate bodies                                                     */
/* ---------------------------------------------------------------- */

function PlateBody({
  plate,
  reduced,
  activeChart,
}: {
  plate: Plate;
  reduced: boolean;
  activeChart: 'bar' | 'trend' | null;
}) {
  const hallucinationOption = useHallucinationOption(reduced);
  const driftOption = useDriftOption(reduced);
  const hallucinationTable = useMemo(
    () => buildCategoryBarChartTable([...HALLUCINATION_BY_CLASS], '%'),
    [],
  );
  const driftTable = useMemo(() => buildTrendChartTable([...DRIFT_SERIES]), []);

  switch (plate.kind) {
    case 'cover':
      return (
        <div className="lr-body lr-body-cover">
          <Build i={0}>
            <p className="lr-eyebrow">
              {REPORT.team} · REPORT {REPORT.ref}
            </p>
          </Build>
          <h2 className="lr-display lr-display-cover">
            {plate.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="lr-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={plate.titleLines.length + 1}>
            <p className="lr-thesis">{plate.thesis}</p>
          </Build>
          <Build i={plate.titleLines.length + 2}>
            <div className="lr-front-meta">
              {plate.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );

    case 'spec':
      return (
        <div className="lr-body">
          <PlateHead plate={plate} />
          <Build i={1}>
            <p className="lr-standfirst">{plate.standfirst}</p>
          </Build>
          <dl className="lr-spec">
            {plate.spec.map((row, i) => (
              <Build key={row.label} i={i + 2} className="lr-spec-row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </Build>
            ))}
          </dl>
          <Build i={plate.spec.length + 2}>
            <div className="lr-notes">
              {plate.notes.map((n, i) => (
                <p key={i}>
                  <span aria-hidden="true">—</span> {n}
                </p>
              ))}
            </div>
          </Build>
        </div>
      );

    case 'battery':
      return (
        <div className="lr-body">
          <PlateHead plate={plate} />
          <Build i={1}>
            <p className="lr-standfirst">{plate.standfirst}</p>
          </Build>
          <Build i={2}>
            <table className="lr-table">
              <thead>
                <tr>
                  {plate.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plate.suites.map((s) => (
                  <tr key={s.ref}>
                    <td className="lr-td-ref">{s.ref}</td>
                    <th scope="row" className="lr-td-name">
                      {s.suite}
                    </th>
                    <td className="lr-td-num">{s.cases}</td>
                    <td className="lr-td-num">{s.probes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="lr-tfoot">
                  <td />
                  <th scope="row" className="lr-td-name">
                    TOTAL · 5 SUITES
                  </th>
                  <td className="lr-td-num">{plate.total.cases}</td>
                  <td className="lr-td-num">{plate.total.probes}</td>
                </tr>
              </tfoot>
            </table>
          </Build>
        </div>
      );

    case 'figure': {
      const isBar = plate.chart === 'bar';
      const active = activeChart === plate.chart;
      return (
        <div className="lr-body">
          <PlateHead plate={plate} />
          <div className="lr-figure-grid">
            <div className="lr-figure-side">
              <Build i={1}>
                <p className="lr-fig-no">{plate.figNo}</p>
              </Build>
              <Build i={2}>
                <p className="lr-reading">{plate.reading}</p>
              </Build>
              <Build i={3}>
                <p className="lr-subnote">{plate.subnote}</p>
              </Build>
              {isBar ? (
                <Build i={4}>
                  <p className="lr-appetite">
                    <span aria-hidden="true" className="lr-appetite-mark">
                      ◆
                    </span>{' '}
                    VALIDATION APPETITE {HALLUCINATION_APPETITE.toFixed(1)}%
                  </p>
                </Build>
              ) : null}
            </div>
            <Build i={2} className="lr-chart-wrap">
              <ChartFigure
                key={active ? 'entered' : 'parked'}
                title={plate.caption}
                sourceNote={plate.source}
                option={isBar ? hallucinationOption : driftOption}
                tableColumns={isBar ? hallucinationTable.columns : driftTable.columns}
                tableRows={isBar ? hallucinationTable.rows : driftTable.rows}
                height={360}
                reducedMotion={reduced}
                className="lr-chart"
              />
            </Build>
          </div>
        </div>
      );
    }

    case 'findings':
      return (
        <div className="lr-body">
          <PlateHead plate={plate} />
          <Build i={1}>
            <p className="lr-standfirst">{plate.standfirst}</p>
          </Build>
          <Build i={2}>
            <table className="lr-table lr-findings" data-testid="findings-register">
              <caption className="lr-sr">
                Validation findings register for {REPORT.model}. Finding VF-07 is CRITICAL and
                OPEN — the one finding that keeps the verdict conditional.
              </caption>
              <thead>
                <tr>
                  {plate.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plate.findings.map((f) => (
                  <tr key={f.ref} data-open={f.open ? 'true' : undefined}>
                    <td className="lr-td-ref">{f.ref}</td>
                    <td className="lr-td-sev">
                      <span className={`lr-sev lr-sev-${f.severity.toLowerCase()}`}>
                        {f.open ? '● ' : '○ '}
                        {f.severity}
                      </span>
                    </td>
                    <th scope="row" className="lr-td-finding">
                      {f.finding}
                    </th>
                    <td className="lr-td-status">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
        </div>
      );

    case 'limitations':
      return (
        <div className="lr-body">
          <PlateHead plate={plate} />
          <Build i={1}>
            <p className="lr-standfirst">{plate.standfirst}</p>
          </Build>
          <ol className="lr-limitations">
            {plate.limitations.map((l, i) => (
              <Build key={l.ref} i={i + 2} as="li" className="lr-limitation">
                <span className="lr-limitation-ref">{l.ref}</span>
                <span className="lr-limitation-text">{l.text}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'verdict':
      return (
        <div className="lr-body lr-body-verdict">
          <PlateHead plate={plate} />
          <Build i={1} className="lr-stamp-wrap">
            <span className="lr-stamp" data-testid="verdict-stamp">
              <span className="lr-stamp-inner">{plate.stamp}</span>
              <span className="lr-stamp-ref" aria-hidden="true">
                {REPORT.ref} · {REPORT.programme}
              </span>
            </span>
          </Build>
          <Build i={2}>
            <p className="lr-verdict-line">{plate.verdictLine}</p>
          </Build>
          <dl className="lr-conditions">
            {plate.conditions.map((c, i) => (
              <Build key={c.ref} i={i + 3} className="lr-condition">
                <dt>{c.ref}</dt>
                <dd>{c.text}</dd>
              </Build>
            ))}
          </dl>
          <Build i={plate.conditions.length + 3}>
            <p className="lr-crossref">{plate.crossRef}</p>
          </Build>
        </div>
      );
  }
}

/* ---------------------------------------------------------------- */
/* The report                                                       */
/* ---------------------------------------------------------------- */

export default function LabReportPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(PLATE_COUNT, {
    reduced,
  });
  const [indexOpen, setIndexOpen] = useState(false);
  const activePlate = PLATES[activeIndex] as Plate;

  useEffect(() => {
    document.title = `The Lab Report — ${REPORT.ref}, validation of ${REPORT.model} — Live`;
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'r' || event.key === 'R') {
        const n = plateNumberForId('findings');
        if (n) goTo(n);
      }
      if (event.key === 'i' || event.key === 'I') setIndexOpen((open) => !open);
      if (event.key === 'Escape') setIndexOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  const activeChart: 'bar' | 'trend' | null =
    activePlate.kind === 'figure' ? activePlate.chart : null;

  const plateChrome =
    activePlate.plate === null
      ? `FRONT MATTER · ${REPORT.ref}`
      : `PLATE ${String(activePlate.plate).padStart(2, '0')} OF ${REPORT.plateCount} · VALIDATION OF ${REPORT.model}`;

  return (
    <div className="lr-root" data-testid="live-lab-report" data-reduced={reduced ? 'true' : undefined}>
      <header className="lr-chrome" aria-label="Report chrome">
        <div className="lr-chrome-cell">
          <RouterLink to="/" className="lr-back">
            ◄ GALLERY
          </RouterLink>
          <span className="lr-chrome-rule" aria-hidden="true" />
          <span>{REPORT.team}</span>
        </div>
        <div className="lr-chrome-cell">
          <span data-testid="plate-counter" aria-live="polite">
            {counter} · {plateChrome} · INDEPENDENT REVIEW
          </span>
          <span className="lr-chrome-rule" aria-hidden="true" />
          <button
            type="button"
            className="lr-index-toggle"
            aria-expanded={indexOpen}
            aria-controls="lr-index"
            onClick={() => setIndexOpen((open) => !open)}
          >
            PLATES
          </button>
        </div>
      </header>

      <nav
        id="lr-index"
        className="lr-index"
        aria-label="All plates"
        data-open={indexOpen ? 'true' : undefined}
        hidden={!indexOpen}
      >
        <p className="lr-index-heading">
          {REPORT.ref} · {REPORT.plateCount} PLATES
        </p>
        <ol className="lr-index-list">
          {PLATES.map((plate, index) => (
            <li key={plate.id}>
              <button
                type="button"
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index + 1);
                  setIndexOpen(false);
                }}
              >
                <span className="lr-index-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{plate.indexTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="lr-main">
        <div className="lr-corners" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <h1>
          <VisuallyHidden>
            The Lab Report — {REPORT.ref}, an independent validation of {REPORT.model} for programme{' '}
            {REPORT.programme}, in a cover and {REPORT.plateCount} plates. Currently on plate{' '}
            {activeNumber} of {PLATE_COUNT}: {activePlate.indexTitle}.
          </VisuallyHidden>
        </h1>
        <div className="lr-stage">
          {PLATES.map((plate, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={plate.id}
                className="lr-plate"
                data-state={state}
                data-plate-id={plate.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Plate ${index + 1} of ${PLATE_COUNT}: ${plate.indexTitle}`}
              >
                <PlateBody plate={plate} reduced={reduced} activeChart={activeChart} />
                <div className="lr-print-foot" aria-hidden="true">
                  {REPORT.ref} · PLATE {String(index + 1).padStart(2, '0')} / {PLATE_COUNT} ·{' '}
                  {REPORT.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="lr-footer">
        <span className="lr-footer-section" data-testid="plate-section">
          {activePlate.section}
        </span>
        <span className="lr-footer-notice">{REPORT.dataNotice}</span>
        <div className="lr-footer-nav">
          <span className="lr-hint">{REPORT.keyboardHint}</span>
          <button
            type="button"
            className="lr-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous plate"
          >
            ←
          </button>
          <button
            type="button"
            className="lr-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === PLATE_COUNT - 1}
            aria-label="Next plate"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
