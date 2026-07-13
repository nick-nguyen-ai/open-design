/**
 * Content pack for "The Straight Pitch" — the live rendering of
 * `deck-sales-pitch`.
 *
 * THE WORLD: the deliberately CONVENTIONAL sales deck, executed flawlessly —
 * problem → solution → proof → pricing, the shape a good account team makes in
 * PowerPoint. A persistent title bar, a 12-column content zone, a footer rule
 * with page number + confidentiality + synthetic notice, restrained single
 * fade/rise motion. NO world conceit. The craft is typographic scale (Fraunces
 * display / Inter text / IBM Plex Mono figures), grid alignment, and an honest
 * voice. Accent: deep teal.
 *
 * Anomaly (verbatim): a slide headed `WHERE WE ARE NOT A FIT` with three real
 * bullets — the candour is the anomaly a normal pitch never risks.
 *
 * The client, the outcomes, and the pricing are all synthetic (DECK.dataNotice).
 */
import type { KpiTileDatum } from '@enterprise-design/content-components';

export const DECK = {
  vendor: 'Cadence Logistics Cloud',
  client: 'Northwind Logistics',
  clientTag: 'NORTHWIND LOGISTICS',
  date: '14 July 2026',
  confidential: 'PREPARED FOR NORTHWIND — CONFIDENTIAL',
  dataNotice: 'SYNTHETIC PITCH — NO REAL CLIENT',
  keyboardHint: '← → NAVIGATE · HOME/END',
} as const;

/** The anomaly heading — verbatim, test-asserted. */
export const NOT_A_FIT_HEADING = 'WHERE WE ARE NOT A FIT' as const;

export type SlideKind =
  | 'title'
  | 'problem'
  | 'cost'
  | 'solution'
  | 'how'
  | 'proof'
  | 'case'
  | 'notAFit'
  | 'pricing'
  | 'ask';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'For Northwind' },
  { id: 'problem', kind: 'problem', section: 'The problem' },
  { id: 'cost', kind: 'cost', section: 'The problem' },
  { id: 'solution', kind: 'solution', section: 'The solution' },
  { id: 'how', kind: 'how', section: 'The solution' },
  { id: 'proof', kind: 'proof', section: 'The proof' },
  { id: 'case', kind: 'case', section: 'The proof' },
  { id: 'not-a-fit', kind: 'notAFit', section: 'The proof' },
  { id: 'pricing', kind: 'pricing', section: 'Pricing' },
  { id: 'ask', kind: 'ask', section: 'The ask' },
];

export const SLIDE_COUNT = SLIDES.length;

/** Deep-link targets for the e2e (the honest slide and the proof slide). */
export const NOT_A_FIT_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'notAFit') + 1;
export const PROOF_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'proof') + 1;

/* ------------------------------------------------------------------ */
/* Title                                                               */
/* ------------------------------------------------------------------ */

export const TITLE = {
  eyebrow: 'A PROPOSAL FOR NORTHWIND LOGISTICS',
  line1: 'Ship every order',
  line2: 'without touching three spreadsheets.',
  standfirst:
    'A short, honest proposal: the problem in your words, what we would change, the proof it works, and what it costs. No surprises on the pricing slide.',
} as const;

/* ------------------------------------------------------------------ */
/* The problem — in the client's words                                 */
/* ------------------------------------------------------------------ */

export const PROBLEM = {
  quote:
    'We are growing thirty percent a year, and every new order still passes through three spreadsheets and two people before it ships. We cannot hire our way out of this.',
  attribution: 'VP Operations, Northwind Logistics',
  gloss:
    'You told us this in April. Everything after this slide is aimed at exactly that sentence — not at a generic “digital transformation”.',
} as const;

/* ------------------------------------------------------------------ */
/* Cost of doing nothing — one number, huge                            */
/* ------------------------------------------------------------------ */

export const COST = {
  figure: '$3.4M',
  unit: 'per year, and rising',
  headline: 'What the status quo costs.',
  breakdown: [
    { label: 'Rework & mis-ships', value: '$1.6M', note: 'Orders re-keyed by hand, caught late or not at all.' },
    { label: 'Overtime & temp ops', value: '$1.1M', note: 'Headcount added just to move data between systems.' },
    { label: 'Lost renewals', value: '$0.7M', note: 'Shippers who left after a bad peak season.' },
  ],
  gloss: 'This is not a soft number. It is the run-rate you approved in this year’s ops budget.',
} as const;

/* ------------------------------------------------------------------ */
/* The solution — a 3-node before/after diagram (local SVG)            */
/* ------------------------------------------------------------------ */

export interface DiagramNode {
  id: string;
  label: string;
  sub: string;
  /** top-left in the shared 720×150 viewBox band */
  x: number;
  y: number;
  tone: 'plain' | 'accent' | 'muted';
}

export const NODE_W = 176;
export const NODE_H = 84;
export const DIAGRAM_VIEW = '0 0 720 150';

/** Two bands share one geometry: three nodes, two arrows, left→right. */
export const BEFORE_NODES: readonly DiagramNode[] = [
  { id: 'orders-b', label: 'Orders', sub: 'Email · portal · EDI', x: 12, y: 33, tone: 'plain' },
  { id: 'manual-b', label: 'Manual ops', sub: '3 spreadsheets · 2 people', x: 272, y: 33, tone: 'muted' },
  { id: 'carriers-b', label: 'Carriers', sub: '14 hand-keyed', x: 532, y: 33, tone: 'plain' },
];

export const AFTER_NODES: readonly DiagramNode[] = [
  { id: 'orders-a', label: 'Orders', sub: 'Email · portal · EDI', x: 12, y: 33, tone: 'plain' },
  { id: 'router-a', label: 'Cadence Router', sub: 'One system · zero re-keys', x: 272, y: 33, tone: 'accent' },
  { id: 'carriers-a', label: 'Carriers', sub: '14 auto-booked', x: 532, y: 33, tone: 'plain' },
];

export const SOLUTION = {
  headline: 'One system where the two people used to be.',
  gloss:
    'Same orders in, same carriers out. We replace the manual middle — three spreadsheets and two full-time people — with one router that books automatically and flags only the exceptions.',
} as const;

/* ------------------------------------------------------------------ */
/* How it works — three numbered steps                                 */
/* ------------------------------------------------------------------ */

export interface Step {
  no: string;
  title: string;
  detail: string;
}

export const STEPS: readonly Step[] = [
  {
    no: '01',
    title: 'Ingest',
    detail: 'Orders arrive by email, portal or EDI and land in one normalised queue — no re-keying, no copy-paste.',
  },
  {
    no: '02',
    title: 'Route',
    detail: 'The router picks the carrier by cost and SLA, books the label, and only surfaces the exceptions a human should see.',
  },
  {
    no: '03',
    title: 'Track',
    detail: 'Every shipment streams status back to one board your ops lead and your customers can both read.',
  },
];

/* ------------------------------------------------------------------ */
/* The proof — comp.kpi-tile (three customer outcomes)                 */
/* ------------------------------------------------------------------ */

export const PROOF_METRICS: readonly KpiTileDatum[] = [
  {
    id: 'on-time',
    label: 'On-time dispatch',
    value: 0.94,
    unit: 'percent',
    delta: 0.18,
    deltaGoodDirection: 'up',
    target: 0.9,
    status: 'on-track',
  },
  {
    id: 'cost-per-shipment',
    label: 'Cost per shipment',
    value: 6,
    unit: 'currency',
    delta: -0.22,
    deltaGoodDirection: 'down',
    target: 7,
    status: 'on-track',
  },
  {
    id: 'payback',
    label: 'Payback · months',
    value: 7,
    unit: 'count',
    status: 'on-track',
  },
];

export const PROOF = {
  headline: 'What it did for shippers your size.',
  gloss:
    'Median across eleven customers shipping 500–5,000 orders a month in their first year on Cadence. Your mileage will vary — these are the numbers we would sign up to review with you at month six.',
} as const;

/* ------------------------------------------------------------------ */
/* Named case study                                                    */
/* ------------------------------------------------------------------ */

export const CASE = {
  name: 'Gateway Freight',
  profile: '1,900 orders / month · 22 carriers · 2 ops FTE',
  quote:
    'We went from two people spending their mornings in spreadsheets to zero. They moved to account management. Peak season was the first one we did not dread.',
  attribution: 'COO, Gateway Freight',
  facts: [
    { label: 'Live in', value: '38 days' },
    { label: 'Re-keys removed', value: '~2,400 / mo' },
    { label: 'Ops FTE freed', value: '2.0' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* The anomaly — where we are NOT a fit (three honest bullets)         */
/* ------------------------------------------------------------------ */

export const NOT_A_FIT = {
  gloss: 'The three situations where we would tell you not to buy. If any of these is you, the rest of this deck does not matter.',
  bullets: [
    {
      lead: 'You ship under ~500 orders a month.',
      body: 'Below that, a good ops lead and a spreadsheet genuinely beat us on cost. We would be selling you overhead.',
    },
    {
      lead: 'You need a WMS we do not connect to yet.',
      body: 'We support fourteen carriers and six WMS platforms out of the box. Anything else is a custom build we would rather you not pay for on day one.',
    },
    {
      lead: 'You want a fully managed service.',
      body: 'We are software, not a 3PL. If you need people to run your dock, we will introduce you to a partner instead of pretending we are one.',
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Pricing — three tiers, middle recommended (a quiet rule)            */
/* ------------------------------------------------------------------ */

export interface Tier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  fit: string;
  features: readonly string[];
  recommended?: boolean;
}

export const TIERS: readonly Tier[] = [
  {
    id: 'core',
    name: 'Core',
    price: '$4,500',
    cadence: '/ month',
    fit: 'Up to 1,500 orders / month',
    features: ['One router', 'Up to 8 carriers', 'Standard tracking board', 'Email support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$8,900',
    cadence: '/ month',
    fit: 'Up to 6,000 orders / month',
    features: ['Everything in Core', 'All 14 carriers', 'Exception routing rules', 'Named CSM', 'Six-month review'],
    recommended: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 'Custom',
    cadence: '',
    fit: '6,000+ orders / month',
    features: ['Everything in Growth', 'Custom WMS connectors', 'SLA guarantees', 'Dedicated solutions engineer'],
  },
];

export const PRICING_NOTE =
  'Growth is the right tier for Northwind at your current volume — we have pre-selected it, and you can move down as easily as up. No setup fee, no annual lock-in in year one.';

/* ------------------------------------------------------------------ */
/* The ask + next meeting + a compact implementation timeline          */
/* ------------------------------------------------------------------ */

export interface TimelineStep {
  when: string;
  label: string;
}

export const TIMELINE: readonly TimelineStep[] = [
  { when: 'Week 1', label: 'Connect orders & carriers' },
  { when: 'Week 2–4', label: 'Route in shadow mode' },
  { when: 'Week 5', label: 'Cut over exceptions-only' },
  { when: 'Week 6', label: 'Go live · review at month 6' },
];

export const ASK = {
  headline: 'One decision, then a six-week clock.',
  ask: 'A two-week paid pilot on your real order feed, on Growth, at no risk: if the router does not remove re-keys in shadow mode, you owe nothing.',
  meeting: 'Next meeting: Thursday 24 July, 2:00pm — your ops lead, our solutions engineer, one live order feed.',
} as const;

export const DATA_NOTES =
  'All figures, customers, and quotes are synthetic and illustrative. Northwind Logistics, Gateway Freight, and Cadence Logistics Cloud are not real companies.';
