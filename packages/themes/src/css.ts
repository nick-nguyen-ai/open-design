import { renderBlock, GENERATED_BANNER, type VarMap } from '@enterprise-design/design-tokens';
import type { ThemeDefinition } from './theme.js';

/**
 * Emit the CSS file for one theme.
 *
 * Contract: themes switch by toggling `data-theme` on `:root`, and every themed
 * token is a colour — so no layout dimension ever changes across themes.
 *
 * - The `light` theme is the DEFAULT: it binds to bare `:root` (and the explicit
 *   `:root[data-theme='light']` override) so a page with no `data-theme` and no
 *   OS preference renders light.
 * - The `dark` theme binds to `:root[data-theme='dark']` AND, as the
 *   `prefers-color-scheme: dark` default, to `:root:not([data-theme='light'])`
 *   inside a media query — so it follows the OS unless a `data-theme` overrides.
 *
 * An explicit `data-theme` attribute always wins over the OS preference because
 * `[data-theme='light']` is excluded from the dark media selector.
 */
export function buildThemeCss(theme: ThemeDefinition): string {
  const vars = theme.values as VarMap;
  const header = `${GENERATED_BANNER}\n/* Theme: ${theme.label} (${theme.id}) */`;

  if (theme.colorScheme === 'light') {
    const block = renderBlock([':root', `:root[data-theme='${theme.colorScheme}']`], vars);
    return `${header}\n${block}\n`;
  }

  const explicit = renderBlock(`:root[data-theme='${theme.colorScheme}']`, vars);
  const preferred = renderBlock(":root:not([data-theme='light'])", vars, '  ');
  const media = `@media (prefers-color-scheme: dark) {\n${preferred}\n}`;
  return `${header}\n${explicit}\n${media}\n`;
}
