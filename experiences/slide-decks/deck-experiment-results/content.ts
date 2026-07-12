/**
 * Content pack for "The Readout" — the live rendering of
 * `deck-experiment-results`.
 *
 * A quarter of experiment results presented as an instrument READOUT session:
 * the room where the numbers land. Near-black bench with phosphor-teal traces,
 * scanline restraint, everything measured. Each reading slide states a
 * hypothesis, draws its trace, counts a RESULT NUMERAL up once to its value,
 * and shows a shape-and-word-coded verdict plate — SHIPPED, KILLED, or the
 * anomaly, WITHHELD: a statistically significant win they chose NOT to ship
 * because a guardrail metric regressed. Killed results are stated with pride.
 *
 * Everything here is TYPED and DETERMINISTIC. No Math.random at render. All
 * results are synthetic demonstration data at realistic magnitudes; the
 * experiment names and team are credible inventions — no real result implied.
 */
import type { CategoryBarDatum, TrendChartSeriesInput } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Session chrome                                                      */
/* ------------------------------------------------------------------ */

export const SESSION = {
  title: 'EXPERIMENT REVIEW',
  quarter: 'Q2 FY27',
  team: 'GROWTH & DECISION SCIENCE',
  dataNotice: 'SYNTHETIC RESULTS · BENCH READOUT',
  keyboardHint: '← → READING · HOME/END FIRST/LAST · W — THE WITHHELD READING',
} as const;

export type Verdict = 'shipped' | 'killed' | 'withheld';

export const VERDICT_LABEL: Record<Verdict, string> = {
  shipped: 'SHIPPED',
  killed: 'KILLED · LEARNING LOGGED',
  withheld: 'WITHHELD · GUARDRAIL REGRESSED',
};

/** Verdict is coded by SHAPE and WORD, never colour alone. */
export const VERDICT_GLYPH: Record<Verdict, string> = {
  shipped: '■',
  killed: '□',
  withheld: '▲',
};

/* ------------------------------------------------------------------ */
/* The quarter's ledger                                                */
/* ------------------------------------------------------------------ */

interface LedgerRow {
  ref: string;
  label: string;
  value: number;
  note: string;
  flag?: boolean;
}

export const LEDGER: { standfirst: string; rows: readonly LedgerRow[] } = {
  standfirst:
    'Twenty-three experiments reached a decision this quarter. Fourteen were conclusive. Five shipped, six were killed, and one was withheld. We count the kills as loudly as the ships — a killed experiment is a question answered, not effort wasted.',
  rows: [
    { ref: 'RUN', label: 'Experiments run to a decision', value: 23, note: 'across 5 surfaces' },
    { ref: 'SIG', label: 'Reached significance', value: 14, note: 'primary metric, α = 0.05' },
    { ref: 'SHP', label: 'Shipped', value: 5, note: 'cleared ship bar + all guardrails' },
    { ref: 'KIL', label: 'Killed — learning logged', value: 6, note: 'flat or negative, stated plainly' },
    { ref: 'WHD', label: 'Withheld — won but breached a guardrail', value: 1, note: 'the reading below', flag: true },
    { ref: 'ITR', label: 'Still iterating', value: 11, note: 'underpowered or mid-ramp' },
  ] as const,
} as const;

/* ------------------------------------------------------------------ */
/* Numeral spec — the RESULT NUMERAL that counts up once               */
/* ------------------------------------------------------------------ */

export interface Numeral {
  /** Magnitude counted 0 → value (the sign is fixed, not animated). */
  value: number;
  decimals: number;
  sign: '+' | '−' | '';
  suffix: string;
  /** The metric the numeral measures. */
  metric: string;
  /** The bar this result had to clear (or the guardrail it breached). */
  bar: string;
}

/* ------------------------------------------------------------------ */
/* Reading model                                                       */
/* ------------------------------------------------------------------ */

interface ReadingChartTrend {
  kind: 'trend';
  series: readonly TrendChartSeriesInput[];
  /** Optional horizontal reference line (ship bar or guardrail). */
  markLine?: { value: number; label: string; tone: 'ship' | 'guard' };
  yMin?: number;
  yMax?: number;
  unit: string;
}

interface ReadingChartBar {
  kind: 'bar';
  data: readonly CategoryBarDatum[];
  markLine?: { value: number; label: string; tone: 'ship' | 'guard' };
  yMin?: number;
  yMax?: number;
  unit: string;
}

export type ReadingChart = ReadingChartTrend | ReadingChartBar;

export interface Reading {
  id: string;
  /** Reading number shown on the plate. */
  no: string;
  indexTitle: string;
  hypothesis: string;
  standfirst: string;
  numeral: Numeral;
  verdict: Verdict;
  verdictNote: string;
  sample: string;
  chart: ReadingChart;
  caption: string;
  source: string;
  /** The single withheld reading — the deliberate anomaly. */
  anomaly?: boolean;
}

/* ------------------------------------------------------------------ */
/* Reading 01 — SHIPPED                                                */
/* ------------------------------------------------------------------ */

const RAMP_WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'] as const;

const R1_EFFECT = [0.4, 1.1, 1.8, 2.3, 2.7, 2.9] as const; // cumulative treatment−control, %

const READING_1: Reading = {
  id: 'reading-checkout',
  no: 'READING 01',
  indexTitle: 'Reading 01 — streaming feature cache (shipped)',
  hypothesis: 'A streaming feature cache in the scoring path lifts checkout conversion.',
  standfirst:
    'Fresher features at decision time should let the ranker respond to in-session intent. We ran it as a two-arm split over a six-week ramp on the checkout surface.',
  numeral: {
    value: 2.9,
    decimals: 1,
    sign: '+',
    suffix: '%',
    metric: 'checkout conversion, treatment − control',
    bar: 'ship bar +1.0% · cleared at W3',
  },
  verdict: 'shipped',
  verdictNote:
    'Cleared the ship bar in week three and held. All three guardrails green: latency, complaint rate, refund rate unchanged. Rolled to 100% at quarter close.',
  sample: 'n = 418,000 sessions · 6-week ramp · α = 0.05 · power 0.9',
  chart: {
    kind: 'trend',
    unit: '%',
    yMin: 0,
    yMax: 3.5,
    series: [
      {
        id: 'effect',
        label: 'Cumulative conversion effect (%)',
        points: RAMP_WEEKS.map((x, i) => ({ x, y: R1_EFFECT[i] as number })),
      },
    ],
    markLine: { value: 1.0, label: 'SHIP BAR +1.0%', tone: 'ship' },
  },
  caption: 'Cumulative checkout-conversion effect across the six-week ramp, against the +1.0% ship bar',
  source:
    'Two-arm split, treatment minus control, cumulative through each ramp week. Ship bar +1.0% absolute. n and power as stated. Synthetic demonstration data (EXPERIMENT REVIEW Q2 FY27).',
};

/* ------------------------------------------------------------------ */
/* Reading 02 — KILLED                                                 */
/* ------------------------------------------------------------------ */

const READING_2: Reading = {
  id: 'reading-reorder',
  no: 'READING 02',
  indexTitle: 'Reading 02 — model-picked reorder nudges (killed)',
  hypothesis: 'Model-picked reorder nudges on the home surface lift basket size.',
  standfirst:
    'A tempting idea: predict what a customer will reorder and prompt it. We powered it to detect a +1.0% basket lift and segmented the read on purpose, because averages hide the truth here.',
  numeral: {
    value: 0.3,
    decimals: 1,
    sign: '+',
    suffix: '%',
    metric: 'basket size, treatment − control',
    bar: 'ship bar +1.0% · confidence interval crosses zero',
  },
  verdict: 'killed',
  verdictNote:
    'Killed with pride. The average was flat and the segment read told us why: high-frequency shoppers found the nudge redundant and clicked away. We learned the surface, not the model, was wrong — logged and closed.',
  sample: 'n = 262,000 sessions · 4-week run · α = 0.05 · power 0.8',
  chart: {
    kind: 'bar',
    unit: '%',
    yMin: -1.5,
    yMax: 2,
    data: [
      { id: 'new', category: 'New', value: 1.1, target: 1.0 },
      { id: 'occasional', category: 'Occasional', value: 0.6, target: 1.0 },
      { id: 'regular', category: 'Regular', value: -0.2, target: 1.0 },
      { id: 'high-freq', category: 'High-frequency', value: -0.9, target: 1.0 },
    ],
    markLine: { value: 1.0, label: 'SHIP BAR +1.0%', tone: 'ship' },
  },
  caption: 'Basket-size effect by shopper segment, against the +1.0% ship bar — the average hides the split',
  source:
    'Basket-size effect, treatment minus control, by shopper frequency segment. Ship bar +1.0%. Only "New" clears it and it is the smallest segment. Synthetic demonstration data (EXPERIMENT REVIEW Q2 FY27).',
};

/* ------------------------------------------------------------------ */
/* Reading 03 — WITHHELD (the anomaly)                                 */
/* ------------------------------------------------------------------ */

const R3_FRAUD = [-2.1, -4.8, -7.3, -9.1, -10.4, -11.0] as const; // fraud loss, % (down = good)
const R3_HOLDS = [0.1, 0.3, 0.5, 0.62, 0.74, 0.81] as const; // false-positive holds, % (up = bad)

const READING_3: Reading = {
  id: 'reading-fraud-hold',
  no: 'READING 03',
  indexTitle: 'Reading 03 — aggressive fraud-hold threshold (withheld)',
  hypothesis: 'A lower fraud-hold threshold cuts fraud loss without harming good customers.',
  standfirst:
    'The primary metric won, clearly and significantly — fraud loss fell 11%. And we are not shipping it. This is the reading the whole session is built to be honest about.',
  numeral: {
    value: 11.0,
    decimals: 1,
    sign: '−',
    suffix: '%',
    metric: 'fraud loss, treatment − control (significant)',
    bar: 'GUARDRAIL BREACHED · false-positive holds +0.81% vs +0.30% limit',
  },
  verdict: 'withheld',
  verdictNote:
    'A real, significant win on the metric we set out to move. Withheld anyway: the false-positive customer-hold guardrail breached at +0.81% against a +0.30% ceiling — we would have stopped legitimate customers to catch fraud. The number that decides is not the one we were hoping to move.',
  sample: 'n = 1,240,000 transactions · 6-week ramp · α = 0.05 · power 0.95',
  anomaly: true,
  chart: {
    kind: 'trend',
    unit: '%',
    yMin: -12,
    yMax: 2,
    series: [
      {
        id: 'fraud',
        label: 'Fraud loss effect (%)',
        points: RAMP_WEEKS.map((x, i) => ({ x, y: R3_FRAUD[i] as number })),
      },
      {
        id: 'holds',
        label: 'False-positive holds (%)',
        points: RAMP_WEEKS.map((x, i) => ({ x, y: R3_HOLDS[i] as number })),
      },
    ],
    markLine: { value: 0.3, label: 'GUARDRAIL +0.30%', tone: 'guard' },
  },
  caption:
    'Fraud-loss win against the false-positive-hold guardrail — the guardrail line is the one that decides',
  source:
    'Fraud loss (down is good) and false-positive customer holds (up is bad), treatment minus control, cumulative by ramp week. Guardrail ceiling +0.30% on holds. Synthetic demonstration data (EXPERIMENT REVIEW Q2 FY27).',
};

export const READINGS: readonly Reading[] = [READING_1, READING_2, READING_3];

export const WITHHELD_READING = READINGS.find((r) => r.anomaly) as Reading;

/* ------------------------------------------------------------------ */
/* The board — every reading, verdict-coded (accessible mirror)        */
/* ------------------------------------------------------------------ */

export const BOARD = {
  standfirst:
    'Every reading on one board, verdict beside effect. Shape and word carry the verdict, never colour alone. The withheld reading sits in the same table as the ships — that is the point.',
  columns: ['Ref', 'Reading', 'Effect', 'Verdict'] as const,
  rows: READINGS.map((r) => ({
    ref: r.no.replace('READING ', 'R'),
    reading: r.hypothesis,
    effect: `${r.numeral.sign}${r.numeral.value.toFixed(r.numeral.decimals)}${r.numeral.suffix}`,
    verdict: r.verdict,
    verdictLabel: VERDICT_LABEL[r.verdict],
    anomaly: r.anomaly ?? false,
  })),
} as const;

/* ------------------------------------------------------------------ */
/* Method appendix                                                     */
/* ------------------------------------------------------------------ */

export const METHOD = {
  standfirst:
    'How a reading earns its verdict. Stated up front so no result is argued into shipping after the fact.',
  rows: [
    { label: 'SIGNIFICANCE', value: 'α = 0.05, two-sided · pre-registered primary metric only' },
    { label: 'POWER', value: '0.80 minimum · sample sized before launch, never after' },
    { label: 'MINIMUM EFFECT', value: '+1.0% absolute on the primary metric to reach the ship bar' },
    { label: 'MINIMUM RUNTIME', value: '2 weeks and 2 full business cycles, whichever is longer' },
    { label: 'GUARDRAILS', value: 'Holds ≤ +0.30% · p99 latency ≤ +5ms · complaints ≤ +0.20%' },
    { label: 'STOPPING RULE', value: 'No peeking to a win. A breached guardrail withholds a winner.' },
  ] as const,
} as const;

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* ------------------------------------------------------------------ */

interface SlideBase {
  id: string;
  indexTitle: string;
  section: string;
  place: string;
}

export interface ThesisSlide extends SlideBase {
  kind: 'thesis';
  eyebrow: string;
  titleLines: readonly string[];
  thesis: string;
  meta: readonly string[];
}

export interface LedgerSlide extends SlideBase {
  kind: 'ledger';
  kicker: string;
  heading: string;
}

export interface ReadingSlide extends SlideBase {
  kind: 'reading';
  readingId: string;
}

export interface BoardSlide extends SlideBase {
  kind: 'board';
  kicker: string;
  heading: string;
}

export interface MethodSlide extends SlideBase {
  kind: 'method';
  kicker: string;
  heading: string;
}

export interface CloseSlide extends SlideBase {
  kind: 'close';
  kicker: string;
  titleLines: readonly string[];
  carries: readonly string[];
  meta: readonly string[];
}

export type Slide =
  | ThesisSlide
  | LedgerSlide
  | ReadingSlide
  | BoardSlide
  | MethodSlide
  | CloseSlide;

const SEC_OPEN = 'THE SESSION';
const SEC_READINGS = 'THE READINGS';
const SEC_METHOD = 'THE METHOD';

export const SLIDES: readonly Slide[] = [
  {
    kind: 'thesis',
    id: 'thesis',
    indexTitle: 'Opening — what survives measurement',
    section: SEC_OPEN,
    place: `${SESSION.quarter} · SESSION OPEN`,
    eyebrow: `${SESSION.title} · ${SESSION.quarter}`,
    titleLines: ['We ship what', 'survives', 'measurement —', 'and we say', 'so out loud.'],
    thesis:
      'This is a bench readout, not a highlight reel. Every experiment that reached a decision is on the instrument, wins and kills alike, read to the same tolerance. One reading won its primary metric and is not shipping. We would rather show you that number than bury it.',
    meta: [
      `${SESSION.team} · ${SESSION.quarter}`,
      '23 RUN · 14 CONCLUSIVE · 5 SHIPPED · 6 KILLED · 1 WITHHELD',
      'READINGS ON THE PRE-REGISTERED PRIMARY METRIC, α = 0.05',
    ],
  },
  {
    kind: 'ledger',
    id: 'ledger',
    indexTitle: "The quarter's ledger",
    section: SEC_OPEN,
    place: `${SESSION.quarter} · LEDGER`,
    kicker: 'THE QUARTER ON THE BENCH',
    heading: 'What the quarter actually decided',
  },
  {
    kind: 'reading',
    id: 'reading-checkout',
    indexTitle: 'Reading 01 — shipped',
    section: SEC_READINGS,
    place: 'READING 01 · SHIPPED',
    readingId: 'reading-checkout',
  },
  {
    kind: 'reading',
    id: 'reading-reorder',
    indexTitle: 'Reading 02 — killed',
    section: SEC_READINGS,
    place: 'READING 02 · KILLED',
    readingId: 'reading-reorder',
  },
  {
    kind: 'reading',
    id: 'reading-fraud-hold',
    indexTitle: 'Reading 03 — withheld',
    section: SEC_READINGS,
    place: 'READING 03 · WITHHELD',
    readingId: 'reading-fraud-hold',
  },
  {
    kind: 'board',
    id: 'board',
    indexTitle: 'The board — all readings',
    section: SEC_READINGS,
    place: `${SESSION.quarter} · THE BOARD`,
    kicker: 'ALL READINGS, ONE BOARD',
    heading: 'Effect beside verdict',
  },
  {
    kind: 'method',
    id: 'method',
    indexTitle: 'Method — how a reading earns its verdict',
    section: SEC_METHOD,
    place: 'METHOD · APPENDIX',
    kicker: 'HOW WE MEASURE',
    heading: 'The rules, stated before the run',
  },
  {
    kind: 'close',
    id: 'close',
    indexTitle: 'Close — what we carry forward',
    section: SEC_METHOD,
    place: `${SESSION.quarter} · SESSION CLOSE`,
    kicker: 'WHAT WE CARRY FORWARD',
    titleLines: ['A number we did', 'not want is still', 'a number we keep.'],
    carries: [
      'Ship the streaming feature cache to the remaining surfaces (Reading 01).',
      'Re-home the reorder nudge off the home surface before any re-test (Reading 02).',
      'Redesign the fraud-hold experiment around the holds guardrail, not despite it (Reading 03).',
      'Publish the withheld reading to the whole org — measurement honesty is the product.',
    ],
    meta: [
      `${SESSION.team} · ${SESSION.quarter}`,
      '5 SHIPPED · 6 KILLED · 1 WITHHELD · 11 STILL ON THE BENCH',
    ],
  },
];

export const SLIDE_COUNT = SLIDES.length;

export function slideNumberForId(id: string): number | null {
  const index = SLIDES.findIndex((slide) => slide.id === id);
  return index === -1 ? null : index + 1;
}

export function readingById(id: string): Reading {
  return READINGS.find((r) => r.id === id) as Reading;
}
