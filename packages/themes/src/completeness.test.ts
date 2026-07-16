import { describe, it, expect } from 'vitest';
import { themedTokenNames } from '@enterprise-design/design-tokens';
import { themes } from './theme.js';

describe.each(themes.map((t) => [t.id, t] as const))('%s completeness', (_name, theme) => {
  const keys = Object.keys(theme.values);

  it('provides a value for every themed token name in the contract', () => {
    const missing = themedTokenNames.filter((n) => !(n in theme.values));
    expect(missing).toEqual([]);
  });

  it('declares no tokens outside the contract', () => {
    const contract = new Set<string>(themedTokenNames);
    const extra = keys.filter((k) => !contract.has(k));
    expect(extra).toEqual([]);
  });

  it('has a non-empty value for every token', () => {
    for (const [name, value] of Object.entries(theme.values)) {
      expect(value, name).toMatch(/\S/);
    }
  });

  it('has exactly as many tokens as the contract', () => {
    expect(keys.length).toBe(themedTokenNames.length);
  });
});

describe('theme registry', () => {
  it('ships each family as exactly one light and one dark theme', () => {
    // Family = the id minus its trailing -light/-dark scheme suffix.
    const families = new Map<string, string[]>();
    for (const t of themes) {
      const family = t.id.replace(/-(light|dark)$/, '');
      expect(t.id.endsWith(`-${t.colorScheme}`), `${t.id} suffix matches colorScheme`).toBe(true);
      families.set(family, [...(families.get(family) ?? []), t.colorScheme]);
    }
    for (const [family, schemes] of families) {
      expect(schemes.sort(), family).toEqual(['dark', 'light']);
    }
  });

  it('has unique theme ids', () => {
    expect(new Set(themes.map((t) => t.id)).size).toBe(themes.length);
  });
});
