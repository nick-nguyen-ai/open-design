/** Pure value formatting — no DOM, unit-testable in isolation from the component. */
export type KpiUnit = 'currency' | 'percent' | 'count' | 'ratio';

const INTEGER_FORMATTER = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const ONE_DECIMAL_FORMATTER = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const RATIO_FORMATTER = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

/** Formats a raw metric value for display, given its semantic unit. */
export function formatKpiValue(value: number, unit: KpiUnit = 'count'): string {
  switch (unit) {
    case 'percent':
      return `${ONE_DECIMAL_FORMATTER.format(value * 100)}%`;
    case 'currency':
      return `$${INTEGER_FORMATTER.format(value)}`;
    case 'ratio':
      return `${RATIO_FORMATTER.format(value)}×`;
    case 'count':
    default:
      return INTEGER_FORMATTER.format(value);
  }
}

/** Formats a delta (fractional change, e.g. `0.032` = "+3.2%") with an explicit sign. */
export function formatKpiDelta(delta: number): string {
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : '±';
  return `${sign}${ONE_DECIMAL_FORMATTER.format(Math.abs(delta) * 100)}%`;
}
