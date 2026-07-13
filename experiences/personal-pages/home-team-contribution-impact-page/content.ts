/**
 * Content pack for "The Dawn Wall" — the live rendering of
 * `home-team-contribution-impact-page`.
 *
 * A team lead's contribution page composed as a glass wall at first light:
 * parallel translucent STREAMS (one per teammate) flow left→right and
 * converge into solid, bright SHIPPED OUTCOMES at the dawn edge. Stream
 * weights are contribution data, drawn honestly. One stream ends mid-wall —
 * a teammate who left — capped with a tribute mark, their work still credited
 * in the outcomes: attribution survives departure (the anomaly).
 *
 * signal-glass grammar, but composed OPPOSITE to The Studio: horizontal
 * confluence at dawn, not late-afternoon stacked panes. Everything TYPED and
 * DETERMINISTIC; the profile is ILLUSTRATIVE AND SYNTHETIC.
 */

/* ------------------------------------------------------------------ */
/* Chrome + lead                                                       */
/* ------------------------------------------------------------------ */

export const CHROME = {
  world: 'THE DAWN WALL · PERSONAL PAGE',
  timeOfDay: 'FIRST LIGHT · SPRINT 26',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const LEAD = {
  name: 'Renata Vasquez',
  role: 'Engineering Lead',
  team: 'Decisioning Platform',
  framing: 'This page measures the team, not me.',
  note: 'I am the last name on every outcome below, on purpose. The wall is drawn to scale: the widest streams did the most work, and I am not the widest stream.',
} as const;

export const STATEMENT: readonly string[] = ['We ship at', 'the confluence.'];

export const STATEMENT_SUBLINE =
  'Six streams of work, one wall of glass at first light. Each stream is a person; its width is what they carried; where they meet, something shipped. One stream ends early — Wei moved on mid-year — and their work still lights the outcomes it built.';

/* ------------------------------------------------------------------ */
/* Streams — one per teammate (left origins, top → bottom)             */
/* ------------------------------------------------------------------ */

export interface Stream {
  id: string;
  person: string;
  workstream: string;
  /** Mono channel label on the stream. */
  channel: string;
  /** True for the teammate who left mid-year — the anomaly. */
  departed?: boolean;
  departedNote?: string;
}

export const STREAMS: readonly Stream[] = [
  { id: 's-priya', person: 'Priya Menon', workstream: 'Streaming platform', channel: 'STREAM-01' },
  { id: 's-tomas', person: 'Tomas Halvorsen', workstream: 'Model serving', channel: 'STREAM-02' },
  {
    id: 's-wei',
    person: 'Wei Zhang',
    workstream: 'Data quality',
    channel: 'STREAM-03',
    departed: true,
    departedNote: 'Left for a founding role, MAR 2026. Credited in full below.',
  },
  { id: 's-aisha', person: 'Aïsha Bello', workstream: 'Experimentation', channel: 'STREAM-04' },
  { id: 's-daniel', person: 'Daniel Okafor', workstream: 'Reliability & on-call', channel: 'STREAM-05' },
  { id: 's-renata', person: 'Renata Vasquez', workstream: 'Enabling & glue', channel: 'STREAM-06' },
];

/* ------------------------------------------------------------------ */
/* Outcomes — solid bright blocks at the dawn edge (right)             */
/* ------------------------------------------------------------------ */

export interface Outcome {
  id: string;
  name: string;
  /** Short label + big metric for the wall block (kept legible inside it). */
  short: readonly [string, string];
  metric: string;
  /** Relative magnitude — scales the outcome block and its inflows. */
  magnitude: number;
  before: string;
  after: string;
  impact: string;
}

export const OUTCOMES: readonly Outcome[] = [
  {
    id: 'o-realtime',
    name: 'Real-time decisioning · GA',
    short: ['Real-time', 'decisioning · GA'],
    metric: 'p99 180ms',
    magnitude: 1.0,
    before: 'p99 620ms',
    after: 'p99 180ms',
    impact: 'Batch scoring retired; decisions now inline at 180ms p99.',
  },
  {
    id: 'o-refresh',
    name: 'Weekly model refresh',
    short: ['Weekly model', 'refresh'],
    metric: '2 alerts / qtr',
    magnitude: 0.72,
    before: '6 drift alerts / qtr',
    after: '2 drift alerts / qtr',
    impact: 'Retrain cadence halved the drift surface without hurting stability.',
  },
  {
    id: 'o-contracts',
    name: 'Data contracts, zero-touch',
    short: ['Data contracts,', 'zero-touch'],
    metric: '3 breaks / qtr',
    magnitude: 0.62,
    before: '14 breaks / qtr',
    after: '3 breaks / qtr',
    impact: 'Schema contracts caught upstream breakage before it reached a model.',
  },
];

/* ------------------------------------------------------------------ */
/* Contributions — person × outcome × share-of-that-outcome            */
/* Shares within each outcome sum to 1.0; names first, lead last.      */
/* ------------------------------------------------------------------ */

export interface Contribution {
  streamId: string;
  outcomeId: string;
  /** Fraction of THIS outcome driven by this person (0–1). */
  share: number;
}

export const CONTRIBUTIONS: readonly Contribution[] = [
  // Real-time decisioning
  { streamId: 's-priya', outcomeId: 'o-realtime', share: 0.34 },
  { streamId: 's-tomas', outcomeId: 'o-realtime', share: 0.3 },
  { streamId: 's-daniel', outcomeId: 'o-realtime', share: 0.2 },
  { streamId: 's-renata', outcomeId: 'o-realtime', share: 0.16 },
  // Weekly refresh
  { streamId: 's-aisha', outcomeId: 'o-refresh', share: 0.38 },
  { streamId: 's-tomas', outcomeId: 'o-refresh', share: 0.24 },
  { streamId: 's-daniel', outcomeId: 'o-refresh', share: 0.2 },
  { streamId: 's-renata', outcomeId: 'o-refresh', share: 0.18 },
  // Data contracts — Wei (departed) drove this and stays credited
  { streamId: 's-wei', outcomeId: 'o-contracts', share: 0.4 },
  { streamId: 's-priya', outcomeId: 'o-contracts', share: 0.26 },
  { streamId: 's-aisha', outcomeId: 'o-contracts', share: 0.18 },
  { streamId: 's-renata', outcomeId: 'o-contracts', share: 0.16 },
] as const;

/* ------------------------------------------------------------------ */
/* Rituals — how the team works (concrete, not a values poster)        */
/* ------------------------------------------------------------------ */

export interface Ritual {
  id: string;
  title: string;
  measure: string;
  detail: string;
}

export const RITUALS: readonly Ritual[] = [
  {
    id: 'r-review',
    title: 'Review within the day',
    measure: 'median 1h 20m to first review',
    detail: 'Every PR gets a human review the same working day. If it waits, that is a bug in us.',
  },
  {
    id: 'r-oncall',
    title: 'On-call is one week in six',
    measure: 'nobody does two Decembers running',
    detail: 'Rotation is public a quarter ahead. Holidays are swapped by the team, not assigned by me.',
  },
  {
    id: 'r-postmortem',
    title: 'Blameless by default',
    measure: '9 of 9 incidents written up',
    detail: 'Every incident gets a write-up naming the system, never the person. We keep them all.',
  },
  {
    id: 'r-credit',
    title: 'Credit travels with the work',
    measure: 'attribution outlives tenure',
    detail: 'When someone leaves, their name stays on what they built. See STREAM-03 on the wall.',
  },
];

/* ------------------------------------------------------------------ */
/* Derived helpers (typed, deterministic — no render-time randomness)  */
/* ------------------------------------------------------------------ */

export function streamById(id: string): Stream {
  return STREAMS.find((s) => s.id === id) as Stream;
}

export function outcomeById(id: string): Outcome {
  return OUTCOMES.find((o) => o.id === id) as Outcome;
}

/** Raw ribbon weight = share of outcome × outcome magnitude. */
export function ribbonWeight(c: Contribution): number {
  return c.share * outcomeById(c.outcomeId).magnitude;
}
