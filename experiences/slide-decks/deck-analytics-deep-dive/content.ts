/**
 * Content pack for "The Long Signal" — the live rendering of
 * `deck-analytics-deep-dive`.
 *
 * THE WORLD: an analytics deep-dive staged as an observatory. ONE dataset —
 * fifty-two weeks of a single business metric (checkout conversion, synthetic)
 * — threads the entire deck as a persistent bespoke chart band across the
 * bottom of every slide. The SAME series is progressively annotated as the
 * argument develops; each slide lights up its region of the line. The hero
 * slide expands the band to the full viewport as an INTERACTIVE INSTRUMENT:
 * crosshair readout (week, value, 7-day delta), a pinnable comparison marker,
 * arrow-key week-walking, and a `B`-toggled baseline overlay — all bespoke
 * local SVG with an aria-live readout and a hidden 52-row data table.
 *
 * The series is deterministic: generated once at module load from a seeded
 * generator (never randomised at render) with a real seasonal shape, gentle
 * trend, baked noise, and a genuine LEVEL SHIFT at week 37 — the anomaly the
 * eye is meant to find, kept in every summary statistic rather than smoothed.
 *
 * Anomaly (verbatim): `WEEK 37 REGIME CHANGE — FLAGGED, NOT SMOOTHED`.
 * All figures are a synthetic series (declared in DECK.dataNotice).
 */
import type { KpiTileDatum } from '@enterprise-design/content-components';
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';

export const DECK = {
  code: 'SIGNAL-01',
  world: 'THE LONG SIGNAL',
  metric: 'CHECKOUT CONVERSION',
  subject: 'MERIDIAN COMMERCE · SYNTHETIC',
  dataNotice: 'SYNTHETIC SERIES — DEMONSTRATION ONLY',
  keyboardHint: '← → SLIDES · ON THE INSTRUMENT: ← → WEEK · ENTER PIN · B BASELINE',
} as const;

export const THESIS = {
  line1: 'One metric,',
  line2: 'honestly read.',
  standfirst:
    'Fifty-two weeks of checkout conversion, read as one continuous signal — not a highlight reel of the good weeks. Every anomaly kept in view, including the one nobody wanted.',
} as const;

/* ------------------------------------------------------------------ */
/* Deterministic 52-week series (generated once, at module load)       */
/* ------------------------------------------------------------------ */

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface Week {
  /** 1-based ISO week index within the studied year. */
  week: number;
  /** Checkout conversion, percent (e.g. 3.62 = 3.62%). */
  value: number;
  /** Sessions observed that week (the denominator, n). */
  n: number;
  /** Week-over-week change in conversion, percentage points (null for week 1). */
  delta: number | null;
}

export const SHIFT_WEEK = 37;
const SHIFT_INDEX = SHIFT_WEEK - 1;
const WEEK_COUNT = 52;

const noise = seeded(370437);
const sample = seeded(915523);

export const WEEKS: readonly Week[] = (() => {
  const rows: Week[] = [];
  let prev: number | null = null;
  for (let i = 0; i < WEEK_COUNT; i += 1) {
    const week = i + 1;
    // Annual seasonal shape: trough at the turn of the year, peak mid-year.
    const seasonal = 0.24 * Math.sin((i / WEEK_COUNT) * Math.PI * 2 - Math.PI / 2);
    // Gentle secular improvement across the year.
    const trend = 0.0055 * i;
    // Baked week-to-week noise (deterministic, never randomised at render).
    const jitter = (noise() - 0.5) * 0.12;
    // The genuine level shift at week 37 — a downward regime change.
    const shift = week >= SHIFT_WEEK ? -0.54 : 0;
    const value = Number((3.58 + seasonal + trend + jitter + shift).toFixed(2));
    const n = Math.round(48000 + 9000 * Math.sin((i / WEEK_COUNT) * Math.PI * 2) + (sample() - 0.5) * 4200);
    const delta = prev === null ? null : Number((value - prev).toFixed(2));
    rows.push({ week, value, n, delta });
    prev = value;
  }
  return rows;
})();

export const VALUES = WEEKS.map((w) => w.value);

function mean(list: readonly number[]): number {
  return list.reduce((sum, v) => sum + v, 0) / list.length;
}

export const PRE_MEAN = Number(mean(VALUES.slice(0, SHIFT_INDEX)).toFixed(2));
export const POST_MEAN = Number(mean(VALUES.slice(SHIFT_INDEX)).toFixed(2));
export const SHIFT_DELTA = Number((POST_MEAN - PRE_MEAN).toFixed(2));
export const SERIES_MEAN = Number(mean(VALUES).toFixed(2));
export const TOTAL_SESSIONS = WEEKS.reduce((sum, w) => sum + w.n, 0);

/* Y-scale bounds for every renderer of this series (shared, with headroom). */
export const VALUE_MIN = Math.floor(Math.min(...VALUES) * 10) / 10 - 0.1;
export const VALUE_MAX = Math.ceil(Math.max(...VALUES) * 10) / 10 + 0.1;

/**
 * Normalised sample points in a unit box: x in [0,1] left→right, y in [0,1]
 * where 1 is the TOP (highest value). Each renderer maps this into its own
 * viewBox, so the band strip and the full instrument draw the exact same line.
 */
export const POINTS01: readonly (readonly [number, number])[] = WEEKS.map((w, i) => {
  const x = i / (WEEK_COUNT - 1);
  const y = (w.value - VALUE_MIN) / (VALUE_MAX - VALUE_MIN);
  return [Number(x.toFixed(5)), Number(y.toFixed(5))] as const;
});

/* ------------------------------------------------------------------ */
/* The anomaly — the week-37 regime change (verbatim strings)          */
/* ------------------------------------------------------------------ */

export const ANOMALY_TEXT = 'WEEK 37 REGIME CHANGE — FLAGGED, NOT SMOOTHED';
export const ANOMALY = {
  flag: ANOMALY_TEXT,
  headline: 'A level shift, not a bad week.',
  body: `At week 37 the series steps down and stays down — a ${Math.abs(SHIFT_DELTA).toFixed(2)}-point drop in the run rate that never recovers to the prior level. It is a regime change, not noise: the weeks before average ${PRE_MEAN}%, the weeks after average ${POST_MEAN}%.`,
  discipline:
    'We keep it in every summary statistic. Smoothing it away would have flattered the year and hidden the one thing worth acting on. The line is drawn as it happened.',
  cause:
    'Traced to a checkout change shipped that week that added a required account step. Correlation is strong; the controlled read-out is on the roadmap slide.',
} as const;

/* ------------------------------------------------------------------ */
/* Slide 2 — the question                                             */
/* ------------------------------------------------------------------ */

export const QUESTION = {
  kicker: '01 · THE QUESTION',
  heading: 'Did checkout get better this year, or did we just get lucky in the spring?',
  body: 'Conversion ended the year close to where it began. That flat headline hides two different stories — a genuine seasonal lift, and a step-down at week 37 that the average quietly absorbs. This deck reads the whole line to tell them apart.',
  asides: [
    { term: 'NOT', text: 'A dashboard tour, or a wall of green tiles.' },
    { term: 'IS', text: 'One series, read end to end, with its worst week left in.' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide 3 — the dataset (provenance card)                            */
/* ------------------------------------------------------------------ */

export const DATASET = {
  kicker: '02 · THE DATASET',
  heading: 'What the line is made of.',
  provenance: [
    { label: 'METRIC', value: 'Checkout conversion — completed orders ÷ checkout sessions' },
    { label: 'GRAIN', value: 'Weekly, ISO weeks W01–W52 (52 observations)' },
    { label: 'DENOMINATOR', value: `${(TOTAL_SESSIONS / 1_000_000).toFixed(1)}M checkout sessions across the year` },
    { label: 'DEFINITION', value: 'Session = a cart that reached the checkout step; order = payment authorised' },
    { label: 'EXCLUSIONS', value: 'Internal test traffic and known bot sessions removed pre-aggregation' },
    { label: 'PROVENANCE', value: 'Synthetic series, seeded and deterministic — no real customer data' },
  ],
  facts: [
    { stat: '52', cap: 'weekly observations' },
    { stat: `${SERIES_MEAN}%`, cap: 'mean conversion' },
    { stat: `${PRE_MEAN}→${POST_MEAN}%`, cap: 'run rate across the week-37 shift' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide 4 — the instrument (hero)                                    */
/* ------------------------------------------------------------------ */

export const INSTRUMENT = {
  kicker: '03 · THE INSTRUMENT',
  heading: 'Walk the whole year.',
  help: 'Hover the line, or focus it and use ← → to walk weeks. Enter pins a comparison marker; B overlays the pre-shift baseline.',
} as const;

/* ------------------------------------------------------------------ */
/* Slide 5 — seasonality decomposition (small-multiple strips)        */
/* ------------------------------------------------------------------ */

export const SEASONALITY = {
  kicker: '04 · SEASONALITY',
  heading: 'Trend, season, remainder.',
  body: 'The same line, decomposed. A slow upward trend, a clean annual season peaking mid-year, and a remainder that is quiet noise — until week 37, where the remainder holds a persistent negative offset the season can not explain.',
  strips: [
    {
      id: 'trend',
      label: 'TREND',
      note: 'Gentle secular lift, +0.28pp across the year before the shift.',
      kind: 'trend' as const,
    },
    {
      id: 'season',
      label: 'SEASON',
      note: 'Annual cycle, peak near week 27, trough at the turns.',
      kind: 'season' as const,
    },
    {
      id: 'remainder',
      label: 'REMAINDER',
      note: 'Quiet, mean-zero — then a step at week 37 that stays.',
      kind: 'remainder' as const,
    },
  ],
} as const;

/* Decomposition strips — deterministic normalised traces (y in [0,1]). */
export interface DecompStrip {
  id: string;
  label: string;
  note: string;
  kind: 'trend' | 'season' | 'remainder';
  points01: readonly (readonly [number, number])[];
}

function stripPoints(kind: 'trend' | 'season' | 'remainder'): (readonly [number, number])[] {
  return WEEKS.map((w, i) => {
    const x = i / (WEEK_COUNT - 1);
    let raw: number;
    if (kind === 'trend') {
      raw = 0.5 + 0.0055 * i * 0.9;
    } else if (kind === 'season') {
      raw = 0.5 + 0.42 * Math.sin((i / WEEK_COUNT) * Math.PI * 2 - Math.PI / 2);
    } else {
      const base = (seeded(370437 + i)() - 0.5) * 0.28;
      raw = 0.5 + base + (w.week >= SHIFT_WEEK ? -0.34 : 0);
    }
    return [x, Math.max(0.04, Math.min(0.96, raw))] as const;
  });
}

export const DECOMP_STRIPS: readonly DecompStrip[] = SEASONALITY.strips.map((s) => ({
  ...s,
  points01: stripPoints(s.kind),
}));

/* ------------------------------------------------------------------ */
/* Slide 6 — the anomaly week (uses ANOMALY above)                    */
/* ------------------------------------------------------------------ */

export const ANOMALY_SLIDE = {
  kicker: '05 · THE ANOMALY',
} as const;

/* ------------------------------------------------------------------ */
/* Slide 7 — cohort comparison (comp.trend-chart, two cohorts)        */
/* ------------------------------------------------------------------ */

function cohortSeries(id: string, label: string, base: number, seasonAmp: number, shift: number, seed: number): TrendChartSeriesInput {
  const rnd = seeded(seed);
  return {
    id,
    label,
    points: WEEKS.map((w, i) => ({
      x: `W${String(w.week).padStart(2, '0')}`,
      y: Number(
        (
          base +
          seasonAmp * Math.sin((i / WEEK_COUNT) * Math.PI * 2 - Math.PI / 2) +
          0.004 * i +
          (rnd() - 0.5) * 0.1 +
          (w.week >= SHIFT_WEEK ? shift : 0)
        ).toFixed(2),
      ),
    })),
  };
}

/** Two cohorts split from the same population — the shift is not shared equally. */
export const COHORTS: readonly TrendChartSeriesInput[] = [
  cohortSeries('returning', 'Returning customers', 4.32, 0.2, -0.12, 5501),
  cohortSeries('new', 'New visitors', 2.94, 0.26, -0.94, 7307),
];

export const COHORT = {
  kicker: '06 · COHORTS',
  heading: 'The shift did not fall on everyone.',
  body: 'Split the line by customer type and the week-37 step lands almost entirely on new visitors — the ones asked to create an account. Returning customers, already signed in, barely move. That is the signature of a checkout-friction cause, not a demand shock.',
  note: 'Synthetic cohorts · completed orders ÷ checkout sessions, weekly',
} as const;

/* ------------------------------------------------------------------ */
/* Slide 8 — what moved it (comp.kpi-tile row of effect sizes)        */
/* ------------------------------------------------------------------ */

export const DRIVERS = {
  kicker: '07 · WHAT MOVED IT',
  heading: 'Four things moved the line. One of them we chose.',
  body: 'Attributed effect sizes on conversion, in percentage points, from the weeks each change landed. The mandatory-account step at week 37 is the largest single mover — and the only one we shipped ourselves.',
  /** Effect sizes as fractions of a percentage point → shown as percent by KpiTile. */
  effects: [
    { id: 'season', label: 'Seasonal peak (wk 27)', value: 0.0038, unit: 'percent', status: 'on-track', deltaGoodDirection: 'up' },
    { id: 'trend', label: 'Secular trend (full year)', value: 0.0028, unit: 'percent', status: 'on-track', deltaGoodDirection: 'up' },
    { id: 'wallet', label: 'Wallet pay launch (wk 14)', value: 0.0019, unit: 'percent', status: 'on-track', deltaGoodDirection: 'up' },
    { id: 'account', label: 'Mandatory account (wk 37)', value: -0.0054, unit: 'percent', target: 0, status: 'off-track', deltaGoodDirection: 'up' },
  ] satisfies KpiTileDatum[],
  annotations: [
    { week: 14, label: 'Wallet pay' },
    { week: 27, label: 'Seasonal peak' },
    { week: 37, label: 'Mandatory account' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide 9 — what we do not know (honest uncertainty)                 */
/* ------------------------------------------------------------------ */

export const UNKNOWN = {
  kicker: '08 · WHAT WE DO NOT KNOW',
  heading: 'Where the line stops telling us things.',
  body: 'An honest read names its own limits. Three of them, stated plainly rather than buried in a footnote.',
  items: [
    {
      term: 'CAUSATION',
      text: 'The week-37 step correlates with the account change, but no holdout was running. We are confident, not certain — a controlled test is the only way to close it.',
    },
    {
      term: 'ATTRIBUTION',
      text: 'The four effect sizes overlap in time; the decomposition apportions them, but a few tenths of a point could belong to any neighbour.',
    },
    {
      term: 'HORIZON',
      text: 'Fifty-two weeks is one seasonal cycle. We can describe this year; we can not yet separate a durable regime from a long trough.',
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide 10 — recommendation + monitoring plan                        */
/* ------------------------------------------------------------------ */

export const RECOMMENDATION = {
  kicker: '09 · RECOMMENDATION',
  line1: 'Reverse the step.',
  line2: 'Then watch the line.',
  standfirst:
    'Restore guest checkout behind an experiment, and instrument the series so the next regime change is caught in a week, not a quarter.',
  actions: [
    'Run a guest-checkout holdout — expect to recover most of the 0.54-point step within four weeks.',
    'Keep the week-37 shift in every reported number; annotate, never smooth.',
    'Stand up a weekly change-point monitor on the live series, alerting on a sustained ±0.3-point shift.',
  ],
  monitor: {
    label: 'MONITORING THRESHOLD',
    value: '±0.30 pp sustained over 3 weeks → page the analytics on-call',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                        */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'question'
  | 'dataset'
  | 'instrument'
  | 'seasonality'
  | 'anomaly'
  | 'cohort'
  | 'drivers'
  | 'unknown'
  | 'recommendation';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  /** The region of the persistent band this slide lights up (1-based weeks). */
  region: { from: number; to: number } | null;
  /** Band highlight mode for the lit region. */
  mode: 'signal' | 'flag' | 'muted';
  /** Short annotation shown on the persistent band for this slide. */
  bandNote?: string;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Cover', region: null, mode: 'muted' },
  { id: 'question', kind: 'question', section: 'The question', region: { from: 1, to: 52 }, mode: 'muted', bandNote: 'FLAT HEADLINE · TWO STORIES INSIDE' },
  { id: 'dataset', kind: 'dataset', section: 'The dataset', region: { from: 1, to: 52 }, mode: 'signal', bandNote: '52 WEEKS · CHECKOUT CONVERSION' },
  { id: 'instrument', kind: 'instrument', section: 'The instrument', region: null, mode: 'signal' },
  { id: 'seasonality', kind: 'seasonality', section: 'Seasonality', region: { from: 20, to: 34 }, mode: 'signal', bandNote: 'SEASONAL PEAK · WK 27' },
  { id: 'anomaly', kind: 'anomaly', section: 'The anomaly', region: { from: 37, to: 52 }, mode: 'flag', bandNote: ANOMALY_TEXT },
  { id: 'cohort', kind: 'cohort', section: 'Cohorts', region: { from: 37, to: 52 }, mode: 'flag', bandNote: 'SHIFT FALLS ON NEW VISITORS' },
  { id: 'drivers', kind: 'drivers', section: 'What moved it', region: { from: 14, to: 37 }, mode: 'signal', bandNote: 'FOUR MOVERS · ONE WE CHOSE' },
  { id: 'unknown', kind: 'unknown', section: 'What we do not know', region: { from: 45, to: 52 }, mode: 'muted', bandNote: 'ONE CYCLE ONLY · HORIZON LIMIT' },
  { id: 'recommendation', kind: 'recommendation', section: 'Recommendation', region: { from: 37, to: 52 }, mode: 'flag', bandNote: 'REVERSE THE STEP · WATCH THE LINE' },
];

export const SLIDE_COUNT = SLIDES.length;
export const INSTRUMENT_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'instrument') + 1;
export const ANOMALY_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'anomaly') + 1;
