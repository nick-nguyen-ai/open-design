/**
 * PROJECT-PAGE sample for the five-surface MCP quality test — an AGENT
 * EVALUATION PROGRAMME re-filled into "The Validation Ledger" world-template
 * (`proj-ai-model-validation-hub`). CONTENT ONLY: the whole craft lives in
 * `LedgerTemplate.tsx`; this file is a typed {@link LedgerFill}, validated at
 * load, so a clean parse is itself proof the fill honours the contract.
 *
 * THE STORY: a platform team puts LLM AGENTS through a pre-production evaluation
 * pipeline that maps 1:1 onto the template's pinned four stages —
 *   intake     → use-case registered, eval harness scoped
 *   challenge  → red-team + capability evals (SWE-bench / AgentBench / AgentDojo)
 *   review     → independent review (independent of the build team)
 *   sign-off   → committee go-live approval
 * Methodology is real (NIST AI RMF measure/red-team loop; PRA SS1/23 independent
 * validation + tiering; OWASP LLM01 direct vs INDIRECT prompt injection). Every
 * programme content — agent names, dates, counts, the stalled item — is SYNTHETIC
 * ILLUSTRATIVE, declared in `office.editionLine` and both chart source-notes.
 *
 * ANOMALY (required, exactly one): `dispute-resolution-agent`, held 34 days in
 * red-team challenge against a 20-day threshold — the red-team found indirect
 * prompt-injection paths via uploaded dispute files reaching the refund tool,
 * with no named remediation owner. The whole page is arranged around it.
 */
import { LedgerFill } from '../proj-ai-model-validation-hub/ledger-fill.js';

/* ------------------------------------------------------------------ */
/* Throughput exhibit — agents entering evaluation vs cleared to       */
/* go-live, twelve four-week periods. Year-first so lexical == chrono. */
/* Intake runs ahead of sign-off: the backlog is the area between.     */
/* ------------------------------------------------------------------ */

const PERIODS = [
  '2025·P09', '2025·P10', '2025·P11', '2025·P12', '2025·P13', '2026·P01',
  '2026·P02', '2026·P03', '2026·P04', '2026·P05', '2026·P06', '2026·P07',
] as const;
const INTAKE_PER_PERIOD = [2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3] as const;
const SIGNOFF_PER_PERIOD = [1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 3, 2] as const;

const INTAKE_POINTS = PERIODS.map((x, i) => ({ x, y: INTAKE_PER_PERIOD[i] as number }));
const SIGNOFF_POINTS = PERIODS.map((x, i) => ({ x, y: SIGNOFF_PER_PERIOD[i] as number }));

/* ------------------------------------------------------------------ */
/* The sample fill                                                      */
/* ------------------------------------------------------------------ */

export const agentEvalsFill: LedgerFill = LedgerFill.parse({
  office: {
    pageTitle: 'The Agent Evaluation Ledger — Pre-Production Programme',
    programmeCode: 'AEP-2026',
    programmeName: 'AGENT EVALUATION PROGRAMME',
    reportingPeriod: 'PERIOD 07 · 29 JUN – 12 JUL 2026',
    rag: 'AMBER',
    ragReason: 'ONE AGENT STALLED IN RED-TEAM CHALLENGE',
    editionLine: 'PLATFORM OFFICE · SYNTHETIC ILLUSTRATIVE DATA',
    director: 'H. OSEI, PROGRAMME LEAD',
    issued: 'ISSUED 2026-07-12',
  },

  hero: {
    kicker: 'THE AGENT EVALUATION LEDGER',
    statementLines: ['An agent is a claim', 'until the evals say otherwise.'],
    subline:
      'Twenty-four agents are queued for pre-production evaluation this year. Nine are on the ledger this period. Eight are moving. One has stopped in red-team challenge — and the page is arranged so you cannot miss it.',
    facts: [
      { label: 'IN SCOPE FY26', value: '24' },
      { label: 'CLEARED YTD', value: '9' },
      { label: 'ON THE LEDGER', value: '9' },
      { label: 'STALLED', value: '1' },
      { label: 'MEDIAN CYCLE', value: '41 DAYS' },
    ],
  },

  pipeline: {
    bandTitle: 'THE EVALUATION LEDGER',
    bandSub: 'NINE AGENTS IN FLIGHT · READ LEFT TO RIGHT · ONE STALLED',
    rowLegend: 'AGENT · TIER · OWNER',
    stallThresholdDays: 20,
    a11yCaption:
      'The evaluation ledger plots nine in-flight agents across four stages — intake, red-team challenge, independent review, go-live sign-off. dispute-resolution-agent has been in red-team challenge for 34 days against a 20-day stall threshold and is flagged as stalled. The table in section 2 carries every entry.',
    stageKeyNote:
      'TRAIL = STAGES CLEARED · SQUARE = CURRENT STAGE, DAYS IN STAGE · HATCH + STALLED STAMP = CLOCK HELD BEYOND',
    stages: [
      { id: 'intake', label: 'INTAKE', exitRule: 'Use-case registered, harness scoped', flowKind: 'start' },
      { id: 'challenge', label: 'RED-TEAM & EVALS', exitRule: 'Red-team findings closed, evals passed', flowKind: 'process', flowInboundLabel: 'intake pack complete' },
      { id: 'review', label: 'INDEPENDENT REVIEW', exitRule: 'All findings closed or accepted', flowKind: 'decision', flowInboundLabel: 'eval results filed' },
      { id: 'sign-off', label: 'GO-LIVE SIGN-OFF', exitRule: 'Committee go-live decision recorded', flowKind: 'end', flowInboundLabel: 'findings closed' },
    ],
    models: [
      {
        id: 'dispute-resolution-agent',
        model: 'dispute-resolution-agent',
        version: 'v0.9-rc2',
        tier: 1,
        owner: 'Dispute & Chargeback Platform',
        stage: 'challenge',
        daysInStage: 34,
        enteredStage: '2026-06-08',
        targetSignOff: '2026-07-05',
        status: 'stalled',
        stall: {
          reason: 'Red-team found indirect prompt-injection paths via uploaded dispute files reaching the refund tool.',
          escalation: 'Escalated to platform sponsor 2026-07-09 · no named remediation owner for the injection paths yet.',
        },
      },
      { id: 'claims-triage-agent', model: 'claims-triage-agent', version: 'v0.9', tier: 1, owner: 'Claims Automation Platform', stage: 'challenge', daysInStage: 15, enteredStage: '2026-06-27', targetSignOff: '2026-08-22', status: 'moving' },
      { id: 'fraud-alert-triage-agent', model: 'fraud-alert-triage-agent', version: 'v1.1', tier: 1, owner: 'Financial Crime Platform', stage: 'challenge', daysInStage: 9, enteredStage: '2026-07-03', targetSignOff: '2026-09-05', status: 'moving' },
      { id: 'kyc-refresh-agent', model: 'kyc-refresh-agent', version: 'v2.0', tier: 1, owner: 'Onboarding & KYC Platform', stage: 'review', daysInStage: 12, enteredStage: '2026-06-30', targetSignOff: '2026-08-07', status: 'moving' },
      { id: 'payment-exceptions-agent', model: 'payment-exceptions-agent', version: 'v1.0', tier: 2, owner: 'Payments Platform', stage: 'review', daysInStage: 16, enteredStage: '2026-06-26', targetSignOff: '2026-08-14', status: 'moving' },
      { id: 'invoice-reconciliation-agent', model: 'invoice-reconciliation-agent', version: 'v1.2', tier: 2, owner: 'Finance Automation', stage: 'review', daysInStage: 7, enteredStage: '2026-07-05', targetSignOff: '2026-08-18', status: 'moving' },
      { id: 'onboarding-copilot-agent', model: 'onboarding-copilot-agent', version: 'v1.0', tier: 2, owner: 'Digital Servicing', stage: 'sign-off', daysInStage: 5, enteredStage: '2026-07-07', targetSignOff: '2026-07-18', status: 'moving' },
      { id: 'servicedesk-router-agent', model: 'servicedesk-router-agent', version: 'v1.3', tier: 3, owner: 'IT Service Management', stage: 'sign-off', daysInStage: 3, enteredStage: '2026-07-09', targetSignOff: '2026-07-24', status: 'moving' },
      { id: 'contract-summary-agent', model: 'contract-summary-agent', version: 'v0.8', tier: 3, owner: 'Legal Engineering', stage: 'intake', daysInStage: 4, enteredStage: '2026-07-08', targetSignOff: '2026-09-19', status: 'moving' },
    ],
  },

  table: {
    bandTitle: 'THE LEDGER, LINE BY LINE',
    bandSub: 'TEXTUAL MIRROR · 9 ENTRIES',
    caption:
      'The evaluation ledger as a table: nine agents with version, tier, owner, current stage, days in stage, date entered, target sign-off, and any stall note.',
  },

  posture: {
    bandTitle: 'PROGRAMME POSTURE',
    bandSub: 'PROGRESS & STATUS · SUBORDINATE TO THE LEDGER',
    kpiTitle: 'Programme measures',
    kpis: [
      { id: 'kpi-scope', label: 'Agents in scope FY26', value: 24, unit: 'count', status: 'neutral' },
      { id: 'kpi-cleared', label: 'Cleared to go-live YTD', value: 9, unit: 'count', target: 12, status: 'at-risk' },
      { id: 'kpi-cycle', label: 'Median cycle (days)', value: 41, unit: 'count', target: 35, status: 'at-risk' },
      { id: 'kpi-redteam', label: 'Red-team findings closed', value: 0.78, unit: 'percent', target: 0.85, status: 'at-risk' },
    ],
    exhibit: {
      number: 'EXHIBIT A',
      title: 'Evaluation throughput against intake, last twelve periods',
      source:
        'Agents entering evaluation vs agents cleared to go-live, per four-week reporting period. Synthetic illustrative data.',
      caption:
        'Intake has run ahead of go-live sign-off through the spring; the evaluation backlog the office carries is the area between the lines.',
    },
    throughput: [
      { id: 'intake', label: 'Agents entering evaluation', points: INTAKE_POINTS },
      { id: 'signed-off', label: 'Agents cleared to go-live', points: SIGNOFF_POINTS },
    ],
  },

  outcomes: {
    bandTitle: 'RECENT OUTCOMES',
    bandSub: 'LAST SIX DISPOSITIONS · EVIDENCE ON FILE',
    caption:
      'Recent evaluation outcomes: reference, date, agent, tier, outcome, findings raised, and validator.',
    rows: [
      { ref: 'AE-26-042', date: '2026-07-06', model: 'statement-summary-agent v1.2', tier: 3, outcome: 'approved', findings: 2, validator: 'R. IYER' },
      { ref: 'AE-26-040', date: '2026-06-28', model: 'address-change-agent v1.0', tier: 2, outcome: 'approved-with-conditions', findings: 5, validator: 'T. MOSS' },
      { ref: 'AE-26-039', date: '2026-06-21', model: 'refund-eligibility-agent v2.0', tier: 2, outcome: 'approved', findings: 3, validator: 'A. DIALLO' },
      { ref: 'AE-26-036', date: '2026-06-12', model: 'offer-recommender-agent v1.0', tier: 2, outcome: 'rejected', findings: 11, validator: 'L. HAAS' },
      { ref: 'AE-26-034', date: '2026-06-04', model: 'complaints-router-agent v1.1', tier: 3, outcome: 'approved', findings: 1, validator: 'M. FENG' },
      { ref: 'AE-26-031', date: '2026-05-27', model: 'sanctions-screening-agent v1.0', tier: 1, outcome: 'approved-with-conditions', findings: 7, validator: 'A. DIALLO' },
    ],
  },

  decisions: {
    bandTitle: 'DECISION LOG & PROGRAMME WIRE',
    bandSub: 'WHAT THE OFFICE DECIDED · WHAT THE OFFICE HEARD',
    decisionLogHeading: 'DECISION LOG',
    wireHeading: 'PROGRAMME WIRE',
    wireTitle: 'Programme wire',
    log: [
      { date: '2026-07-09', decision: 'Escalate dispute-resolution-agent injection remediation to platform sponsor; hold challenge clock.', owner: 'H. OSEI', disposition: 'ESCALATED · OPEN' },
      { date: '2026-07-01', decision: 'Adopt AgentDojo-style indirect-injection suite for all tier-1 challenges from P08.', owner: 'EVAL METHODS FORUM', disposition: 'ADOPTED' },
      { date: '2026-06-23', decision: 'Reject offer-recommender-agent resubmission window shorter than eight weeks.', owner: 'L. HAAS', disposition: 'REJECTED · RESUBMIT P10' },
      { date: '2026-06-16', decision: 'Bring onboarding-copilot-agent sign-off forward one period at owner request.', owner: 'H. OSEI', disposition: 'APPROVED' },
      { date: '2026-06-09', decision: 'Assign second reviewer to dispute-resolution-agent tool-permission scope.', owner: 'A. DIALLO', disposition: 'ASSIGNED' },
    ],
    wire: [
      { id: 'wire-0712', label: 'Period 07 ledger issued to platform committee pack', status: 'info', description: 'Nine in-flight agents; one stalled item flagged on the front page.', timestamp: '2026-07-12T08:00:00+10:00' },
      { id: 'wire-0710', label: 'dispute-resolution-agent: still no named remediation owner', status: 'warning', description: 'Challenge clock held; 34 days in stage against a 20-day stall threshold.', timestamp: '2026-07-10T14:20:00+10:00' },
      { id: 'wire-0707', label: 'onboarding-copilot-agent entered go-live sign-off', status: 'success', description: 'Zero open findings — cleanest tier-2 package this quarter.', timestamp: '2026-07-07T11:05:00+10:00' },
      { id: 'wire-0706', label: 'statement-summary-agent v1.2 approved (AE-26-042)', status: 'success', description: 'Two minor findings, both closed at review.', timestamp: '2026-07-06T16:40:00+10:00' },
      { id: 'wire-0703', label: 'fraud-alert-triage-agent red-team run scheduled', status: 'info', description: 'Indirect-injection suite; adversarial document corpus P07.', timestamp: '2026-07-03T09:30:00+10:00' },
    ],
  },
});

/** Standard alias mirroring the shipped instance's export shape. */
export const SAMPLE_FILL = agentEvalsFill;
