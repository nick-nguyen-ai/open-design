import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import {
  durationsMs,
  easings,
  REDUCED_MOTION_CAP_MS,
  SIGNATURE_SEQUENCE_CAP_MS,
} from '../adapter.js';
import { buildStaggeredTimeline } from '../timeline.js';
import { useMotionPreference } from '../MotionProvider.js';

export interface LedgerRevealItem {
  id: string;
  content: ReactNode;
}

export interface LedgerRevealProps {
  /** Items in READING order — the reveal order. Never randomised or positional. */
  items: readonly LedgerRevealItem[];
  className?: string;
}

/**
 * `ledger-reveal` (plan §4.3): numeric/tabular content resolves from a
 * neutral placeholder to its final value in reading order, with a single
 * settle — no counting-up theatrics, values arrive once.
 *
 * Full variant: `--ease-settle`, items stagger-start by `--dur-feedback`
 * (90ms) and each settles over `--dur-structure` (320ms), capped at 1200ms.
 * Reduced variant: same reading order, opacity-only (no translate), capped
 * at 400ms.
 */
export function LedgerReveal({ items, className }: LedgerRevealProps) {
  const { reduced } = useMotionPreference();
  const ids = items.map((item) => item.id);

  const steps = reduced
    ? buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.feedback / 2,
        stepDurationMs: durationsMs.feedback,
        ease: easings.settle,
        capMs: REDUCED_MOTION_CAP_MS,
      })
    : buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.feedback,
        stepDurationMs: durationsMs.structure,
        ease: easings.settle,
        capMs: SIGNATURE_SEQUENCE_CAP_MS,
      });

  return (
    <div
      className={className}
      data-motion-sequence="ledger-reveal"
      data-motion-variant={reduced ? 'reduced' : 'full'}
    >
      {items.map((item, index) => {
        const step = steps[index];
        if (!step) return null;
        return (
          <motion.div
            key={item.id}
            data-testid={`ledger-reveal-item-${item.id}`}
            data-delay-ms={step.delayMs}
            data-duration-ms={step.durationMs}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{
              delay: step.delayMs / 1000,
              duration: step.durationMs / 1000,
              ease: step.ease,
            }}
          >
            {item.content}
          </motion.div>
        );
      })}
    </div>
  );
}
