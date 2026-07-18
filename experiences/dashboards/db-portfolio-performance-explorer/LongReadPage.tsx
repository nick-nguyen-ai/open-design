/**
 * "The Long Read" — the live full-bleed rendering of
 * `db-portfolio-performance-explorer`.
 *
 * Portfolio performance written as a magazine feature: a headline with a
 * standfirst, a drop-cap opening, numbered figure plates set into the copy,
 * one pull-quote, and a plain table at the end for readers who want the
 * numbers without the prose. It explains WHY the quarter moved, not just
 * where it landed. Grammar: executive-editorial; signature: horizon-sweep;
 * motion level 1; locked light. Deliberately simple — this is the world for
 * readers who trust print.
 *
 * Art-direction licence: this file and long-read.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useMemo } from 'react';
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
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './long-read.css';
import {
  ATTRIBUTION_FIGURE,
  FOOT,
  MASTHEAD,
  NUMBERS,
  RETURN_FIGURE,
  RETURN_SERIES,
  STORY,
  TITLE,
} from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#1e1c18',
  faint: '#6b655a',
  burgundy: '#6d1f2c',
  slate: '#8a8375',
  grid: 'rgba(107, 101, 90, 0.18)',
  paper: '#faf8f2',
} as const;

function useReturnOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption(
      [
        { id: 'portfolio', label: 'Portfolio', points: RETURN_SERIES.portfolio },
        { id: 'benchmark', label: 'Benchmark', points: RETURN_SERIES.benchmark },
      ],
      { colors: [INK.burgundy, INK.slate], reducedMotion: reduced, showAverageLine: false },
    ) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      lineStyle: { ...(s.lineStyle as Rec), width: s.id === 'portfolio' ? 2 : 1.2 },
    }));
    const axis = (extra?: Rec): Rec => ({
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: INK.grid } },
      axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 9 },
      ...extra,
    });
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.faint },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 2,
        textStyle: { color: INK.faint, fontFamily: MONO, fontSize: 10 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.paper,
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axis({ splitLine: { show: false } }),
        axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 9, interval: 15 },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axis(),
        axisLabel: {
          color: INK.faint,
          fontFamily: MONO,
          fontSize: 9,
          formatter: (v: number) => `${v}%`,
        },
      },
    };
  }, [reduced]);
}

function useAttributionOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...ATTRIBUTION_FIGURE.data], {
      colors: [INK.burgundy],
      reducedMotion: reduced,
    }) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      barMaxWidth: 30,
      itemStyle: {
        color: (params: { value: unknown }) => (Number(params.value) < 0 ? INK.slate : INK.burgundy),
      },
    }));
    const axis = (extra?: Rec): Rec => ({
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: INK.grid } },
      axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 9 },
      ...extra,
    });
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.faint },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.paper,
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: { ...(base.xAxis as Rec), ...axis({ splitLine: { show: false }, axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 8.5, interval: 0, rotate: 12 } }) },
      yAxis: { ...(base.yAxis as Rec), ...axis() },
    };
  }, [reduced]);
}

export default function LongReadPage() {
  const { reduced } = useMotionPreference();
  const returnOption = useReturnOption(reduced);
  const returnTable = useMemo(
    () =>
      buildTrendChartTable([
        { id: 'portfolio', label: 'Portfolio', points: RETURN_SERIES.portfolio },
        { id: 'benchmark', label: 'Benchmark', points: RETURN_SERIES.benchmark },
      ]),
    [],
  );
  const attributionOption = useAttributionOption(reduced);
  const attributionTable = useMemo(
    () => buildCategoryBarChartTable([...ATTRIBUTION_FIGURE.data]),
    [],
  );

  return (
    <div className="lr-root" data-testid="live-long-read" data-reduced={reduced ? 'true' : undefined}>
      <header className="lr-chrome" data-part-id="db-portfolio-performance-explorer/chrome">
        <div className="lr-chrome-row">
          <RouterLink to="/" className="lr-back">
            ◄ GALLERY
          </RouterLink>
          <span className="lr-chrome-mast">
            {MASTHEAD.title} <em>· {MASTHEAD.desk}</em>
          </span>
          <span>{MASTHEAD.issue}</span>
        </div>
        <div className="lr-chrome-row lr-chrome-row-sub">
          <span className="lr-provenance">{MASTHEAD.provenance}</span>
        </div>
      </header>

      <main className="lr-main">
        <section className="lr-title" aria-labelledby="lr-headline" data-part-id="db-portfolio-performance-explorer/title">
          <p className="lr-kicker">{TITLE.kicker}</p>
          <h1 id="lr-headline" className="lr-headline" data-part-id="db-portfolio-performance-explorer/title/headline">
            {TITLE.headline}
          </h1>
          <p className="lr-standfirst">{TITLE.standfirst}</p>
          <p className="lr-byline">{TITLE.byline}</p>
        </section>

        <article className="lr-story" data-part-id="db-portfolio-performance-explorer/story">
          <p className="lr-para lr-para-drop">{STORY.openers[0]}</p>
          <p className="lr-para">{STORY.openers[1]}</p>

          <figure className="lr-plate" data-part-id="db-portfolio-performance-explorer/story/return-chart">
            <figcaption className="lr-plate-caption">
              <span className="lr-plate-num">{RETURN_FIGURE.plate}</span> {RETURN_FIGURE.heading}
            </figcaption>
            <ChartFigure
              title={RETURN_FIGURE.chartTitle}
              sourceNote={RETURN_FIGURE.chartSource}
              option={returnOption}
              tableColumns={returnTable.columns}
              tableRows={returnTable.rows}
              height={300}
              reducedMotion={reduced}
            />
          </figure>

          <h2 className="lr-crosshead">{STORY.crossheadDrivers}</h2>
          <p className="lr-para">{STORY.driverParagraphs[0]}</p>

          <blockquote className="lr-pull" data-part-id="db-portfolio-performance-explorer/story/pull-quote">
            {STORY.pullQuote}
          </blockquote>

          <p className="lr-para">{STORY.driverParagraphs[1]}</p>

          <figure className="lr-plate" data-part-id="db-portfolio-performance-explorer/story/attribution-chart">
            <figcaption className="lr-plate-caption">
              <span className="lr-plate-num">{ATTRIBUTION_FIGURE.plate}</span> {ATTRIBUTION_FIGURE.heading}
            </figcaption>
            <ChartFigure
              title={ATTRIBUTION_FIGURE.chartTitle}
              sourceNote={ATTRIBUTION_FIGURE.chartSource}
              option={attributionOption}
              tableColumns={attributionTable.columns}
              tableRows={attributionTable.rows}
              height={280}
              reducedMotion={reduced}
            />
          </figure>

          <h2 className="lr-crosshead">{STORY.crossheadNext}</h2>
          <p className="lr-para">{STORY.closers[0]}</p>
          <p className="lr-para">{STORY.closers[1]}</p>
        </article>

        <section className="lr-numbers" aria-labelledby="lr-numbers-heading" data-part-id="db-portfolio-performance-explorer/numbers">
          <h2 id="lr-numbers-heading" className="lr-numbers-heading">
            {NUMBERS.title}
            <span className="lr-numbers-sub">{NUMBERS.sub}</span>
          </h2>
          <table className="lr-table" data-part-id="db-portfolio-performance-explorer/numbers/table">
            <caption>
              <VisuallyHidden>{NUMBERS.caption}</VisuallyHidden>
            </caption>
            <thead>
              <tr>
                <th scope="col">MEASURE</th>
                <th scope="col">Q2 2026</th>
                <th scope="col">AGAINST</th>
              </tr>
            </thead>
            <tbody>
              {NUMBERS.rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th>
                  <td className="lr-table-value">{row.value}</td>
                  <td className="lr-table-versus">{row.versus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="lr-foot">
        <p>{FOOT.note}</p>
        <p className="lr-foot-line">
          <span>{MASTHEAD.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
