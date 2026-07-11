import type { HTMLAttributes } from 'react';
import { useMotionPreference } from '@enterprise-design/motion';
import { cx } from './cx.js';

export type SkeletonShape = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
}

const SHAPE: Record<SkeletonShape, string> = {
  text: 'rounded-sm',
  circular: 'rounded-full',
  rectangular: 'rounded-md',
};

/**
 * Loading placeholder. `aria-hidden` — a Skeleton never carries meaning of
 * its own; the region it's inside should announce its OWN loading state
 * separately (e.g. a `role="status"` "Loading…" sibling) if that matters to
 * assistive tech. Shimmer animation is skipped under reduced motion.
 */
export function Skeleton({ shape = 'text', width, height, className, style, ...rest }: SkeletonProps) {
  const { reduced } = useMotionPreference();

  return (
    <div
      role="presentation"
      aria-hidden="true"
      data-motion-variant={reduced ? 'reduced' : 'full'}
      className={cx('bg-surface-sunken', SHAPE[shape], !reduced && 'animate-skeleton-shimmer', className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
