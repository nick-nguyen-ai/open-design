/**
 * The THEMED token contract. These tokens are declared here as NAMES only — a
 * theme (in `@enterprise-design/themes`) supplies the concrete value for each.
 *
 * This array is the single source of truth for theme completeness: the themes
 * package must provide a value for every name here, in both light and dark. The
 * completeness test in that package enforces it against `themedTokenNames`.
 *
 * Ordering here is the emission order in the generated CSS (deterministic).
 */
export const themedTokenNames = [
  // Surfaces — luminance-ordered planes (sunken < base < raised < overlay).
  'surface-base',
  'surface-raised',
  'surface-sunken',
  'surface-overlay',
  // Text — ink roles. All body roles must clear WCAG AA on base + raised.
  'text-primary',
  'text-secondary',
  'text-muted',
  'text-on-accent',
  // Borders.
  'border-subtle',
  'border-strong',
  // Focus.
  'focus-ring',
  // Accent — one confident signal.
  'accent',
  'accent-hover',
  'accent-muted',
  // Status — each carries fg (text/icon) / bg (fill) / border. Never colour-alone.
  'success-fg',
  'success-bg',
  'success-border',
  'warning-fg',
  'warning-bg',
  'warning-border',
  'danger-fg',
  'danger-bg',
  'danger-border',
  'info-fg',
  'info-bg',
  'info-border',
  // Chart categorical — fixed-order identity hues (see dataviz skill). Never cycled.
  'chart-cat-1',
  'chart-cat-2',
  'chart-cat-3',
  'chart-cat-4',
  'chart-cat-5',
  'chart-cat-6',
  'chart-cat-7',
  'chart-cat-8',
  // Chart sequential — single-hue magnitude ramp, light → dark.
  'chart-seq-1',
  'chart-seq-2',
  'chart-seq-3',
  'chart-seq-4',
  'chart-seq-5',
  'chart-seq-6',
  'chart-seq-7',
  // Chart diverging — two poles + neutral midpoint (index 4 = midpoint).
  'chart-div-1',
  'chart-div-2',
  'chart-div-3',
  'chart-div-4',
  'chart-div-5',
  'chart-div-6',
  'chart-div-7',
  // Diagram — node/edge roles for architecture & flow diagrams.
  'diagram-node-surface',
  'diagram-node-border',
  'diagram-node-text',
  'diagram-node-accent',
  'diagram-edge',
  'diagram-edge-strong',
] as const;

/** A themed token name (e.g. `'accent'`, `'surface-base'`). */
export type ThemedTokenName = (typeof themedTokenNames)[number];

/** A theme's value map: every themed token name → a concrete CSS value. */
export type ThemeValueMap = Record<ThemedTokenName, string>;

/** Which OS `color-scheme` a theme presents as. */
export type ColorScheme = 'light' | 'dark';
