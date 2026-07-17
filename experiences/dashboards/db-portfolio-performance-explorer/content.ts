/**
 * "The Long Read" — shipped content for `db-portfolio-performance-explorer`.
 *
 * Synthetic demonstration data for a fictional investment portfolio review,
 * written as an editorial feature. All figures and attributions are invented.
 */

export interface TrendPoint {
  x: string;
  y: number;
}

export interface AttributionDatum {
  id: string;
  category: string;
  value: number;
}

export interface PlainNumber {
  id: string;
  label: string;
  value: string;
  versus: string;
}

export const MASTHEAD = {
  title: 'MERIDIAN QUARTERLY',
  desk: 'THE PORTFOLIO DESK',
  issue: 'Q2 2026 REVIEW · PUBLISHED 14 JUL 2026',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT MERIDIAN FIGURES',
} as const;

export const TITLE = {
  kicker: 'THE QUARTER, EXPLAINED',
  headline: 'The quarter the portfolio earned its keep.',
  standfirst:
    'Up 4.6% against a benchmark that managed 2.1% — but the number is the least interesting part. Three deliberate decisions did the work, one position gave half of it back, and the story of why is worth ten minutes of any committee’s time.',
  byline: 'BY THE PORTFOLIO DESK · CHARTS FROM THE ATTRIBUTION ENGINE',
} as const;

export const STORY = {
  openers: [
    'Every quarter produces a number, and most reviews stop there. This one should not, because the 4.6% the portfolio returned was not the market being kind — the market was ordinary. It was three decisions taken in April doing exactly what they were designed to do, at the same time, without borrowing risk from the future to do it.',
    'The first decision was boring on purpose: rotating a fifth of the duration book out ahead of the May repricing. The second was the infrastructure sleeve, which had spent two quarters looking early and finally looked right. The third was simply not selling the payments-technology position during the March drawdown — patience, recorded as a decision in the minutes, not a failure to act.',
  ],
  crossheadDrivers: 'Three drivers, one detractor',
  driverParagraphs: [
    'The attribution engine puts the duration rotation at +1.8 points — the single largest contribution, and the one with the clearest counterfactual: the un-rotated book would have carried the May repricing at full weight. The infrastructure sleeve added +1.4 points as the backlog of committed projects converted to revenue. Patience on payments technology contributed +1.1 points of recovery.',
    'Honesty requires the fourth line: the retail-property position cost 0.9 points, half of what the three drivers earned. The thesis — footfall recovery in secondary centres — has not survived contact with the data for three consecutive quarters. The desk’s recommendation, minuted below, is exit by December.',
  ],
  pullQuote: 'The number is the least interesting part. The decisions behind it are the review.',
  crossheadNext: 'What the desk does next',
  closers: [
    'The duration book stays rotated until the autumn statement; the trigger to re-extend is written and pre-agreed. The infrastructure sleeve is capped at its current weight — the thesis worked, which is precisely when sizing discipline matters most. Retail property enters managed exit unless October’s data breaks the trend.',
    'Next quarter’s review will read this page against what actually happened. That is the point of writing it down.',
  ],
} as const;

export const RETURN_FIGURE = {
  plate: 'FIGURE 1',
  heading: 'The quarter, drawn',
  chartTitle: 'Portfolio vs benchmark — cumulative return, Q2 2026',
  chartSource: 'Cumulative daily return, portfolio against composite benchmark. Synthetic demonstration data.',
} as const;

/** Cumulative return curves (percent) — portfolio and benchmark. */
export const RETURN_SERIES: { portfolio: TrendPoint[]; benchmark: TrendPoint[] } = (() => {
  const portfolio: TrendPoint[] = [];
  const benchmark: TrendPoint[] = [];
  for (let i = 0; i < 65; i += 1) {
    const day = new Date(Date.UTC(2026, 3, 1 + i));
    const x = day.toISOString().slice(0, 10);
    const t = i / 64;
    const wobble = Math.sin(i / 3.2) * 0.25 + Math.sin(i / 7.1) * 0.2;
    const dip = i > 20 && i < 27 ? -(0.9 - Math.abs(i - 23.5) * 0.2) : 0;
    portfolio.push({ x, y: Math.round((t * 4.4 + wobble + dip + (i > 40 ? 0.3 : 0)) * 100) / 100 });
    benchmark.push({ x, y: Math.round((t * 2.0 + wobble * 0.8 + dip * 1.2) * 100) / 100 });
  }
  return { portfolio, benchmark };
})();

export const ATTRIBUTION_FIGURE = {
  plate: 'FIGURE 2',
  heading: 'Where it came from',
  chartTitle: 'Return attribution by decision, Q2 2026 (percentage points)',
  chartSource: 'Contribution to portfolio return by named decision. Synthetic demonstration data.',
  data: [
    { id: 'a1', category: 'Duration rotation', value: 1.8 },
    { id: 'a2', category: 'Infrastructure sleeve', value: 1.4 },
    { id: 'a3', category: 'Payments tech (held)', value: 1.1 },
    { id: 'a4', category: 'Stock selection, other', value: 1.2 },
    { id: 'a5', category: 'Retail property', value: -0.9 },
  ] as AttributionDatum[],
} as const;

export const NUMBERS = {
  title: 'The numbers, plainly',
  sub: 'For readers who want the table — same data as the story',
  caption: 'Plain summary of quarterly performance figures against benchmark and prior quarter.',
  rows: [
    { id: 'n1', label: 'Total return, Q2', value: '+4.6%', versus: 'benchmark +2.1%' },
    { id: 'n2', label: 'Rolling 12 months', value: '+11.2%', versus: 'benchmark +8.4%' },
    { id: 'n3', label: 'Realised volatility', value: '7.8%', versus: 'budget ≤ 9.0%' },
    { id: 'n4', label: 'Active positions', value: '41', versus: '44 last quarter' },
    { id: 'n5', label: 'Decisions minuted', value: '6', versus: 'all with triggers' },
  ] as PlainNumber[],
} as const;

export const FOOT = {
  note: 'This review is written by the desk, not generated from the numbers alone; the attribution engine supplies the figures, the desk supplies the accountability. Past performance is synthetic and predicts nothing.',
  next: 'Q3 REVIEW PUBLISHES 12 OCT 2026',
} as const;
