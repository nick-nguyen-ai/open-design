/**
 * The adapter's shared chart shell: every chart in this package renders one
 * of these instead of hand-rolling its own `<figure>`. Composes (plan
 * §10.3's accessible-chart contract):
 *   (a) the ECharts mount node — decorative (`aria-hidden`) to assistive
 *       tech, since its content is an ECharts-painted SVG a screen reader
 *       cannot meaningfully traverse;
 *   (b) `ChartDataTable`, the visually-hidden REAL data-table equivalent —
 *       the actual accessible content;
 *   (c) a visible `<figcaption>` carrying the title and a source/synthetic-
 *       data note, in the normal accessibility tree.
 */
import { useRef } from 'react';
import { useECharts } from './useECharts.js';
import { ChartDataTable } from './ChartDataTable.js';
import type { ChartOption } from './types.js';

export interface ChartFigureProps {
  title: string;
  sourceNote?: string;
  option: ChartOption;
  tableColumns: readonly string[];
  tableRows: readonly (readonly (string | number)[])[];
  /** Fixed mount height in pixels — ECharts (like any chart lib) needs a laid-out box to draw into. */
  height?: number;
  reducedMotion: boolean;
  className?: string;
}

export function ChartFigure({
  title,
  sourceNote,
  option,
  tableColumns,
  tableRows,
  height = 280,
  reducedMotion,
  className,
}: ChartFigureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useECharts(containerRef, option);

  return (
    <figure className={className}>
      <div
        ref={containerRef}
        aria-hidden="true"
        data-testid="chart-mount"
        data-motion-sequence="data-ink-draw"
        data-motion-variant={reducedMotion ? 'reduced' : 'full'}
        style={{ width: '100%', height }}
      />
      <ChartDataTable caption={`${title} — data table`} columns={tableColumns} rows={tableRows} />
      <figcaption className="mt-2 text-xs text-text-muted">
        {title}
        {sourceNote ? ` — ${sourceNote}` : ''}
      </figcaption>
    </figure>
  );
}
