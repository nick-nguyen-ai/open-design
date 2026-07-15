/**
 * "The Quarter" — experience-composer run: GitLab Q1 FY27 quarterly business
 * review from public filings (Task 12 goal test, sample 1/5). CONTENT ONLY,
 * conforming to {@link QuarterFill}; the template carries the whole craft.
 *
 * Every figure traces to the run's source context
 * (`docs/superpowers/specs/gitlab-qbr-sample/source-context.md`): the Q1 FY27
 * earnings release + call (June 2026), the March 2026 outlook, and the 10-Q
 * revenue disaggregation. The ONE exception is the pipeline table, which is
 * illustrative (GitLab does not disclose pipeline) — declared in `deck.notice`,
 * `pipelineNote`, and `dataNotes`.
 */
import { QuarterFill } from '../deck-quarterly-business-review/quarter-fill.js';

export const gitlabQbrFill: QuarterFill = QuarterFill.parse({
  deck: {
    title: 'Quarterly Business Review',
    org: 'GITLAB, INC.',
    period: 'Q1 FY27 · Quarterly Business Review',
    periodShort: 'Q1 FY27',
    confidentiality: 'EXTERNAL — COMPILED FROM PUBLIC FILINGS',
    notice: 'PUBLIC FILINGS + ILLUSTRATIVE PIPELINE DATA',
  },
  agenda: [
    { no: '01', title: 'Executive summary', detail: 'The quarter in four sentences — the beat, the raise, and the flag.' },
    { no: '02', title: 'Financial results', detail: 'Headline KPIs against the March outlook; six quarters of revenue trend.' },
    { no: '03', title: 'Customers', detail: 'Named expansions, the pressure cohort, and the illustrative pipeline shape.' },
    { no: '04', title: 'Risks', detail: 'What could bend the year: contraction, restructuring, the AI race.' },
    { no: '05', title: 'Priorities', detail: 'Where the next quarter goes: agents, landing the restructuring, core stability.' },
  ],
  headlines: {
    segment: 'Where the growth came from.',
  },
  summary: {
    lead: 'A fourth straight beat and a raised year — while self-managed goes flat for the first time since IPO.',
    sentences: [
      'Revenue reached $264.2M, up 23% year on year and roughly four points above the outlook issued in March — the fourth consecutive beat.',
      'Profitability moved with it: non-GAAP operating margin of 14%, adjusted free cash flow of $146.7M, and a full-year guide raised to $1,112–1,118M.',
      'The flag: self-managed subscription revenue was flat quarter on quarter for the first time since IPO, as the price-sensitive cohort — roughly 20% of ARR — kept contracting seats.',
      'The agentic bet is landing: the Duo Agent Platform reached a ~$20M consumption run rate in its first full quarter and attached to four of the top ten deals.',
    ],
  },
  anomalyLabel: 'SELF-MANAGED FLAT QOQ — FIRST SINCE IPO',
  kpis: [
    {
      id: 'revenue',
      label: 'Total revenue',
      value: 264_200_000,
      unit: 'currency',
      delta: 0.23,
      deltaGoodDirection: 'up',
      target: 256_400_000,
      status: 'on-track',
    },
    {
      id: 'margin',
      label: 'Non-GAAP operating margin',
      value: 0.14,
      unit: 'percent',
      delta: 0.02,
      deltaGoodDirection: 'up',
      target: 0.12,
      status: 'on-track',
    },
    {
      id: 'customers',
      label: 'Customers ≥ $100K ARR',
      value: 1519,
      unit: 'count',
      delta: 0.18,
      deltaGoodDirection: 'up',
      status: 'on-track',
    },
    {
      id: 'selfmanaged',
      label: 'Self-managed growth QoQ',
      value: 0,
      unit: 'percent',
      deltaGoodDirection: 'up',
      status: 'off-track',
    },
  ],
  kpiNote: 'Three of four sit at or above plan; self-managed subscription was flat quarter on quarter for the first time since IPO.',
  kpiVsPlan: [
    { metric: 'Revenue', actual: '$264.2M', plan: '$256.4M', delta: '+$7.8M' },
    { metric: 'Non-GAAP op margin', actual: '14%', plan: '~12%', delta: '+2 pts' },
    { metric: 'FY27 revenue guide', actual: '$1,112–1,118M', plan: '$1,099–1,118M', delta: 'floor +$13M' },
    { metric: 'cRPO', actual: '$724.1M', plan: 'n/a', delta: '+24% YoY' },
  ],
  revenueSeries: {
    id: 'revenue',
    label: 'Revenue ($M)',
    points: [
      { x: 'Q4 FY25', y: 211.4 },
      { x: 'Q1 FY26', y: 214.5 },
      { x: 'Q2 FY26', y: 236.0 },
      { x: 'Q3 FY26', y: 244.3 },
      { x: 'Q4 FY26', y: 260.4 },
      { x: 'Q1 FY27', y: 264.2 },
    ],
  },
  revenueNote: 'Public filings; Q3 FY26 derived from the disclosed FY26 total ($955.2M) less the three reported quarters. Growth held at 23% into FY27.',
  segments: [
    { id: 'selfmanaged', category: 'Self-managed sub', value: 151.1 },
    { id: 'saas', category: 'SaaS', value: 88.2 },
    { id: 'license', category: 'License & other', value: 24.9 },
  ],
  segmentNote: 'SaaS grew 37.5% year on year; self-managed grew 16% on the year but stalled sequentially — the flag. Split from the 10-Q; plan targets are not disclosed.',
  wins: [
    { name: 'Zillow Group', value: '2,000+ seats', note: 'Migrating 2,000+ engineers to GitLab Dedicated and piloting the Duo Agent Platform.' },
    { name: 'CSL Limited', value: 'Multiyear', note: 'Multiyear commitment to GitLab Ultimate plus the Duo Agent Platform.' },
    { name: 'Top-10 US bank (pilot)', value: 'DAP pilot', note: 'Duo Agent Platform pilot averaging 1.5 hours saved per developer task.' },
  ],
  losses: [
    { name: 'Price-sensitive cohort', value: '~20% of ARR', note: 'Cohort stayed under pressure with more seat contraction than anticipated.' },
    { name: 'Seat rightsizing', value: 'NRR 117%', note: 'Customer layoffs and M&A drove seat reductions across renewals.' },
    { name: 'Self-managed momentum', value: 'Flat QoQ', note: 'First flat self-managed quarter since IPO — the flagged line of this review.' },
  ],
  pipeline: [
    { stage: 'Commit', deals: 34, value: '$61M', coverage: '1.1x' },
    { stage: 'Best case', deals: 58, value: '$95M', coverage: '1.7x' },
    { stage: 'Open pipeline', deals: 121, value: '$139M', coverage: '2.5x' },
  ],
  pipelineNote: 'Illustrative shape only — GitLab does not disclose pipeline; coverage multiples are anchored to the $272–274M Q2 revenue guide.',
  risks: [
    {
      risk: 'Seat contraction in price-sensitive base',
      severity: 'High',
      mitigation: 'DAP consumption revenue decouples growth from seats; the ~20%-of-ARR cohort renewal calendar is watched account by account.',
    },
    {
      risk: 'Restructuring execution',
      severity: 'Medium',
      mitigation: '$30–35M of charges with ~$19M in Q2; a 14% workforce reduction and 22-country exit must land without delivery slip.',
    },
    {
      risk: 'Agentic competition',
      severity: 'Medium',
      mitigation: 'DAP hit a ~$20M run rate in its first full quarter and attached to 4 of the top-10 deals — keep shipping ahead of the field.',
    },
  ],
  priorities: [
    { no: '01', title: 'Scale the Duo Agent Platform', detail: 'Convert the ~$20M consumption run rate into durable ARR; deepen the top-deal attach beyond four of ten.' },
    { no: '02', title: 'Land the restructuring cleanly', detail: 'Execute the 14% reduction and 22-country exit inside the $30–35M envelope with no customer-facing slip.' },
    { no: '03', title: 'Stabilise self-managed', detail: 'Arrest the sequential stall: cohort-level renewal plays for the price-sensitive ~20% of ARR.' },
    { no: '04', title: 'Compound enterprise expansion', detail: 'NRR 117% and 1,519 six-figure customers — keep Dedicated and Ultimate the landing zone for regulated logos.' },
  ],
  dataNotes: [
    'All figures from GitLab public filings and the Q1 FY27 earnings materials (June 2, 2026), except the pipeline table, which is illustrative — GitLab does not disclose pipeline.',
    'Q3 FY26 revenue is derived: $955.2M FY26 total less the three reported quarters. The plan column uses the initial FY27 outlook issued March 3, 2026.',
    'Customer names are from the public Q1 FY27 earnings call; the losses column reflects disclosed pressure, not named churn.',
  ],
});
