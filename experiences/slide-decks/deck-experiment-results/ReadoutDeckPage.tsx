/**
 * "The Readout" — the live full-bleed rendering of `deck-experiment-results`.
 *
 * A quarter of experiment results as a bench-oscilloscope READOUT session:
 * near-black instrument field, phosphor-teal traces, a faint graticule and a
 * restrained scanline. Each reading states a hypothesis, draws its trace
 * (TrendChart / CategoryBarChart, data-ink-draw on entry), counts a RESULT
 * NUMERAL up once to its value and holds, and shows a shape-and-word-coded
 * verdict plate. One reading is the anomaly: a statistically significant win
 * WITHHELD because a guardrail regressed. The board is the accessible mirror.
 * Keyboard-driven (←/→/Home/End, W jumps to the withheld reading), `?slide=`
 * deep-linkable, printable one reading per page.
 *
 * Art-direction licence (task 16): this file and readout.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven; reduced motion holds the numeral at its
 * final value and collapses slide turns to stepped opacity.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference, durationsMs } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-mono/700.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import './readout.css';
import {
  SESSION,
  LEDGER,
  READINGS,
  BOARD,
  METHOD,
  SLIDES,
  SLIDE_COUNT,
  VERDICT_LABEL,
  VERDICT_GLYPH,
  readingById,
  slideNumberForId,
} from './content.js';
import type { Reading, ReadingChart, Slide, Numeral } from './content.js';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  phos: '#57f2c2',
  phosDim: '#2f8f74',
  warn: '#f0a24a',
  kill: '#7c96a0',
  muted: '#6f8f86',
  ink: '#dff3ec',
  grid: 'rgba(87, 242, 194, 0.12)',
  gridSoft: 'rgba(87, 242, 194, 0.08)',
} as const;

type Rec = Record<string, unknown>;

/* ---------------------------------------------------------------- */
/* Build wrapper                                                   */
/* ---------------------------------------------------------------- */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
  ...rest
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
} & Record<string, unknown>) {
  return (
    <Tag
      className={className ? `rd-build ${className}` : 'rd-build'}
      style={{ ['--rd-i' as string]: i }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* The result numeral — counts up ONCE, then holds                 */
/* ---------------------------------------------------------------- */

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, active: boolean, reduced: boolean): number {
  // `animated` is only ever written from inside the rAF callback (async), so no
  // synchronous setState in the effect body. The static cases — reduced motion,
  // parked-before-first-view, and finished — are derived during render.
  const [animated, setAnimated] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced || !active || done.current) return;
    const duration = durationsMs.narrative * 1.4;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      setAnimated(target * easeOutCubic(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        done.current = true;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, target]);

  if (reduced || done.current) return target;
  if (!active) return 0;
  return animated;
}

function ResultNumeral({
  numeral,
  verdict,
  active,
  reduced,
}: {
  numeral: Numeral;
  verdict: Reading['verdict'];
  active: boolean;
  reduced: boolean;
}) {
  const value = useCountUp(numeral.value, active, reduced);
  return (
    <div className="rd-numeral-block">
      <span className="rd-numeral" data-verdict={verdict} data-testid="result-numeral">
        <span aria-hidden={reduced ? undefined : 'true'}>
          {numeral.sign}
          {value.toFixed(numeral.decimals)}
        </span>
        <span className="rd-numeral-suffix">{numeral.suffix}</span>
        {!reduced ? (
          <VisuallyHidden>
            {numeral.sign}
            {numeral.value.toFixed(numeral.decimals)}
            {numeral.suffix}
          </VisuallyHidden>
        ) : null}
      </span>
      <span className="rd-numeral-metric">{numeral.metric}</span>
      <span className="rd-numeral-bar">{numeral.bar}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Charts                                                          */
/* ---------------------------------------------------------------- */

function axisInk(size = 10) {
  return {
    axisLine: { lineStyle: { color: INK.grid } },
    axisTick: { show: false },
    axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: size },
    nameTextStyle: { color: INK.muted, fontFamily: MONO },
  };
}

function markLineFor(chart: ReadingChart) {
  if (!chart.markLine) return undefined;
  const tone = chart.markLine.tone === 'guard' ? INK.warn : INK.phos;
  return {
    silent: true,
    symbol: 'none',
    lineStyle: { color: tone, type: 'dashed', width: 1.2 },
    label: {
      show: true,
      position: 'insideEndTop',
      color: tone,
      fontFamily: MONO,
      fontSize: 10,
      formatter: chart.markLine.label,
    },
    data: [{ yAxis: chart.markLine.value }],
  };
}

function useReadingOption(reading: Reading, reduced: boolean): ChartOption {
  return useMemo(() => {
    const chart = reading.chart;
    if (chart.kind === 'trend') {
      const base = buildTrendChartOption([...chart.series], {
        colors: [INK.phos, INK.warn],
        unit: chart.unit,
        reducedMotion: reduced,
        showAverageLine: false,
      }) as Rec;
      // When a guardrail is in play the two series live on different scales:
      // the primary (fraud loss, big) on the left axis and the deciding
      // guardrail metric (holds, small) on its OWN right axis, so the breach
      // against the guardrail line is legible rather than flattened to nothing.
      const guardAxis = chart.series.length > 1 && chart.markLine?.tone === 'guard';
      const guardMark = guardAxis && chart.markLine ? markLineFor(chart) : undefined;
      const series = (base.series as Rec[]).map((s, i) => ({
        ...s,
        symbolSize: 6,
        lineStyle: { ...(s.lineStyle as Rec), width: i === 0 ? 2.6 : 2.2 },
        ...(guardAxis && i === 1 ? { yAxisIndex: 1, markLine: guardMark } : {}),
        ...(!guardAxis && i === 0 && chart.markLine ? { markLine: markLineFor(chart) } : {}),
      }));
      const leftAxis = {
        ...(base.yAxis as Rec),
        ...axisInk(),
        ...(chart.yMin !== undefined ? { min: chart.yMin } : {}),
        ...(chart.yMax !== undefined ? { max: chart.yMax } : {}),
        splitLine: { lineStyle: { color: INK.gridSoft, type: 'dashed' } },
      };
      const rightAxis = {
        type: 'value',
        position: 'right',
        name: 'holds %',
        min: 0,
        max: 1,
        ...axisInk(),
        axisLabel: { color: INK.warn, fontFamily: MONO, fontSize: 10, formatter: '{value}%' },
        nameTextStyle: { color: INK.warn, fontFamily: MONO },
        splitLine: { show: false },
      };
      return {
        ...base,
        series,
        backgroundColor: 'transparent',
        textStyle: { fontFamily: MONO, color: INK.muted },
        legend:
          chart.series.length > 1
            ? {
                top: 0,
                icon: 'rect',
                itemWidth: 14,
                itemHeight: 2,
                itemGap: 22,
                textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
              }
            : undefined,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#0a1117',
          borderColor: INK.grid,
          textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
        },
        grid: { left: 46, right: guardAxis ? 52 : 22, top: chart.series.length > 1 ? 42 : 24, bottom: 30, containLabel: true },
        xAxis: { ...(base.xAxis as Rec), ...axisInk(), splitLine: { show: false } },
        yAxis: guardAxis ? [leftAxis, rightAxis] : leftAxis,
      } as ChartOption;
    }
    // bar
    const base = buildCategoryBarChartOption([...chart.data], {
      colors: [INK.phos, INK.phosDim],
      unit: chart.unit,
      reducedMotion: reduced,
    }) as Rec;
    const series = (base.series as Rec[]).map((s) => {
      if (s.id === 'value') {
        return {
          ...s,
          data: chart.data.map((d) => ({
            value: d.value,
            itemStyle: {
              color: (d.value ?? 0) >= (chart.markLine?.value ?? Infinity) ? INK.phos : INK.phosDim,
              borderRadius: [2, 2, 0, 0],
            },
          })),
          label: {
            show: true,
            position: 'top',
            color: INK.ink,
            fontFamily: MONO,
            fontSize: 10,
            formatter: (p: { value: number }) => `${p.value > 0 ? '+' : ''}${p.value}%`,
          },
          ...(chart.markLine ? { markLine: markLineFor(chart) } : {}),
        };
      }
      return { ...s, itemStyle: { color: INK.phosDim } };
    });
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0a1117',
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 44, right: 20, top: 26, bottom: 34, containLabel: true },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk(11),
        // Every segment stays named on the category axis.
        axisLabel: { ...axisInk(11).axisLabel, interval: 0 },
        splitLine: { show: false },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk(),
        ...(chart.yMin !== undefined ? { min: chart.yMin } : {}),
        ...(chart.yMax !== undefined ? { max: chart.yMax } : {}),
        splitLine: { lineStyle: { color: INK.gridSoft, type: 'dashed' } },
      },
    } as ChartOption;
  }, [reading, reduced]);
}

function readingTable(reading: Reading) {
  const chart = reading.chart;
  if (chart.kind === 'trend') return buildTrendChartTable([...chart.series]);
  return buildCategoryBarChartTable([...chart.data], chart.unit);
}

/* ---------------------------------------------------------------- */
/* Reading body                                                    */
/* ---------------------------------------------------------------- */

function ReadingBody({ reading, reduced, active }: { reading: Reading; reduced: boolean; active: boolean }) {
  const option = useReadingOption(reading, reduced);
  const table = useMemo(() => readingTable(reading), [reading]);
  return (
    <div className="rd-reading-grid">
      <div className="rd-reading-side rd-body" data-verdict={reading.verdict}>
        <Build i={0}>
          <p className="rd-reading-no">{reading.no}</p>
        </Build>
        <Build i={1}>
          <p className="rd-hypothesis">{reading.hypothesis}</p>
        </Build>
        <Build i={2}>
          <p className="rd-reading-standfirst">{reading.standfirst}</p>
        </Build>
        <Build i={3}>
          <ResultNumeral
            numeral={reading.numeral}
            verdict={reading.verdict}
            active={active}
            reduced={reduced}
          />
        </Build>
        <Build i={4}>
          <span className="rd-verdict" data-verdict={reading.verdict} data-testid="verdict-plate">
            <span className="rd-verdict-glyph" aria-hidden="true">
              {VERDICT_GLYPH[reading.verdict]}
            </span>
            {VERDICT_LABEL[reading.verdict]}
          </span>
        </Build>
        <Build i={5}>
          <p className="rd-verdict-note">{reading.verdictNote}</p>
        </Build>
        <Build i={6}>
          <p className="rd-sample">{reading.sample}</p>
        </Build>
      </div>
      <Build i={2} className="rd-chart-wrap">
        <ChartFigure
          key={active ? 'entered' : 'parked'}
          title={reading.caption}
          sourceNote={reading.source}
          option={option}
          tableColumns={table.columns}
          tableRows={table.rows}
          height={360}
          reducedMotion={reduced}
          className="rd-chart"
        />
      </Build>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Slide bodies                                                    */
/* ---------------------------------------------------------------- */

function SlideBody({ slide, reduced, activeId }: { slide: Slide; reduced: boolean; activeId: string }) {
  switch (slide.kind) {
    case 'thesis':
      return (
        <div className="rd-body">
          <Build i={0}>
            <p className="rd-eyebrow">{slide.eyebrow}</p>
          </Build>
          <h2 className="rd-display">
            {slide.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="rd-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={slide.titleLines.length + 1}>
            <p className="rd-thesis">{slide.thesis}</p>
          </Build>
          <Build i={slide.titleLines.length + 2}>
            <div className="rd-front-meta">
              {slide.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );

    case 'ledger':
      return (
        <div className="rd-body">
          <Build i={0}>
            <p className="rd-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="rd-heading">{slide.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="rd-standfirst">{LEDGER.standfirst}</p>
          </Build>
          <ol className="rd-ledger" data-testid="quarter-ledger">
            {LEDGER.rows.map((row, i) => (
              <Build key={row.ref} i={i + 3} as="li" className="rd-ledger-row" data-flag={row.flag ? 'true' : undefined}>
                <span className="rd-ledger-num">{row.value}</span>
                <span className="rd-ledger-label">{row.label}</span>
                <span className="rd-ledger-note">{row.note}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'reading': {
      const reading = readingById(slide.readingId);
      return <ReadingBody reading={reading} reduced={reduced} active={activeId === slide.id} />;
    }

    case 'board':
      return (
        <div className="rd-body">
          <Build i={0}>
            <p className="rd-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="rd-heading">{slide.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="rd-standfirst">{BOARD.standfirst}</p>
          </Build>
          <Build i={3}>
            <table className="rd-table" data-testid="readings-board">
              <caption className="rd-sr">
                Every reading this quarter with effect and verdict. Reading R03 is WITHHELD — a
                significant win withheld because the false-positive-hold guardrail regressed.
              </caption>
              <thead>
                <tr>
                  {BOARD.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOARD.rows.map((row) => (
                  <tr key={row.ref} data-verdict={row.verdict} data-anomaly={row.anomaly ? 'true' : undefined}>
                    <td className="rd-td-ref">{row.ref}</td>
                    <th scope="row" className="rd-td-reading">
                      {row.reading}
                    </th>
                    <td className="rd-td-effect">{row.effect}</td>
                    <td className="rd-td-verdict">
                      <span className="rd-chip">
                        <span aria-hidden="true">{VERDICT_GLYPH[row.verdict]}</span>
                        {row.verdictLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
        </div>
      );

    case 'method':
      return (
        <div className="rd-body">
          <Build i={0}>
            <p className="rd-kicker">{slide.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="rd-heading">{slide.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="rd-standfirst">{METHOD.standfirst}</p>
          </Build>
          <dl className="rd-method">
            {METHOD.rows.map((row, i) => (
              <Build key={row.label} i={i + 3} className="rd-method-row" as="div">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </Build>
            ))}
          </dl>
        </div>
      );

    case 'close':
      return (
        <div className="rd-body">
          <Build i={0}>
            <p className="rd-kicker">{slide.kicker}</p>
          </Build>
          <h2 className="rd-display">
            {slide.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="rd-line">{line}</span>
              </Build>
            ))}
          </h2>
          <ol className="rd-carries">
            {slide.carries.map((c, i) => (
              <Build key={i} i={slide.titleLines.length + 1 + i} as="li" className="rd-carry">
                <span className="rd-carry-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="rd-carry-text">{c}</span>
              </Build>
            ))}
          </ol>
          <Build i={slide.titleLines.length + 1 + slide.carries.length}>
            <div className="rd-front-meta">
              {slide.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );
  }
}

/* ---------------------------------------------------------------- */
/* The session                                                     */
/* ---------------------------------------------------------------- */

export default function ReadoutDeckPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const [indexOpen, setIndexOpen] = useState(false);
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = `The Readout — ${SESSION.title} ${SESSION.quarter} — Live`;
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'w' || event.key === 'W') {
        const anomaly = READINGS.find((r) => r.anomaly);
        const n = anomaly ? slideNumberForId(anomaly.id) : null;
        if (n) goTo(n);
      }
      if (event.key === 'i' || event.key === 'I') setIndexOpen((open) => !open);
      if (event.key === 'Escape') setIndexOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="rd-root" data-testid="live-readout" data-reduced={reduced ? 'true' : undefined}>
      <header className="rd-chrome" aria-label="Session chrome">
        <div className="rd-chrome-cell">
          <RouterLink to="/" className="rd-back">
            ◄ GALLERY
          </RouterLink>
          <span className="rd-chrome-rule" aria-hidden="true" />
          <span>
            {SESSION.title} · {SESSION.quarter}
          </span>
        </div>
        <div className="rd-chrome-cell">
          <span data-testid="reading-counter" aria-live="polite">
            {counter} · {activeSlide.place}
          </span>
          <span className="rd-chrome-rule" aria-hidden="true" />
          <button
            type="button"
            className="rd-index-toggle"
            aria-expanded={indexOpen}
            aria-controls="rd-index"
            onClick={() => setIndexOpen((open) => !open)}
          >
            READINGS
          </button>
        </div>
      </header>

      <nav
        id="rd-index"
        className="rd-index"
        aria-label="All readings"
        data-open={indexOpen ? 'true' : undefined}
        hidden={!indexOpen}
      >
        <p className="rd-index-heading">
          {SESSION.title} {SESSION.quarter} · {SLIDE_COUNT} SLIDES
        </p>
        <ol className="rd-index-list">
          {SLIDES.map((slide, index) => (
            <li key={slide.id}>
              <button
                type="button"
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index + 1);
                  setIndexOpen(false);
                }}
              >
                <span className="rd-index-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{slide.indexTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="rd-main">
        <h1>
          <VisuallyHidden>
            The Readout — {SESSION.title} {SESSION.quarter}, a quarter of experiment results as a
            bench readout in {SLIDE_COUNT} slides. Twenty-three experiments reached a decision: five
            shipped, six killed, one withheld — a significant win withheld because a guardrail
            regressed. Every reading is listed on the board slide. Currently on slide {activeNumber}{' '}
            of {SLIDE_COUNT}: {activeSlide.indexTitle}.
          </VisuallyHidden>
        </h1>
        <div className="rd-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="rd-slide"
                data-state={state}
                data-slide-id={slide.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.indexTitle}`}
              >
                <SlideBody slide={slide} reduced={reduced} activeId={activeSlide.id} />
                <div className="rd-print-foot" aria-hidden="true">
                  {SESSION.title} {SESSION.quarter} · SLIDE {String(index + 1).padStart(2, '0')} /{' '}
                  {SLIDE_COUNT} · {SESSION.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="rd-footer">
        <span className="rd-footer-section" data-testid="slide-section">
          {activeSlide.section}
        </span>
        <span className="rd-footer-notice">{SESSION.dataNotice}</span>
        <div className="rd-footer-nav">
          <span className="rd-hint">{SESSION.keyboardHint}</span>
          <button
            type="button"
            className="rd-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="rd-nav-btn"
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
