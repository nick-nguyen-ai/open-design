import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cx } from './cx.js';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'aria-label'> {
  /** Visible label text. Omit ONLY if `aria-label` is provided instead. */
  label?: string;
  /** Escape hatch for a visually-labelled-elsewhere field; required if `label` is omitted. */
  'aria-label'?: string;
  /** Supporting hint text, tied via `aria-describedby`. */
  description?: string;
  /** Error message; when present also sets `aria-invalid`. */
  error?: string;
  containerClassName?: string;
}

const INPUT_BASE =
  'w-full rounded-md border bg-surface-raised px-3 text-text-primary placeholder:text-text-muted ' +
  'border-border-strong transition-colors duration-feedback ease-settle ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger-border';

/**
 * Labelled text input. Either `label` (renders a visible `<label>`) or
 * `aria-label` (visually-labelled-elsewhere escape hatch) is required — TS
 * doesn't enforce the "one of" at the type level (both are optional props for
 * ergonomics), so this is a runtime contract documented here and covered by
 * the a11y test asserting an accessible name is always present.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    description,
    error,
    id,
    className,
    containerClassName,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('flex flex-col gap-1', containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cx(INPUT_BASE, 'h-10', className)}
        {...rest}
      />
      {description ? (
        <p id={descriptionId} className="text-sm text-text-muted">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-danger-fg" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
