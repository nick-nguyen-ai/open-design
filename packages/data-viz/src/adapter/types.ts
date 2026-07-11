/**
 * The narrowed `EChartsOption` type for this adapter: a `ComposeOption` union
 * of exactly the series/component option shapes registered in
 * `echarts-core.ts`. Using the composed (not the all-encompassing) option
 * type keeps chart authors from reaching for series/components this package
 * never registers.
 */
import type { ComposeOption } from 'echarts/core';
import type { BarSeriesOption, LineSeriesOption, ScatterSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  MarkLineComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import type { XAXisComponentOption, YAXisComponentOption } from 'echarts/types/dist/option';

export type ChartOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | ScatterSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | MarkLineComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | XAXisComponentOption
  | YAXisComponentOption
>;
