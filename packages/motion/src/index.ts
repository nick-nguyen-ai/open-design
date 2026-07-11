// Adapter: derives Motion-consumable configs from the design-tokens VALUES.
export {
  easings,
  durations,
  durationsMs,
  SIGNATURE_SEQUENCE_CAP_MS,
  REDUCED_MOTION_CAP_MS,
} from './adapter.js';
export type { CubicBezierEase } from './adapter.js';

// Shared timeline arithmetic.
export { buildStaggeredTimeline, timelineTotalMs } from './timeline.js';
export type { TimelineStep, BuildStaggeredTimelineOptions } from './timeline.js';

// Reduced-motion resolution.
export { MotionProvider, useMotionPreference } from './MotionProvider.js';
export type { MotionProviderProps } from './MotionProvider.js';

// Signature sequences.
export { LedgerReveal } from './sequences/LedgerReveal.js';
export type { LedgerRevealItem, LedgerRevealProps } from './sequences/LedgerReveal.js';

export { HorizonSweep } from './sequences/HorizonSweep.js';
export type { HorizonSweepItem, HorizonSweepProps } from './sequences/HorizonSweep.js';

export { DataInkDraw, DATA_INK_DEFAULT_ORDER } from './sequences/DataInkDraw.js';
export type { DataInkGroup, DataInkDrawProps } from './sequences/DataInkDraw.js';
