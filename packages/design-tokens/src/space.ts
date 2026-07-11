/**
 * Spacing scale — 4px geometric base (1 step = 4px = 0.25rem at a 16px root).
 * Non-themed: identical in every theme. Values are `rem` so they respect the
 * user's root font size.
 */
export const space = {
  'space-0': '0',
  'space-1': '0.25rem',
  'space-2': '0.5rem',
  'space-3': '0.75rem',
  'space-4': '1rem',
  'space-5': '1.25rem',
  'space-6': '1.5rem',
  'space-7': '1.75rem',
  'space-8': '2rem',
  'space-10': '2.5rem',
  'space-12': '3rem',
  'space-16': '4rem',
  'space-20': '5rem',
  'space-24': '6rem',
  'space-32': '8rem',
} as const satisfies Record<string, string>;
