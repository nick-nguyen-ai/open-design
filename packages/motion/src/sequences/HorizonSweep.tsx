import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import {
  durationsMs,
  easings,
  REDUCED_MOTION_CAP_MS,
  SIGNATURE_SEQUENCE_CAP_MS,
} from '../adapter.js';
import { buildStaggeredTimeline } from '../timeline.js';
import type { TimelineStep } from '../timeline.js';
import { useMotionPreference } from '../MotionProvider.js';

export interface HorizonSweepItem {
  id: string;
  content: ReactNode;
}

export interface HorizonSweepProps {
  /** Content items registering onto the baseline, in semantic reading order. */
  items: readonly HorizonSweepItem[];
  className?: string;
}

const BASELINE_ID = 'baseline';

/**
 * `horizon-sweep` (plan §4.3): a single baseline draws across the viewport
 * (`--ease-trace`), then content registers onto it from below
 * (`--ease-settle`) — establishing the page's datum line.
 *
 * Full variant: baseline draws over `--dur-narrative` (560ms), then content
 * items stagger-settle by `--dur-feedback` starting once the baseline
 * finishes, each over `--dur-structure`, all capped at 1200ms total. Reduced
 * variant: baseline, then content — both collapse to ordered opacity steps,
 * capped at 400ms.
 */
export function HorizonSweep({ items, className }: HorizonSweepProps) {
  const { reduced } = useMotionPreference();
  const ids = items.map((item) => item.id);
  const cap = reduced ? REDUCED_MOTION_CAP_MS : SIGNATURE_SEQUENCE_CAP_MS;

  const baselineDurationMs = Math.min(reduced ? durationsMs.feedback : durationsMs.narrative, cap);
  const baselineStep: TimelineStep = {
    id: BASELINE_ID,
    delayMs: 0,
    durationMs: baselineDurationMs,
    ease: easings.trace,
  };

  const contentSteps = reduced
    ? buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.feedback / 2,
        stepDurationMs: durationsMs.feedback,
        ease: easings.settle,
        capMs: cap,
        startDelayMs: baselineDurationMs,
      })
    : buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.feedback,
        stepDurationMs: durationsMs.structure,
        ease: easings.settle,
        capMs: cap,
        startDelayMs: baselineDurationMs,
      });

  return (
    <div
      className={className}
      data-motion-sequence="horizon-sweep"
      data-motion-variant={reduced ? 'reduced' : 'full'}
    >
      <motion.div
        data-testid="horizon-sweep-baseline"
        data-delay-ms={baselineStep.delayMs}
        data-duration-ms={baselineStep.durationMs}
        style={{ transformOrigin: 'left' }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
        transition={{
          delay: baselineStep.delayMs / 1000,
          duration: baselineStep.durationMs / 1000,
          ease: baselineStep.ease,
        }}
      />
      {items.map((item, index) => {
        const step = contentSteps[index];
        if (!step) return null;
        return (
          <motion.div
            key={item.id}
            data-testid={`horizon-sweep-item-${item.id}`}
            data-delay-ms={step.delayMs}
            data-duration-ms={step.durationMs}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
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
