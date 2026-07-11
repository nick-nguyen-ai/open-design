/**
 * Chart draw-in timing, sourced from `@enterprise-design/motion`'s duration
 * tokens so charts share ONE motion identity with the rest of the platform.
 *
 * `data-ink-draw` (plan §4.3) is authored as a React component that wraps
 * DOM children it can independently animate as `<motion.g>`/`<motion.div>`
 * groups. ECharts owns its own render pipeline internally (it does not hand
 * back React-controlled axis/series/annotation elements to wrap), so this
 * adapter reproduces `data-ink-draw`'s SEMANTIC order — axes are immediate
 * (they establish the frame before anything else appears), series draw in
 * next staggered by `--dur-state`, each animating over `--dur-structure`,
 * and any annotation (e.g. an average `markLine`, a target `scatter` marker)
 * animates in last, once every series has settled — using ECharts' native
 * `animationDuration`/`animationDelay`/`animationEasing` options instead of
 * the React wrapper.
 *
 * ECharts' `animationEasing` only accepts named easing curves (or a runtime
 * easing FUNCTION), not a raw `cubic-bezier(...)` string — so this adapter
 * uses ECharts' built-in `'cubicOut'`/`'quadraticOut'` curves (a decelerate
 * shape matching `--ease-trace`'s intent) rather than vendoring a bezier
 * sampler to reproduce the exact curve. Durations remain fully governed by
 * the shared token system via `durationsMs`; only the easing CURVE is
 * approximated, and no literal `cubic-bezier(...)` value appears anywhere in
 * this package (MOTION-003).
 */
import { durationsMs } from '@enterprise-design/motion';

export interface ChartAnimationTiming {
  /** Global ECharts `animation` switch — `false` under reduced motion (instant, no draw-in). */
  animation: boolean;
  seriesAnimationDurationMs: number;
  /** Per-series stagger delay, in semantic (reading) series order. */
  seriesAnimationDelayMs: (seriesIndex: number) => number;
  annotationAnimationDurationMs: number;
  /** Annotation always starts once every series has finished settling. */
  annotationAnimationDelayMs: number;
  seriesEasing: 'cubicOut';
  annotationEasing: 'quadraticOut';
}

export interface BuildChartAnimationTimingOptions {
  reducedMotion: boolean;
}

/**
 * Computes draw-in timing for a chart with `seriesCount` series. Pure and
 * DOM-free: safe to unit-test the exact millisecond values ECharts will
 * receive without touching ECharts or the DOM at all.
 */
export function buildChartAnimationTiming(
  seriesCount: number,
  options: BuildChartAnimationTimingOptions,
): ChartAnimationTiming {
  if (options.reducedMotion) {
    // Reduced-motion: draw-in collapses to instant. ECharts' global
    // `animation: false` renders the final state with no transition at all —
    // a stricter and simpler guarantee than plan §4.3's 400ms reduced-motion
    // cap (an instant render trivially satisfies "capped at 400ms").
    return {
      animation: false,
      seriesAnimationDurationMs: 0,
      seriesAnimationDelayMs: () => 0,
      annotationAnimationDurationMs: 0,
      annotationAnimationDelayMs: 0,
      seriesEasing: 'cubicOut',
      annotationEasing: 'quadraticOut',
    };
  }

  const stagger = durationsMs.state;
  const seriesDuration = durationsMs.structure;
  const seriesTotalMs = Math.max(0, seriesCount - 1) * stagger + seriesDuration;

  return {
    animation: true,
    seriesAnimationDurationMs: seriesDuration,
    seriesAnimationDelayMs: (seriesIndex) => seriesIndex * stagger,
    annotationAnimationDurationMs: durationsMs.feedback,
    annotationAnimationDelayMs: seriesTotalMs,
    seriesEasing: 'cubicOut',
    annotationEasing: 'quadraticOut',
  };
}
