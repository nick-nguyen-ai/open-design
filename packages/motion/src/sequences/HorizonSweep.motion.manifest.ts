import type { MotionSequence } from '@enterprise-design/contracts';

/**
 * Registry manifest for the `horizon-sweep` signature sequence implemented in
 * `./HorizonSweep.tsx` (plan §4.3). Metadata only — transcribed from the real
 * component, not invented.
 */
const horizonSweepMotion: MotionSequence = {
  sequenceId: 'horizon-sweep',
  name: 'Horizon Sweep',
  description:
    'A single baseline draws across the viewport on --ease-trace over --dur-narrative (560ms), establishing the page datum line; content then registers onto it from below on --ease-settle, staggering by --dur-feedback per item over --dur-structure each, starting once the baseline finishes. The whole sequence is scaled to stay within the 1200ms signature-sequence budget. Natural home: executive pages and slide sections.',
  trigger: 'navigate',
  order: ['baseline', 'content'],
  totalDurationMs: 1200,
  reducedMotionVariant:
    'Baseline, then content — both collapse to ordered opacity-only steps (no scaleX / translate) in the same two-phase order, capped at the 400ms reduced-motion budget.',
};

export default horizonSweepMotion;
