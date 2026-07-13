/**
 * "The Long Signal" — the live full-bleed rendering of
 * `deck-analytics-deep-dive`.
 *
 * An analytics deep-dive staged as an observatory. ONE dataset — 52 weeks of
 * checkout conversion (synthetic) — threads the whole deck as a persistent
 * bespoke chart band across the bottom of every slide, the SAME series
 * progressively annotated as the argument develops. The hero slide expands the
 * band to the full viewport as an INTERACTIVE INSTRUMENT: crosshair readout
 * (week, value, 7-day delta), a pinnable comparison marker, arrow-key week-
 * walking (scoped to the focused SVG so it never turns the slide), and a
 * `B`-toggled baseline overlay — all bespoke local SVG with an aria-live
 * readout and a hidden 52-row data table.
 *
 * Anomaly (verbatim): a week-37 regime change flagged
 * `WEEK 37 REGIME CHANGE — FLAGGED, NOT SMOOTHED` — a level shift kept in
 * every summary statistic, never smoothed away.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (dark) is locked by
 * LiveExperience — not re-locked here. A comp.trend-chart carries the cohort
 * comparison; a comp.kpi-tile row carries the effect sizes.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { KpiTile } from '@enterprise-design/content-components';
import { ChartFigure, buildTrendChartOption, buildTrendChartTable } from '@enterprise-design/data-viz';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './long-signal.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  ANOMALY,
  ANOMALY_SLIDE,
  ANOMALY_TEXT,
  COHORT,
  COHORTS,
  DATASET,
  DECK,
  DECOMP_STRIPS,
  DRIVERS,
  INSTRUMENT,
  INSTRUMENT_SLIDE_NUMBER,
  POINTS01,
  POST_MEAN,
  PRE_MEAN,
  QUESTION,
  RECOMMENDATION,
  SEASONALITY,
  SERIES_MEAN,
  SHIFT_DELTA,
  SHIFT_WEEK,
  SLIDES,
  SLIDE_COUNT,
  THESIS,
  UNKNOWN,
  VALUE_MAX,
  VALUE_MIN,
  WEEKS,
} from './content.js';
import type { DecompStrip, Slide } from './content.js';

/* ------------------------------------------------------------------ */
/* Shared line geometry — every renderer maps POINTS01 into a viewBox   */
/* ------------------------------------------------------------------ */

const SHIFT_INDEX = SHIFT_WEEK - 1;

function buildPath(
  points: readonly (readonly [number, number])[],
  sx: (x: number) => number,
  sy: (y: number) => number,
  from = 0,
  to = points.length - 1,
): string {
  let d = '';
  for (let i = from; i <= to; i += 1) {
    const [x, y] = points[i] as readonly [number, number];
    d += `${i === from ? 'M' : 'L'} ${sx(x).toFixed(2)} ${sy(y).toFixed(2)} `;
  }
  return d.trim();
}

/* ------------------------------------------------------------------ */
/* Build wrapper                                                       */
/* ------------------------------------------------------------------ */

function Build({
  i,
  children,
  className,
  testid,
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  testid?: string;
}) {
  return (
    <div className={className ? `ls-build ${className}` : 'ls-build'} style={{ ['--ls-i' as string]: i }} data-testid={testid}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The persistent band — the SAME series on every slide                */
/* ------------------------------------------------------------------ */

const BAND_W = 1000;
const BAND_H = 150;
const BAND_PAD = { l: 8, r: 8, t: 18, b: 22 };
const bandPW = BAND_W - BAND_PAD.l - BAND_PAD.r;
const bandPH = BAND_H - BAND_PAD.t - BAND_PAD.b;
const bandX = (x01: number) => BAND_PAD.l + x01 * bandPW;
const bandY = (y01: number) => BAND_PAD.t + (1 - y01) * bandPH;

function weekX(week: number): number {
  return bandX((week - 1) / (WEEKS.length - 1));
}

function SignalBand({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  const region = slide.region;
  const regionFrom = region ? region.from : 0;
  const regionTo = region ? region.to : 0;
  const preTo = SHIFT_INDEX; // last pre-shift index (week 36)
  return (
    <div className={reduced ? 'ls-band ls-band-static' : 'ls-band'} data-band-mode={slide.mode}>
      <svg
        className="ls-band-svg"
        viewBox={`0 0 ${BAND_W} ${BAND_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Checkout conversion, 52 weeks. Mean ${SERIES_MEAN}%. A level shift at week ${SHIFT_WEEK}: from ${PRE_MEAN}% before to ${POST_MEAN}% after. ${ANOMALY_TEXT}.`}
        data-testid="signal-band"
      >
        {/* baseline grid */}
        <line className="ls-band-base" x1={BAND_PAD.l} y1={bandY(0)} x2={BAND_W - BAND_PAD.r} y2={bandY(0)} />
        {/* the pre-shift line */}
        <path className="ls-band-line" d={buildPath(POINTS01, bandX, bandY, 0, preTo)} />
        {/* the regime segment — always drawn in the flag colour */}
        <path className="ls-band-line ls-band-flag" d={buildPath(POINTS01, bandX, bandY, preTo, POINTS01.length - 1)} />
        {/* the week-37 marker, permanent */}
        <line className="ls-band-shift" x1={weekX(SHIFT_WEEK)} y1={BAND_PAD.t - 6} x2={weekX(SHIFT_WEEK)} y2={BAND_H - BAND_PAD.b + 4} />
        {/* the lit region for THIS slide */}
        {region ? (
          <path
            className="ls-band-lit"
            data-mode={slide.mode}
            d={buildPath(
              POINTS01,
              bandX,
              bandY,
              regionFrom - 1,
              regionTo - 1,
            )}
          />
        ) : null}
      </svg>
      {slide.bandNote ? (
        <div className="ls-band-note" data-mode={slide.mode} data-testid="band-note">
          <span className="ls-band-note-tick" aria-hidden="true">
            {region ? `W${String(regionFrom).padStart(2, '0')}–W${String(regionTo).padStart(2, '0')}` : `W01–W${WEEKS.length}`}
          </span>
          <span className="ls-band-note-text">{slide.bandNote}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The interactive instrument (hero)                                   */
/* ------------------------------------------------------------------ */

const VB_W = 1000;
const VB_H = 440;
const PAD = { l: 66, r: 40, t: 30, b: 52 };
const plotW = VB_W - PAD.l - PAD.r;
const plotH = VB_H - PAD.t - PAD.b;
const sx = (x01: number) => PAD.l + x01 * plotW;
const sy = (y01: number) => PAD.t + (1 - y01) * plotH;
const iWeekX = (week: number) => sx((week - 1) / (WEEKS.length - 1));
const valueToY01 = (value: number) => (value - VALUE_MIN) / (VALUE_MAX - VALUE_MIN);
const iValueY = (value: number) => sy(valueToY01(value));

const Y_TICKS = (() => {
  const ticks: number[] = [];
  for (let v = Math.ceil(VALUE_MIN * 2) / 2; v <= VALUE_MAX; v += 0.5) ticks.push(Number(v.toFixed(1)));
  return ticks;
})();
const X_TICKS = [1, 10, 20, 30, 37, 45, 52];

function Instrument({ reduced }: { reduced: boolean }) {
  const [readout, setReadout] = useState(SHIFT_INDEX); // opens on the anomaly week
  const [pinned, setPinned] = useState<number | null>(null);
  const [baseline, setBaseline] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const clampIdx = (n: number) => Math.max(0, Math.min(WEEKS.length - 1, n));
  const current = WEEKS[readout]!;
  const pinnedWeek = pinned !== null ? WEEKS[pinned]! : null;
  const pinDelta = pinnedWeek ? Number((current.value - pinnedWeek.value).toFixed(2)) : null;

  const walk = (delta: number) => setReadout((r) => clampIdx(r + delta));

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        e.stopPropagation();
        walk(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        e.stopPropagation();
        walk(-1);
        break;
      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        setReadout(0);
        break;
      case 'End':
        e.preventDefault();
        e.stopPropagation();
        setReadout(WEEKS.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.stopPropagation();
        setPinned((p) => (p === readout ? null : readout));
        break;
      case 'b':
      case 'B':
        e.preventDefault();
        e.stopPropagation();
        setBaseline((b) => !b);
        break;
      default:
        break;
    }
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const frac = (e.clientX - rect.left) / rect.width;
    const idx = clampIdx(Math.round(frac * (WEEKS.length - 1)));
    setReadout(idx);
  };

  const preMeanY = iValueY(PRE_MEAN);
  const readoutText = `Week ${current.week}: ${current.value.toFixed(2)}% · 7-day change ${
    current.delta === null ? 'n/a' : `${current.delta > 0 ? '+' : ''}${current.delta.toFixed(2)} pp`
  }${pinnedWeek && pinDelta !== null ? ` · vs week ${pinnedWeek.week}: ${pinDelta > 0 ? '+' : ''}${pinDelta.toFixed(2)} pp` : ''}`;

  return (
    <div className="ls-instrument" data-testid="instrument-panel">
      <div className="ls-inst-chartwrap">
        <svg
          ref={svgRef}
          className={reduced ? 'ls-inst-svg ls-inst-static' : 'ls-inst-svg'}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="application"
          tabIndex={0}
          aria-label={`Interactive checkout-conversion instrument. Fifty-two weekly observations. ${INSTRUMENT.help} Currently reading week ${current.week}, ${current.value.toFixed(2)} percent.`}
          data-testid="instrument"
          onKeyDown={onKeyDown}
          onPointerMove={onMove}
          onClick={() => setPinned((p) => (p === readout ? null : readout))}
        >
          {/* y grid */}
          {Y_TICKS.map((v) => (
            <g key={`y${v}`}>
              <line className="ls-inst-grid" x1={PAD.l} y1={iValueY(v)} x2={VB_W - PAD.r} y2={iValueY(v)} />
              <text className="ls-inst-ytick" x={PAD.l - 10} y={iValueY(v) + 4} textAnchor="end">
                {v.toFixed(1)}%
              </text>
            </g>
          ))}
          {/* x ticks */}
          {X_TICKS.map((w) => (
            <text key={`x${w}`} className="ls-inst-xtick" x={iWeekX(w)} y={VB_H - PAD.b + 24} textAnchor="middle">
              W{String(w).padStart(2, '0')}
            </text>
          ))}
          {/* regime marker */}
          <line className="ls-inst-shift" x1={iWeekX(SHIFT_WEEK)} y1={PAD.t} x2={iWeekX(SHIFT_WEEK)} y2={VB_H - PAD.b} />
          <text className="ls-inst-shift-label" x={iWeekX(SHIFT_WEEK) + 8} y={PAD.t + 16} textAnchor="start">
            WK 37 REGIME CHANGE
          </text>
          {/* permanent level references — the two regimes, self-evident at rest */}
          <line className="ls-inst-mean ls-inst-mean-pre" x1={iWeekX(1)} y1={iValueY(PRE_MEAN)} x2={iWeekX(SHIFT_WEEK)} y2={iValueY(PRE_MEAN)} />
          <text className="ls-inst-mean-label ls-inst-mean-label-pre" x={iWeekX(SHIFT_WEEK) - 8} y={iValueY(PRE_MEAN) - 7} textAnchor="end">
            PRE {PRE_MEAN}%
          </text>
          <line className="ls-inst-mean ls-inst-mean-post" x1={iWeekX(SHIFT_WEEK)} y1={iValueY(POST_MEAN)} x2={iWeekX(WEEKS.length)} y2={iValueY(POST_MEAN)} />
          <text className="ls-inst-mean-label ls-inst-mean-label-post" x={iWeekX(WEEKS.length)} y={iValueY(POST_MEAN) + 18} textAnchor="end">
            POST {POST_MEAN}%
          </text>
          {/* baseline overlay (B) */}
          {baseline ? (
            <g className="ls-inst-baseline" data-testid="baseline-overlay">
              <line className="ls-inst-baseline-line" x1={PAD.l} y1={preMeanY} x2={VB_W - PAD.r} y2={preMeanY} />
              <text className="ls-inst-baseline-label" x={VB_W - PAD.r} y={preMeanY - 8} textAnchor="end">
                PRE-SHIFT BASELINE {PRE_MEAN}%
              </text>
            </g>
          ) : null}
          {/* the line: pre-shift then regime segment */}
          <path className="ls-inst-line" d={buildPath(POINTS01, sx, sy, 0, SHIFT_INDEX)} />
          <path className="ls-inst-line ls-inst-line-flag" d={buildPath(POINTS01, sx, sy, SHIFT_INDEX, POINTS01.length - 1)} />
          {/* pinned comparison marker */}
          {pinnedWeek ? (
            <g className="ls-inst-pin" data-testid="instrument-pin">
              <line className="ls-inst-pin-line" x1={iWeekX(pinnedWeek.week)} y1={PAD.t} x2={iWeekX(pinnedWeek.week)} y2={VB_H - PAD.b} />
              <rect
                className="ls-inst-pin-dot"
                x={iWeekX(pinnedWeek.week) - 5}
                y={iValueY(pinnedWeek.value) - 5}
                width={10}
                height={10}
                transform={`rotate(45 ${iWeekX(pinnedWeek.week)} ${iValueY(pinnedWeek.value)})`}
              />
            </g>
          ) : null}
          {/* crosshair + readout dot */}
          <line className="ls-inst-cross" x1={iWeekX(current.week)} y1={PAD.t} x2={iWeekX(current.week)} y2={VB_H - PAD.b} />
          <circle className="ls-inst-dot" cx={iWeekX(current.week)} cy={iValueY(current.value)} r={6} />
        </svg>
      </div>

      {/* the mono readout — pinned above the line */}
      <div className="ls-inst-readout" data-testid="instrument-readout-panel">
        <div className="ls-inst-readout-main">
          <span className="ls-inst-readout-week">W{String(current.week).padStart(2, '0')}</span>
          <span className="ls-inst-readout-value">{current.value.toFixed(2)}%</span>
          <span className="ls-inst-readout-delta" data-dir={current.delta === null ? 'flat' : current.delta >= 0 ? 'up' : 'down'}>
            {current.delta === null ? '—' : `${current.delta > 0 ? '+' : ''}${current.delta.toFixed(2)} pp / wk`}
          </span>
        </div>
        <dl className="ls-inst-readout-stats" aria-hidden="true">
          <div>
            <dt>PRE-SHIFT</dt>
            <dd>{PRE_MEAN}%</dd>
          </div>
          <div>
            <dt>POST-SHIFT</dt>
            <dd className="ls-inst-stat-flag">{POST_MEAN}%</dd>
          </div>
          <div>
            <dt>LEVEL Δ</dt>
            <dd className="ls-inst-stat-flag">{SHIFT_DELTA.toFixed(2)} pp</dd>
          </div>
        </dl>
        <div className="ls-inst-readout-aux">
          {pinnedWeek && pinDelta !== null ? (
            <span className="ls-inst-readout-pin">
              vs W{String(pinnedWeek.week).padStart(2, '0')} ({pinnedWeek.value.toFixed(2)}%):{' '}
              <strong data-dir={pinDelta >= 0 ? 'up' : 'down'}>
                {pinDelta > 0 ? '+' : ''}
                {pinDelta.toFixed(2)} pp
              </strong>
            </span>
          ) : (
            <span className="ls-inst-readout-hint">{INSTRUMENT.help}</span>
          )}
        </div>
      </div>

      {/* aria-live mirror for keyboard / AT users */}
      <VisuallyHidden>
        <span aria-live="polite" data-testid="instrument-readout">
          {readoutText}
        </span>
      </VisuallyHidden>

      {/* the hidden 52-row data table — the accessible equivalent */}
      <VisuallyHidden>
        <table data-testid="signal-table">
          <caption>Checkout conversion by week — synthetic series, 52 observations</caption>
          <thead>
            <tr>
              <th scope="col">Week</th>
              <th scope="col">Conversion %</th>
              <th scope="col">7-day change (pp)</th>
              <th scope="col">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {WEEKS.map((w) => (
              <tr key={w.week} data-week={w.week}>
                <th scope="row">W{String(w.week).padStart(2, '0')}</th>
                <td>{w.value.toFixed(2)}</td>
                <td>{w.delta === null ? '—' : w.delta.toFixed(2)}</td>
                <td>{w.n.toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </VisuallyHidden>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Decomposition small-multiple strips                                 */
/* ------------------------------------------------------------------ */

const STRIP_W = 640;
const STRIP_H = 96;
const stripX = (x01: number) => 6 + x01 * (STRIP_W - 12);
const stripY = (y01: number) => 12 + (1 - y01) * (STRIP_H - 24);

function DecompStripView({ strip }: { strip: DecompStrip }) {
  return (
    <svg
      className="ls-strip-svg"
      viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`${strip.label} component: ${strip.note}`}
    >
      <line className="ls-strip-mid" x1={6} y1={stripY(0.5)} x2={STRIP_W - 6} y2={stripY(0.5)} />
      <line className="ls-strip-shift" x1={stripX((SHIFT_WEEK - 1) / (WEEKS.length - 1))} y1={8} x2={stripX((SHIFT_WEEK - 1) / (WEEKS.length - 1))} y2={STRIP_H - 8} />
      <path
        className={strip.kind === 'remainder' ? 'ls-strip-line ls-strip-line-flag' : 'ls-strip-line'}
        d={buildPath(strip.points01, stripX, stripY, 0, strip.points01.length - 1)}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Cohort trend chart (comp.trend-chart)                               */
/* ------------------------------------------------------------------ */

const CYAN = '#5fd4d0';
const INK = '#e8e6df';
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const AXIS_INK = '#9aa2b0';
const GRID_INK = 'rgba(233, 230, 223, 0.10)';

function CohortChart({ reduced }: { reduced: boolean }) {
  const option = useMemo(() => {
    const base = buildTrendChartOption(COHORTS, {
      colors: [CYAN, INK],
      variant: 'line',
      unit: '%',
      yAxisLabel: 'Conversion %',
      reducedMotion: reduced,
      showAverageLine: false,
    });
    const axis = {
      axisLine: { lineStyle: { color: GRID_INK } },
      axisTick: { lineStyle: { color: GRID_INK } },
      axisLabel: { color: AXIS_INK, fontFamily: MONO, fontSize: 10 },
      nameTextStyle: { color: AXIS_INK, fontFamily: MONO },
    };
    return {
      ...base,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: AXIS_INK },
      xAxis: {
        ...base.xAxis,
        ...axis,
        axisLabel: { ...axis.axisLabel, interval: 3 },
        splitLine: { show: false },
      },
      yAxis: {
        ...base.yAxis,
        ...axis,
        splitLine: { lineStyle: { color: GRID_INK, type: 'dashed' } },
      },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 16,
        itemHeight: 2,
        itemGap: 24,
        textStyle: { color: INK, fontFamily: MONO, fontSize: 11 },
        data: COHORTS.map((c) => c.label),
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#10141c',
        borderColor: GRID_INK,
        textStyle: { color: INK, fontFamily: MONO, fontSize: 11 },
      },
    } as typeof base;
  }, [reduced]);
  const table = useMemo(() => buildTrendChartTable(COHORTS), []);
  return (
    <ChartFigure
      key={reduced ? 'r' : 'f'}
      title="Checkout conversion by cohort, 52 weeks"
      sourceNote={COHORT.note}
      option={option}
      tableColumns={table.columns}
      tableRows={table.rows}
      height={340}
      reducedMotion={reduced}
      className="ls-cohort-chart"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function KickerRow({ kicker }: { kicker: string }) {
  return (
    <Build i={0} className="ls-kickerrow">
      <span className="ls-kicker">{kicker}</span>
      <span className="ls-codename">{DECK.world}</span>
    </Build>
  );
}

function SlideBody({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="ls-cover">
          <Build i={0} className="ls-kickerrow">
            <span className="ls-kicker">{DECK.metric} · DEEP DIVE</span>
            <span className="ls-codename">{DECK.subject}</span>
          </Build>
          <h2 className="ls-display">
            <Build i={1}>
              <span className="ls-line">{THESIS.line1}</span>
            </Build>
            <Build i={2}>
              <span className="ls-line ls-accent">{THESIS.line2}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="ls-standfirst">{THESIS.standfirst}</p>
          </Build>
          <div className="ls-cover-band">
            <SignalBand slide={slide} reduced={reduced} />
          </div>
        </div>
      );

    case 'question':
      return (
        <div className="ls-prose-body">
          <KickerRow kicker={QUESTION.kicker} />
          <Build i={1}>
            <h2 className="ls-heading">{QUESTION.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="ls-body">{QUESTION.body}</p>
          </Build>
          <Build i={3} className="ls-aside-row">
            {QUESTION.asides.map((a) => (
              <div key={a.term} className="ls-aside">
                <span className="ls-aside-term">{a.term}</span>
                <span className="ls-aside-text">{a.text}</span>
              </div>
            ))}
          </Build>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );

    case 'dataset':
      return (
        <div className="ls-prose-body">
          <KickerRow kicker={DATASET.kicker} />
          <div className="ls-dataset-grid">
            <Build i={1}>
              <h2 className="ls-heading ls-heading-tight">{DATASET.heading}</h2>
              <dl className="ls-provenance" data-testid="provenance">
                {DATASET.provenance.map((p) => (
                  <div key={p.label} className="ls-prov-row">
                    <dt>{p.label}</dt>
                    <dd>{p.value}</dd>
                  </div>
                ))}
              </dl>
            </Build>
            <Build i={2} className="ls-fact-col">
              {DATASET.facts.map((f) => (
                <div key={f.cap} className="ls-fact">
                  <span className="ls-fact-stat">{f.stat}</span>
                  <span className="ls-fact-cap">{f.cap}</span>
                </div>
              ))}
            </Build>
          </div>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );

    case 'instrument':
      return (
        <div className="ls-inst-body">
          <Build i={0} className="ls-kickerrow">
            <span className="ls-kicker">{INSTRUMENT.kicker}</span>
            <span className="ls-codename">
              MEAN {SERIES_MEAN}% · {PRE_MEAN}→{POST_MEAN}% ACROSS WK 37
            </span>
          </Build>
          <Build i={1}>
            <h2 className="ls-heading ls-heading-tight">{INSTRUMENT.heading}</h2>
          </Build>
          <Build i={2} className="ls-inst-frame">
            <Instrument reduced={reduced} />
          </Build>
        </div>
      );

    case 'seasonality':
      return (
        <div className="ls-prose-body">
          <KickerRow kicker={SEASONALITY.kicker} />
          <Build i={1}>
            <h2 className="ls-heading ls-heading-tight">{SEASONALITY.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="ls-body ls-body-wide">{SEASONALITY.body}</p>
          </Build>
          <Build i={3} className="ls-strips">
            {DECOMP_STRIPS.map((strip) => (
              <div key={strip.id} className="ls-strip">
                <div className="ls-strip-head">
                  <span className="ls-strip-label">{strip.label}</span>
                  <span className="ls-strip-note">{strip.note}</span>
                </div>
                <DecompStripView strip={strip} />
              </div>
            ))}
          </Build>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );

    case 'anomaly':
      return (
        <div className="ls-prose-body">
          <KickerRow kicker={ANOMALY_SLIDE.kicker} />
          <div className="ls-anomaly-grid">
            <Build i={1}>
              <p className="ls-flag" data-testid="anomaly-flag">
                <span className="ls-flag-badge">FLAG</span>
                {ANOMALY.flag}
              </p>
              <h2 className="ls-heading ls-heading-tight">{ANOMALY.headline}</h2>
              <p className="ls-body">{ANOMALY.body}</p>
            </Build>
            <Build i={2} className="ls-anomaly-aside">
              <div className="ls-anomaly-card">
                <span className="ls-anomaly-card-term">DISCIPLINE</span>
                <p>{ANOMALY.discipline}</p>
              </div>
              <div className="ls-anomaly-card">
                <span className="ls-anomaly-card-term">SUSPECTED CAUSE</span>
                <p>{ANOMALY.cause}</p>
              </div>
              <div className="ls-shift-stat">
                <span className="ls-shift-stat-value">{SHIFT_DELTA.toFixed(2)} pp</span>
                <span className="ls-shift-stat-cap">sustained level shift · {PRE_MEAN}% → {POST_MEAN}%</span>
              </div>
            </Build>
          </div>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );

    case 'cohort':
      return (
        <div className="ls-prose-body">
          <KickerRow kicker={COHORT.kicker} />
          <div className="ls-cohort-grid">
            <Build i={1} className="ls-cohort-aside">
              <h2 className="ls-heading ls-heading-tight">{COHORT.heading}</h2>
              <p className="ls-body">{COHORT.body}</p>
            </Build>
            <Build i={2} className="ls-cohort-frame" testid="cohort-chart">
              <CohortChart reduced={reduced} />
            </Build>
          </div>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );

    case 'drivers':
      return (
        <div className="ls-prose-body">
          <KickerRow kicker={DRIVERS.kicker} />
          <Build i={1}>
            <h2 className="ls-heading ls-heading-tight">{DRIVERS.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="ls-body ls-body-wide">{DRIVERS.body}</p>
          </Build>
          <Build i={3} className="ls-kpi-frame" testid="drivers-kpi">
            <KpiTile title="Attributed effect sizes on checkout conversion" metrics={[...DRIVERS.effects]} />
          </Build>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );

    case 'unknown':
      return (
        <div className="ls-prose-body">
          <KickerRow kicker={UNKNOWN.kicker} />
          <Build i={1}>
            <h2 className="ls-heading ls-heading-tight">{UNKNOWN.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="ls-body ls-body-wide">{UNKNOWN.body}</p>
          </Build>
          <Build i={3} className="ls-unknown-grid">
            {UNKNOWN.items.map((it) => (
              <div key={it.term} className="ls-unknown-card">
                <span className="ls-unknown-term">{it.term}</span>
                <p className="ls-unknown-text">{it.text}</p>
              </div>
            ))}
          </Build>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );

    case 'recommendation':
      return (
        <div className="ls-closing">
          <Build i={0} className="ls-kickerrow">
            <span className="ls-kicker">{RECOMMENDATION.kicker}</span>
          </Build>
          <h2 className="ls-monument">
            <Build i={1}>
              <span className="ls-line">{RECOMMENDATION.line1}</span>
            </Build>
            <Build i={2}>
              <span className="ls-line ls-accent">{RECOMMENDATION.line2}</span>
            </Build>
          </h2>
          <Build i={3}>
            <p className="ls-standfirst ls-standfirst-wide">{RECOMMENDATION.standfirst}</p>
          </Build>
          <Build i={4} className="ls-action-list">
            <ol>
              {RECOMMENDATION.actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
            <div className="ls-monitor">
              <span className="ls-monitor-label">{RECOMMENDATION.monitor.label}</span>
              <span className="ls-monitor-value">{RECOMMENDATION.monitor.value}</span>
            </div>
          </Build>
          <SignalBand slide={slide} reduced={reduced} />
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function LongSignalPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Long Signal — CHECKOUT CONVERSION — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) return;
      if (target && typeof target.getAttribute === 'function' && target.getAttribute('role') === 'application') {
        return;
      }
      if (event.key === 'i' || event.key === 'I') goTo(INSTRUMENT_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="ls-root" data-testid="live-long-signal" data-reduced={reduced ? 'true' : undefined}>
      <div className="ls-grain" aria-hidden="true" />

      <header className="ls-chrome ls-chrome-top" aria-label="Deck chrome">
        <div className="ls-chrome-cell">
          <RouterLink to="/" className="ls-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ls-chrome-rule" aria-hidden="true" />
          <span>
            {DECK.code} · {DECK.world}
          </span>
        </div>
        <div className="ls-chrome-cell">
          <span data-testid="signal-counter" aria-live="polite">
            {counter} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="ls-main">
        <h1>
          <VisuallyHidden>
            The Long Signal — an analytics deep-dive reading 52 weeks of checkout conversion
            (synthetic) as one continuous line, threaded across every slide and expanded on the
            instrument slide into a keyboard-operable chart. A level shift at week 37 is kept in
            view, not smoothed: “{ANOMALY_TEXT}”. Slide {activeNumber} of {SLIDE_COUNT}:{' '}
            {activeSlide.section}.
          </VisuallyHidden>
        </h1>

        <div className="ls-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="ls-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="ls-slide-inner">
                  <SlideBody slide={slide} reduced={reduced} />
                </div>
                <div className="ls-print-foot" aria-hidden="true">
                  {DECK.code} · {DECK.world} · {slide.section} · SLIDE{' '}
                  {String(index + 1).padStart(2, '0')} / {SLIDE_COUNT} · {DECK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="ls-chrome ls-chrome-bottom" aria-label="Deck controls">
        <span className="ls-notice" data-testid="data-notice">
          {DECK.dataNotice}
        </span>
        <div className="ls-footer-nav">
          <span className="ls-hint">{DECK.keyboardHint}</span>
          <button
            type="button"
            className="ls-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="ls-nav-btn"
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
