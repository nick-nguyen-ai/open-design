/**
 * Emits the committed per-theme CSS files from the theme value maps.
 *
 * Run with Node's native TypeScript support: `node scripts/generate-css.ts`
 * (wired as `pnpm --filter @enterprise-design/themes generate:css`).
 *
 * Excluded from the package tsconfig; uses `.ts` import specifiers (resolved by
 * Node type-stripping) and reaches into design-tokens' PURE `css.ts` by relative
 * path — the shipped library instead imports it via the package entry. Outputs
 * are committed; `css.test.ts` fails if they drift from `buildThemeCss()`.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderBlock, GENERATED_BANNER } from '../../design-tokens/src/css.ts';
import { lightValues } from '../src/light.values.ts';
import { darkValues } from '../src/dark.values.ts';

// Mirror of buildThemeCss() from ../src/css.ts, using the pure renderer above.
// (The shipped buildThemeCss imports from the package entry, which Node's
// type-stripping cannot resolve through the `.js`-specifier graph; the drift
// test asserts this output equals buildThemeCss for both themes.)
function lightCss(): string {
  const header = `${GENERATED_BANNER}\n/* Theme: Enterprise Neutral — Light (enterprise-neutral-light) */`;
  return `${header}\n${renderBlock([':root', ":root[data-theme='light']"], lightValues)}\n`;
}

function darkCss(): string {
  const header = `${GENERATED_BANNER}\n/* Theme: Enterprise Neutral — Dark (enterprise-neutral-dark) */`;
  const explicit = renderBlock(":root[data-theme='dark']", darkValues);
  const preferred = renderBlock(":root:not([data-theme='light'])", darkValues, '  ');
  return `${header}\n${explicit}\n@media (prefers-color-scheme: dark) {\n${preferred}\n}\n`;
}

const here = dirname(fileURLToPath(import.meta.url));
const write = (file: string, content: string) => {
  const out = join(here, '..', file);
  writeFileSync(out, content, 'utf8');
  console.log(`Wrote ${out}`);
};

write('enterprise-neutral-light.css', lightCss());
write('enterprise-neutral-dark.css', darkCss());
