import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { durations, easings, useMotionPreference } from '@enterprise-design/motion';
import { useModalBehavior } from './useModalBehavior.js';
import { cx } from './cx.js';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Visible heading, used as the dialog's accessible name via `aria-labelledby`. Omit ONLY if `aria-label` is given instead. */
  title?: string;
  'aria-label'?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal dialog: focus-trapped, `Escape` closes, focus restored to the
 * trigger on close, background `inert` + scroll-locked, `role="dialog"` +
 * `aria-modal`. Mount/unmount is synchronous with `open` (no exit-animation
 * unmount delay) — deliberately, so the a11y contract (focus trap active,
 * background inert) never has a moment of disagreement with what's on
 * screen. Only the ENTER transition is animated, via `@enterprise-design/motion`
 * tokens, respecting reduced motion.
 */
export function Dialog({ open, onClose, title, 'aria-label': ariaLabel, children, className }: DialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const { reduced } = useMotionPreference();

  useModalBehavior({ open, onClose, containerRef });

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
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
          'relative z-modal max-w-lg rounded-lg bg-surface-overlay p-6 shadow-xl focus:outline-none',
          className,
        )}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
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
