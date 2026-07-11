import type { ReactNode } from 'react';
import { cx } from './cx.js';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * "No results" / "nothing here yet" presentation. `role="status"` (implicit
 * `aria-live="polite"` + `aria-atomic="true"`) so a screen reader announces
 * it when it appears in place of content the user was waiting on (e.g. after
 * a search resolves to zero results) without needing a separate live region.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div role="status" className={cx('flex flex-col items-center gap-2 p-8 text-center', className)}>
      {icon ? (
        <span aria-hidden="true" className="text-text-muted">
          {icon}
        </span>
      ) : null}
      <p className="font-weight-semibold text-text-primary">{title}</p>
      {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
