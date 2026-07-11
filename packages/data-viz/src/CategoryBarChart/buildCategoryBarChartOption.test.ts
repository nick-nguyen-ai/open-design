import { describe, expect, it } from 'vitest';
import { buildCategoryBarChartOption, buildCategoryBarChartTable } from './buildCategoryBarChartOption.js';
import type { CategoryBarDatum } from './buildCategoryBarChartOption.js';

const COLORS = ['#111111', '#222222'];

const DATA: CategoryBarDatum[] = [
  { id: 'north', category: 'North', value: 42, target: 50 },
  { id: 'south', category: 'South', value: 58, target: 50 },
  { id: 'east', category: 'East', value: 30 },
];

describe('buildCategoryBarChartOption', () => {
  it('builds a bar series with one value per category, in input order', () => {
    const option = buildCategoryBarChartOption(DATA, { colors: COLORS });
    const series = option.series as Array<Record<string, unknown>>;
    expect(series[0]?.type).toBe('bar');
    expect(series[0]?.data).toEqual([42, 58, 30]);
    const xAxis = option.xAxis as Record<string, unknown>;
    expect(xAxis.data).toEqual(['North', 'South', 'East']);
  });

  it('always shows a visible value label on the bars (non-colour encoding)', () => {
    const option = buildCategoryBarChartOption(DATA, { colors: COLORS });
    const series = option.series as Array<Record<string, unknown>>;
    const label = series[0]?.label as Record<string, unknown>;
    expect(label.show).toBe(true);
  });

  it('adds a diamond-symbol target scatter series when any datum has a target', () => {
    const option = buildCategoryBarChartOption(DATA, { colors: COLORS });
    const series = option.series as Array<Record<string, unknown>>;
    expect(series).toHaveLength(2);
    expect(series[1]?.type).toBe('scatter');
    expect(series[1]?.symbol).toBe('diamond');
    // Target is null for East, which has no target — not silently coerced to 0.
    expect(series[1]?.data).toEqual([50, 50, null]);
  });

  it('omits the target series entirely when no datum has a target', () => {
    const noTargets = DATA.map(({ target: _target, ...rest }) => rest);
    const option = buildCategoryBarChartOption(noTargets, { colors: COLORS });
    const series = option.series as Array<Record<string, unknown>>;
    expect(series).toHaveLength(1);
    expect(option.legend).toBeUndefined();
  });

  it('swaps category/value axes for horizontal orientation', () => {
    const vertical = buildCategoryBarChartOption(DATA, { colors: COLORS, orientation: 'vertical' });
    const horizontal = buildCategoryBarChartOption(DATA, { colors: COLORS, orientation: 'horizontal' });
    expect((vertical.xAxis as Record<string, unknown>).type).toBe('category');
    expect((horizontal.yAxis as Record<string, unknown>).type).toBe('category');
    expect((horizontal.xAxis as Record<string, unknown>).type).toBe('value');
  });

  it('reduced motion disables animation globally', () => {
    const option = buildCategoryBarChartOption(DATA, { colors: COLORS, reducedMotion: true });
    expect(option.animation).toBe(false);
  });

  it('the target annotation animates in after the bar series (full motion)', () => {
    const option = buildCategoryBarChartOption(DATA, { colors: COLORS, reducedMotion: false });
    const series = option.series as Array<Record<string, unknown>>;
    expect(series[1]?.animationDelay).toBeGreaterThan(0);
    expect(series[1]?.animationDelay as number).toBeGreaterThanOrEqual(series[0]?.animationDuration as number);
  });
});

describe('buildCategoryBarChartTable', () => {
  it('includes a Target column only when at least one datum has a target', () => {
    const withTargets = buildCategoryBarChartTable(DATA);
    expect(withTargets.columns).toEqual(['Category', 'Value', 'Target']);
    expect(withTargets.rows[2]).toEqual(['East', 30, '—']);

    const noTargets = buildCategoryBarChartTable(DATA.map(({ target: _target, ...rest }) => rest));
    expect(noTargets.columns).toEqual(['Category', 'Value']);
  });

  it('labels the value column with the unit when provided', () => {
    const table = buildCategoryBarChartTable(DATA, 'USD');
    expect(table.columns[1]).toBe('Value (USD)');
  });
});
