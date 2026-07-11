/**
 * Motion tokens — non-themed VALUES only (they do not change with theme).
 *
 * BOUNDARY: this package defines the easing/duration primitives. The motion
 * package (Task 4) CONSUMES these to build animation primitives and sequences —
 * do not author sequences here.
 */
export const easing = {
  /** Decelerate hard, land soft — elements settling into their final place. */
  'ease-settle': 'cubic-bezier(0.2, 0, 0, 1)',
  /** Quick rise — surfaces lifting up / appearing (menus, popovers). */
  'ease-lift': 'cubic-bezier(0.3, 0, 0.1, 1)',
  /** Symmetric in-out — tracing/drawing a path or connector end to end. */
  'ease-trace': 'cubic-bezier(0.65, 0, 0.35, 1)',
  /** Even in-out — shifting between two resting states. */
  'ease-shift': 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const satisfies Record<string, string>;

export const duration = {
  /** Immediate feedback (press, hover ink). */
  'dur-feedback': '90ms',
  /** State change (toggle, selection). */
  'dur-state': '180ms',
  /** Structural change (panel, layout, expand). */
  'dur-structure': '320ms',
  /** Narrative moment (hero reveal, storytelling beat). */
  'dur-narrative': '560ms',
} as const satisfies Record<string, string>;
