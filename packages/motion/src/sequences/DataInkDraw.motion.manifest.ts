import type { MotionSequence } from '@enterprise-design/contracts';

/**
 * Registry manifest for the `data-ink-draw` signature sequence implemented in
 * `./DataInkDraw.tsx` (plan §4.3). Metadata only — the `order` below matches
 * the component's own exported `DATA_INK_DEFAULT_ORDER` constant exactly.
 */
const dataInkDrawMotion: MotionSequence = {
  sequenceId: 'data-ink-draw',
  name: 'Data Ink Draw',
  description:
    'Chart marks draw along their own geometry — axes first, then series, then annotation — using --ease-trace, so the chart teaches its own reading order. Groups stagger-start by --dur-state (180ms) and each draws in over --dur-structure (320ms), scaled together to stay within the 1200ms signature-sequence budget. Natural home: all analytical charts (KPI trend lines, category comparisons).',
  trigger: 'enter',
  order: ['axes', 'series', 'annotation'],
  totalDurationMs: 1200,
  reducedMotionVariant:
    'The same axes / series / annotation order collapses to opacity-only steps, halved stagger (--dur-feedback / 2), capped at the 400ms reduced-motion budget — the chart still teaches its reading order, just without the draw-on animation.',
};

export default dataInkDrawMotion;
