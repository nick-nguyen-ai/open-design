import { Button } from './Button.js';
import { cx } from './cx.js';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Error presentation with an optional retry action. `role="alert"` (implicit
 * `aria-live="assertive"` + `aria-atomic="true"`) so it interrupts and is
 * announced immediately — appropriate since an error, unlike an empty state,
 * needs urgent attention.
 */
export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cx('flex flex-col items-center gap-2 p-8 text-center', className)}>
      <p className="font-semibold text-danger-fg">{title}</p>
      {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
