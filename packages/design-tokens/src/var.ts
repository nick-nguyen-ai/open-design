import type { NonThemedTokenName } from './groups.js';
import type { ThemedTokenName } from './themed.js';

/** Any token name the design system knows about — non-themed or themed. */
export type TokenName = NonThemedTokenName | ThemedTokenName;

/**
 * Type-safe CSS-variable reference. Components reference tokens by NAME through
 * this helper — never raw hex — so values stay owned by the token/theme layer.
 *
 * @example cssVar('accent')      // 'var(--accent)'
 * @example cssVar('space-4', '1rem') // 'var(--space-4, 1rem)' with a fallback
 */
export function cssVar(name: TokenName, fallback?: string): string {
  return fallback === undefined ? `var(--${name})` : `var(--${name}, ${fallback})`;
}

/** The `--name` custom-property string for a token (no `var()` wrapper). */
export function cssVarName(name: TokenName): `--${TokenName}` {
  return `--${name}`;
}
