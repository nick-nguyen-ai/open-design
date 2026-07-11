import { forwardRef, useId, useRef } from 'react';
import type { InputHTMLAttributes, Ref } from 'react';
import { cx } from './cx.js';
import { VisuallyHidden } from './VisuallyHidden.js';

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'aria-label'> {
  label?: string;
  'aria-label'?: string;
  /** Called with `''` when the clear button is activated (in addition to a native `onChange`). */
  onClear?: () => void;
  containerClassName?: string;
}

const INPUT_BASE =
  'w-full rounded-md border bg-surface-raised pl-3 pr-9 text-text-primary placeholder:text-text-muted ' +
  'border-border-strong transition-colors duration-feedback ease-settle ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as { current: T | null }).current = node;
    }
  };
}

/**
 * `type="search"` gets the implicit `searchbox` role for free; the wrapper
 * carries the `search` landmark role for the (typically singular) page
 * search region. Clearable: a trailing button with an accessible label that
 * clears the value and returns focus to the input.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { label, id, className, containerClassName, 'aria-label': ariaLabel, onClear, value, onChange, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const innerRef = useRef<HTMLInputElement>(null);
  const hasValue = typeof value === 'string' && value.length > 0;

  function handleClear() {
    onClear?.();
    innerRef.current?.focus();
  }

  return (
    <div role="search" className={cx('flex flex-col gap-1', containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={mergeRefs(ref, innerRef)}
          id={inputId}
          type="search"
          aria-label={label ? undefined : ariaLabel}
          className={cx(INPUT_BASE, 'h-10', className)}
          value={value}
          onChange={onChange}
          {...rest}
        />
        {hasValue && onClear ? (
          <button
            type="button"
            onClick={handleClear}
            className={cx(
              'absolute inset-y-0 right-2 flex items-center text-text-muted hover:text-text-primary',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
            )}
          >
            <span aria-hidden="true">&times;</span>
            <VisuallyHidden>Clear search</VisuallyHidden>
          </button>
        ) : null}
      </div>
    </div>
  );
});
