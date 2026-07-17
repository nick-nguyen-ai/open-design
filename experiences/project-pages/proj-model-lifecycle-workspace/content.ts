/**
 * "The Foundry" — synthetic content for `proj-model-lifecycle-workspace`.
 * Models as castings moving through a foundry: pattern shop (develop),
 * proof house (validate), production floor (deploy), archive (retire) —
 * every transition stamped, never faded. Fictional bank: Meridian.
 * All content synthetic.
 */

export const FOUNDRY = {
  masthead: 'MERIDIAN BANK · MODEL FOUNDRY',
  ref: 'FOUNDRY FLOOR ML-9 · SHIFT RECORD · 14 JUL 2026',
  kicker: 'PATTERN SHOP → PROOF HOUSE → PRODUCTION FLOOR → ARCHIVE',
  title: 'A model is a casting. Every move it makes is stamped.',
  subline:
    'Fourteen models live on this floor. Each is a casting in exactly one hall: the pattern shop where it is developed, the proof house where it is validated, the production floor where it serves, or the archive where it rests. A casting moves only under a stamp — and drift sends it back to the proof house, not to a meeting.',
  figures: [
    { label: 'CASTINGS', value: '14' },
    { label: 'PATTERN SHOP', value: '4' },
    { label: 'PROOF HOUSE', value: '3' },
    { label: 'PRODUCTION', value: '5' },
  ],
  provenance: 'SYNTHETIC FOUNDRY RECORD · DEMONSTRATION MODELS, NOT A LIVE INVENTORY',
} as const;

export type Hall = 'pattern-shop' | 'proof-house' | 'production' | 'archive';

export interface Casting {
  id: string;
  mark: string;
  name: string;
  hall: Hall;
  since: string;
  heat: string;
}

export const HALLS: readonly { id: Hall; name: string; verb: string }[] = [
  { id: 'pattern-shop', name: 'The pattern shop', verb: 'DEVELOP' },
  { id: 'proof-house', name: 'The proof house', verb: 'VALIDATE' },
  { id: 'production', name: 'The production floor', verb: 'SERVE' },
  { id: 'archive', name: 'The archive', verb: 'REST' },
];

export const CASTINGS: readonly Casting[] = [
  { id: 'c-01', mark: 'M-201', name: 'Cashflow Forecaster v2', hall: 'pattern-shop', since: 'MAY 2026', heat: 'Feature work · backtest harness being cut' },
  { id: 'c-02', mark: 'M-207', name: 'SME Credit Narrative LLM', hall: 'pattern-shop', since: 'JUN 2026', heat: 'Prompt suite in draft · red-team booked' },
  { id: 'c-03', mark: 'M-209', name: 'Document Extraction v3', hall: 'pattern-shop', since: 'JUN 2026', heat: 'Training on the July document corpus' },
  { id: 'c-04', mark: 'M-212', name: 'Branch Footfall Model', hall: 'pattern-shop', since: 'JUL 2026', heat: 'Pattern being carved · data contract agreed' },
  { id: 'c-05', mark: 'M-198', name: 'Complaints Triage LLM', hall: 'proof-house', since: 'JUN 2026', heat: 'Fairness proof 2 of 3 · tolerance held' },
  { id: 'c-06', mark: 'M-195', name: 'Limit Optimiser', hall: 'proof-house', since: 'MAY 2026', heat: 'Champion–challenger readout due 28 JUL' },
  { id: 'c-07', mark: 'M-203', name: 'Collections Uplift Model', hall: 'proof-house', since: 'JUL 2026', heat: 'RETURNED FROM PRODUCTION · drift proof rerunning' },
  { id: 'c-08', mark: 'M-140', name: 'PD Scorer v4', hall: 'production', since: 'JAN 2025', heat: 'Serving · monthly stability green' },
  { id: 'c-09', mark: 'M-166', name: 'Fraud Graph Screen', hall: 'production', since: 'AUG 2025', heat: 'Serving · recall holding at proof level' },
  { id: 'c-10', mark: 'M-171', name: 'AML Alert Ranker', hall: 'production', since: 'OCT 2025', heat: 'Serving · quarterly re-proof passed JUN' },
  { id: 'c-11', mark: 'M-183', name: 'Churn Early-Warning', hall: 'production', since: 'FEB 2026', heat: 'Serving · watch on covariate shift' },
  { id: 'c-12', mark: 'M-190', name: 'Pricing Elasticity v2', hall: 'production', since: 'APR 2026', heat: 'Serving · first re-proof due SEP' },
  { id: 'c-13', mark: 'M-092', name: 'PD Scorer v3', hall: 'archive', since: 'JAN 2025', heat: 'Retired under stamp · succeeded by M-140' },
  { id: 'c-14', mark: 'M-114', name: 'Rules-Based Fraud Screen', hall: 'archive', since: 'AUG 2025', heat: 'Retired under stamp · succeeded by M-166' },
] as const;

export const STAMPS = {
  title: 'The stamp ledger',
  sub: 'Every transition on this floor, stamped and dated — latest first',
  entries: [
    {
      id: 'st-1',
      date: '9 JUL 2026',
      stamp: 'RETURNED TO PROOF',
      casting: 'M-203 Collections Uplift',
      detail: 'Population stability index breached tolerance in production. Casting pulled back to the proof house within the same shift.',
      tone: 'return',
    },
    {
      id: 'st-2',
      date: '24 JUN 2026',
      stamp: 'PROVED',
      casting: 'M-198 Complaints Triage LLM',
      detail: 'Second fairness proof passed across all four customer segments; one proof remains before the floor.',
      tone: 'prove',
    },
    {
      id: 'st-3',
      date: '11 JUN 2026',
      stamp: 'CAST',
      casting: 'M-212 Branch Footfall',
      detail: 'New pattern opened in the shop with a signed data contract and a named validator before the first line of code.',
      tone: 'cast',
    },
    {
      id: 'st-4',
      date: '2 JUN 2026',
      stamp: 'DEPLOYED',
      casting: 'M-190 Pricing Elasticity v2',
      detail: 'Moved to the production floor carrying proof certificate P-2026-041. Shadow period closed clean.',
      tone: 'deploy',
    },
    {
      id: 'st-5',
      date: '18 MAY 2026',
      stamp: 'RETIRED',
      casting: 'M-092 PD Scorer v3',
      detail: 'Retired under stamp with its lineage sealed in the archive. No fade-out: consumers were re-pointed on a dated schedule.',
      tone: 'retire',
    },
  ],
} as const;

export const DOCTRINE = {
  title: 'Foundry doctrine',
  sub: 'The rules the floor runs on',
  rules: [
    {
      id: 'fd-1',
      rule: 'No casting skips the proof house — including the urgent ones.',
      note: 'Urgency changes the queue position, never the route. The proof house has a fast lane, not a bypass.',
    },
    {
      id: 'fd-2',
      rule: 'Every production casting carries its proof certificate.',
      note: 'A model serving without a referenced, current certificate is treated as an incident, not an oversight.',
    },
    {
      id: 'fd-3',
      rule: 'Drift sends a casting back to the proof house, not to a meeting.',
      note: 'The stamp ledger shows M-203 pulled within a shift. The discussion happens while the proof reruns, not instead of it.',
    },
    {
      id: 'fd-4',
      rule: 'Retirement is a stamped act, not a fade-out.',
      note: 'A casting leaves the floor on a date, with its lineage sealed and its consumers re-pointed. Nothing is left running "just in case".',
    },
  ],
} as const;

export const FOOT = {
  note: 'The Foundry — a model lifecycle as visible state transitions: four halls, stamped moves, and drift that routes back to proof. All models and figures are synthetic.',
  next: 'NEXT PROOF READOUT · M-195 LIMIT OPTIMISER · 28 JUL 2026',
} as const;
