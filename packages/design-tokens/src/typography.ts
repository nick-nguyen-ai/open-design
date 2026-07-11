/**
 * Typography — non-themed. CDN-free system stacks only (no runtime font fetch).
 * Body/heading/display share the platform UI sans for a precise, native feel;
 * mono/numeric use the platform monospace. `--font-numeric` is paired with
 * `--numeric-figures: tabular-nums` so figures align in columns.
 */
const SANS =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
const MONO =
  'ui-monospace, "Cascadia Code", "Cascadia Mono", "SFMono-Regular", "Consolas", Menlo, monospace';

export const fontFamily = {
  'font-display': SANS,
  'font-heading': SANS,
  'font-body': SANS,
  'font-label': SANS,
  'font-mono': MONO,
  'font-numeric': MONO,
} as const satisfies Record<string, string>;

/**
 * Modular type scale, major third (1.25). Base = 1rem (16px). Sizes double as
 * role sizes: caption→`xs`/`sm`, body→`md`, headings→`lg`..`3xl`, display→`4xl`/`5xl`.
 */
export const fontSize = {
  'font-size-xs': '0.64rem',
  'font-size-sm': '0.8rem',
  'font-size-md': '1rem',
  'font-size-lg': '1.25rem',
  'font-size-xl': '1.5625rem',
  'font-size-2xl': '1.9531rem',
  'font-size-3xl': '2.4414rem',
  'font-size-4xl': '3.0518rem',
  'font-size-5xl': '3.8147rem',
} as const satisfies Record<string, string>;

/** Line heights (unitless) tuned per role: tight for display, normal for body. */
export const lineHeight = {
  'line-height-tight': '1.1',
  'line-height-snug': '1.25',
  'line-height-normal': '1.5',
  'line-height-relaxed': '1.65',
} as const satisfies Record<string, string>;

export const fontWeight = {
  'font-weight-regular': '400',
  'font-weight-medium': '500',
  'font-weight-semibold': '600',
  'font-weight-bold': '700',
} as const satisfies Record<string, string>;

/** Letter spacing — tighten large display, open up small all-caps labels. */
export const letterSpacing = {
  'letter-spacing-tight': '-0.011em',
  'letter-spacing-normal': '0',
  'letter-spacing-wide': '0.02em',
  'letter-spacing-wider': '0.06em',
} as const satisfies Record<string, string>;

/** Figure style. Apply with `font-variant-numeric` where columns must align. */
export const numeric = {
  'numeric-figures': 'tabular-nums',
} as const satisfies Record<string, string>;
