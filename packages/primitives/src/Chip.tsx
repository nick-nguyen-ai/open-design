import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx.js';
import { VisuallyHidden } from './VisuallyHidden.js';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const CHIP_BASE =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ' +
  'transition-colors duration-feedback ease-settle ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';

function toneClass(selected: boolean) {
  return selected
    ? 'border-accent bg-accent-muted text-accent'
    : 'border-border-subtle bg-surface-raised text-text-secondary hover:bg-surface-sunken';
}

/** A toggleable filter chip: native `<button aria-pressed>`. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected = false, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} aria-pressed={selected} className={cx(CHIP_BASE, toneClass(selected), className)} {...rest}>
      {children}
    </button>
  );
});

export interface RemovableChipProps extends HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  /** Accessible label for the remove button, e.g. `"Remove Revenue"`. */
  removeLabel: string;
  onRemove: () => void;
  children: ReactNode;
}

/**
 * A static labelled chip (not itself a toggle button — see `Chip` for
 * that) plus a trailing remove button with its own accessible name and click
 * handler. Used for active filter chips.
 */
export const RemovableChip = forwardRef<HTMLSpanElement, RemovableChipProps>(function RemovableChip(
  { removeLabel, onRemove, selected = false, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx(CHIP_BASE, toneClass(selected), 'pr-1', className)} {...rest}>
      {children}
      <button
        type="button"
        onClick={onRemove}
        className={cx(
          'inline-flex h-5 w-5 items-center justify-center rounded-full text-text-muted hover:bg-surface-sunken hover:text-text-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
        )}
      >
        <span aria-hidden="true">&times;</span>
        <VisuallyHidden>{removeLabel}</VisuallyHidden>
      </button>
    </span>
  );
});
