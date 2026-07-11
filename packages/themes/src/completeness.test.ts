import { describe, it, expect } from 'vitest';
import { themedTokenNames } from '@enterprise-design/design-tokens';
import { enterpriseNeutralLight, enterpriseNeutralDark, themes } from './theme.js';

describe.each([
  ['light', enterpriseNeutralLight],
  ['dark', enterpriseNeutralDark],
])('%s theme completeness', (_name, theme) => {
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
  it('ships exactly one light and one dark theme', () => {
    expect(themes.map((t) => t.colorScheme).sort()).toEqual(['dark', 'light']);
  });

  it('has unique theme ids', () => {
    expect(new Set(themes.map((t) => t.id)).size).toBe(themes.length);
  });
});
