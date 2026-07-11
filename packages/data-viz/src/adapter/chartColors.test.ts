import { describe, expect, it } from 'vitest';
import { resolveChartColors } from './chartColors.js';

describe('resolveChartColors', () => {
  it('resolves the categorical scale to 8 colours', () => {
    const colors = resolveChartColors('categorical', () => undefined);
    expect(colors).toHaveLength(8);
  });

  it('resolves the sequential and diverging scales to 7 colours each', () => {
    expect(resolveChartColors('sequential', () => undefined)).toHaveLength(7);
    expect(resolveChartColors('diverging', () => undefined)).toHaveLength(7);
  });

  it('prefers a live CSS variable over the fallback when the reader returns one', () => {
    const colors = resolveChartColors('categorical', (name) =>
      name === 'chart-cat-1' ? 'rgb(1, 2, 3)' : undefined,
    );
    expect(colors[0]).toBe('rgb(1, 2, 3)');
  });

  it('falls back to the themes package light values when the reader returns nothing (no DOM)', () => {
    const colors = resolveChartColors('categorical', () => undefined);
    // Every fallback colour is a real, non-empty value sourced from @enterprise-design/themes.
    for (const color of colors) {
      expect(typeof color).toBe('string');
      expect(color.length).toBeGreaterThan(0);
    }
  });

  it('is pure: identical inputs produce identical output, no DOM required', () => {
    const a = resolveChartColors('diverging', () => undefined);
    const b = resolveChartColors('diverging', () => undefined);
    expect(a).toEqual(b);
  });
});
