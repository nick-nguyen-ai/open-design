import { useMemo } from 'react';
import { EmptyState, ErrorState, Skeleton, VisuallyHidden } from '@enterprise-design/primitives';
import { useMotionPreference } from '@enterprise-design/motion';
import { ChartFigure } from '../adapter/ChartFigure.js';
import { useChartColors } from '../adapter/useChartColors.js';
import { buildTrendChartOption, buildTrendChartTable } from './buildTrendChartOption.js';
import type { TrendChartSeriesInput } from './buildTrendChartOption.js';

export type TrendChartState = 'default' | 'loading' | 'empty' | 'partial-data' | 'error';

export interface TrendChartProps {
  series: TrendChartSeriesInput[];
  title: string;
  /** Explicit state override. Auto-detects `empty` when every series has zero points. */
  state?: TrendChartState;
  unit?: string;
  yAxisLabel?: string;
  variant?: 'line' | 'area';
  sourceNote?: string;
  showAverageLine?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

function isEmpty(series: readonly TrendChartSeriesInput[]): boolean {
  return series.length === 0 || series.every((s) => s.points.length === 0);
}

export function TrendChart({
  series,
  title,
  state,
  unit,
  yAxisLabel,
  variant = 'line',
  sourceNote,
  showAverageLine = true,
  errorMessage,
  onRetry,
  className,
}: TrendChartProps) {
  const { reduced } = useMotionPreference();
  const colors = useChartColors('categorical');
  const resolvedState = state ?? (isEmpty(series) ? 'empty' : 'default');

  const option = useMemo(
    () =>
      buildTrendChartOption(series, {
        colors,
        variant,
        unit,
        yAxisLabel,
        reducedMotion: reduced,
        showAverageLine,
      }),
    [series, colors, variant, unit, yAxisLabel, reduced, showAverageLine],
  );
  const table = useMemo(() => buildTrendChartTable(series), [series]);

  if (resolvedState === 'loading') {
    return (
      <div className={className} role="status" aria-label={`Loading ${title}`}>
        <Skeleton shape="rectangular" height={280} className="w-full" />
        <VisuallyHidden>Loading {title}…</VisuallyHidden>
      </div>
    );
  }

  if (resolvedState === 'error') {
    return (
      <ErrorState
        title={`Couldn't load ${title}`}
        description={errorMessage}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (resolvedState === 'empty') {
    return (
      <EmptyState
        title="No trend data"
        description={`${title} has no data points yet.`}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <ChartFigure
        title={title}
        sourceNote={sourceNote}
        option={option}
        tableColumns={table.columns}
        tableRows={table.rows}
        reducedMotion={reduced}
      />
      {resolvedState === 'partial-data' ? (
        <p className="mt-2 text-xs text-text-muted" data-testid="trend-chart-partial-note">
          Showing partial data — some points are still arriving.
        </p>
      ) : null}
    </div>
  );
}
