/**
 * Emits the committed `tokens.css` from the non-themed token modules.
 *
 * Run under `tsx` (workspace dev dependency): `tsx scripts/generate-css.ts`,
 * wired as `pnpm --filter @enterprise-design/design-tokens generate:css`. `tsx`
 * resolves the package's `.js`-specifier source graph, so this script imports
 * the REAL `buildTokensCss` and the REAL `nonThemedTokens` aggregation — no
 * duplicated logic. `css.test.ts` asserts the committed file byte-equals
 * `buildTokensCss(nonThemedTokens)`.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildTokensCss } from '../src/css.js';
import { nonThemedTokens } from '../src/groups.js';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'tokens.css');
writeFileSync(out, buildTokensCss(nonThemedTokens), 'utf8');
console.log(`Wrote ${out}`);
