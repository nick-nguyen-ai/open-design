/**
 * Emits the committed per-theme CSS files from the theme value maps.
 *
 * Run under `tsx` (workspace dev dependency): `tsx scripts/generate-css.ts`,
 * wired as `pnpm --filter @enterprise-design/themes generate:css`. `tsx` resolves
 * the workspace `.js`-specifier graph (including the `@enterprise-design/design-
 * tokens` package entry), so this script imports the REAL `buildThemeCss` — no
 * duplicated selector/branching logic. `css.test.ts` asserts each committed file
 * byte-equals `buildThemeCss(theme)`.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildThemeCss } from '../src/css.js';
import { enterpriseNeutralLight, enterpriseNeutralDark } from '../src/theme.js';

const here = dirname(fileURLToPath(import.meta.url));
const write = (file: string, content: string) => {
  const out = join(here, '..', file);
  writeFileSync(out, content, 'utf8');
  console.log(`Wrote ${out}`);
};

write('enterprise-neutral-light.css', buildThemeCss(enterpriseNeutralLight));
write('enterprise-neutral-dark.css', buildThemeCss(enterpriseNeutralDark));
