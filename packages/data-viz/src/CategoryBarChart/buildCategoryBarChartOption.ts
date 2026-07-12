/**
 * PURE option builder for the categorical bar chart — no DOM access.
 */
import { lightValues } from '@enterprise-design/themes';
import { buildChartAnimationTiming } from '../adapter/chartMotion.js';
import type { ChartOption } from '../adapter/types.js';

/** Defensive fallback only reached if `colors` is empty (never true for a resolved palette). */
const NEUTRAL_FALLBACK_COLOR = lightValues['text-muted'];

export interface CategoryBarDatum {
  id: string;
  category: string;
  value: number;
  /** Optional per-category reference/target value, rendered as a diamond marker (shape, not colour, is the encoding). */
  target?: number;
}

export interface BuildCategoryBarChartOptionOptions {
  colors: readonly string[];
  unit?: string;
  orientation?: 'vertical' | 'horizontal';
  reducedMotion?: boolean;
}

export function buildCategoryBarChartOption(
  data: readonly CategoryBarDatum[],
  options: BuildCategoryBarChartOptionOptions,
): ChartOption {
  const { colors, unit, orientation = 'vertical', reducedMotion = false } = options;
  const timing = buildChartAnimationTiming(1, { reducedMotion });
  const categories = data.map((d) => d.category);
  const values = data.map((d) => d.value);
  const hasTargets = data.some((d) => d.target !== undefined);
  const barColor = colors[0] ?? NEUTRAL_FALLBACK_COLOR;
  const targetColor = colors[1] ?? barColor;

  const barSeries = {
    id: 'value',
    name: 'Value',
    type: 'bar' as const,
    data: values,
    itemStyle: { color: barColor, borderRadius: orientation === 'vertical' ? [4, 4, 0, 0] : [0, 4, 4, 0] },
    label: {
      show: true,
      position: (orientation === 'vertical' ? 'top' : 'right') as 'top' | 'right',
      formatter: unit ? `{c} ${unit}` : undefined,
    },
    animation: timing.animation,
    animationDuration: timing.seriesAnimationDurationMs,
    animationDelay: 0,
    animationEasing: timing.seriesEasing,
  };

  const targetSeries = hasTargets
    ? {
        id: 'target',
        name: 'Target',
        type: 'scatter' as const,
        symbol: 'diamond' as const,
        symbolSize: 12,
        itemStyle: { color: targetColor },
        data: data.map((d) => d.target ?? null),
        animation: timing.animation,
        animationDuration: timing.annotationAnimationDurationMs,
        animationDelay: timing.annotationAnimationDelayMs,
        animationEasing: timing.annotationEasing,
      }
    : undefined;

  // Small-N categorical charts must never drop labels: an unlabelled bar is
  // an integrity failure (the reader cannot name what breached).
  const categoryAxis = {
    type: 'category' as const,
    data: categories,
    axisLabel: { interval: 0 as const },
  };
  const valueAxis = {
    type: 'value' as const,
    name: unit,
    axisLabel: unit ? { formatter: `{value} ${unit}` } : undefined,
  };

  return {
    animation: timing.animation,
    color: [...colors],
    grid:
      orientation === 'vertical'
        ? { left: 56, right: 24, top: hasTargets ? 40 : 24, bottom: 56, containLabel: true }
        : { left: 96, right: 32, top: hasTargets ? 40 : 24, bottom: 32, containLabel: true },
    xAxis: orientation === 'vertical' ? categoryAxis : valueAxis,
    yAxis: orientation === 'vertical' ? valueAxis : categoryAxis,
    tooltip: { trigger: 'axis' },
    legend: hasTargets ? { top: 0, data: ['Value', 'Target'] } : undefined,
    series: targetSeries ? [barSeries, targetSeries] : [barSeries],
  };
}

export interface CategoryBarChartTable {
  columns: string[];
  rows: (string | number)[][];
}

export function buildCategoryBarChartTable(
  data: readonly CategoryBarDatum[],
  unit?: string,
): CategoryBarChartTable {
  const hasTargets = data.some((d) => d.target !== undefined);
  const valueColumn = unit ? `Value (${unit})` : 'Value';
  const columns = hasTargets ? ['Category', valueColumn, 'Target'] : ['Category', valueColumn];
  const rows = data.map((d) =>
    hasTargets ? [d.category, d.value, d.target ?? '—'] : [d.category, d.value],
  );
  return { columns, rows };
}
