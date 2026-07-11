/**
 * Emits the committed `tokens.css` from the non-themed token modules.
 *
 * Run with Node's native TypeScript support: `node scripts/generate-css.ts`
 * (wired as `pnpm --filter @enterprise-design/design-tokens generate:css`).
 *
 * This script is intentionally excluded from the package tsconfig and uses
 * explicit `.ts` import specifiers (which Node's type-stripping resolves) rather
 * than the `.js` specifiers the shipped source uses. The `tokens.css` output is
 * committed; `css.test.ts` fails if it drifts from `buildTokensCss()`.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { space } from '../src/space.ts';
import { radius, borderWidth } from '../src/radius.ts';
import {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  numeric,
} from '../src/typography.ts';
import { elevation } from '../src/elevation.ts';
import { easing, duration } from '../src/motion.ts';
import { layoutWidth, density, zIndex, print } from '../src/layout.ts';
import { buildTokensCss } from '../src/css.ts';

const nonThemedTokens = {
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
};

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'tokens.css');
writeFileSync(out, buildTokensCss(nonThemedTokens), 'utf8');
console.log(`Wrote ${out}`);
