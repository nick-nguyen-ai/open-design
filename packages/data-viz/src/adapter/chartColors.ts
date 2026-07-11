/**
 * Chart colour resolution: derives series colours from the semantic chart
 * tokens (`--chart-cat-*` / `--chart-seq-*` / `--chart-div-*`) rather than
 * hard-coding hex values in chart code, so a chart re-colours automatically
 * when `@enterprise-design/themes` swaps `[data-theme]`.
 *
 * `resolveChartColors` is the PURE half: given a `getVar` reader, it returns
 * the resolved palette with no DOM dependency, so it is directly
 * unit-testable with a fake reader. The fallback palette (used when no CSS
 * variable is present, e.g. in a DOM-less test) is read from
 * `@enterprise-design/themes`' light values — never a literal hex duplicated
 * in this file.
 */
import { lightValues } from '@enterprise-design/themes';

export type ChartColorScale = 'categorical' | 'sequential' | 'diverging';

const CATEGORICAL_KEYS = [
  'chart-cat-1',
  'chart-cat-2',
  'chart-cat-3',
  'chart-cat-4',
  'chart-cat-5',
  'chart-cat-6',
  'chart-cat-7',
  'chart-cat-8',
] as const;

const SEQUENTIAL_KEYS = [
  'chart-seq-1',
  'chart-seq-2',
  'chart-seq-3',
  'chart-seq-4',
  'chart-seq-5',
  'chart-seq-6',
  'chart-seq-7',
] as const;

const DIVERGING_KEYS = [
  'chart-div-1',
  'chart-div-2',
  'chart-div-3',
  'chart-div-4',
  'chart-div-5',
  'chart-div-6',
  'chart-div-7',
] as const;

const SCALE_KEYS: Record<ChartColorScale, readonly string[]> = {
  categorical: CATEGORICAL_KEYS,
  sequential: SEQUENTIAL_KEYS,
  diverging: DIVERGING_KEYS,
};

/** `--chart-*` token name -> its light-theme fallback value (never a literal hex). */
const FALLBACK_BY_KEY: Record<string, string> = Object.fromEntries(
  [...CATEGORICAL_KEYS, ...SEQUENTIAL_KEYS, ...DIVERGING_KEYS].map((key) => [key, lightValues[key]]),
);

/** Reads a `--<name>` CSS custom property off `document.documentElement`. */
export function defaultCssVarReader(name: string): string | undefined {
  if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') return undefined;
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
  return value.length > 0 ? value : undefined;
}

/**
 * Resolves the full palette for a chart colour scale. `getVar` defaults to
 * reading live CSS custom properties; tests pass a fake reader (or omit CSS
 * entirely) to exercise the fallback path with no DOM at all.
 */
export function resolveChartColors(
  scale: ChartColorScale,
  getVar: (name: string) => string | undefined = defaultCssVarReader,
): string[] {
  return SCALE_KEYS[scale].map((key) => getVar(key) ?? FALLBACK_BY_KEY[key] ?? lightValues['text-muted']);
}
