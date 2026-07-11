import { space } from './space.js';
import { radius, borderWidth } from './radius.js';
import {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  numeric,
} from './typography.js';
import { elevation } from './elevation.js';
import { easing, duration } from './motion.js';
import { layoutWidth, density, zIndex, print } from './layout.js';

/**
 * All NON-THEMED tokens, merged in a deterministic order. This is the source of
 * `tokens.css` (`:root`) and of the non-themed half of the `TokenName` union.
 * The order here is the emission order in the generated CSS.
 */
export const nonThemedTokens = {
  ...space,
  ...radius,
  ...borderWidth,
  ...fontFamily,
  ...fontSize,
  ...lineHeight,
  ...fontWeight,
  ...letterSpacing,
  ...numeric,
  ...elevation,
  ...easing,
  ...duration,
  ...layoutWidth,
  ...density,
  ...zIndex,
  ...print,
} as const;

/** A non-themed token name (e.g. `'space-4'`, `'radius-md'`, `'ease-settle'`). */
export type NonThemedTokenName = keyof typeof nonThemedTokens;
