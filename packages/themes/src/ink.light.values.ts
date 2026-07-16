/**
 * Gallery Ink LIGHT theme — concrete values for every themed token.
 *
 * The gallery chrome's "design museum" palette: warm paper surfaces, an ink
 * text ramp, warm hairline borders, and one vermilion accent. Chart, status,
 * and diagram tokens are IDENTICAL to enterprise-neutral-light so registered
 * components rendered inside live worlds do not shift when the chrome theme
 * changes (see docs/superpowers/specs/2026-07-17-gallery-ink-redesign-design.md).
 *
 * Pure data (no imports) so the generation script can load it directly.
 */
export const inkLightValues = {
  // Surfaces — warm paper ramp.
  'surface-base': '#faf7f1',
  'surface-raised': '#ffffff',
  'surface-sunken': '#f2ede3',
  'surface-overlay': '#ffffff',
  // Text — warm ink ramp; every step clears AA on every surface plane.
  'text-primary': '#1f1b15',
  'text-secondary': '#514b3d',
  'text-muted': '#6c6555',
  'text-on-accent': '#ffffff',
  // Borders — decorative dividers only (same policy as enterprise-neutral).
  'border-subtle': '#e6dfd2',
  'border-strong': '#cdc3b0',
  // Focus — the vermilion accent (4.6:1 on paper, well over the 3:1 non-text bar).
  'focus-ring': '#c8401e',
  // Accent — vermilion; white text 4.9:1, and the accent itself clears 4.5:1
  // as link text on surface-base.
  'accent': '#c8401e',
  'accent-hover': '#a83518',
  'accent-muted': '#f7e3dc',
  // Status — identical to enterprise-neutral-light.
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
  // Chart categorical — identical to enterprise-neutral-light.
  'chart-cat-1': '#2a78d6',
  'chart-cat-2': '#1baf7a',
  'chart-cat-3': '#eda100',
  'chart-cat-4': '#008300',
  'chart-cat-5': '#4a3aa7',
  'chart-cat-6': '#e34948',
  'chart-cat-7': '#e87ba4',
  'chart-cat-8': '#eb6834',
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
  'chart-div-4': '#f0efec',
  'chart-div-5': '#f0b8b5',
  'chart-div-6': '#e34948',
  'chart-div-7': '#b3261e',
  // Diagram — identical to enterprise-neutral-light (renders inside worlds).
  'diagram-node-surface': '#ffffff',
  'diagram-node-border': '#c1c9d3',
  'diagram-node-text': '#0d1117',
  'diagram-node-accent': '#2a43c0',
  'diagram-edge': '#9aa5b3',
  'diagram-edge-strong': '#556170',
} as const;
