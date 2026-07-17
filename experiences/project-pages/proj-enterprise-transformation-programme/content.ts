/**
 * "The Annual Report" — synthetic content for `proj-enterprise-transformation-programme`.
 * A multi-year transformation reported the way a company reports its year:
 * a chairman's letter, a statement of committed outcomes with variance,
 * and notes to the accounts. Fictional bank: Meridian. All figures synthetic.
 */

export const REPORT = {
  masthead: 'MERIDIAN BANK',
  ref: 'PROGRAMME FORWARD · ANNUAL REPORT · FY2026',
  kicker: 'THE TRANSFORMATION, REPORTED LIKE THE ACCOUNTS',
  title: 'What we committed. What we delivered. What we owe you next.',
  subline:
    'Programme Forward is Meridian’s three-year enterprise transformation. This report covers its second year and is written the way an annual report is written: outcomes as line items, variance stated plainly, and notes where a number deserves an explanation.',
  figures: [
    { label: 'PROGRAMME YEAR', value: '2 OF 3' },
    { label: 'OUTCOMES COMMITTED', value: '6' },
    { label: 'DELIVERED OR AHEAD', value: '4' },
    { label: 'BENEFITS BANKED', value: '£41M' },
  ],
  provenance: 'SYNTHETIC REPORT · A DEMONSTRATION PROGRAMME, NOT AUDITED FINANCIALS',
} as const;

export const LETTER = {
  title: 'The chairman’s letter',
  sub: 'One page, once a year, no slideware',
  paragraphs: [
    'A year ago we made you six commitments and asked to be judged on them, not on activity. This letter reports against those six and nothing else. Four are delivered or ahead of plan. One is on plan. One is behind, and the note against it says why and what has changed.',
    'The temptation in any transformation’s second year is to re-baseline: to move the goalposts quietly and report green against the new posts. We have not done that. Every figure in the statement below is measured against the original 2024 commitment, and where we are behind, the variance column says so in plain numbers.',
    'The single most important thing that happened this year is not in the statement: the payments migration completed without a customer-facing incident. It was the riskiest item on the programme and it is now behind us. The hardest item ahead is the branch operating model, and note 4 explains why we have slowed it deliberately.',
  ],
  signoff: { name: 'E. Aldous', role: 'Chair, Programme Forward Board' },
} as const;

export interface OutcomeLine {
  id: string;
  outcome: string;
  committed: string;
  delivered: string;
  variance: string;
  tone: 'ahead' | 'on' | 'behind';
  noteRef?: string;
}

const OUTCOME_LINES: readonly OutcomeLine[] = [
    {
      id: 'ol-1',
      outcome: 'Payments migrated to the new platform',
      committed: '80% of volume',
      delivered: '100% of volume',
      variance: '+20 pts',
      tone: 'ahead',
      noteRef: '1',
    },
    {
      id: 'ol-2',
      outcome: 'Cost-to-income ratio reduction',
      committed: '−3.0 pts',
      delivered: '−3.4 pts',
      variance: '+0.4 pts',
      tone: 'ahead',
    },
    {
      id: 'ol-3',
      outcome: 'Annualised benefits banked',
      committed: '£38M',
      delivered: '£41M',
      variance: '+£3M',
      tone: 'ahead',
      noteRef: '2',
    },
    {
      id: 'ol-4',
      outcome: 'Customer onboarding time',
      committed: '≤ 2 days',
      delivered: '1.6 days',
      variance: 'ahead of target',
      tone: 'ahead',
    },
    {
      id: 'ol-5',
      outcome: 'Legacy systems decommissioned',
      committed: '14 systems',
      delivered: '14 systems',
      variance: 'on plan',
      tone: 'on',
      noteRef: '3',
    },
    {
      id: 'ol-6',
      outcome: 'Branch operating model rollout',
      committed: '120 branches',
      delivered: '74 branches',
      variance: '−46 branches',
      tone: 'behind',
      noteRef: '4',
    },
];

export const STATEMENT = {
  title: 'Statement of committed outcomes',
  sub: 'Measured against the original 2024 commitments — no re-baselining',
  columns: ['OUTCOME', 'COMMITTED FY26', 'DELIVERED FY26', 'VARIANCE'],
  lines: OUTCOME_LINES,
} as const;

export const NOTES = {
  title: 'Notes to the accounts',
  sub: 'Where a number deserves an explanation, it gets one',
  notes: [
    {
      no: '1',
      title: 'Payments migration',
      body: 'Completed eleven weeks early after the March dual-write rehearsal held for a full statement cycle. The contingency budget for a staged fallback (£2.1M) was released and is included in benefits banked.',
    },
    {
      no: '2',
      title: 'Benefits banked',
      body: 'Benefits are counted only when the finance business partner signs the run-rate reduction into the unit’s budget. Forecast but unsigned benefits (£9M) are not in this figure and never will be.',
    },
    {
      no: '3',
      title: 'Decommissioning',
      body: 'Fourteen systems retired as committed; the archive obligations for two of them transferred to the records platform. No system was counted as retired while still drawing licence or infrastructure cost.',
    },
    {
      no: '4',
      title: 'Branch operating model — behind plan, deliberately',
      body: 'The pilot cohort showed the new staffing model failing in high-footfall branches. Rather than roll a known defect to 46 more sites, the board approved a redesign and a revised completion of Q2 FY27. The original commitment stands and will be reported against next year.',
    },
  ],
} as const;

export const SIGNATURES = {
  title: 'Signed on behalf of the programme board',
  date: '14 July 2026',
  signers: [
    { name: 'E. Aldous', role: 'Chair, Programme Forward Board' },
    { name: 'R. Okafor', role: 'Group Chief Financial Officer, Sponsor' },
  ],
} as const;

export const FOOT = {
  note: 'The Annual Report — a transformation programme reported as committed outcomes with variance, not activity. Every figure on this page is synthetic.',
  next: 'NEXT REPORT · FY2027 · MEASURED AGAINST THE SAME SIX COMMITMENTS',
} as const;
