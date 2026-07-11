/**
 * Pure timeline arithmetic shared by every signature sequence. Deliberately
 * has no Motion / React dependency so it is trivial to unit-test the actual
 * ordering and durations a sequence will hand to Motion, without touching
 * Motion internals.
 */
import type { CubicBezierEase } from './adapter.js';

export interface TimelineStep {
  id: string;
  delayMs: number;
  durationMs: number;
  ease: CubicBezierEase;
}

export interface BuildStaggeredTimelineOptions {
  /** Item ids in SEMANTIC (reading) order — this function never reorders them. */
  ids: readonly string[];
  /** Gap between the start of consecutive steps. */
  staggerMs: number;
  /** How long each individual step's own motion takes. */
  stepDurationMs: number;
  ease: CubicBezierEase;
  /** Hard cap on total wall-clock time (delay of the last step + its duration). */
  capMs: number;
  /** Delay added to every step, e.g. to sequence after a prior phase. */
  startDelayMs?: number;
}

/**
 * Builds an ordered, staggered reveal timeline for `ids`.
 *
 * If the naive stagger would push the sequence past `capMs`, stagger AND step
 * duration scale down together so the invariant `total <= capMs` holds
 * unconditionally, regardless of item count — sequences never silently exceed
 * their budget (plan §4.3: signature sequences <= 1200ms, reduced <= 400ms).
 */
export function buildStaggeredTimeline(options: BuildStaggeredTimelineOptions): TimelineStep[] {
  const { ids, staggerMs, stepDurationMs, ease, capMs, startDelayMs = 0 } = options;
  const n = ids.length;
  if (n === 0) return [];

  const budget = Math.max(0, capMs - startDelayMs);
  const naiveTotal = (n - 1) * staggerMs + stepDurationMs;
  const scale = naiveTotal > budget && naiveTotal > 0 ? budget / naiveTotal : 1;
  const effectiveStagger = staggerMs * scale;
  const effectiveDuration = stepDurationMs * scale;

  return ids.map((id, index) => ({
    id,
    delayMs: startDelayMs + index * effectiveStagger,
    durationMs: effectiveDuration,
    ease,
  }));
}

/** Total wall-clock duration of a timeline (last step's delay + its own duration). */
export function timelineTotalMs(steps: readonly TimelineStep[]): number {
  return steps.reduce((max, step) => Math.max(max, step.delayMs + step.durationMs), 0);
}
