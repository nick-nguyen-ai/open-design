import type { ColorScheme, ThemeValueMap } from '@enterprise-design/design-tokens';
import { lightValues } from './light.values.js';
import { darkValues } from './dark.values.js';
import { inkLightValues } from './ink.light.values.js';
import { inkDarkValues } from './ink.dark.values.js';

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

export const galleryInkLight: ThemeDefinition = {
  id: 'gallery-ink-light',
  label: 'Gallery Ink — Light',
  colorScheme: 'light',
  values: inkLightValues satisfies ThemeValueMap,
};

export const galleryInkDark: ThemeDefinition = {
  id: 'gallery-ink-dark',
  label: 'Gallery Ink — Dark',
  colorScheme: 'dark',
  values: inkDarkValues satisfies ThemeValueMap,
};

/** All shipped themes — two families, each with one light and one dark member. */
export const themes: readonly ThemeDefinition[] = [
  enterpriseNeutralLight,
  enterpriseNeutralDark,
  galleryInkLight,
  galleryInkDark,
];
