/**
 * "The Charter" — synthetic content for `proj-operating-model-redesign`.
 * An operating-model redesign written as the articles of a charter: each
 * decision an article with its rationale and a transition seal, read calmly,
 * never re-litigated. Fictional bank: Meridian. All content synthetic.
 */

export const CHARTER = {
  masthead: 'MERIDIAN BANK',
  ref: 'OPERATING MODEL CHARTER · SECOND EDITION · JULY 2026',
  kicker: 'DECISIONS TAKEN, WRITTEN DOWN, NOT REOPENED',
  title: 'The Operating Model Charter',
  subline:
    'Meridian’s new operating model, recorded as seven articles. Each article states a decision, the reasoning that carried it, and a seal showing whether it is already in force or still in transition. The charter exists so that a decision made in a January board room is not re-argued in a June corridor.',
  figures: [
    { label: 'ARTICLES', value: '7' },
    { label: 'IN FORCE', value: '5' },
    { label: 'TRANSITIONING', value: '2' },
    { label: 'NEXT REVIEW', value: 'JAN 2027' },
  ],
  provenance: 'SYNTHETIC CHARTER · A DEMONSTRATION OPERATING MODEL, NOT A LIVE REORGANISATION',
} as const;

export const PREAMBLE = {
  title: 'Preamble',
  body: 'This charter records how Meridian organises itself to serve customers: who decides what, where work lives, and how the pieces meet. An article may be amended only by the Executive Committee in session, with the amendment and its reasons recorded here. Until then, every article reads as settled law — the point of a charter is that it is calmer than the debate that produced it.',
} as const;

export interface Article {
  id: string;
  numeral: string;
  title: string;
  decision: string;
  rationale: string;
  seal: 'in-force' | 'transitioning';
  since: string;
}

export const ARTICLES: readonly Article[] = [
  {
    id: 'art-1',
    numeral: 'I',
    title: 'Customer journeys own the outcome',
    decision:
      'The bank organises around eleven end-to-end customer journeys. Each journey has one accountable leader who owns its outcome measures across every channel and system it touches.',
    rationale:
      'Under the previous model, a mortgage application crossed four departmental boundaries and no one owned the whole of it. Handoffs, not people, were the source of most delay.',
    seal: 'in-force',
    since: 'JAN 2026',
  },
  {
    id: 'art-2',
    numeral: 'II',
    title: 'Platforms serve journeys, not the reverse',
    decision:
      'Technology and operations platforms exist to serve the journeys. A platform may set standards for how it is consumed; it may not set the journey’s priorities.',
    rationale:
      'Platform teams previously ran their own roadmaps and journeys queued behind them. Inverting the relationship puts customer demand, not platform convenience, at the head of the queue.',
    seal: 'in-force',
    since: 'JAN 2026',
  },
  {
    id: 'art-3',
    numeral: 'III',
    title: 'Decisions are taken where the information is',
    decision:
      'Decision rights are written down per decision type. Anything not explicitly reserved to the centre belongs to the journey or platform closest to the information.',
    rationale:
      'The reserved list replaced a culture in which any decision could be escalated and therefore every decision was. The default is now local; escalation is the exception that must justify itself.',
    seal: 'in-force',
    since: 'MAR 2026',
  },
  {
    id: 'art-4',
    numeral: 'IV',
    title: 'One risk framework, applied in the flow of work',
    decision:
      'Risk and control obligations are embedded in each journey’s standard work, assured by a second line that samples outcomes rather than approving every step.',
    rationale:
      'Sequential approval queues gave the appearance of control and the reality of delay. Sampling outcomes holds the standard while letting the work move.',
    seal: 'in-force',
    since: 'APR 2026',
  },
  {
    id: 'art-5',
    numeral: 'V',
    title: 'Funding follows journeys, quarterly',
    decision:
      'Funding is allocated to journeys as standing teams with quarterly reviews, replacing annual project budgeting. Money moves when evidence moves, not when the calendar does.',
    rationale:
      'Annual budgeting funded last year’s guesses for a full year. Quarterly reallocation lets the bank stop funding what the evidence has already voted against.',
    seal: 'in-force',
    since: 'JUN 2026',
  },
  {
    id: 'art-6',
    numeral: 'VI',
    title: 'Shared services consolidate into one operations spine',
    decision:
      'Payments operations, account servicing, and back-office reconciliation consolidate into a single operations spine with published service standards per journey.',
    rationale:
      'Three parallel operations units held three copies of similar work with three different standards. One spine, one standard, one queue discipline.',
    seal: 'transitioning',
    since: 'TARGET OCT 2026',
  },
  {
    id: 'art-7',
    numeral: 'VII',
    title: 'Leadership spans are widened; layers are capped at five',
    decision:
      'No more than five management layers between the chief executive and any customer-facing colleague. Spans below six reports require an explicit exception.',
    rationale:
      'Each additional layer added a week to decisions and a filter to bad news. Five layers is the deepest the bank can be and still hear itself think.',
    seal: 'transitioning',
    since: 'TARGET DEC 2026',
  },
] as const;

export const TRANSITION = {
  title: 'The transition schedule',
  sub: 'What remains in motion, and when it settles',
  rows: [
    {
      id: 'tr-1',
      article: 'VI',
      move: 'Payments operations joins the spine',
      window: 'AUG 2026',
      state: 'Consultation complete; cutover plan agreed',
    },
    {
      id: 'tr-2',
      article: 'VI',
      move: 'Account servicing and reconciliation follow',
      window: 'OCT 2026',
      state: 'Standards mapping in progress',
    },
    {
      id: 'tr-3',
      article: 'VII',
      move: 'Layer review concludes; exceptions ratified',
      window: 'DEC 2026',
      state: 'Two divisions reviewed of five',
    },
  ],
} as const;

export const CUSTODIANS = {
  title: 'Custodians of the charter',
  sub: 'Who holds the pen, and when it may be used',
  entries: [
    {
      id: 'cu-1',
      role: 'Executive Committee',
      duty: 'Sole authority to amend an article, in session, with reasons recorded.',
    },
    {
      id: 'cu-2',
      role: 'Chief Operating Officer',
      duty: 'Keeper of the charter text and the transition schedule; reports state to the board quarterly.',
    },
    {
      id: 'cu-3',
      role: 'Journey and platform leaders',
      duty: 'Apply the articles daily; raise an amendment case when reality and charter diverge.',
    },
  ],
} as const;

export const FOOT = {
  note: 'The Charter — an operating model recorded as articles with rationale and transition seals, so decisions stay decided. All names and details are synthetic.',
  next: 'AMENDMENTS · EXECUTIVE COMMITTEE IN SESSION ONLY · NEXT REVIEW JAN 2027',
} as const;
