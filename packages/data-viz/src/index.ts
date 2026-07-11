// Adapter — exported for other data-viz-adjacent packages/tests that need to
// build a chart option or resolve chart colours without a full component.
export { echarts } from './adapter/echarts-core.js';
export type { ECharts } from './adapter/echarts-core.js';
export type { ChartOption } from './adapter/types.js';
export { resolveChartColors, defaultCssVarReader } from './adapter/chartColors.js';
export type { ChartColorScale } from './adapter/chartColors.js';
export { useChartColors } from './adapter/useChartColors.js';
export { buildChartAnimationTiming } from './adapter/chartMotion.js';
export type { ChartAnimationTiming, BuildChartAnimationTimingOptions } from './adapter/chartMotion.js';
export { ChartFigure } from './adapter/ChartFigure.js';
export type { ChartFigureProps } from './adapter/ChartFigure.js';
export { ChartDataTable } from './adapter/ChartDataTable.js';
export type { ChartDataTableProps } from './adapter/ChartDataTable.js';

// TrendChart
export { TrendChart } from './TrendChart/TrendChart.js';
export type { TrendChartProps, TrendChartState } from './TrendChart/TrendChart.js';
export {
  buildTrendChartOption,
  buildTrendChartTable,
  collectTrendChartCategories,
} from './TrendChart/buildTrendChartOption.js';
export type {
  TrendChartPoint,
  TrendChartSeriesInput,
  BuildTrendChartOptionOptions,
  TrendChartTable,
} from './TrendChart/buildTrendChartOption.js';

// CategoryBarChart
export { CategoryBarChart } from './CategoryBarChart/CategoryBarChart.js';
export type { CategoryBarChartProps, CategoryBarChartState } from './CategoryBarChart/CategoryBarChart.js';
export {
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from './CategoryBarChart/buildCategoryBarChartOption.js';
export type {
  CategoryBarDatum,
  BuildCategoryBarChartOptionOptions,
  CategoryBarChartTable,
} from './CategoryBarChart/buildCategoryBarChartOption.js';
