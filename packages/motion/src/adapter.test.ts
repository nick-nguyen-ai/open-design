import { describe, expect, it } from 'vitest';
import { easing, duration } from '@enterprise-design/design-tokens';
import { durations, durationsMs, easings } from './adapter.js';

/** Formats a Motion ease tuple back into the CSS `cubic-bezier(...)` form. */
function toCssCubicBezier([x1, y1, x2, y2]: readonly [number, number, number, number]): string {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

describe('easings (single source of truth with design-tokens)', () => {
  it('settle/lift/trace/shift round-trip the exact design-tokens cubic-bezier VALUES', () => {
    expect(toCssCubicBezier(easings.settle)).toBe(easing['ease-settle']);
    expect(toCssCubicBezier(easings.lift)).toBe(easing['ease-lift']);
    expect(toCssCubicBezier(easings.trace)).toBe(easing['ease-trace']);
    expect(toCssCubicBezier(easings.shift)).toBe(easing['ease-shift']);
  });

  it('exposes 4-tuples of finite numbers', () => {
    for (const ease of Object.values(easings)) {
      expect(ease).toHaveLength(4);
      for (const component of ease) expect(Number.isFinite(component)).toBe(true);
    }
  });
});

describe('durations (single source of truth with design-tokens)', () => {
  it('durationsMs equals the design-tokens duration VALUES in milliseconds', () => {
    expect(durationsMs.feedback).toBe(Number.parseFloat(duration['dur-feedback']));
    expect(durationsMs.state).toBe(Number.parseFloat(duration['dur-state']));
    expect(durationsMs.structure).toBe(Number.parseFloat(duration['dur-structure']));
    expect(durationsMs.narrative).toBe(Number.parseFloat(duration['dur-narrative']));
  });

  it('durations (seconds) is durationsMs / 1000 — the unit Motion transitions expect', () => {
    expect(durations.feedback).toBeCloseTo(durationsMs.feedback / 1000);
    expect(durations.state).toBeCloseTo(durationsMs.state / 1000);
    expect(durations.structure).toBeCloseTo(durationsMs.structure / 1000);
    expect(durations.narrative).toBeCloseTo(durationsMs.narrative / 1000);
  });

  it('follows the locked duration scale: 90/180/320/560ms', () => {
    expect(durationsMs).toEqual({ feedback: 90, state: 180, structure: 320, narrative: 560 });
  });
});
