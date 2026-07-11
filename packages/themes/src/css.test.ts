import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { themedTokenNames } from '@enterprise-design/design-tokens';
import { enterpriseNeutralLight, enterpriseNeutralDark } from './theme.js';
import { buildThemeCss } from './css.js';

const here = dirname(fileURLToPath(import.meta.url));
const cssFile = (name: string) => readFileSync(join(here, '..', name), 'utf8');

describe('buildThemeCss — light (default)', () => {
  const css = buildThemeCss(enterpriseNeutralLight);

  it('binds to bare :root and the explicit light selector', () => {
    expect(css).toContain(':root,');
    expect(css).toContain(":root[data-theme='light'] {");
  });

  it('does not use a prefers-color-scheme media query (light is the default)', () => {
    expect(css).not.toContain('@media');
  });

  it('emits every themed token', () => {
    for (const name of themedTokenNames) {
      expect(css).toContain(`--${name}: ${enterpriseNeutralLight.values[name]};`);
    }
  });

  it('is deterministic', () => {
    expect(buildThemeCss(enterpriseNeutralLight)).toBe(css);
  });
});

describe('buildThemeCss — dark', () => {
  const css = buildThemeCss(enterpriseNeutralDark);

  it('binds to the explicit dark selector and a prefers-dark default', () => {
    expect(css).toContain(":root[data-theme='dark'] {");
    expect(css).toContain('@media (prefers-color-scheme: dark) {');
    expect(css).toContain(":root:not([data-theme='light']) {");
  });

  it('lets an explicit data-theme win over the OS preference', () => {
    // The dark OS default excludes [data-theme='light'], so a forced light page
    // never picks up dark from the media query.
    expect(css).toContain(":root:not([data-theme='light'])");
  });

  it('emits every themed token with its dark value', () => {
    for (const name of themedTokenNames) {
      expect(css).toContain(`--${name}: ${enterpriseNeutralDark.values[name]};`);
    }
  });
});

describe('committed theme CSS files', () => {
  it('light matches buildThemeCss (run `pnpm generate:css` if this fails)', () => {
    expect(cssFile('enterprise-neutral-light.css')).toBe(buildThemeCss(enterpriseNeutralLight));
  });

  it('dark matches buildThemeCss (run `pnpm generate:css` if this fails)', () => {
    expect(cssFile('enterprise-neutral-dark.css')).toBe(buildThemeCss(enterpriseNeutralDark));
  });

  it('never emit a layout-dimension token in a themed file (colour-only switch)', () => {
    const forbidden = /--(space|radius|font-size|line-height|layout|density|z-|border-width)/;
    expect(cssFile('enterprise-neutral-light.css')).not.toMatch(forbidden);
    expect(cssFile('enterprise-neutral-dark.css')).not.toMatch(forbidden);
  });
});
