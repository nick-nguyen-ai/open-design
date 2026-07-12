/**
 * Content pack for "The Validation Ledger" — the live rendering of
 * `proj-ai-model-validation-hub`.
 *
 * A programme hub with the quiet authority of a programme office: a
 * well-edited board paper crossed with a working ledger. The commanding
 * visual is the validation pipeline ledger — every in-flight model's
 * position on the road from intake to sign-off, with one stalled item the
 * page refuses to hide.
 *
 * Everything here is TYPED and DETERMINISTIC. All figures are synthetic
 * demonstration data at realistic institutional magnitudes.
 */
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';
import type { KpiTileDatum, StatusListItemDatum } from '@enterprise-design/content-components';
import type { FlowDiagramData } from '@enterprise-design/diagrams';

/* ------------------------------------------------------------------ */
/* The programme office                                                */
/* ------------------------------------------------------------------ */

export const OFFICE = {
  programmeCode: 'MVP-2026',
  programmeName: 'MODEL VALIDATION PROGRAMME',
  reportingPeriod: 'PERIOD 07 · 29 JUN – 12 JUL 2026',
  /** RAG posture — never colour-encoded alone; the letter is the encoding. */
  rag: 'AMBER' as const,
  ragReason: 'ONE ITEM STALLED IN INDEPENDENT REVIEW',
  editionLine: 'PROGRAMME OFFICE · SYNTHETIC DEMONSTRATION DATA',
  director: 'H. NGUYEN, PROGRAMME DIRECTOR',
  issued: 'ISSUED 2026-07-12',
} as const;

export const STATEMENT: readonly string[] = [
  'A model is an opinion',
  'until the ledger says otherwise.',
];

export const STATEMENT_SUBLINE =
  'Twenty-eight models pass through this office in FY26. Nine are on the ledger this period. Eight are moving. One has stopped — and the whole page is arranged so you cannot miss it.';

export interface ProgrammeFact {
  label: string;
  value: string;
}

export const PROGRAMME_FACTS: readonly ProgrammeFact[] = [
  { label: 'IN SCOPE FY26', value: '28' },
  { label: 'SIGNED OFF YTD', value: '11' },
  { label: 'ON THE LEDGER', value: '9' },
  { label: 'STALLED', value: '1' },
  { label: 'MEDIAN CYCLE', value: '34 DAYS' },
];

/* ------------------------------------------------------------------ */
/* The pipeline (also a FlowDiagram — its outline is the stage key)    */
/* ------------------------------------------------------------------ */

export type StageId = 'intake' | 'challenge' | 'review' | 'sign-off';

export interface PipelineStage {
  id: StageId;
  label: string;
  /** What has to be true to leave this stage. */
  exitRule: string;
}

export const STAGES: readonly PipelineStage[] = [
  { id: 'intake', label: 'INTAKE', exitRule: 'Complete evidence pack lodged' },
  { id: 'challenge', label: 'CHALLENGE', exitRule: 'Challenger matched or beaten on holdout' },
  { id: 'review', label: 'INDEPENDENT REVIEW', exitRule: 'All findings closed or accepted' },
  { id: 'sign-off', label: 'SIGN-OFF', exitRule: 'Committee disposition recorded' },
];

export function stageIndex(id: StageId): number {
  return STAGES.findIndex((stage) => stage.id === id);
}

export const PIPELINE_FLOW: FlowDiagramData = {
  nodes: [
    { id: 'intake', label: 'INTAKE', kind: 'start' },
    { id: 'challenge', label: 'CHALLENGE', kind: 'process' },
    { id: 'review', label: 'INDEPENDENT REVIEW', kind: 'decision' },
    { id: 'sign-off', label: 'SIGN-OFF', kind: 'end' },
  ],
  edges: [
    { id: 'e-intake-challenge', from: 'intake', to: 'challenge', label: 'evidence pack complete' },
    { id: 'e-challenge-review', from: 'challenge', to: 'review', label: 'challenger result filed' },
    { id: 'e-review-signoff', from: 'review', to: 'sign-off', label: 'findings closed' },
  ],
};

/* ------------------------------------------------------------------ */
/* The ledger — nine models in flight                                  */
/* ------------------------------------------------------------------ */

export interface LedgerEntry {
  id: string;
  model: string;
  version: string;
  tier: 1 | 2 | 3;
  owner: string;
  stage: StageId;
  daysInStage: number;
  enteredStage: string;
  targetSignOff: string;
  stalled?: {
    reason: string;
    escalation: string;
  };
}

/** Days in stage beyond which the office calls an item stalled. */
export const STALL_THRESHOLD_DAYS = 25;

export const LEDGER: readonly LedgerEntry[] = [
  {
    id: 'wholesale-credit-pd',
    model: 'wholesale-credit-pd',
    version: 'v7 refresh',
    tier: 1,
    owner: 'Institutional Credit Models',
    stage: 'review',
    daysInStage: 41,
    enteredStage: '2026-06-01',
    targetSignOff: '2026-07-03',
    stalled: {
      reason: 'Validator awaiting data-lineage evidence for two derived exposure features.',
      escalation: 'Escalated to programme sponsor 2026-07-08 · owner committed to lodge by 16 JUL.',
    },
  },
  {
    id: 'mortgage-serviceability',
    model: 'mortgage-serviceability',
    version: 'v4',
    tier: 1,
    owner: 'Retail Credit Models',
    stage: 'challenge',
    daysInStage: 19,
    enteredStage: '2026-06-23',
    targetSignOff: '2026-08-21',
    },
  {
    id: 'smb-lending-pd',
    model: 'smb-lending-pd',
    version: 'v1',
    tier: 1,
    owner: 'Business Bank Analytics',
    stage: 'challenge',
    daysInStage: 12,
    enteredStage: '2026-06-30',
    targetSignOff: '2026-08-28',
  },
  {
    id: 'payments-anomaly',
    model: 'payments-anomaly',
    version: 'v2',
    tier: 1,
    owner: 'Payments Risk Analytics',
    stage: 'challenge',
    daysInStage: 8,
    enteredStage: '2026-07-04',
    targetSignOff: '2026-09-04',
  },
  {
    id: 'fx-settlement-risk',
    model: 'fx-settlement-risk',
    version: 'v1',
    tier: 2,
    owner: 'Markets Quant Engineering',
    stage: 'review',
    daysInStage: 17,
    enteredStage: '2026-06-25',
    targetSignOff: '2026-08-07',
  },
  {
    id: 'cards-collections-uplift',
    model: 'cards-collections-uplift',
    version: 'v3',
    tier: 2,
    owner: 'Collections Strategy',
    stage: 'review',
    daysInStage: 9,
    enteredStage: '2026-07-03',
    targetSignOff: '2026-08-14',
  },
  {
    id: 'insurance-claims-triage',
    model: 'insurance-claims-triage',
    version: 'v2',
    tier: 2,
    owner: 'Insurance Decisioning',
    stage: 'sign-off',
    daysInStage: 6,
    enteredStage: '2026-07-06',
    targetSignOff: '2026-07-17',
  },
  {
    id: 'branch-rostering-forecast',
    model: 'branch-rostering-forecast',
    version: 'v1',
    tier: 3,
    owner: 'Workforce Analytics',
    stage: 'sign-off',
    daysInStage: 3,
    enteredStage: '2026-07-09',
    targetSignOff: '2026-07-24',
  },
  {
    id: 'retail-deposit-attrition',
    model: 'retail-deposit-attrition',
    version: 'v2',
    tier: 2,
    owner: 'Deposits & Savings Analytics',
    stage: 'intake',
    daysInStage: 4,
    enteredStage: '2026-07-08',
    targetSignOff: '2026-09-18',
  },
];

export const STALLED_ENTRY: LedgerEntry = LEDGER[0] as LedgerEntry;

export function stageCount(stage: StageId): number {
  return LEDGER.filter((entry) => entry.stage === stage).length;
}

/* ------------------------------------------------------------------ */
/* Progress & status band                                              */
/* ------------------------------------------------------------------ */

export const PROGRAMME_KPIS: readonly KpiTileDatum[] = [
  { id: 'kpi-scope', label: 'Models in scope FY26', value: 28, unit: 'count', status: 'neutral' },
  { id: 'kpi-signed', label: 'Signed off YTD', value: 11, unit: 'count', target: 12, status: 'at-risk' },
  { id: 'kpi-cycle', label: 'Median cycle (days)', value: 34, unit: 'count', target: 30, status: 'at-risk' },
  { id: 'kpi-findings', label: 'Findings closed rate', value: 0.87, unit: 'percent', target: 0.85, status: 'on-track' },
];

/* ------------------------------------------------------------------ */
/* Exhibit A — throughput vs intake, twelve periods                    */
/* ------------------------------------------------------------------ */

export const EXHIBIT_A = {
  number: 'EXHIBIT A',
  title: 'Validation throughput against intake, last twelve periods',
  source:
    'Models entering the pipeline vs models signed off, per four-week reporting period. Synthetic demonstration data.',
  caption:
    'Sign-off throughput has closed most of the gap intake opened in the autumn; the backlog the office carries is the area between the lines.',
} as const;

/** Reporting periods, year-first so lexical order IS chronological order. */
const PERIODS = [
  '2025·P09', '2025·P10', '2025·P11', '2025·P12', '2025·P13', '2026·P01',
  '2026·P02', '2026·P03', '2026·P04', '2026·P05', '2026·P06', '2026·P07',
] as const;
const INTAKE_PER_PERIOD = [3, 2, 4, 3, 4, 3, 2, 3, 3, 2, 3, 2] as const;
const SIGNOFF_PER_PERIOD = [1, 1, 2, 2, 2, 3, 2, 3, 3, 3, 4, 3] as const;

export const THROUGHPUT_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'intake',
    label: 'Models entering validation',
    points: PERIODS.map((x, i) => ({ x, y: INTAKE_PER_PERIOD[i] as number })),
  },
  {
    id: 'signed-off',
    label: 'Models signed off',
    points: PERIODS.map((x, i) => ({ x, y: SIGNOFF_PER_PERIOD[i] as number })),
  },
];

/* ------------------------------------------------------------------ */
/* Recent validation outcomes (the evidence table)                     */
/* ------------------------------------------------------------------ */

export type Outcome = 'approved' | 'approved-with-conditions' | 'rejected';

export const OUTCOME_LABEL: Record<Outcome, string> = {
  approved: 'APPROVED',
  'approved-with-conditions': 'APPROVED W/ CONDITIONS',
  rejected: 'REJECTED',
};

export interface ValidationOutcome {
  ref: string;
  date: string;
  model: string;
  tier: 1 | 2 | 3;
  outcome: Outcome;
  findings: number;
  validator: string;
}

export const RECENT_OUTCOMES: readonly ValidationOutcome[] = [
  { ref: 'MV-26-081', date: '2026-07-04', model: 'complaint-triage-nlp v2', tier: 3, outcome: 'approved', findings: 2, validator: 'R. OKONJO' },
  { ref: 'MV-26-079', date: '2026-06-27', model: 'kyc-doc-classifier v3', tier: 2, outcome: 'approved-with-conditions', findings: 5, validator: 'T. WIRTH' },
  { ref: 'MV-26-078', date: '2026-06-20', model: 'merchant-risk-gbm v2', tier: 2, outcome: 'approved', findings: 3, validator: 'A. DEVLIN' },
  { ref: 'MV-26-075', date: '2026-06-11', model: 'offer-propensity v5', tier: 3, outcome: 'rejected', findings: 9, validator: 'R. OKONJO' },
  { ref: 'MV-26-074', date: '2026-06-05', model: 'aml-alert-ranker v2', tier: 1, outcome: 'approved-with-conditions', findings: 6, validator: 'M. KAUR' },
  { ref: 'MV-26-071', date: '2026-05-29', model: 'collections-uplift v2', tier: 3, outcome: 'approved', findings: 1, validator: 'T. WIRTH' },
];

/* ------------------------------------------------------------------ */
/* Decision log                                                        */
/* ------------------------------------------------------------------ */

export interface DecisionLogEntry {
  date: string;
  decision: string;
  owner: string;
  disposition: string;
}

export const DECISION_LOG: readonly DecisionLogEntry[] = [
  {
    date: '2026-07-08',
    decision: 'Escalate wholesale-credit-pd lineage gap to programme sponsor; hold review clock.',
    owner: 'H. NGUYEN',
    disposition: 'ESCALATED · OPEN',
  },
  {
    date: '2026-07-02',
    decision: 'Adopt shared challenger harness v2 for all tier-1 challenges from P08.',
    owner: 'VALIDATION METHODS FORUM',
    disposition: 'ADOPTED',
  },
  {
    date: '2026-06-24',
    decision: 'Reject offer-propensity v5 resubmission window shorter than eight weeks.',
    owner: 'M. KAUR',
    disposition: 'REJECTED · RESUBMIT P10',
  },
  {
    date: '2026-06-17',
    decision: 'Bring insurance-claims-triage v2 forward one period at owner request.',
    owner: 'H. NGUYEN',
    disposition: 'APPROVED',
  },
  {
    date: '2026-06-10',
    decision: 'Second independent reviewer assigned to wholesale-credit-pd (exposure features).',
    owner: 'A. DEVLIN',
    disposition: 'ASSIGNED',
  },
];

/* ------------------------------------------------------------------ */
/* Programme wire (StatusList)                                         */
/* ------------------------------------------------------------------ */

export const PROGRAMME_WIRE: readonly StatusListItemDatum[] = [
  {
    id: 'wire-0712',
    label: 'Period 07 ledger issued to committee pack',
    status: 'info',
    description: 'Nine in-flight items; one stalled item flagged on the front page.',
    timestamp: '2026-07-12T08:00:00+10:00',
  },
  {
    id: 'wire-0710',
    label: 'wholesale-credit-pd: owner committed lineage evidence by 16 JUL',
    status: 'warning',
    description: 'Review clock remains held; 41 days in stage against a 25-day stall threshold.',
    timestamp: '2026-07-10T14:20:00+10:00',
  },
  {
    id: 'wire-0709',
    label: 'branch-rostering-forecast entered sign-off',
    status: 'success',
    description: 'Zero open findings — cleanest tier-3 package this year.',
    timestamp: '2026-07-09T11:05:00+10:00',
  },
  {
    id: 'wire-0704',
    label: 'complaint-triage-nlp v2 approved (MV-26-081)',
    status: 'success',
    description: 'Two minor findings, both closed at review.',
    timestamp: '2026-07-04T16:40:00+10:00',
  },
  {
    id: 'wire-0630',
    label: 'smb-lending-pd challenger run scheduled',
    status: 'info',
    description: 'Shared harness v2; holdout window 2025-07 → 2026-06.',
    timestamp: '2026-06-30T09:30:00+10:00',
  },
];
