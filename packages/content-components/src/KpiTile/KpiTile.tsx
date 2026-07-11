import type { ReactNode } from 'react';
import { Badge, Card, EmptyState, ErrorState, Skeleton, VisuallyHidden } from '@enterprise-design/primitives';
import type { BadgeTone } from '@enterprise-design/primitives';
import { LedgerReveal } from '@enterprise-design/motion';
import { CheckCircleIcon, DashCircleIcon, OctagonXIcon, TriangleAlertIcon, TriangleDownIcon, TriangleUpIcon } from '../icons.js';
import { formatKpiDelta, formatKpiValue } from './formatKpiValue.js';
import type { KpiUnit } from './formatKpiValue.js';

export type KpiStatus = 'on-track' | 'at-risk' | 'off-track' | 'neutral';

export interface KpiTileDatum {
  id: string;
  label: string;
  value: number;
  unit?: KpiUnit;
  /** Fractional change since the prior period, e.g. `0.032` = +3.2%. */
  delta?: number;
  /** Which direction of `delta` counts as good — flips the up/down tone (e.g. cost falling is good). */
  deltaGoodDirection?: 'up' | 'down';
  target?: number;
  status: KpiStatus;
}

export type KpiTileState = 'default' | 'loading' | 'empty' | 'error';

export interface KpiTileProps {
  metrics: KpiTileDatum[];
  title?: string;
  state?: KpiTileState;
  loadingCount?: number;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

const STATUS_LABEL: Record<KpiStatus, string> = {
  'on-track': 'On track',
  'at-risk': 'At risk',
  'off-track': 'Off track',
  neutral: 'No target',
};

const STATUS_TONE: Record<KpiStatus, BadgeTone> = {
  'on-track': 'success',
  'at-risk': 'warning',
  'off-track': 'danger',
  neutral: 'neutral',
};

const STATUS_ICON: Record<KpiStatus, () => ReactNode> = {
  'on-track': CheckCircleIcon,
  'at-risk': TriangleAlertIcon,
  'off-track': OctagonXIcon,
  neutral: DashCircleIcon,
};

type DeltaTone = 'success' | 'danger' | 'neutral';

function deltaTone(delta: number, goodDirection: 'up' | 'down'): DeltaTone {
  if (delta === 0) return 'neutral';
  const isIncrease = delta > 0;
  const isGood = goodDirection === 'up' ? isIncrease : !isIncrease;
  return isGood ? 'success' : 'danger';
}

const DELTA_TONE_TEXT_CLASS: Record<DeltaTone, string> = {
  success: 'text-success-fg',
  danger: 'text-danger-fg',
  neutral: 'text-text-secondary',
};

function KpiTileCard({ metric }: { metric: KpiTileDatum }) {
  const StatusIcon = STATUS_ICON[metric.status];
  const goodDirection = metric.deltaGoodDirection ?? 'up';

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-text-secondary">{metric.label}</span>
        <Badge tone={STATUS_TONE[metric.status]} className="inline-flex items-center gap-1">
          <StatusIcon />
          {STATUS_LABEL[metric.status]}
        </Badge>
      </div>

      <span className="font-numeric text-3xl font-weight-semibold text-text-primary" data-testid="kpi-tile-value">
        {formatKpiValue(metric.value, metric.unit)}
      </span>

      {metric.delta !== undefined ? (
        <span
          className={
            'inline-flex w-fit items-center gap-1 text-sm font-numeric ' +
            DELTA_TONE_TEXT_CLASS[deltaTone(metric.delta, goodDirection)]
          }
        >
          {metric.delta > 0 ? <TriangleUpIcon /> : metric.delta < 0 ? <TriangleDownIcon /> : null}
          {formatKpiDelta(metric.delta)}
          <VisuallyHidden> vs. prior period</VisuallyHidden>
        </span>
      ) : null}

      {metric.target !== undefined ? (
        <span className="text-xs text-text-muted font-numeric">
          Target {formatKpiValue(metric.target, metric.unit)}
        </span>
      ) : null}
    </Card>
  );
}

function LoadingTiles({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading KPIs">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} shape="rectangular" height={132} />
      ))}
      <VisuallyHidden>Loading KPIs…</VisuallyHidden>
    </div>
  );
}

/**
 * A set of KPI tiles ("kpi-set" data) — label, tabular-numeral value, delta,
 * target, and status, each encoded by text/icon-shape as well as colour.
 * Numeric values resolve via `LedgerReveal` in reading order.
 */
export function KpiTile({ metrics, title, state, loadingCount = 3, errorMessage, onRetry, className }: KpiTileProps) {
  const resolvedState = state ?? (metrics.length === 0 ? 'empty' : 'default');

  if (resolvedState === 'loading') {
    return (
      <div className={className}>
        <LoadingTiles count={loadingCount} />
      </div>
    );
  }

  if (resolvedState === 'error') {
    return (
      <ErrorState
        title="Couldn't load KPIs"
        description={errorMessage}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (resolvedState === 'empty') {
    return <EmptyState title="No KPIs yet" description="Metrics will appear here once available." className={className} />;
  }

  const grid = (
    <LedgerReveal
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      items={metrics.map((metric) => ({
        id: metric.id,
        content: <KpiTileCard metric={metric} />,
      }))}
    />
  );

  if (title === undefined) return <div className={className}>{grid}</div>;
  return (
    <section aria-label={title} className={className}>
      {grid}
    </section>
  );
}
