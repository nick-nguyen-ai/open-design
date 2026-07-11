import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { durations, easings, useMotionPreference } from '@enterprise-design/motion';
import { useModalBehavior } from './useModalBehavior.js';
import { cx } from './cx.js';

export type DrawerSide = 'left' | 'right';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  'aria-label'?: string;
  side?: DrawerSide;
  children: ReactNode;
  className?: string;
}

const SIDE_POSITION: Record<DrawerSide, string> = {
  left: 'left-0',
  right: 'right-0',
};

const SIDE_OFFSET: Record<DrawerSide, number> = {
  left: -24,
  right: 24,
};

/**
 * Side sheet — identical a11y contract to `Dialog` (focus trap, Escape,
 * focus restore, background inert + scroll-locked, `role="dialog"` +
 * `aria-modal`), anchored to a screen edge instead of centred. Used for
 * quick preview / mobile filters.
 */
export function Drawer({
  open,
  onClose,
  title,
  'aria-label': ariaLabel,
  side = 'right',
  children,
  className,
}: DrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const { reduced } = useMotionPreference();

  useModalBehavior({ open, onClose, containerRef });

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-modal">
      {/* Backdrop: tinted with the `text-primary` ink token (not a raw colour) at 50% so it adapts with theme. */}
      <div className="absolute inset-0 bg-text-primary/50" aria-hidden="true" onClick={onClose} />
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
        className={cx(
          'absolute inset-y-0 flex w-full max-w-sm flex-col bg-surface-overlay p-6 shadow-xl',
          // Visible ring for the container-fallback focus target (see Dialog):
          // a drawer with no focusable descendants focuses the container itself.
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
          SIDE_POSITION[side],
          className,
        )}
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: SIDE_OFFSET[side] }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
        transition={{ duration: durations.state, ease: easings.lift }}
      >
        {title ? (
          <h2 id={titleId} className="mb-4 text-lg font-weight-semibold text-text-primary">
            {title}
          </h2>
        ) : null}
        {children}
      </motion.div>
    </div>,
    document.body,
  );
}
