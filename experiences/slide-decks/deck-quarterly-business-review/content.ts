/**
 * The shipped fill for "The Quarter" — the first {@link QuarterFill} instance.
 *
 * THE WORLD: deliberately CONVENTIONAL slide anatomy — the quarterly business
 * review a competent operator makes in PowerPoint, executed flawlessly. All the
 * craft lives in `QuarterTemplate.tsx`; this file carries only the CONTENT, and
 * it is validated against the `QuarterFill` schema at load so the shipped deck is
 * itself a proof that the contract admits the real design.
 *
 * Anomaly (verbatim): the KPI row flags `NRR 96% — BELOW 100% FLOOR` — the single
 * red figure in an otherwise green row, echoed in the executive summary.
 *
 * Every figure is a synthetic result (declared in `deck.notice` and the appendix).
 */
import { QuarterFill } from './quarter-fill.js';

export const quarterFill: QuarterFill = QuarterFill.parse({
  deck: {
    title: 'Meridian Systems',
    org: 'MERIDIAN SYSTEMS',
    period: 'Q3 FY26 · Quarterly Business Review',
    periodShort: 'Q3 FY26',
    confidentiality: 'CONFIDENTIAL — BOARD DISTRIBUTION',
    notice: 'SYNTHETIC RESULTS — DEMONSTRATION ONLY',
  },

  headlines: {
    segment: 'Where the growth came from.',
  },

  agenda: [
    { no: '01', title: 'Performance', detail: 'The quarter against plan — headline metrics and revenue trend.' },
    { no: '02', title: 'Segments', detail: 'Where growth came from, and where it did not.' },
    { no: '03', title: 'Execution', detail: 'Wins, losses, and the state of the pipeline.' },
    { no: '04', title: 'Risk', detail: 'The open risks and what we are doing about them.' },
    { no: '05', title: 'Outlook', detail: 'The four things that matter next quarter.' },
  ],

  summary: {
    lead: 'A strong quarter on the top line, undercut by one number we will not paper over.',
    sentences: [
      'Revenue grew 6.2% quarter-on-quarter to $48.2M, ahead of the $47.0M plan, carried by Enterprise renewals and a stronger public-sector close.',
      'Gross margin held at 71.2% and headcount landed under plan at 742, giving us room to invest into the pipeline described in section 05.',
      'Net revenue retention slipped to 96% — below our 100% floor for the first time in seven quarters — and it is the one metric we are treating as a board-level issue, not a footnote.',
    ],
  },

  /** The one flagged figure — the single red number in a green KPI row. */
  anomalyLabel: 'NRR 96% — BELOW 100% FLOOR',

  kpis: [
    {
      id: 'revenue',
      label: 'Revenue',
      value: 48_200_000,
      unit: 'currency',
      delta: 0.062,
      deltaGoodDirection: 'up',
      target: 47_000_000,
      status: 'on-track',
    },
    {
      id: 'nrr',
      label: 'Net revenue retention',
      value: 0.96,
      unit: 'percent',
      delta: -0.03,
      deltaGoodDirection: 'up',
      target: 1.0,
      status: 'off-track',
    },
    {
      id: 'margin',
      label: 'Gross margin',
      value: 0.712,
      unit: 'percent',
      delta: 0.018,
      deltaGoodDirection: 'up',
      target: 0.7,
      status: 'on-track',
    },
    {
      id: 'headcount',
      label: 'Headcount',
      value: 742,
      unit: 'count',
      delta: 0.045,
      deltaGoodDirection: 'up',
      target: 760,
      status: 'on-track',
    },
  ],

  kpiNote: 'Four headline metrics against plan. Three are on track; net revenue retention is not.',

  kpiVsPlan: [
    { metric: 'Revenue', actual: '$48.2M', plan: '$47.0M', delta: '+$1.2M' },
    { metric: 'Net revenue retention', actual: '96%', plan: '100%', delta: '−4 pts' },
    { metric: 'Gross margin', actual: '71.2%', plan: '70.0%', delta: '+1.2 pts' },
    { metric: 'Headcount', actual: '742', plan: '760', delta: '−18' },
  ],

  revenueSeries: {
    id: 'revenue',
    label: 'Revenue ($M)',
    points: [
      { x: 'Q4 FY24', y: 38.9 },
      { x: 'Q1 FY25', y: 40.2 },
      { x: 'Q2 FY25', y: 41.8 },
      { x: 'Q3 FY25', y: 43.1 },
      { x: 'Q4 FY25', y: 44.0 },
      { x: 'Q1 FY26', y: 45.1 },
      { x: 'Q2 FY26', y: 45.4 },
      { x: 'Q3 FY26', y: 48.2 },
    ],
  },

  revenueNote:
    'Eight quarters of recognised revenue. The Q3 step reflects two Enterprise renewals pulled forward from Q4.',

  segments: [
    { id: 'enterprise', category: 'Enterprise', value: 24.1, target: 22.5 },
    { id: 'mid-market', category: 'Mid-Market', value: 12.6, target: 13.0 },
    { id: 'smb', category: 'SMB', value: 6.4, target: 7.2 },
    { id: 'public', category: 'Public Sector', value: 5.1, target: 4.3 },
  ],

  segmentNote:
    'Revenue by segment against plan (diamond). Enterprise and Public Sector beat; SMB missed, and it is the SMB book driving the retention miss.',

  wins: [
    { name: 'Halcyon Freight', value: '$3.1M ACV', note: 'Three-year renewal, expanded to the logistics module.' },
    { name: 'State of Calderon', value: '$2.4M ACV', note: 'New public-sector logo; twelve-month procurement closed early.' },
    { name: 'Vantage Retail', value: '$1.2M ACV', note: 'Upsell into analytics after a clean twelve-month deployment.' },
  ],

  losses: [
    { name: 'Brightline SMB cohort', value: '−$0.9M ARR', note: 'Nine small accounts churned to a cheaper point solution.' },
    { name: 'Orbit Manufacturing', value: '−$0.6M ARR', note: 'Downgraded at renewal; budget freeze, not a product loss.' },
    { name: 'Kestrel Media', value: '−$0.3M ARR', note: 'Lost to incumbent consolidation; no displacement path.' },
  ],

  pipeline: [
    { stage: 'Commit', deals: 11, value: '$8.9M', coverage: '1.0×' },
    { stage: 'Best case', deals: 19, value: '$14.6M', coverage: '1.6×' },
    { stage: 'Pipeline', deals: 42, value: '$31.2M', coverage: '3.4×' },
    { stage: 'Early stage', deals: 88, value: '$52.7M', coverage: '5.8×' },
  ],

  pipelineNote:
    'Coverage against the $9.1M Q4 target. Commit is thin at 1.0×; the quarter turns on best-case conversion.',

  risks: [
    {
      risk: 'SMB retention below floor',
      severity: 'High',
      mitigation: 'Dedicated save-desk pod stood up; renewal outreach moved to 120 days out.',
    },
    {
      risk: 'Commit coverage thin at 1.0×',
      severity: 'High',
      mitigation: 'Weekly deal inspection with Sales leadership; two deals fast-tracked to legal.',
    },
    {
      risk: 'Key-account concentration',
      severity: 'Medium',
      mitigation: 'Top-ten accounts now under named exec sponsors with quarterly reviews.',
    },
    {
      risk: 'Hiring behind plan in Data',
      severity: 'Low',
      mitigation: 'Two senior offers out; contractor bridge covers the Q4 roadmap.',
    },
  ],

  priorities: [
    {
      no: '01',
      title: 'Return NRR to the floor',
      detail: 'Get net revenue retention back above 100% by closing the SMB churn gap — the single most-watched number next quarter.',
    },
    {
      no: '02',
      title: 'Convert best-case pipeline',
      detail: 'Lift best-case coverage to commit; the $9.1M Q4 target depends on it.',
    },
    {
      no: '03',
      title: 'Land the public-sector motion',
      detail: 'Turn the State of Calderon win into a repeatable procurement playbook.',
    },
    {
      no: '04',
      title: 'Close the Data hires',
      detail: 'Two senior hires unblock the FY27 analytics roadmap.',
    },
  ],

  dataNotes: [
    'All figures are synthetic and illustrative; no real company, customer, or result is represented.',
    'Revenue is recognised revenue in USD millions unless stated. NRR is trailing-twelve-month net revenue retention across the installed base.',
    'Segment revenue is bookings-weighted; plan (diamond) is the board-approved FY26 operating plan.',
    'Pipeline coverage is weighted value ÷ the $9.1M Q4 commit target as of the quarter close.',
  ],
});

/** Standard certifier alias (Task 5): the shipped fill instance. */
export const SHIPPED_FILL = quarterFill;
