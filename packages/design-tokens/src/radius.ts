/**
 * Corner radii — deliberately restrained. Banks read sharp, not bubbly, so the
 * ceiling is 8px; `full` is reserved for pills/avatars only.
 */
export const radius = {
  'radius-none': '0',
  'radius-sm': '2px',
  'radius-md': '4px',
  'radius-lg': '6px',
  'radius-xl': '8px',
  'radius-full': '9999px',
} as const satisfies Record<string, string>;

/** Stroke widths for borders, dividers, and focus outlines. */
export const borderWidth = {
  'border-width-0': '0',
  'border-width-hairline': '1px',
  'border-width-thick': '2px',
  'border-width-heavy': '4px',
} as const satisfies Record<string, string>;
