import { useMemo } from 'react';
import { EmptyState, ErrorState, Skeleton, VisuallyHidden } from '@enterprise-design/primitives';
import { useMotionPreference } from '@enterprise-design/motion';
import { ChartFigure } from '../adapter/ChartFigure.js';
import { useChartColors } from '../adapter/useChartColors.js';
import { buildCategoryBarChartOption, buildCategoryBarChartTable } from './buildCategoryBarChartOption.js';
import type { CategoryBarDatum } from './buildCategoryBarChartOption.js';

export type CategoryBarChartState = 'default' | 'loading' | 'empty' | 'error';

export interface CategoryBarChartProps {
  data: CategoryBarDatum[];
  title: string;
  state?: CategoryBarChartState;
  unit?: string;
  orientation?: 'vertical' | 'horizontal';
  sourceNote?: string;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export function CategoryBarChart({
  data,
  title,
  state,
  unit,
  orientation = 'vertical',
  sourceNote,
  errorMessage,
  onRetry,
  className,
}: CategoryBarChartProps) {
  const { reduced } = useMotionPreference();
  const colors = useChartColors('categorical');
  const resolvedState = state ?? (data.length === 0 ? 'empty' : 'default');

  const option = useMemo(
    () => buildCategoryBarChartOption(data, { colors, unit, orientation, reducedMotion: reduced }),
    [data, colors, unit, orientation, reduced],
  );
  const table = useMemo(() => buildCategoryBarChartTable(data, unit), [data, unit]);

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
        title="No category data"
        description={`${title} has no categories to show yet.`}
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
    </div>
  );
}
