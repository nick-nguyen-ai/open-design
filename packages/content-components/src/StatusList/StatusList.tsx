import { Badge, EmptyState, ErrorState, Skeleton, VisuallyHidden } from '@enterprise-design/primitives';
import type { BadgeTone } from '@enterprise-design/primitives';
import type { ReactNode } from 'react';
import {
  CheckCircleIcon,
  DashCircleIcon,
  InfoCircleIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from '../icons.js';

export type StatusKind = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusListItemDatum {
  id: string;
  label: string;
  status: StatusKind;
  description?: string;
  /** ISO 8601 timestamp — present for an `event-log` style list, absent for a plain `categorical` list. */
  timestamp?: string;
}

export type StatusListState = 'default' | 'loading' | 'empty' | 'error';

export interface StatusListProps {
  items: StatusListItemDatum[];
  title?: string;
  state?: StatusListState;
  loadingCount?: number;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
  /**
   * IANA time zone for rendering item timestamps (e.g. `'UTC'`). Defaults to
   * the viewer's local zone. Pass this when the surrounding page shows a clock
   * in a fixed zone — otherwise the list's stamps silently disagree with it.
   */
  timeZone?: string;
}

const STATUS_LABEL: Record<StatusKind, string> = {
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Info',
  neutral: 'Neutral',
};

const STATUS_TONE: Record<StatusKind, BadgeTone> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  neutral: 'neutral',
};

const STATUS_ICON: Record<StatusKind, () => ReactNode> = {
  success: CheckCircleIcon,
  warning: TriangleAlertIcon,
  danger: OctagonXIcon,
  info: InfoCircleIcon,
  neutral: DashCircleIcon,
};

const FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function timestampFormatter(timeZone: string | undefined): Intl.DateTimeFormat {
  const key = timeZone ?? 'local';
  let formatter = FORMATTERS.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone });
    FORMATTERS.set(key, formatter);
  }
  return formatter;
}

function formatTimestamp(timestamp: string, timeZone: string | undefined): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : timestampFormatter(timeZone).format(date);
}

function StatusListRow({ item, timeZone }: { item: StatusListItemDatum; timeZone?: string }) {
  const StatusIcon = STATUS_ICON[item.status];
  return (
    <li className="flex items-start gap-3 border-b border-border-subtle py-3 last:border-b-0">
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-text-secondary">
        <StatusIcon />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-text-primary">{item.label}</span>
          <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
        </div>
        {item.description ? <span className="text-sm text-text-secondary">{item.description}</span> : null}
      </div>
      {item.timestamp ? (
        <time dateTime={item.timestamp} className="shrink-0 text-xs font-numeric text-text-muted">
          {formatTimestamp(item.timestamp, timeZone)}
        </time>
      ) : null}
    </li>
  );
}

function LoadingRows({ count }: { count: number }) {
  return (
    <div role="status" aria-label="Loading status list" className="flex flex-col gap-2">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} shape="rectangular" height={48} />
      ))}
      <VisuallyHidden>Loading status list…</VisuallyHidden>
    </div>
  );
}

/**
 * A list of status items (`categorical` or, with `timestamp`, `event-log`
 * data) — each row encodes its status via a Badge tone AND a distinct icon
 * shape, so colour is never the only signal.
 */
export function StatusList({ items, title, state, loadingCount = 3, errorMessage, onRetry, className, timeZone }: StatusListProps) {
  const resolvedState = state ?? (items.length === 0 ? 'empty' : 'default');

  if (resolvedState === 'loading') {
    return (
      <div className={className}>
        <LoadingRows count={loadingCount} />
      </div>
    );
  }

  if (resolvedState === 'error') {
    return (
      <ErrorState title="Couldn't load status list" description={errorMessage} onRetry={onRetry} className={className} />
    );
  }

  if (resolvedState === 'empty') {
    return <EmptyState title="No status items" description="Items will appear here once available." className={className} />;
  }

  return (
    <ul aria-label={title} className={className}>
      {items.map((item) => (
        <StatusListRow key={item.id} item={item} timeZone={timeZone} />
      ))}
    </ul>
  );
}
