import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-body font-medium ' +
  'transition-colors duration-feedback ease-settle ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-text-on-accent hover:bg-accent-hover',
  secondary:
    'bg-surface-raised text-text-primary border border-border-strong hover:bg-surface-sunken',
  ghost: 'bg-transparent text-text-primary hover:bg-surface-sunken',
  danger: 'bg-danger-bg text-danger-fg border border-danger-border hover:bg-danger-border',
};

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-md',
};

/** Native `<button>` — the accessible-name and keyboard-activation contract come free. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', disabled = false, leadingIcon, trailingIcon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cx(BASE, VARIANT[variant], SIZE[size], className)}
      {...rest}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {leadingIcon}
        </span>
      ) : null}
      {children}
      {trailingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});
