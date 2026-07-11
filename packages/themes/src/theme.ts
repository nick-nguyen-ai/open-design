import type { ColorScheme, ThemeValueMap } from '@enterprise-design/design-tokens';
import { lightValues } from './light.values.js';
import { darkValues } from './dark.values.js';

/** A named theme: an id, the `color-scheme` it presents as, and its value map. */
export interface ThemeDefinition {
  /** Stable id, also the CSS filename stem (e.g. `enterprise-neutral-light`). */
  readonly id: string;
  /** Human label. */
  readonly label: string;
  /** OS colour-scheme this theme is the default for. */
  readonly colorScheme: ColorScheme;
  /** Every themed token → concrete value. */
  readonly values: ThemeValueMap;
}

export const enterpriseNeutralLight: ThemeDefinition = {
  id: 'enterprise-neutral-light',
  label: 'Enterprise Neutral — Light',
  colorScheme: 'light',
  // `satisfies` is a compile-time gate for MISSING tokens (the value map is not
  // assignable to ThemeValueMap if a name is absent). It does NOT catch a stray
  // EXTRA token — excess-property checks don't fire on a non-literal identifier —
  // so the runtime completeness test is what enforces "no extras".
  values: lightValues satisfies ThemeValueMap,
};

export const enterpriseNeutralDark: ThemeDefinition = {
  id: 'enterprise-neutral-dark',
  label: 'Enterprise Neutral — Dark',
  colorScheme: 'dark',
  values: darkValues satisfies ThemeValueMap,
};

/** All shipped themes. */
export const themes: readonly ThemeDefinition[] = [enterpriseNeutralLight, enterpriseNeutralDark];
