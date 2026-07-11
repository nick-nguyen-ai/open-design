import type { HTMLAttributes } from 'react';
import { cx } from './cx.js';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONE: Record<BadgeTone, string> = {
  neutral: 'bg-surface-sunken text-text-secondary border border-border-subtle',
  accent: 'bg-accent-muted text-accent border border-accent',
  success: 'bg-success-bg text-success-fg border border-success-border',
  warning: 'bg-warning-bg text-warning-fg border border-warning-border',
  danger: 'bg-danger-bg text-danger-fg border border-danger-border',
  info: 'bg-info-bg text-info-fg border border-info-border',
};

/**
 * A small status/label element (approval state, motion-level, category tag).
 * Purely presentational — no implicit ARIA role. Its accessible name is
 * whatever text content it wraps, exposed automatically to the accessibility
 * tree with no special handling needed.
 */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        TONE[tone],
        className,
      )}
      {...rest}
    />
  );
}

/**
 * Same primitive as `Badge`, re-exported under the name used for
 * categorisation/labelling call sites (e.g. content tags) — not a separate
 * implementation, just a clearer name at the call site.
 */
export const Tag = Badge;
