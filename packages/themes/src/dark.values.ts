/**
 * Enterprise-neutral DARK theme — concrete values for every themed token.
 *
 * Surfaces sit near the dark end of the graphite ramp; elevation is carried by
 * surface-luminance steps (sunken < base < raised < overlay) rather than shadow.
 * The accent lifts slightly for visibility on dark while keeping white text at
 * AA. Chart hues are the dataviz skill's dark column (stepped for a dark
 * surface); the theme-independent seq/div data ramps are shared with light.
 *
 * Pure data (no imports). The typed wrapper is in `dark.ts`.
 */
export const darkValues = {
  // Surfaces — luminance-ordered, near the dark end of the graphite ramp.
  'surface-base': '#12171e',
  'surface-raised': '#191f27',
  'surface-sunken': '#0d1117',
  'surface-overlay': '#2a323c',
  // Text.
  'text-primary': '#f7f9fb',
  'text-secondary': '#c1c9d3',
  'text-muted': '#9aa5b3',
  'text-on-accent': '#ffffff',
  // Borders.
  'border-subtle': '#2a323c',
  'border-strong': '#3d4753',
  // Focus — a brighter accent step for visibility on dark surfaces.
  'focus-ring': '#6b83ea',
  // Accent — signal blue lifted for dark, white text still AA.
  'accent': '#3a56d4',
  'accent-hover': '#4f6be0',
  'accent-muted': '#20263a',
  // Status.
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
  // Chart categorical (dataviz dark column).
  'chart-cat-1': '#3987e5',
  'chart-cat-2': '#199e70',
  'chart-cat-3': '#c98500',
  'chart-cat-4': '#008300',
  'chart-cat-5': '#9085e9',
  'chart-cat-6': '#e66767',
  'chart-cat-7': '#d55181',
  'chart-cat-8': '#d95926',
  // Chart sequential — single-hue blue ramp (shared data ramp).
  'chart-seq-1': '#cde2fb',
  'chart-seq-2': '#9ec5f4',
  'chart-seq-3': '#6da7ec',
  'chart-seq-4': '#3987e5',
  'chart-seq-5': '#256abf',
  'chart-seq-6': '#184f95',
  'chart-seq-7': '#0d366b',
  // Chart diverging — blue ↔ red, dark neutral midpoint (index 4).
  'chart-div-1': '#184f95',
  'chart-div-2': '#3987e5',
  'chart-div-3': '#9ec5f4',
  'chart-div-4': '#383835',
  'chart-div-5': '#f0b8b5',
  'chart-div-6': '#e34948',
  'chart-div-7': '#b3261e',
  // Diagram.
  'diagram-node-surface': '#191f27',
  'diagram-node-border': '#3d4753',
  'diagram-node-text': '#f7f9fb',
  'diagram-node-accent': '#6b83ea',
  'diagram-edge': '#556170',
  'diagram-edge-strong': '#9aa5b3',
} as const;
