import { useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { cx } from './cx.js';

export interface SegmentedControlOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options: readonly SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group — required since there's rarely a visible `<legend>`. */
  'aria-label': string;
  className?: string;
}

/**
 * `role="radiogroup"` of `role="radio"` buttons — the browse-mode switcher.
 * Roving tabindex: only the selected option is a Tab stop; ArrowLeft/Right
 * (and Up/Down) move focus AND selection together (selection-follows-focus,
 * matching native `<input type="radio">` group behaviour), Home/End jump to
 * the first/last option.
 */
export function SegmentedControl({ options, value, onChange, className, ...rest }: SegmentedControlProps) {
  const groupId = useId();
  const refs = useRef(new Map<string, HTMLButtonElement>());

  function focusAndSelect(nextValue: string) {
    onChange(nextValue);
    refs.current.get(nextValue)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = options.length - 1;
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = index === 0 ? last : index - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    const next = options[nextIndex];
    if (next) focusAndSelect(next.value);
  }

  return (
    <div
      role="radiogroup"
      className={cx('inline-flex gap-1 rounded-md border border-border-subtle bg-surface-sunken p-1', className)}
      {...rest}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              if (el) refs.current.set(option.value, el);
              else refs.current.delete(option.value);
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            id={`${groupId}-${option.value}`}
            onClick={() => focusAndSelect(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cx(
              'rounded-sm px-3 py-1.5 text-sm font-weight-medium transition-colors duration-feedback ease-settle',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
              selected
                ? 'bg-surface-raised text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
