import { describe, it, expect } from 'vitest';
import type { ThemeValueMap } from '@enterprise-design/design-tokens';
import { themes } from './theme.js';
import { contrastRatio, parseHex } from './contrast.js';

const AA_BODY = 4.5; // WCAG 2.2 §1.4.3 normal text
const AA_NONTEXT = 3.0; // WCAG 2.2 §1.4.11 non-text / large text

describe('contrast helper sanity', () => {
  it('parses shorthand and full hex', () => {
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
    expect(parseHex('000000')).toEqual([0, 0, 0]);
  });

  it('rejects invalid hex', () => {
    expect(() => parseHex('#12')).toThrow();
    expect(() => parseHex('#zzzzzz')).toThrow();
  });

  it('matches known WCAG reference ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    // #767676 on white is the canonical 4.54:1 AA boundary grey.
    expect(contrastRatio('#767676', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });
});

/** Pairs that must clear a threshold, computed from a theme's own values. */
function pairs(v: ThemeValueMap): Array<[string, string, string, number]> {
  const bodyTextSurfaces = ['surface-base', 'surface-raised', 'surface-sunken'] as const;
  const list: Array<[string, string, string, number]> = [];

  // Body text roles on every surface plane.
  for (const text of ['text-primary', 'text-secondary', 'text-muted'] as const) {
    for (const surface of bodyTextSurfaces) {
      list.push([`${text} on ${surface}`, v[text], v[surface], AA_BODY]);
    }
  }
  // Text on accent (base + hover).
  list.push(['text-on-accent on accent', v['text-on-accent'], v['accent'], AA_BODY]);
  list.push(['text-on-accent on accent-hover', v['text-on-accent'], v['accent-hover'], AA_BODY]);

  // Status fg on its own bg, and on the page surface.
  for (const status of ['success', 'warning', 'danger', 'info'] as const) {
    const fg = v[`${status}-fg`];
    list.push([`${status}-fg on ${status}-bg`, fg, v[`${status}-bg`], AA_BODY]);
    list.push([`${status}-fg on surface-base`, fg, v['surface-base'], AA_BODY]);
  }

  // Non-text (WCAG 1.4.11): the focus ring must be a visible indicator against
  // the base surface. Divider borders are decorative and intentionally subtle,
  // so they are not held to 3:1 here.
  list.push(['focus-ring on surface-base', v['focus-ring'], v['surface-base'], AA_NONTEXT]);

  return list;
}

describe.each(themes.map((t) => [t.id, t.values] as const))(
  '%s WCAG AA contrast',
  (_name, values) => {
  for (const [label, fg, bg, min] of pairs(values)) {
    it(`${label} ≥ ${min}:1`, () => {
      const ratio = contrastRatio(fg, bg);
      expect(ratio, `${fg} on ${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
    });
  }
});
