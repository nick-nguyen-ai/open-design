/**
 * Enterprise-neutral LIGHT theme — concrete values for every themed token.
 *
 * Palette: a cool graphite neutral ramp (very slightly blue), one deep signal-
 * blue / ink-indigo accent, and status hues tuned so every body pair clears
 * WCAG 2.2 AA. Chart hues are the dataviz skill's validated categorical /
 * sequential / diverging palette (blue-anchored, so it sits with the accent).
 *
 * Pure data (no imports) so the generation script can load it directly. The
 * typed, contract-checked wrapper is in `light.ts`.
 */
export const lightValues = {
  // Surfaces — near the light end of the graphite ramp.
  'surface-base': '#f7f9fb',
  'surface-raised': '#ffffff',
  'surface-sunken': '#eceff3',
  'surface-overlay': '#ffffff',
  // Text.
  'text-primary': '#0d1117',
  'text-secondary': '#3d4753',
  'text-muted': '#556170',
  'text-on-accent': '#ffffff',
  // Borders.
  'border-subtle': '#dbe0e7',
  'border-strong': '#c1c9d3',
  // Focus — the accent, for a high-visibility ring.
  'focus-ring': '#2a43c0',
  // Accent — deep signal blue / ink-indigo.
  'accent': '#2a43c0',
  'accent-hover': '#21349a',
  'accent-muted': '#e6e9f7',
  // Status.
  'success-fg': '#0a6b0a',
  'success-bg': '#e7f4e7',
  'success-border': '#b3ddb3',
  'warning-fg': '#8a5a00',
  'warning-bg': '#fbf0d9',
  'warning-border': '#f0d089',
  'danger-fg': '#b3261e',
  'danger-bg': '#fbe9e8',
  'danger-border': '#f0b8b5',
  'info-fg': '#1b50b8',
  'info-bg': '#e7edfb',
  'info-border': '#b9cbf3',
  // Chart categorical (dataviz light column).
  'chart-cat-1': '#2a78d6',
  'chart-cat-2': '#1baf7a',
  'chart-cat-3': '#eda100',
  'chart-cat-4': '#008300',
  'chart-cat-5': '#4a3aa7',
  'chart-cat-6': '#e34948',
  'chart-cat-7': '#e87ba4',
  'chart-cat-8': '#eb6834',
  // Chart sequential — single-hue blue, light → dark.
  'chart-seq-1': '#cde2fb',
  'chart-seq-2': '#9ec5f4',
  'chart-seq-3': '#6da7ec',
  'chart-seq-4': '#3987e5',
  'chart-seq-5': '#256abf',
  'chart-seq-6': '#184f95',
  'chart-seq-7': '#0d366b',
  // Chart diverging — blue ↔ red, neutral gray midpoint (index 4).
  'chart-div-1': '#184f95',
  'chart-div-2': '#3987e5',
  'chart-div-3': '#9ec5f4',
  'chart-div-4': '#f0efec',
  'chart-div-5': '#f0b8b5',
  'chart-div-6': '#e34948',
  'chart-div-7': '#b3261e',
  // Diagram.
  'diagram-node-surface': '#ffffff',
  'diagram-node-border': '#c1c9d3',
  'diagram-node-text': '#0d1117',
  'diagram-node-accent': '#2a43c0',
  'diagram-edge': '#9aa5b3',
  'diagram-edge-strong': '#556170',
} as const;
