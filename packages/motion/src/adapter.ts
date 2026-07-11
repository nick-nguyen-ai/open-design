/**
 * Adapter over Motion for React (motion.dev, `motion/react`).
 *
 * This is the ONLY place that parses the design-tokens easing/duration VALUES
 * (`--ease-*`, `--dur-*`) into Motion-consumable shapes. Sequences and,
 * eventually, components import `easings`/`durations` from here — never raw
 * Motion eases, library spring defaults, or literal `cubic-bezier(...)`
 * strings (MOTION-003; enforced outside this package and
 * `@enterprise-design/design-tokens` by the root ESLint guard).
 */
import { easing, duration } from '@enterprise-design/design-tokens';

/** A Motion `ease` cubic-bezier tuple: `[x1, y1, x2, y2]`. */
export type CubicBezierEase = readonly [number, number, number, number];

const CUBIC_BEZIER_PATTERN =
  /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/;

function parseCubicBezier(value: string): CubicBezierEase {
  const match = CUBIC_BEZIER_PATTERN.exec(value);
  if (!match) {
    throw new Error(`Expected a cubic-bezier(...) token value, got: ${value}`);
  }
  const [, x1, y1, x2, y2] = match as unknown as [string, string, string, string, string];
  return [Number(x1), Number(y1), Number(x2), Number(y2)];
}

const MS_PATTERN = /^([\d.]+)ms$/;

function parseMs(value: string): number {
  const match = MS_PATTERN.exec(value);
  if (!match) {
    throw new Error(`Expected a "<number>ms" token value, got: ${value}`);
  }
  return Number(match[1]);
}

/**
 * Motion `ease` cubic-bezier tuples, derived from the design-tokens easing
 * VALUES — the single source of truth shared with the CSS token layer.
 */
export const easings = {
  settle: parseCubicBezier(easing['ease-settle']),
  lift: parseCubicBezier(easing['ease-lift']),
  trace: parseCubicBezier(easing['ease-trace']),
  shift: parseCubicBezier(easing['ease-shift']),
} as const satisfies Record<string, CubicBezierEase>;

/** Durations in milliseconds, derived from the design-tokens duration VALUES. */
export const durationsMs = {
  feedback: parseMs(duration['dur-feedback']),
  state: parseMs(duration['dur-state']),
  structure: parseMs(duration['dur-structure']),
  narrative: parseMs(duration['dur-narrative']),
} as const satisfies Record<string, number>;

/** Durations in seconds — the unit Motion's `transition.duration` expects. */
export const durations = {
  feedback: durationsMs.feedback / 1000,
  state: durationsMs.state / 1000,
  structure: durationsMs.structure / 1000,
  narrative: durationsMs.narrative / 1000,
} as const satisfies Record<string, number>;

/** Signature-sequence hard cap in ms (plan §4.3): full sequences never exceed this. */
export const SIGNATURE_SEQUENCE_CAP_MS = 1200;

/** Reduced-motion hard cap in ms (plan §4.3): reduced variants never exceed this. */
export const REDUCED_MOTION_CAP_MS = 400;
