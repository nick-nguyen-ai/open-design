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

export interface DataInkGroup {
  id: string;
  content: ReactNode;
}

export interface DataInkDrawProps {
  /**
   * Groups in semantic reading order. The platform default is
   * axes -> series -> annotation (plan §4.3); a chart declaring additional
   * groups (e.g. affordances) appends them after annotation. `DataInkDraw`
   * never reorders groups itself — order is the caller's contract.
   */
  groups: readonly DataInkGroup[];
  /** Wrap each group as an SVG `<g>` (charts) or a `<div>` (default `'div'`). */
  as?: 'g' | 'div';
  className?: string;
}

/** The platform-recommended semantic order for chart groups (plan §4.3). */
export const DATA_INK_DEFAULT_ORDER = ['axes', 'series', 'annotation'] as const;

/**
 * `data-ink-draw` (plan §4.3): an orchestrator that reveals grouped chart
 * content along its own semantic order — axes, then series, then annotation
 * — using `--ease-trace`, so the chart teaches its own reading order. Charts
 * wrap their SVG groups' content in the `groups` prop; `DataInkDraw` owns
 * only the sequencing, not the per-mark draw geometry (that is chart-specific
 * and out of scope for this package).
 *
 * Full variant: groups stagger-start by `--dur-state` (180ms), each drawing
 * in over `--dur-structure` (320ms), capped at 1200ms. Reduced variant:
 * same group order as opacity steps, capped at 400ms.
 */
export function DataInkDraw({ groups, as = 'div', className }: DataInkDrawProps) {
  const { reduced } = useMotionPreference();
  const ids = groups.map((group) => group.id);

  const steps = reduced
    ? buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.feedback / 2,
        stepDurationMs: durationsMs.feedback,
        ease: easings.trace,
        capMs: REDUCED_MOTION_CAP_MS,
      })
    : buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.state,
        stepDurationMs: durationsMs.structure,
        ease: easings.trace,
        capMs: SIGNATURE_SEQUENCE_CAP_MS,
      });

  const groupNodes = groups.map((group, index) => {
    const step = steps[index];
    if (!step) return null;
    return renderGroup(group, step, as);
  });

  if (as === 'g') {
    return (
      <g
        className={className}
        data-motion-sequence="data-ink-draw"
        data-motion-variant={reduced ? 'reduced' : 'full'}
      >
        {groupNodes}
      </g>
    );
  }

  return (
    <div
      className={className}
      data-motion-sequence="data-ink-draw"
      data-motion-variant={reduced ? 'reduced' : 'full'}
    >
      {groupNodes}
    </div>
  );
}

function renderGroup(group: DataInkGroup, step: TimelineStep, as: 'g' | 'div') {
  const transition = {
    delay: step.delayMs / 1000,
    duration: step.durationMs / 1000,
    ease: step.ease,
  };
  const testProps = {
    'data-testid': `data-ink-draw-group-${group.id}`,
    'data-delay-ms': step.delayMs,
    'data-duration-ms': step.durationMs,
  };

  if (as === 'g') {
    return (
      <motion.g
        key={group.id}
        {...testProps}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
      >
        {group.content}
      </motion.g>
    );
  }

  return (
    <motion.div
      key={group.id}
      {...testProps}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      {group.content}
    </motion.div>
  );
}
