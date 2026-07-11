import { describe, expect, it } from 'vitest';
import { formatKpiDelta, formatKpiValue } from './formatKpiValue.js';

describe('formatKpiValue', () => {
  it('formats a percent unit as a one-decimal percentage', () => {
    expect(formatKpiValue(0.427, 'percent')).toBe('42.7%');
  });

  it('formats a currency unit with a dollar sign and thousands separators', () => {
    expect(formatKpiValue(1234567, 'currency')).toBe('$1,234,567');
  });

  it('formats a ratio unit with two decimals and a multiplication sign', () => {
    expect(formatKpiValue(1.5, 'ratio')).toBe('1.50×');
  });

  it('formats a count (default) as a thousands-separated integer', () => {
    expect(formatKpiValue(48213)).toBe('48,213');
  });
});

describe('formatKpiDelta', () => {
  it('prefixes a positive delta with +', () => {
    expect(formatKpiDelta(0.032)).toBe('+3.2%');
  });

  it('prefixes a negative delta with a minus sign, using the absolute magnitude', () => {
    expect(formatKpiDelta(-0.081)).toBe('−8.1%');
  });

  it('formats a zero delta with a plus-minus sign', () => {
    expect(formatKpiDelta(0)).toBe('±0.0%');
  });
});
