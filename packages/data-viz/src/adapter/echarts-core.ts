/**
 * The ECharts adapter's single module-registration point.
 *
 * Every chart in this package imports its ECharts instance from HERE, never
 * from the `echarts` root package (which bundles the entire library —
 * Canvas renderer, WebGL, every chart type, every component). Registering
 * only the modules charts actually use keeps the bundle small and keeps
 * `usesCanvas: false` true for every manifest in this package: we register
 * `SVGRenderer` only, never `CanvasRenderer`. SVG output is inspectable in
 * the DOM (print/screenshot/test-friendly) instead of an opaque canvas
 * bitmap.
 */
import * as echarts from 'echarts/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  LineChart,
  BarChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  MarkLineComponent,
  SVGRenderer,
]);

export { echarts };
export type { ECharts } from 'echarts/core';
