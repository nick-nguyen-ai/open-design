import type { ReactNode } from 'react';
import { cx } from './cx.js';

export interface SkipLinkProps {
  /** id (no `#`) of the main-content landmark to jump to. */
  targetId: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Hidden until focused; the first Tab stop on a page should reveal it so
 * keyboard users can bypass repeated nav to reach main content.
 */
export function SkipLink({ targetId, children = 'Skip to main content', className }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cx(
        'sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-toast',
        'focus:rounded-md focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-text-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
        className,
      )}
    >
      {children}
    </a>
  );
}
