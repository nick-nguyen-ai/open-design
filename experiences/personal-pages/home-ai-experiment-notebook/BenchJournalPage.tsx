/**
 * "The Bench Journal" — the live full-bleed rendering of
 * `home-ai-experiment-notebook`.
 *
 * A running lab notebook kept in public: a warm grid-paper field, two ink
 * colours, dated experiment entries stamped with a verdict, taped-in figure
 * plates. Honesty is the design — entry 38 is struck through but fully
 * legible, its margin note pointing to the re-run that corrected it.
 * LedgerReveal carries the entry run in reading order.
 *
 * Art-direction licence: this file and journal.css are the experience-local
 * art layer — raw colour values are permitted HERE only. Motion easings and
 * durations remain token-driven through the LedgerReveal sequence.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LedgerReveal, useMotionPreference } from '@enterprise-design/motion';
import type { LedgerRevealItem } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption, TrendChartSeriesInput } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './journal.css';
import {
  CHROME,
  CURRENT_QUESTION,
  ENTRIES,
  INDEX,
  JOURNAL_STANDFIRST,
  PERSON,
  PLATE_LATENCY,
  PLATE_LATENCY_SERIES,
  PLATE_RECALL,
  PLATE_RECALL_SERIES,
  VERDICT_LABEL,
} from './content.js';
import type { JournalEntry } from './content.js';

/* ------------------------------------------------------------------ */
/* Ink (experience-local art layer)                                    */
/* ------------------------------------------------------------------ */

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  navy: '#20345c',
  red: '#a3312a',
  soft: '#5a6274',
  grid: 'rgba(32, 52, 92, 0.14)',
  faint: 'rgba(32, 52, 92, 0.28)',
} as const;

type Rec = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* Inline sparkline — the entry's result trace (decorative)            */
/* ------------------------------------------------------------------ */

const SPARK_W = 132;
const SPARK_H = 34;

function Sparkline({ values, good }: { values: readonly number[]; good: boolean }) {
  const { min, max } = useMemo(() => {
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [values]);
  const span = max - min || 1;
  const step = SPARK_W / (values.length - 1);
  const pts = values
    .map((v, i) => {
      const x = i * step;
      const y = SPARK_H - 4 - ((v - min) / span) * (SPARK_H - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const last = pts.split(' ').at(-1)?.split(',') ?? ['0', '0'];
  return (
    <svg
      className="bj-spark"
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      width={SPARK_W}
      height={SPARK_H}
      aria-hidden="true"
      data-good={good ? 'true' : 'false'}
    >
      <polyline className="bj-spark-line" points={pts} />
      <circle className="bj-spark-dot" cx={Number(last[0])} cy={Number(last[1])} r={2.6} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* An entry                                                            */
/* ------------------------------------------------------------------ */

function Entry({ entry }: { entry: JournalEntry }) {
  return (
    <article
      className={`bj-entry${entry.struck ? ' bj-entry-struck' : ''}`}
      aria-labelledby={`bj-entry-${entry.no}`}
      data-verdict={entry.verdict}
      data-struck={entry.struck ? 'true' : undefined}
    >
      <div className="bj-entry-rail" aria-hidden="true">
        <span className="bj-entry-no">№ {entry.no}</span>
        <span className="bj-entry-date">{entry.date}</span>
      </div>
      <div className="bj-entry-body">
        <div className="bj-entry-head">
          <h3 id={`bj-entry-${entry.no}`} className="bj-entry-title">
            <span className="bj-entry-no-inline">№{entry.no}</span> {entry.title}
          </h3>
          <span className={`bj-stamp bj-stamp-${entry.verdict}`} data-verdict={entry.verdict}>
            {VERDICT_LABEL[entry.verdict]}
          </span>
        </div>
        <dl className="bj-entry-fields">
          <div className="bj-field">
            <dt>HYPOTHESIS</dt>
            <dd>{entry.hypothesis}</dd>
          </div>
          <div className="bj-field">
            <dt>METHOD</dt>
            <dd>{entry.method}</dd>
          </div>
          <div className="bj-field bj-field-result">
            <dt>RESULT</dt>
            <dd>
              <span className="bj-result-text">{entry.result}</span>
              <Sparkline values={entry.spark} good={entry.sparkGood} />
            </dd>
          </div>
        </dl>
        {entry.margin ? (
          <p className={`bj-entry-margin${entry.struck ? ' bj-entry-margin-red' : ''}`}>
            {entry.struck ? '↳ ' : ''}
            {entry.margin}
          </p>
        ) : null}
      </div>
      {entry.struck ? <span className="bj-strike" aria-hidden="true" /> : null}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Figure plate — a "taped-in" ChartFigure                             */
/* ------------------------------------------------------------------ */

function usePlateOption(
  series: readonly TrendChartSeriesInput[],
  reduced: boolean,
  unit: string | undefined,
  yBounds: { min?: number; max?: number } | undefined,
): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...series], {
      colors: [INK.navy, INK.red, INK.soft],
      unit,
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.faint } },
      axisTick: { show: false },
      axisLabel: { color: INK.soft, fontFamily: MONO, fontSize: 9, interval: 0 },
      nameTextStyle: { color: INK.soft, fontFamily: MONO, fontSize: 9 },
    };
    const echSeries = (base.series as Rec[]).map((s) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      ...(s.id === 'budget'
        ? { lineStyle: { ...(s.lineStyle as Rec), width: 1, type: 'dashed', color: INK.soft } }
        : { lineStyle: { ...(s.lineStyle as Rec), width: 2 } }),
    }));
    return {
      ...base,
      series: echSeries,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.soft },
      legend:
        series.length > 1
          ? {
              top: 0,
              icon: 'rect',
              itemWidth: 12,
              itemHeight: 2,
              textStyle: { color: INK.soft, fontFamily: MONO, fontSize: 9 },
            }
          : undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fbf7ec',
        borderColor: INK.faint,
        textStyle: { color: INK.navy, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 44, right: 16, top: series.length > 1 ? 30 : 16, bottom: 30, containLabel: true },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk,
        axisLabel: {
          ...axisInk.axisLabel,
          formatter: (value: string) => (value.length === 10 ? value.slice(8, 10) + '/' + value.slice(5, 7) : value),
        },
        splitLine: { show: false },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        ...(yBounds?.min !== undefined ? { min: yBounds.min } : {}),
        ...(yBounds?.max !== undefined ? { max: yBounds.max } : {}),
        splitLine: { lineStyle: { color: INK.grid } },
      },
    } as ChartOption;
  }, [series, reduced, unit, yBounds]);
}

function FigurePlate({
  meta,
  series,
  unit,
  reduced,
  tilt,
  yBounds,
}: {
  meta: { title: string; caption: string; source: string };
  series: readonly TrendChartSeriesInput[];
  unit?: string;
  reduced: boolean;
  tilt: string;
  yBounds?: { min?: number; max?: number };
}) {
  const option = usePlateOption(series, reduced, unit, yBounds);
  const table = useMemo(() => buildTrendChartTable([...series]), [series]);
  return (
    <figure className="bj-plate" style={{ ['--bj-tilt' as string]: tilt }}>
      <span className="bj-tape bj-tape-tl" aria-hidden="true" />
      <span className="bj-tape bj-tape-br" aria-hidden="true" />
      <ChartFigure
        title={meta.title}
        sourceNote={meta.source}
        option={option}
        tableColumns={table.columns}
        tableRows={table.rows}
        height={210}
        reducedMotion={reduced}
        className="bj-plate-chart"
      />
      <figcaption className="bj-plate-caption">{meta.caption}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function BenchJournalPage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Bench Journal — Sana Okonkwo — Live';
  }, []);

  const items = useMemo<LedgerRevealItem[]>(
    () => [
      {
        id: 'entries-head',
        content: (
          <div className="bj-run-head">
            <h2 className="bj-run-title">THE RUN</h2>
            <span className="bj-run-sub" aria-hidden="true">
              HYPOTHESIS · METHOD · RESULT · VERDICT — NEWEST FIRST
            </span>
          </div>
        ),
      },
      ...ENTRIES.map((entry) => ({
        id: `entry-${entry.no}`,
        content: <Entry entry={entry} />,
      })),
      {
        id: 'plates',
        content: (
          <section className="bj-plates" aria-labelledby="bj-plates-heading">
            <h2 id="bj-plates-heading" className="bj-section-heading">
              FIGURE PLATES
              <span className="bj-section-sub">TAPED IN · FULLER EXHIBITS WITH THEIR DATA TABLES</span>
            </h2>
            <div className="bj-plate-grid">
              <FigurePlate
                meta={PLATE_RECALL}
                series={PLATE_RECALL_SERIES}
                reduced={reduced}
                tilt="-0.5deg"
                yBounds={{ min: 0.6, max: 0.82 }}
              />
              <FigurePlate
                meta={PLATE_LATENCY}
                series={PLATE_LATENCY_SERIES}
                unit="ms"
                reduced={reduced}
                tilt="0.4deg"
              />
            </div>
          </section>
        ),
      },
      {
        id: 'index',
        content: (
          <section className="bj-index" aria-labelledby="bj-index-heading">
            <h2 id="bj-index-heading" className="bj-section-heading">
              INDEX CARD
              <span className="bj-section-sub">TOPICS → ENTRIES · THE NOTEBOOK’S TABLE OF CONTENTS</span>
            </h2>
            <dl className="bj-index-list" data-testid="index-card">
              {INDEX.map((row) => (
                <div key={row.topic} className="bj-index-row">
                  <dt>{row.topic}</dt>
                  <dd>
                    <span className="bj-index-entries">
                      {row.entries.map((n) => `№${n}`).join(' · ')}
                    </span>
                    <span className="bj-index-note">{row.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ),
      },
      {
        id: 'question',
        content: (
          <section className="bj-question" aria-labelledby="bj-question-heading">
            <h2 id="bj-question-heading" className="bj-question-heading">
              {CURRENT_QUESTION.heading}
            </h2>
            <p className="bj-question-body">{CURRENT_QUESTION.body}</p>
            <p className="bj-question-ask">{CURRENT_QUESTION.ask}</p>
          </section>
        ),
      },
    ],
    [reduced],
  );

  return (
    <div className="bj-root" data-testid="live-journal" data-reduced={reduced ? 'true' : undefined}>
      <div className="bj-paper" aria-hidden="true" />
      <header className="bj-chrome" aria-label="Journal chrome">
        <div className="bj-chrome-cell">
          <RouterLink to="/" className="bj-back">
            ◄ GALLERY
          </RouterLink>
          <span className="bj-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="bj-chrome-cell">
          <span className="bj-chrome-open">{CHROME.status}</span>
          <span className="bj-chrome-rule" aria-hidden="true" />
          <span className="bj-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="bj-main">
        <section className="bj-head" aria-labelledby="bj-name">
          <p className="bj-kicker">{PERSON.notebook} · {PERSON.opened}</p>
          <h1 id="bj-name" className="bj-name">
            {PERSON.name}
          </h1>
          <p className="bj-discipline">
            {PERSON.discipline.toUpperCase()} · {PERSON.team.toUpperCase()}
          </p>
          <p className="bj-standfirst">{JOURNAL_STANDFIRST}</p>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            member of staff. Experiments, figures and results are sample content.
          </VisuallyHidden>
        </section>

        <LedgerReveal className="bj-reveal" items={items} />
      </main>

      <footer className="bj-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>{PERSON.notebook} · NOTHING ERASED, ONLY CORRECTED</span>
      </footer>
    </div>
  );
}
