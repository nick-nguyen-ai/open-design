/**
 * PURE option builder (plan's "separate pure option-building from
 * rendering" testability pattern): given time-series data and resolved
 * colours, returns a fully-formed ECharts option with no DOM access
 * whatsoever. `TrendChart.tsx` is the only caller that touches the DOM.
 */
import { lightValues } from '@enterprise-design/themes';
import { buildChartAnimationTiming } from '../adapter/chartMotion.js';
import type { ChartOption } from '../adapter/types.js';

/** Defensive fallback only reached if `colors` is empty (never true for a resolved palette). */
const NEUTRAL_FALLBACK_COLOR = lightValues['text-muted'];

export interface TrendChartPoint {
  /** ISO 8601 date (or any lexically-sortable category label). */
  x: string;
  /** `null` marks a known gap — rendered as a break in the line, not interpolated. */
  y: number | null;
}

export interface TrendChartSeriesInput {
  id: string;
  label: string;
  points: readonly TrendChartPoint[];
}

export interface BuildTrendChartOptionOptions {
  colors: readonly string[];
  variant?: 'line' | 'area';
  unit?: string;
  yAxisLabel?: string;
  reducedMotion?: boolean;
  /** Draw a per-series dashed average reference line — the DataInkDraw "annotation" layer. Default `true`. */
  showAverageLine?: boolean;
}

const LINE_DASH_STYLES = ['solid', 'dashed', 'dotted'] as const;
const SERIES_SYMBOLS = ['circle', 'diamond', 'triangle', 'rect'] as const;

/** The union of every series' `x` value, in ascending (lexical/chronological) order. */
export function collectTrendChartCategories(series: readonly TrendChartSeriesInput[]): string[] {
  const set = new Set<string>();
  for (const s of series) for (const point of s.points) set.add(point.x);
  return [...set].sort();
}

function average(points: readonly TrendChartPoint[]): number | undefined {
  const values = points.map((p) => p.y).filter((y): y is number => y !== null);
  if (values.length === 0) return undefined;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildTrendChartOption(
  series: readonly TrendChartSeriesInput[],
  options: BuildTrendChartOptionOptions,
): ChartOption {
  const { colors, variant = 'line', unit, yAxisLabel, reducedMotion = false, showAverageLine = true } = options;
  const categories = collectTrendChartCategories(series);
  const timing = buildChartAnimationTiming(series.length, { reducedMotion });

  const echartsSeries = series.map((s, index) => {
    const color = colors[index % Math.max(colors.length, 1)] ?? NEUTRAL_FALLBACK_COLOR;
    const byX = new Map(s.points.map((point) => [point.x, point.y]));
    const data = categories.map((x) => byX.get(x) ?? null);
    const avg = average(s.points);

    return {
      id: s.id,
      name: s.label,
      type: 'line' as const,
      data,
      connectNulls: false,
      symbol: SERIES_SYMBOLS[index % SERIES_SYMBOLS.length],
      symbolSize: 6,
      lineStyle: { type: LINE_DASH_STYLES[index % LINE_DASH_STYLES.length], width: 2, color },
      itemStyle: { color },
      areaStyle: variant === 'area' ? { color, opacity: 0.16 } : undefined,
      animation: timing.animation,
      animationDuration: timing.seriesAnimationDurationMs,
      animationDelay: timing.seriesAnimationDelayMs(index),
      animationEasing: timing.seriesEasing,
      markLine:
        showAverageLine && avg !== undefined
          ? {
              silent: true,
              symbol: 'none' as const,
              animation: timing.animation,
              animationDuration: timing.annotationAnimationDurationMs,
              animationDelay: timing.annotationAnimationDelayMs,
              animationEasing: timing.annotationEasing,
              lineStyle: { type: 'dashed' as const, color },
              label: { formatter: `${s.label} avg` },
              data: [{ type: 'average' as const, name: `${s.label} average` }],
            }
          : undefined,
    };
  });

  return {
    animation: timing.animation,
    color: [...colors],
    grid: { left: 56, right: 24, top: series.length > 1 ? 40 : 24, bottom: 48, containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: categories },
    yAxis: {
      type: 'value',
      name: yAxisLabel ?? unit,
      axisLabel: unit ? { formatter: `{value} ${unit}` } : undefined,
    },
    tooltip: { trigger: 'axis' },
    legend: series.length > 1 ? { top: 0, data: series.map((s) => s.label) } : undefined,
    series: echartsSeries,
  };
}

export interface TrendChartTable {
  columns: string[];
  rows: (string | number)[][];
}

/** The data-table equivalent for the same `series` passed to `buildTrendChartOption`. */
export function buildTrendChartTable(series: readonly TrendChartSeriesInput[]): TrendChartTable {
  const categories = collectTrendChartCategories(series);
  const columns = ['Date', ...series.map((s) => s.label)];
  const rows = categories.map((x) => {
    const row: (string | number)[] = [x];
    for (const s of series) {
      const point = s.points.find((p) => p.x === x);
      row.push(point && point.y !== null ? point.y : '—');
    }
    return row;
  });
  return { columns, rows };
}
