import type { ReactNode } from 'react';

export interface VisuallyHiddenProps {
  children: ReactNode;
  /** Render as a different element than the default `<span>` (e.g. `"div"`). */
  as?: 'span' | 'div';
  className?: string;
}

/**
 * Content present for assistive tech / the accessible name tree, but not
 * rendered visually. Uses Tailwind's built-in `sr-only` utility (shipped by
 * `tailwindcss` core, not something this package needs to bridge).
 */
export function VisuallyHidden({ children, as = 'span', className }: VisuallyHiddenProps) {
  const Tag = as;
  return <Tag className={className ? `sr-only ${className}` : 'sr-only'}>{children}</Tag>;
}
