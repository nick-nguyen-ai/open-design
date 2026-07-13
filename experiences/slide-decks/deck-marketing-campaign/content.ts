/**
 * Content pack for "The Campaign Room" — the live rendering of
 * `deck-marketing-campaign`.
 *
 * THE WORLD: a campaign proposal staged as a launch war-room at night. A
 * near-black field, ONE electric coral accent, monumental condensed editorial
 * type for the campaign beats. The spine visual is a hand-sketched funnel
 * (wobbly trapezoids, annotated conversion %s); the analytical centrepiece is
 * an INTERACTIVE channel-mix bar — hover or key a segment and it lifts, pinning
 * a mono tooltip (budget, CAC, expected reach) that also mirrors to a live
 * region for keyboard users.
 *
 * The excalidraw funnel strokes are deterministic — precomputed here with a
 * seeded generator, never randomised at render.
 *
 * Anomaly: one funnel channel is struck through —
 * `PAID SOCIAL — CUT · CAC 4.1× TARGET`.
 *
 * All figures are a synthetic campaign (declared in DECK.dataNotice).
 */
import type { KpiTileDatum } from '@enterprise-design/content-components';

export const DECK = {
  code: 'CAMPAIGN-01',
  world: 'THE CAMPAIGN ROOM',
  name: 'SIGNAL & NOISE',
  client: 'MERIDIAN BUSINESS BANKING · SYNTHETIC',
  dataNotice: 'SYNTHETIC CAMPAIGN — DEMONSTRATION ONLY',
  keyboardHint: '← → SLIDES · ↑ ↓ CHANNELS',
} as const;

export const THESIS = {
  line1: 'Everyone is shouting.',
  line2: 'We say one true thing.',
  standfirst:
    'A twelve-week launch for Meridian’s business account that trades reach for resonance — fewer impressions, aimed harder, at the four hundred decisions that actually move the quarter.',
} as const;

/* ------------------------------------------------------------------ */
/* Deterministic hand-drawn stroke generator (runs once, at load)      */
/* ------------------------------------------------------------------ */

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Pt = readonly [number, number];

function roughLine(points: readonly Pt[], seed: number, jitter = 3): string {
  const rnd = seeded(seed);
  const j = () => (rnd() - 0.5) * 2 * jitter;
  let d = '';
  points.forEach(([x, y], i) => {
    const px = (x + j()).toFixed(1);
    const py = (y + j()).toFixed(1);
    if (i === 0) {
      d += `M ${px} ${py}`;
    } else {
      const [prevX, prevY] = points[i - 1] as Pt;
      const cx = ((prevX + x) / 2 + j() * 1.6).toFixed(1);
      const cy = ((prevY + y) / 2 + j() * 1.6).toFixed(1);
      d += ` Q ${cx} ${cy} ${px} ${py}`;
    }
  });
  return d;
}

/* ------------------------------------------------------------------ */
/* The funnel — the spine visual (hand-sketched wobbly trapezoids)     */
/* ------------------------------------------------------------------ */

export interface FunnelStage {
  id: string;
  label: string;
  metric: string;
  /** conversion into the NEXT stage, shown on the join to the right */
  toNext?: string;
  /** x/y for the conversion label (kept clear of the funnel edge) */
  convX?: number;
  convY?: number;
  path: string;
  /** vertical centre of the band, for label placement */
  cy: number;
}

const CX = 296;
function trapezoid(topY: number, botY: number, topHalf: number, botHalf: number, seed: number): string {
  const pts: Pt[] = [
    [CX - topHalf, topY],
    [CX + topHalf, topY],
    [CX + botHalf, botY],
    [CX - botHalf, botY],
    [CX - topHalf, topY],
  ];
  return roughLine(pts, seed, 3.4);
}

export const FUNNEL: readonly FunnelStage[] = [
  {
    id: 'aware',
    label: 'Awareness',
    metric: '3.2M reached',
    toNext: '18% carry',
    convX: 520,
    convY: 214,
    path: trapezoid(96, 204, 248, 190, 11),
    cy: 148,
  },
  {
    id: 'consider',
    label: 'Consideration',
    metric: '576K engaged',
    toNext: '31% carry',
    convX: 470,
    convY: 342,
    path: trapezoid(222, 330, 178, 120, 27),
    cy: 274,
  },
  {
    id: 'intent',
    label: 'Intent',
    metric: '179K high-intent',
    toNext: '22% carry',
    convX: 420,
    convY: 470,
    path: trapezoid(348, 456, 110, 60, 43),
    cy: 400,
  },
  {
    id: 'convert',
    label: 'Conversion',
    metric: '39K accounts',
    path: trapezoid(474, 566, 52, 26, 59),
    cy: 512,
  },
];

export const FUNNEL_VIEW = '0 0 680 600';

/** The struck-through cut channel — the anomaly. */
export const CUT_CHANNEL = {
  label: 'PAID SOCIAL',
  note: 'PAID SOCIAL — CUT · CAC 4.1× TARGET',
  reason:
    'Modelled at $182 CAC against a $45 target — four times over. Cut before launch; its budget moves to search and partnerships.',
} as const;
export const ANOMALY_TEXT = CUT_CHANNEL.note;

/* ------------------------------------------------------------------ */
/* Audience insight                                                   */
/* ------------------------------------------------------------------ */

export const AUDIENCE = {
  who: 'The founder who already switched banks once and hated it.',
  body: 'Our buyer is a two-to-twenty-person business owner, three years in, who has been burned by a “free” account that nickel-and-dimed them. They don’t want another ad. They want one credible reason to move, and proof the switch won’t cost them a week.',
  facts: [
    { stat: '68%', cap: 'would switch for transparent pricing' },
    { stat: '2.4 days', cap: 'average switching effort they’ll tolerate' },
    { stat: '1 reason', cap: 'is all they say they need to move' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Channel mix — interactive bespoke stacked bar                      */
/* ------------------------------------------------------------------ */

export interface Channel {
  id: string;
  label: string;
  /** share of budget, 0–1 (segments sum to 1) */
  share: number;
  budget: string;
  cac: string;
  reach: string;
  note: string;
}

export const CHANNELS: readonly Channel[] = [
  { id: 'search', label: 'Search', share: 0.28, budget: '$1.18M', cac: '$38', reach: '640K in-market', note: 'Highest intent; absorbs the cut social budget.' },
  { id: 'partner', label: 'Partnerships', share: 0.22, budget: '$0.92M', cac: '$41', reach: '210K via accountants', note: 'Accountant referrals — trusted, low CAC.' },
  { id: 'content', label: 'Content & PR', share: 0.18, budget: '$0.76M', cac: '$52', reach: '1.1M reached', note: 'The one-true-thing story; earns the resonance.' },
  { id: 'email', label: 'Lifecycle email', share: 0.16, budget: '$0.67M', cac: '$19', reach: '95K nurtured', note: 'Owned audience; carries switch-assist proof.' },
  { id: 'events', label: 'Events', share: 0.16, budget: '$0.67M', cac: '$61', reach: '18K met in person', note: 'Founder meetups; small reach, high conviction.' },
];

export const CHANNEL_BUDGET_TOTAL = '$4.20M';

/* ------------------------------------------------------------------ */
/* KPI tile row — comp.kpi-tile                                       */
/* ------------------------------------------------------------------ */

export const KPIS: readonly KpiTileDatum[] = [
  { id: 'budget', label: 'Working budget', value: 4_200_000, unit: 'currency', status: 'on-track' },
  { id: 'cac', label: 'Blended CAC target', value: 45, unit: 'currency', target: 45, status: 'on-track' },
  { id: 'reach', label: 'Net reach', value: 3_200_000, unit: 'count', status: 'on-track' },
];

/* ------------------------------------------------------------------ */
/* Flight calendar — phase bars                                       */
/* ------------------------------------------------------------------ */

export interface Phase {
  id: string;
  label: string;
  /** start week 0-based, length in weeks (12-week flight) */
  start: number;
  weeks: number;
  accent?: boolean;
}
export const FLIGHT_WEEKS = 12;
export const PHASES: readonly Phase[] = [
  { id: 'tease', label: 'Tease', start: 0, weeks: 2 },
  { id: 'launch', label: 'Launch', start: 2, weeks: 3, accent: true },
  { id: 'sustain', label: 'Sustain', start: 5, weeks: 5 },
  { id: 'convert', label: 'Convert push', start: 10, weeks: 2, accent: true },
];

/* ------------------------------------------------------------------ */
/* Creative direction board                                           */
/* ------------------------------------------------------------------ */

export const CREATIVE = {
  headline: 'One true thing, said plainly.',
  principles: [
    { id: 'c1', term: 'TONE', text: 'Plain-spoken, never clever for its own sake. The confidence of an honest number.' },
    { id: 'c2', term: 'VISUAL', text: 'Near-black field, one coral signal, monumental type. The ad looks like the product feels.' },
    { id: 'c3', term: 'PROOF', text: 'Every claim carries the switch-assist guarantee beside it — no reason without a receipt.' },
    { id: 'c4', term: 'ANTI', text: 'No stock smiles, no lifestyle B-roll, no “effortless”. We are the opposite of noise.' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Measurement plan                                                   */
/* ------------------------------------------------------------------ */

export interface Measure {
  id: string;
  metric: string;
  target: string;
  guardrail: string;
}
export const MEASUREMENT: readonly Measure[] = [
  { id: 'm1', metric: 'Accounts opened', target: '39,000', guardrail: 'Blended CAC ≤ $45' },
  { id: 'm2', metric: 'Assisted switches completed', target: '31,000', guardrail: '≤ 2.4 days median' },
  { id: 'm3', metric: 'Brand consideration lift', target: '+9 pts', guardrail: 'Tracked, not optimised for' },
  { id: 'm4', metric: 'Cost per high-intent lead', target: '$24', guardrail: 'Kill any channel above $60' },
];

/* ------------------------------------------------------------------ */
/* The ask                                                            */
/* ------------------------------------------------------------------ */

export const ASK = {
  statement: 'Fund the signal. Cut the noise.',
  detail:
    'We are asking to commit the $4.2M working budget, approve the cut of paid social, and green-light the twelve-week flight to open on the 3rd.',
  decisions: [
    'Commit $4.2M working budget across five channels.',
    'Approve cutting paid social — its CAC is 4.1× target.',
    'Green-light the twelve-week flight, launch on the 3rd.',
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                        */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'audience'
  | 'big-idea'
  | 'funnel'
  | 'channels'
  | 'flight'
  | 'creative'
  | 'measurement'
  | 'ask';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Cover', kicker: 'CAMPAIGN PROPOSAL' },
  { id: 'audience', kind: 'audience', section: 'Audience', kicker: '01 · THE AUDIENCE' },
  { id: 'big-idea', kind: 'big-idea', section: 'The big idea', kicker: '02 · THE BIG IDEA' },
  { id: 'funnel', kind: 'funnel', section: 'The funnel', kicker: '03 · THE FUNNEL' },
  { id: 'channels', kind: 'channels', section: 'Channel mix', kicker: '04 · CHANNEL MIX' },
  { id: 'flight', kind: 'flight', section: 'Flight plan', kicker: '05 · FLIGHT PLAN' },
  { id: 'creative', kind: 'creative', section: 'Creative', kicker: '06 · CREATIVE DIRECTION' },
  { id: 'measurement', kind: 'measurement', section: 'Measurement', kicker: '07 · MEASUREMENT' },
  { id: 'ask', kind: 'ask', section: 'The ask', kicker: '08 · THE ASK' },
];

export const SLIDE_COUNT = SLIDES.length;
export const FUNNEL_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'funnel') + 1;
export const CHANNELS_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'channels') + 1;
