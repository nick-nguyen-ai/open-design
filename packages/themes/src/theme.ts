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
  // `satisfies` here is the compile-time completeness gate: this fails to build
  // if `light.values.ts` is missing a token or has a stray one.
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
