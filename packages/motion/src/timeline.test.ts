import { describe, expect, it } from 'vitest';
import { buildStaggeredTimeline, timelineTotalMs } from './timeline.js';

const EASE = [0.2, 0, 0, 1] as const;

describe('buildStaggeredTimeline', () => {
  it('returns an empty timeline for no ids', () => {
    expect(
      buildStaggeredTimeline({
        ids: [],
        staggerMs: 90,
        stepDurationMs: 320,
        ease: EASE,
        capMs: 1200,
      }),
    ).toEqual([]);
  });

  it('preserves input (semantic) order and staggers by index, never reordering', () => {
    const steps = buildStaggeredTimeline({
      ids: ['axes', 'series', 'annotation'],
      staggerMs: 90,
      stepDurationMs: 320,
      ease: EASE,
      capMs: 1200,
    });
    expect(steps.map((s) => s.id)).toEqual(['axes', 'series', 'annotation']);
    expect(steps[0]?.delayMs).toBe(0);
    expect(steps[1]?.delayMs).toBe(90);
    expect(steps[2]?.delayMs).toBe(180);
    for (const step of steps) {
      expect(step.durationMs).toBe(320);
      expect(step.ease).toBe(EASE);
    }
  });

  it('applies startDelayMs uniformly (e.g. a sequence phase that runs after a prior phase)', () => {
    const steps = buildStaggeredTimeline({
      ids: ['a', 'b'],
      staggerMs: 90,
      stepDurationMs: 320,
      ease: EASE,
      capMs: 1200,
      startDelayMs: 560,
    });
    expect(steps[0]?.delayMs).toBe(560);
    expect(steps[1]?.delayMs).toBe(650);
  });

  it('never exceeds capMs, scaling stagger and duration down together when it would', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `item-${i}`);
    const steps = buildStaggeredTimeline({
      ids,
      staggerMs: 90,
      stepDurationMs: 320,
      ease: EASE,
      capMs: 1200,
    });
    expect(timelineTotalMs(steps)).toBeLessThanOrEqual(1200);
    // Order is still preserved after scaling.
    expect(steps.map((s) => s.id)).toEqual(ids);
  });

  it('respects the 400ms reduced-motion cap under the same scaling guarantee', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `item-${i}`);
    const steps = buildStaggeredTimeline({
      ids,
      staggerMs: 45,
      stepDurationMs: 90,
      ease: EASE,
      capMs: 400,
    });
    expect(timelineTotalMs(steps)).toBeLessThanOrEqual(400);
  });

  it('leaves the timeline untouched when it already fits within the cap', () => {
    const steps = buildStaggeredTimeline({
      ids: ['a', 'b'],
      staggerMs: 90,
      stepDurationMs: 320,
      ease: EASE,
      capMs: 1200,
    });
    expect(steps).toEqual([
      { id: 'a', delayMs: 0, durationMs: 320, ease: EASE },
      { id: 'b', delayMs: 90, durationMs: 320, ease: EASE },
    ]);
  });
});

describe('timelineTotalMs', () => {
  it('is 0 for an empty timeline', () => {
    expect(timelineTotalMs([])).toBe(0);
  });

  it('is the max of delay + duration across steps', () => {
    const steps = [
      { id: 'a', delayMs: 0, durationMs: 100, ease: EASE },
      { id: 'b', delayMs: 50, durationMs: 200, ease: EASE },
    ];
    expect(timelineTotalMs(steps)).toBe(250);
  });
});
