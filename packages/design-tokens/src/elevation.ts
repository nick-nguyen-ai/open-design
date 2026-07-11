/**
 * Elevation — subtle, low-spread shadows tinted with the cool graphite ink
 * (rgb 13,17,23) rather than pure black, so raised surfaces feel lifted without
 * the "SaaS card" drop shadow.
 *
 * Dark theme note: shadows barely read on dark surfaces, so elevation in dark is
 * carried primarily by surface-luminance steps (`--surface-sunken` < `-base` <
 * `-raised` < `-overlay`). These shadow tokens remain valid — they render as a
 * faint depth cue — but surface luminance is the primary channel in dark mode.
 */
export const elevation = {
  'shadow-none': 'none',
  'shadow-sm': '0 1px 2px rgba(13, 17, 23, 0.06)',
  'shadow-md': '0 2px 4px -1px rgba(13, 17, 23, 0.08), 0 1px 2px -1px rgba(13, 17, 23, 0.06)',
  'shadow-lg': '0 4px 12px -2px rgba(13, 17, 23, 0.1), 0 2px 4px -2px rgba(13, 17, 23, 0.06)',
  'shadow-xl': '0 8px 24px -4px rgba(13, 17, 23, 0.12), 0 4px 8px -4px rgba(13, 17, 23, 0.08)',
} as const satisfies Record<string, string>;
