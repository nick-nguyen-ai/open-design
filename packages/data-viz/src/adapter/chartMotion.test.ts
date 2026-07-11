import { describe, expect, it } from 'vitest';
import { durationsMs } from '@enterprise-design/motion';
import { buildChartAnimationTiming } from './chartMotion.js';

describe('buildChartAnimationTiming', () => {
  it('full motion: series stagger by --dur-state, each drawing over --dur-structure', () => {
    const timing = buildChartAnimationTiming(3, { reducedMotion: false });
    expect(timing.animation).toBe(true);
    expect(timing.seriesAnimationDurationMs).toBe(durationsMs.structure);
    expect(timing.seriesAnimationDelayMs(0)).toBe(0);
    expect(timing.seriesAnimationDelayMs(1)).toBe(durationsMs.state);
    expect(timing.seriesAnimationDelayMs(2)).toBe(durationsMs.state * 2);
  });

  it('annotation (the DataInkDraw "annotation" step) starts only once every series has settled', () => {
    const timing = buildChartAnimationTiming(3, { reducedMotion: false });
    const lastSeriesEndMs = timing.seriesAnimationDelayMs(2) + timing.seriesAnimationDurationMs;
    expect(timing.annotationAnimationDelayMs).toBe(lastSeriesEndMs);
    expect(timing.annotationAnimationDurationMs).toBe(durationsMs.feedback);
  });

  it('reduced motion: animation is disabled entirely (instant, no draw-in)', () => {
    const timing = buildChartAnimationTiming(4, { reducedMotion: true });
    expect(timing.animation).toBe(false);
    expect(timing.seriesAnimationDurationMs).toBe(0);
    expect(timing.seriesAnimationDelayMs(3)).toBe(0);
    expect(timing.annotationAnimationDurationMs).toBe(0);
    expect(timing.annotationAnimationDelayMs).toBe(0);
  });

  it('handles zero series without negative delays', () => {
    const timing = buildChartAnimationTiming(0, { reducedMotion: false });
    expect(timing.annotationAnimationDelayMs).toBe(timing.seriesAnimationDurationMs);
  });

  it('never uses a literal cubic-bezier easing string (MOTION-003 applies to the whole workspace)', () => {
    const timing = buildChartAnimationTiming(2, { reducedMotion: false });
    expect(timing.seriesEasing).not.toMatch(/cubic-bezier\(/);
    expect(timing.annotationEasing).not.toMatch(/cubic-bezier\(/);
  });
});
