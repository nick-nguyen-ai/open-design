/**
 * The shipped fill for "The Validation Ledger" — the live rendering of
 * `proj-ai-model-validation-hub`.
 *
 * THE WORLD: a model-validation programme hub with the quiet authority of a
 * programme office — a well-edited board paper crossed with a working ledger.
 * All the craft lives in `LedgerTemplate.tsx`; this file carries only the
 * CONTENT, validated against {@link LedgerFill} at load, so the shipped ledger is
 * itself a proof that the contract admits the real design.
 *
 * Everything here is TYPED and DETERMINISTIC. All figures are synthetic
 * demonstration data at realistic institutional magnitudes (declared in
 * `office.editionLine`); the one deliberate anomaly is `wholesale-credit-pd`,
 * held 41 days in independent review against a 25-day stall threshold.
 */
import { LedgerFill } from './ledger-fill.js';

/* ------------------------------------------------------------------ */
/* Throughput exhibit — throughput vs intake, twelve periods           */
/*                                                                      */
/* Reporting periods are year-first so lexical order IS chronological.  */
/* ------------------------------------------------------------------ */

const PERIODS = [
  '2025·P09', '2025·P10', '2025·P11', '2025·P12', '2025·P13', '2026·P01',
  '2026·P02', '2026·P03', '2026·P04', '2026·P05', '2026·P06', '2026·P07',
] as const;
const INTAKE_PER_PERIOD = [3, 2, 4, 3, 4, 3, 2, 3, 3, 2, 3, 2] as const;
const SIGNOFF_PER_PERIOD = [1, 1, 2, 2, 2, 3, 2, 3, 3, 3, 4, 3] as const;

const INTAKE_POINTS = PERIODS.map((x, i) => ({ x, y: INTAKE_PER_PERIOD[i] as number }));
const SIGNOFF_POINTS = PERIODS.map((x, i) => ({ x, y: SIGNOFF_PER_PERIOD[i] as number }));

/* ------------------------------------------------------------------ */
/* The shipped fill                                                     */
/* ------------------------------------------------------------------ */

export const ledgerFill: LedgerFill = LedgerFill.parse({
  office: {
    pageTitle: 'The Validation Ledger — Model Validation Programme',
    programmeCode: 'MVP-2026',
    programmeName: 'MODEL VALIDATION PROGRAMME',
    reportingPeriod: 'PERIOD 07 · 29 JUN – 12 JUL 2026',
    rag: 'AMBER',
    ragReason: 'ONE ITEM STALLED IN INDEPENDENT REVIEW',
    editionLine: 'PROGRAMME OFFICE · SYNTHETIC DEMONSTRATION DATA',
    director: 'H. NGUYEN, PROGRAMME DIRECTOR',
    issued: 'ISSUED 2026-07-12',
  },

  hero: {
    kicker: 'THE VALIDATION LEDGER',
    statementLines: ['A model is an opinion', 'until the ledger says otherwise.'],
    subline:
      'Twenty-eight models pass through this office in FY26. Nine are on the ledger this period. Eight are moving. One has stopped — and the whole page is arranged so you cannot miss it.',
    facts: [
      { label: 'IN SCOPE FY26', value: '28' },
      { label: 'SIGNED OFF YTD', value: '11' },
      { label: 'ON THE LEDGER', value: '9' },
      { label: 'STALLED', value: '1' },
      { label: 'MEDIAN CYCLE', value: '34 DAYS' },
    ],
  },

  pipeline: {
    bandTitle: 'THE PIPELINE LEDGER',
    bandSub: 'NINE MODELS IN FLIGHT · READ LEFT TO RIGHT · ONE ITEM STALLED',
    rowLegend: 'MODEL · TIER · OWNER',
    stallThresholdDays: 25,
    a11yCaption:
      'The pipeline ledger plots nine in-flight models across four validation stages — intake, challenge, independent review, sign-off. wholesale-credit-pd has been in independent review for 41 days against a 25-day stall threshold and is flagged as stalled. The table in section 2 carries every entry.',
    stageKeyNote:
      'TRAIL = STAGES CLEARED · SQUARE = CURRENT STAGE, DAYS IN STAGE · HATCH + STALLED STAMP = CLOCK HELD BEYOND',
    stages: [
      { id: 'intake', label: 'INTAKE', exitRule: 'Complete evidence pack lodged', flowKind: 'start' },
      { id: 'challenge', label: 'CHALLENGE', exitRule: 'Challenger matched or beaten on holdout', flowKind: 'process', flowInboundLabel: 'evidence pack complete' },
      { id: 'review', label: 'INDEPENDENT REVIEW', exitRule: 'All findings closed or accepted', flowKind: 'decision', flowInboundLabel: 'challenger result filed' },
      { id: 'sign-off', label: 'SIGN-OFF', exitRule: 'Committee disposition recorded', flowKind: 'end', flowInboundLabel: 'findings closed' },
    ],
    models: [
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
        status: 'stalled',
        stall: {
          reason: 'Validator awaiting data-lineage evidence for two derived exposure features.',
          escalation: 'Escalated to programme sponsor 2026-07-08 · owner committed to lodge by 16 JUL.',
        },
      },
      { id: 'mortgage-serviceability', model: 'mortgage-serviceability', version: 'v4', tier: 1, owner: 'Retail Credit Models', stage: 'challenge', daysInStage: 19, enteredStage: '2026-06-23', targetSignOff: '2026-08-21', status: 'moving' },
      { id: 'smb-lending-pd', model: 'smb-lending-pd', version: 'v1', tier: 1, owner: 'Business Bank Analytics', stage: 'challenge', daysInStage: 12, enteredStage: '2026-06-30', targetSignOff: '2026-08-28', status: 'moving' },
      { id: 'payments-anomaly', model: 'payments-anomaly', version: 'v2', tier: 1, owner: 'Payments Risk Analytics', stage: 'challenge', daysInStage: 8, enteredStage: '2026-07-04', targetSignOff: '2026-09-04', status: 'moving' },
      { id: 'fx-settlement-risk', model: 'fx-settlement-risk', version: 'v1', tier: 2, owner: 'Markets Quant Engineering', stage: 'review', daysInStage: 17, enteredStage: '2026-06-25', targetSignOff: '2026-08-07', status: 'moving' },
      { id: 'cards-collections-uplift', model: 'cards-collections-uplift', version: 'v3', tier: 2, owner: 'Collections Strategy', stage: 'review', daysInStage: 9, enteredStage: '2026-07-03', targetSignOff: '2026-08-14', status: 'moving' },
      { id: 'insurance-claims-triage', model: 'insurance-claims-triage', version: 'v2', tier: 2, owner: 'Insurance Decisioning', stage: 'sign-off', daysInStage: 6, enteredStage: '2026-07-06', targetSignOff: '2026-07-17', status: 'moving' },
      { id: 'branch-rostering-forecast', model: 'branch-rostering-forecast', version: 'v1', tier: 3, owner: 'Workforce Analytics', stage: 'sign-off', daysInStage: 3, enteredStage: '2026-07-09', targetSignOff: '2026-07-24', status: 'moving' },
      { id: 'retail-deposit-attrition', model: 'retail-deposit-attrition', version: 'v2', tier: 2, owner: 'Deposits & Savings Analytics', stage: 'intake', daysInStage: 4, enteredStage: '2026-07-08', targetSignOff: '2026-09-18', status: 'moving' },
    ],
  },

  table: {
    bandTitle: 'THE LEDGER, LINE BY LINE',
    bandSub: 'TEXTUAL MIRROR · 9 ENTRIES',
    caption:
      'The pipeline ledger as a table: nine models with version, tier, owner, current stage, days in stage, date entered, target sign-off, and any stall note.',
  },

  posture: {
    bandTitle: 'PROGRAMME POSTURE',
    bandSub: 'PROGRESS & STATUS · SUBORDINATE TO THE LEDGER',
    kpiTitle: 'Programme measures',
    kpis: [
      { id: 'kpi-scope', label: 'Models in scope FY26', value: 28, unit: 'count', status: 'neutral' },
      { id: 'kpi-signed', label: 'Signed off YTD', value: 11, unit: 'count', target: 12, status: 'at-risk' },
      { id: 'kpi-cycle', label: 'Median cycle (days)', value: 34, unit: 'count', target: 30, status: 'at-risk' },
      { id: 'kpi-findings', label: 'Findings closed rate', value: 0.87, unit: 'percent', target: 0.85, status: 'on-track' },
    ],
    exhibit: {
      number: 'EXHIBIT A',
      title: 'Validation throughput against intake, last twelve periods',
      source:
        'Models entering the pipeline vs models signed off, per four-week reporting period. Synthetic demonstration data.',
      caption:
        'Sign-off throughput has closed most of the gap intake opened in the autumn; the backlog the office carries is the area between the lines.',
    },
    throughput: [
      { id: 'intake', label: 'Models entering validation', points: INTAKE_POINTS },
      { id: 'signed-off', label: 'Models signed off', points: SIGNOFF_POINTS },
    ],
  },

  outcomes: {
    bandTitle: 'RECENT OUTCOMES',
    bandSub: 'LAST SIX DISPOSITIONS · EVIDENCE ON FILE',
    caption:
      'Recent validation outcomes: reference, date, model, tier, outcome, findings raised, and validator.',
    rows: [
      { ref: 'MV-26-081', date: '2026-07-04', model: 'complaint-triage-nlp v2', tier: 3, outcome: 'approved', findings: 2, validator: 'R. OKONJO' },
      { ref: 'MV-26-079', date: '2026-06-27', model: 'kyc-doc-classifier v3', tier: 2, outcome: 'approved-with-conditions', findings: 5, validator: 'T. WIRTH' },
      { ref: 'MV-26-078', date: '2026-06-20', model: 'merchant-risk-gbm v2', tier: 2, outcome: 'approved', findings: 3, validator: 'A. DEVLIN' },
      { ref: 'MV-26-075', date: '2026-06-11', model: 'offer-propensity v5', tier: 3, outcome: 'rejected', findings: 9, validator: 'R. OKONJO' },
      { ref: 'MV-26-074', date: '2026-06-05', model: 'aml-alert-ranker v2', tier: 1, outcome: 'approved-with-conditions', findings: 6, validator: 'M. KAUR' },
      { ref: 'MV-26-071', date: '2026-05-29', model: 'collections-uplift v2', tier: 3, outcome: 'approved', findings: 1, validator: 'T. WIRTH' },
    ],
  },

  decisions: {
    bandTitle: 'DECISION LOG & PROGRAMME WIRE',
    bandSub: 'WHAT THE OFFICE DECIDED · WHAT THE OFFICE HEARD',
    decisionLogHeading: 'DECISION LOG',
    wireHeading: 'PROGRAMME WIRE',
    wireTitle: 'Programme wire',
    log: [
      { date: '2026-07-08', decision: 'Escalate wholesale-credit-pd lineage gap to programme sponsor; hold review clock.', owner: 'H. NGUYEN', disposition: 'ESCALATED · OPEN' },
      { date: '2026-07-02', decision: 'Adopt shared challenger harness v2 for all tier-1 challenges from P08.', owner: 'VALIDATION METHODS FORUM', disposition: 'ADOPTED' },
      { date: '2026-06-24', decision: 'Reject offer-propensity v5 resubmission window shorter than eight weeks.', owner: 'M. KAUR', disposition: 'REJECTED · RESUBMIT P10' },
      { date: '2026-06-17', decision: 'Bring insurance-claims-triage v2 forward one period at owner request.', owner: 'H. NGUYEN', disposition: 'APPROVED' },
      { date: '2026-06-10', decision: 'Second independent reviewer assigned to wholesale-credit-pd (exposure features).', owner: 'A. DEVLIN', disposition: 'ASSIGNED' },
    ],
    wire: [
      { id: 'wire-0712', label: 'Period 07 ledger issued to committee pack', status: 'info', description: 'Nine in-flight items; one stalled item flagged on the front page.', timestamp: '2026-07-12T08:00:00+10:00' },
      { id: 'wire-0710', label: 'wholesale-credit-pd: owner committed lineage evidence by 16 JUL', status: 'warning', description: 'Review clock remains held; 41 days in stage against a 25-day stall threshold.', timestamp: '2026-07-10T14:20:00+10:00' },
      { id: 'wire-0709', label: 'branch-rostering-forecast entered sign-off', status: 'success', description: 'Zero open findings — cleanest tier-3 package this year.', timestamp: '2026-07-09T11:05:00+10:00' },
      { id: 'wire-0704', label: 'complaint-triage-nlp v2 approved (MV-26-081)', status: 'success', description: 'Two minor findings, both closed at review.', timestamp: '2026-07-04T16:40:00+10:00' },
      { id: 'wire-0630', label: 'smb-lending-pd challenger run scheduled', status: 'info', description: 'Shared harness v2; holdout window 2025-07 → 2026-06.', timestamp: '2026-06-30T09:30:00+10:00' },
    ],
  },
});

/** Standard certifier alias (Task 5): the shipped fill instance. */
export const SHIPPED_FILL = ledgerFill;
