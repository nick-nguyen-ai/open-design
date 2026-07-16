/**
 * Gallery Ink DARK theme — concrete values for every themed token.
 *
 * The warm-charcoal counterpart to gallery-ink-light: ink surfaces with a
 * paper text ramp and a lifted vermilion accent. Because a lifted vermilion
 * cannot hold white text at AA, `text-on-accent` is near-black ink here — the
 * dark chrome gets ink-on-vermilion buttons (the light theme keeps white).
 * Chart, status, and diagram tokens are IDENTICAL to enterprise-neutral-dark
 * so registered components rendered inside live worlds do not shift.
 *
 * Pure data (no imports) so the generation script can load it directly.
 */
export const inkDarkValues = {
  // Surfaces — warm charcoal, luminance-ordered (sunken < base < raised < overlay).
  'surface-base': '#161310',
  'surface-raised': '#1e1a15',
  'surface-sunken': '#100d0a',
  'surface-overlay': '#292319',
  // Text — warm paper ramp; every step clears AA on every surface plane.
  'text-primary': '#f2eee5',
  'text-secondary': '#c9c1b1',
  'text-muted': '#a09884',
  'text-on-accent': '#1d130c',
  // Borders — decorative dividers only.
  'border-subtle': '#2c261e',
  'border-strong': '#453d31',
  // Focus — a brighter vermilion step for visibility on dark surfaces.
  'focus-ring': '#f08a5f',
  // Accent — vermilion lifted for dark; clears 4.5:1 as link text on
  // surface-base, with near-black ink text on the accent itself.
  'accent': '#e2643c',
  'accent-hover': '#eb7550',
  'accent-muted': '#3a2118',
  // Status — identical to enterprise-neutral-dark.
  'success-fg': '#5fd07a',
  'success-bg': '#10281a',
  'success-border': '#1f5133',
  'warning-fg': '#fbbf24',
  'warning-bg': '#2e2410',
  'warning-border': '#5c4a1a',
  'danger-fg': '#f77066',
  'danger-bg': '#2e1513',
  'danger-border': '#5c2723',
  'info-fg': '#7aa2f7',
  'info-bg': '#12203f',
  'info-border': '#24407f',
  // Chart categorical — identical to enterprise-neutral-dark.
  'chart-cat-1': '#3987e5',
  'chart-cat-2': '#199e70',
  'chart-cat-3': '#c98500',
  'chart-cat-4': '#008300',
  'chart-cat-5': '#9085e9',
  'chart-cat-6': '#e66767',
  'chart-cat-7': '#d55181',
  'chart-cat-8': '#d95926',
  // Chart sequential — shared data ramp.
  'chart-seq-1': '#cde2fb',
  'chart-seq-2': '#9ec5f4',
  'chart-seq-3': '#6da7ec',
  'chart-seq-4': '#3987e5',
  'chart-seq-5': '#256abf',
  'chart-seq-6': '#184f95',
  'chart-seq-7': '#0d366b',
  // Chart diverging — shared data ramp.
  'chart-div-1': '#184f95',
  'chart-div-2': '#3987e5',
  'chart-div-3': '#9ec5f4',
  'chart-div-4': '#383835',
  'chart-div-5': '#f0b8b5',
  'chart-div-6': '#e34948',
  'chart-div-7': '#b3261e',
  // Diagram — identical to enterprise-neutral-dark (renders inside worlds).
  'diagram-node-surface': '#191f27',
  'diagram-node-border': '#3d4753',
  'diagram-node-text': '#f7f9fb',
  'diagram-node-accent': '#6b83ea',
  'diagram-edge': '#556170',
  'diagram-edge-strong': '#9aa5b3',
} as const;
