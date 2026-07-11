import { describe, expect, it } from 'vitest';
import {
  buildTrendChartOption,
  buildTrendChartTable,
  collectTrendChartCategories,
} from './buildTrendChartOption.js';
import type { TrendChartSeriesInput } from './buildTrendChartOption.js';

const COLORS = ['#111111', '#222222', '#333333'];

const TWO_SERIES: TrendChartSeriesInput[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    points: [
      { x: '2026-01', y: 100 },
      { x: '2026-02', y: 120 },
      { x: '2026-03', y: 140 },
    ],
  },
  {
    id: 'cost',
    label: 'Cost',
    points: [
      { x: '2026-01', y: 60 },
      { x: '2026-02', y: 65 },
      { x: '2026-03', y: null },
    ],
  },
];

describe('collectTrendChartCategories', () => {
  it('returns the sorted union of every series x value', () => {
    expect(collectTrendChartCategories(TWO_SERIES)).toEqual(['2026-01', '2026-02', '2026-03']);
  });

  it('handles series with disjoint x values', () => {
    const series: TrendChartSeriesInput[] = [
      { id: 'a', label: 'A', points: [{ x: '2026-01', y: 1 }] },
      { id: 'b', label: 'B', points: [{ x: '2026-02', y: 2 }] },
    ];
    expect(collectTrendChartCategories(series)).toEqual(['2026-01', '2026-02']);
  });
});

describe('buildTrendChartOption', () => {
  it('builds one line series per input series, in order, with the resolved colours', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS });
    expect(Array.isArray(option.series)).toBe(true);
    const series = option.series as Array<Record<string, unknown>>;
    expect(series).toHaveLength(2);
    expect(series[0]?.name).toBe('Revenue');
    expect(series[0]?.type).toBe('line');
    expect((series[0]?.itemStyle as Record<string, unknown>).color).toBe('#111111');
    expect(series[1]?.name).toBe('Cost');
    expect((series[1]?.itemStyle as Record<string, unknown>).color).toBe('#222222');
  });

  it('maps missing x values to null (a gap), never interpolating', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS });
    const series = option.series as Array<Record<string, unknown>>;
    expect(series[1]?.data).toEqual([60, 65, null]);
    expect(series[1]?.connectNulls).toBe(false);
  });

  it('differentiates series by line dash style and marker symbol, not colour alone', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS });
    const series = option.series as Array<Record<string, unknown>>;
    const style0 = series[0]?.lineStyle as Record<string, unknown>;
    const style1 = series[1]?.lineStyle as Record<string, unknown>;
    expect(style0.type).not.toBe(style1.type);
    expect(series[0]?.symbol).not.toBe(series[1]?.symbol);
  });

  it('sets the y-axis unit formatter when a unit is provided', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS, unit: 'USD' });
    const yAxis = option.yAxis as Record<string, unknown>;
    const axisLabel = yAxis.axisLabel as Record<string, unknown>;
    expect(axisLabel.formatter).toBe('{value} USD');
  });

  it('omits the legend for a single series and shows it for multiple series', () => {
    const single = buildTrendChartOption([TWO_SERIES[0] as TrendChartSeriesInput], { colors: COLORS });
    expect(single.legend).toBeUndefined();
    const multi = buildTrendChartOption(TWO_SERIES, { colors: COLORS });
    expect(multi.legend).toBeDefined();
  });

  it('adds a dashed average markLine per series by default (the "annotation" layer)', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS });
    const series = option.series as Array<Record<string, unknown>>;
    const markLine = series[0]?.markLine as Record<string, unknown>;
    expect(markLine).toBeDefined();
    expect((markLine.lineStyle as Record<string, unknown>).type).toBe('dashed');
  });

  it('omits the average markLine when showAverageLine is false', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS, showAverageLine: false });
    const series = option.series as Array<Record<string, unknown>>;
    expect(series[0]?.markLine).toBeUndefined();
  });

  it('reduced motion: animation is globally disabled and no series animates', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS, reducedMotion: true });
    expect(option.animation).toBe(false);
    const series = option.series as Array<Record<string, unknown>>;
    expect(series[0]?.animationDuration).toBe(0);
  });

  it('full motion: the second series draws in after the first (staggered)', () => {
    const option = buildTrendChartOption(TWO_SERIES, { colors: COLORS, reducedMotion: false });
    const series = option.series as Array<Record<string, unknown>>;
    expect(series[1]?.animationDelay).toBeGreaterThan(series[0]?.animationDelay as number);
  });

  it('area variant sets an areaStyle; line variant does not', () => {
    const area = buildTrendChartOption(TWO_SERIES, { colors: COLORS, variant: 'area' });
    const line = buildTrendChartOption(TWO_SERIES, { colors: COLORS, variant: 'line' });
    const areaSeries = area.series as Array<Record<string, unknown>>;
    const lineSeries = line.series as Array<Record<string, unknown>>;
    expect(areaSeries[0]?.areaStyle).toBeDefined();
    expect(lineSeries[0]?.areaStyle).toBeUndefined();
  });
});

describe('buildTrendChartTable', () => {
  it('produces a Date column plus one column per series, in series order', () => {
    const table = buildTrendChartTable(TWO_SERIES);
    expect(table.columns).toEqual(['Date', 'Revenue', 'Cost']);
  });

  it('produces one row per category, with the actual series values', () => {
    const table = buildTrendChartTable(TWO_SERIES);
    expect(table.rows).toEqual([
      ['2026-01', 100, 60],
      ['2026-02', 120, 65],
      ['2026-03', 140, '—'],
    ]);
  });

  it('renders an em dash for a missing/null value rather than 0 or blank', () => {
    const table = buildTrendChartTable(TWO_SERIES);
    expect(table.rows[2]?.[2]).toBe('—');
  });
});
