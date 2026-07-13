/**
 * Content pack for "T-Minus" — the live rendering of `deck-product-launch`.
 *
 * THE WORLD: a product-launch plan staged as a COUNTDOWN SEQUENCE. Every slide
 * carries a monumental T-minus stamp (T-30 → T-0) that counts down as the deck
 * advances, over a midnight field crossed by a single thin amber horizon line
 * that RISES slide by slide toward launch — at T-0 it reaches the top and the
 * field goes GO-green. The countdown + rising horizon is the persistent device;
 * the day-0 runbook timeline is the commanding bespoke visual.
 *
 * Anomaly: on the readiness board, the security gate is amber against otherwise
 * green gates — `SECURITY REVIEW PENDING — BLOCKS T-7`. The one thing that can
 * still stop the clock.
 *
 * All figures are a synthetic launch (declared in DECK.dataNotice). No real
 * institution is named or implied; magnitudes are realistic for a mid-market
 * bank payments product.
 */
import type { StatusListItemDatum, KpiTileDatum } from '@enterprise-design/content-components';

export const DECK = {
  code: 'LAUNCH-04',
  world: 'T-MINUS',
  product: 'MERIDIAN INSTANT',
  programme: 'REAL-TIME BUSINESS PAYMENTS · GO-LIVE',
  war: 'LAUNCH CONTROL · SEQUENCE 04',
  dataNotice: 'SYNTHETIC LAUNCH PLAN — DEMONSTRATION ONLY',
  keyboardHint: '← → NAVIGATE · HOME/END',
} as const;

/* ------------------------------------------------------------------ */
/* The countdown device — a T-minus stamp + a rising horizon per slide */
/* ------------------------------------------------------------------ */

/**
 * Each slide sits at a point on the countdown. `stamp` is the monumental
 * T-minus label; `horizon` is 0→1, the height the amber launch line has climbed
 * (0 = deep field, 1 = reaches the top on the GO slide).
 */

/* ------------------------------------------------------------------ */
/* Readiness board — comp.status-list · THE anomaly                    */
/* ------------------------------------------------------------------ */

export const GATES: readonly StatusListItemDatum[] = [
  {
    id: 'legal',
    label: 'Legal & regulatory',
    status: 'success',
    description: 'Terms, disclosures and the regulator go-live notification are filed and cleared.',
  },
  {
    id: 'security',
    label: 'Security review',
    status: 'warning',
    description: 'SECURITY REVIEW PENDING — BLOCKS T-7. Penetration retest of the payments API is booked but not signed off.',
  },
  {
    id: 'docs',
    label: 'Documentation',
    status: 'success',
    description: 'Help centre, API reference and the day-0 runbook are published and reviewed.',
  },
  {
    id: 'support',
    label: 'Support readiness',
    status: 'success',
    description: 'Frontline trained on the top twenty cases; launch-week escalation rota staffed.',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    status: 'success',
    description: 'Capacity load-tested to three times expected day-0 volume with headroom to spare.',
  },
];

export const ANOMALY_TEXT = 'SECURITY REVIEW PENDING — BLOCKS T-7';
export const READINESS_SLIDE_NUMBER = 4;

/* ------------------------------------------------------------------ */
/* Day-0 runbook — the commanding horizontal sequence (local SVG)      */
/* ------------------------------------------------------------------ */

export interface RunStep {
  id: string;
  time: string;
  label: string;
  detail: string;
  /** The go/no-go gate step — rendered as the pivotal marker. */
  gate?: boolean;
}

export const RUNBOOK: readonly RunStep[] = [
  { id: 'freeze', time: '05:00', label: 'Freeze', detail: 'Code freeze confirmed; release candidate pinned.' },
  { id: 'enable', time: '06:00', label: 'Enable', detail: 'Feature flags on in production, still dark to customers.' },
  { id: 'smoke', time: '07:00', label: 'Smoke', detail: 'Synthetic payments run clean end to end across rails.' },
  { id: 'gono', time: '07:45', label: 'Go / No-go', detail: 'Launch director calls it on the readiness board.', gate: true },
  { id: 'staff', time: '08:00', label: 'Staff cohort', detail: 'Employees transact live — the first real money moves.' },
  { id: 'ramp', time: '09:00', label: 'Ramp 10%', detail: 'First customer cohort enabled; error budget watched.' },
  { id: 'widen', time: '12:00', label: 'Widen 50%', detail: 'Half of eligible accounts; comms embargo still on.' },
  { id: 'ga', time: '16:00', label: 'GA · 100%', detail: 'General availability; announcement and press embargo lift.' },
  { id: 'watch', time: '18:00', label: 'Night watch', detail: 'Heightened monitoring held through the first overnight.' },
];

/** Precomputed x-positions for the runbook rail in the 1200-wide drawing. */
const RUN_X0 = 70;
const RUN_X1 = 1130;
export const RUNBOOK_POS = RUNBOOK.map((s, i) => ({
  ...s,
  x: RUN_X0 + ((RUN_X1 - RUN_X0) * i) / (RUNBOOK.length - 1),
  // alternate labels above / below the rail so nothing collides
  above: i % 2 === 0,
}));
export const RUNBOOK_RAIL_Y = 150;
export const RUNBOOK_VIEW = '0 0 1200 300';
export const RUNBOOK_SLIDE_NUMBER = 7;

/* ------------------------------------------------------------------ */
/* The product in one sentence + launch thesis                         */
/* ------------------------------------------------------------------ */

export const ONE_SENTENCE = {
  lead: 'What we are launching',
  sentence: 'Meridian Instant lets a business move money in seconds, any hour, any day — with the same settlement certainty they get from a wire, at a tenth of the cost.',
  facts: [
    { stat: '< 8 sec', cap: 'end-to-end settlement, target' },
    { stat: '24 / 7 / 365', cap: 'always-on rails' },
    { stat: '£0.20', cap: 'per payment, flat' },
  ],
} as const;

export const THESIS = {
  line1: 'Speed is the',
  line2: 'whole product.',
  standfirst:
    'Businesses do not switch banks for another payments menu. They switch when a payment that used to take a day takes eight seconds and never fails silently. That is the one promise this launch has to keep on day zero — everything else on the plan exists to protect it.',
} as const;

/* ------------------------------------------------------------------ */
/* Comms & channel plan                                                */
/* ------------------------------------------------------------------ */

export interface CommsLine {
  id: string;
  channel: string;
  moment: string;
  detail: string;
}
export const COMMS: readonly CommsLine[] = [
  { id: 'c1', channel: 'In-product', moment: 'T-0, at GA', detail: 'Eligible admins see an enablement card the moment their account flips on.' },
  { id: 'c2', channel: 'Relationship managers', moment: 'T-3 → T-0', detail: 'Top 200 accounts briefed by their RM before the public announcement.' },
  { id: 'c3', channel: 'Email', moment: 'T-0, embargo lift', detail: 'Segmented to eligible businesses only; no cold blast to the base.' },
  { id: 'c4', channel: 'Press & analyst', moment: 'T-0, 16:00', detail: 'Embargoed briefing lifts with GA; one spokesperson, one message.' },
  { id: 'c5', channel: 'Status page', moment: 'T-0 → T+7', detail: 'Live launch status and known-issues log, updated by the on-call lead.' },
];

/* ------------------------------------------------------------------ */
/* Pricing & packaging                                                 */
/* ------------------------------------------------------------------ */

export interface PriceTier {
  id: string;
  name: string;
  price: string;
  unit: string;
  includes: string;
  feature: boolean;
}
export const PRICING: readonly PriceTier[] = [
  { id: 'starter', name: 'Starter', price: '£0.30', unit: 'per payment', includes: 'Up to 2,000 instant payments a month, standard support.', feature: false },
  { id: 'business', name: 'Business', price: '£0.20', unit: 'per payment', includes: 'Volume pricing, bulk file upload, priority support.', feature: true },
  { id: 'scale', name: 'Scale', price: 'Custom', unit: 'committed volume', includes: 'API rate uplift, dedicated limits, named support engineer.', feature: false },
];

/* ------------------------------------------------------------------ */
/* Risk & rollback — what triggers abort                               */
/* ------------------------------------------------------------------ */

export interface AbortTrigger {
  id: string;
  metric: string;
  threshold: string;
  action: string;
}
export const ABORTS: readonly AbortTrigger[] = [
  { id: 'a1', metric: 'Payment success rate', threshold: 'below 99.0% for 5 min', action: 'Halt ramp, hold cohort, page platform on-call.' },
  { id: 'a2', metric: 'Settlement latency (p95)', threshold: 'above 20 sec sustained', action: 'Freeze further widening; investigate rail before proceeding.' },
  { id: 'a3', metric: 'Duplicate / misdirected payment', threshold: 'any confirmed case', action: 'Full stop. Flags off, reconcile, incident bridge opens.' },
  { id: 'a4', metric: 'Security signal', threshold: 'any credible exploit', action: 'Kill switch. Rollback to flags-off, notify regulator.' },
];
export const ROLLBACK_NOTE =
  'Rollback is one switch: feature flags to off returns every account to the existing rails with no data migration. We can be fully back to today’s state inside ten minutes, any point on the timeline.';

/* ------------------------------------------------------------------ */
/* Metrics — comp.kpi-tile (day-7 / day-30)                            */
/* ------------------------------------------------------------------ */

export const METRICS: readonly KpiTileDatum[] = [
  { id: 'activated', label: 'Activated accounts · day 7', value: 4200, unit: 'count', target: 3500, status: 'on-track' },
  { id: 'success', label: 'Payment success rate · day 7', value: 0.994, unit: 'percent', target: 0.99, status: 'on-track' },
  { id: 'latency', label: 'Settlement p95 · day 7', value: 7.8, unit: 'ratio', status: 'on-track' },
  { id: 'tickets', label: 'Support tickets / 1k txns · day 30', value: 1.4, unit: 'ratio', delta: -0.28, deltaGoodDirection: 'down', status: 'on-track' },
];
export const METRICS_NOTE =
  'Day-7 numbers are the launch-week targets committed to the steering group; the day-30 support ratio is the trailing figure we expect once the enablement wave settles.';

/* ------------------------------------------------------------------ */
/* Closing — the T-0 GO slide                                          */
/* ------------------------------------------------------------------ */

export const CLOSING = {
  word: 'GO',
  line: 'On the readiness board, one gate stays amber.',
  detail:
    'We launch when security signs off — not before. Clear that one gate this week and the sequence above runs itself. Everything else is green.',
  decisions: [
    'Confirm the day-0 launch director and the go/no-go time (07:45).',
    'Close the pending security retest before T-7 — the only open gate.',
    'Approve the ramp plan: staff, then 10%, 50%, 100% across launch day.',
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                         */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'one-sentence'
  | 'thesis'
  | 'readiness'
  | 'comms'
  | 'pricing'
  | 'runbook'
  | 'risk'
  | 'metrics'
  | 'closing';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
  /** Monumental countdown stamp. */
  stamp: string;
  /** 0→1 height the amber horizon line has risen on this slide. */
  horizon: number;
  /** GO slide flips the field green. */
  go?: boolean;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Launch', kicker: 'PRODUCT LAUNCH', stamp: 'T-30', horizon: 0.12 },
  { id: 'one-sentence', kind: 'one-sentence', section: 'The product', kicker: '01 · IN ONE SENTENCE', stamp: 'T-24', horizon: 0.2 },
  { id: 'thesis', kind: 'thesis', section: 'Launch thesis', kicker: '02 · THE THESIS', stamp: 'T-21', horizon: 0.3 },
  { id: 'readiness', kind: 'readiness', section: 'Readiness board', kicker: '03 · ARE WE READY', stamp: 'T-14', horizon: 0.42 },
  { id: 'comms', kind: 'comms', section: 'Comms plan', kicker: '04 · WHO HEARS, WHEN', stamp: 'T-10', horizon: 0.52 },
  { id: 'pricing', kind: 'pricing', section: 'Pricing', kicker: '05 · PRICING & PACKAGING', stamp: 'T-7', horizon: 0.62 },
  { id: 'runbook', kind: 'runbook', section: 'Day-0 runbook', kicker: '06 · THE SEQUENCE', stamp: 'T-3', horizon: 0.74 },
  { id: 'risk', kind: 'risk', section: 'Risk & rollback', kicker: '07 · WHAT ABORTS IT', stamp: 'T-2', horizon: 0.82 },
  { id: 'metrics', kind: 'metrics', section: 'Metrics', kicker: '08 · DAY 7 / DAY 30', stamp: 'T-1', horizon: 0.9 },
  { id: 'closing', kind: 'closing', section: 'Go', kicker: '09 · LAUNCH', stamp: 'T-0', horizon: 1, go: true },
];

export const SLIDE_COUNT = SLIDES.length;
