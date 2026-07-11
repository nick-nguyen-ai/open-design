/**
 * Layout container widths and readable measures. Non-themed — switching theme
 * must never change a layout dimension.
 */
export const layoutWidth = {
  'layout-measure': '65ch',
  'layout-narrow': '40rem',
  'layout-content': '72rem',
  'layout-wide': '90rem',
  'layout-full': '100%',
} as const satisfies Record<string, string>;

/**
 * Data density — row heights and cell paddings for tables/lists at three
 * densities. Compact for dense analyst grids, spacious for marketing surfaces.
 */
export const density = {
  'density-compact-row': '2rem',
  'density-compact-pad-y': '0.25rem',
  'density-compact-pad-x': '0.5rem',
  'density-default-row': '2.5rem',
  'density-default-pad-y': '0.5rem',
  'density-default-pad-x': '0.75rem',
  'density-spacious-row': '3rem',
  'density-spacious-pad-y': '0.75rem',
  'density-spacious-pad-x': '1rem',
} as const satisfies Record<string, string>;

/** Stacking order. Gaps left between tiers for ad-hoc layering. */
export const zIndex = {
  'z-hide': '-1',
  'z-base': '0',
  'z-docked': '10',
  'z-dropdown': '1000',
  'z-sticky': '1100',
  'z-banner': '1200',
  'z-overlay': '1300',
  'z-modal': '1400',
  'z-popover': '1500',
  'z-toast': '1600',
  'z-tooltip': '1700',
} as const satisfies Record<string, string>;

/** Print surface — force ink-on-paper, drop shadows, widen margins. */
export const print = {
  'print-ink': '#000000',
  'print-surface': '#ffffff',
  'print-page-margin': '1.6cm',
  'print-font-size': '11pt',
  'print-line-height': '1.4',
} as const satisfies Record<string, string>;
