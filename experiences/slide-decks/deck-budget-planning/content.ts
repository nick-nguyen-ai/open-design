/**
 * Content pack for "The Allocation" — the live rendering of
 * `deck-budget-planning`.
 *
 * THE WORLD: the deliberately CONVENTIONAL budget deck, executed flawlessly. A
 * persistent title bar, a 12-column content zone, a footer rule with page number
 * + confidentiality + synthetic notice, restrained single fade/rise motion. NO
 * world conceit. The commanding visual is a bespoke waterfall — opening budget →
 * increments and cuts → closing — built as a local, keyboard-operable SVG.
 * Accent: oxblood.
 *
 * Anomaly (verbatim): one waterfall bar and one cost-detail row are flagged
 * `CLOUD EGRESS +38% YOY — UNRESOLVED`, oxblood against the neutral bars.
 *
 * Every figure is a synthetic budget (declared in DECK.dataNotice).
 */
import type { CategoryBarDatum } from '@enterprise-design/data-viz';

export const DECK = {
  org: 'MERIDIAN SYSTEMS',
  title: 'Meridian Systems',
  subtitle: 'FY27 Budget · Allocation & Approval',
  confidential: 'CONFIDENTIAL — FINANCE COMMITTEE',
  dataNotice: 'SYNTHETIC BUDGET — DEMONSTRATION ONLY',
  keyboardHint: '← → NAVIGATE · HOME/END',
  currency: '$M',
} as const;

/** The flagged line — verbatim, test-asserted. Appears on the waterfall and in the cost table. */
export const CLOUD_EGRESS_ANOMALY = 'CLOUD EGRESS +38% YOY — UNRESOLVED' as const;

export type SlideKind =
  | 'title'
  | 'context'
  | 'waterfall'
  | 'byFunction'
  | 'headcount'
  | 'costDetail'
  | 'anomaly'
  | 'capexOpex'
  | 'scenarios'
  | 'approval';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'FY27 Budget' },
  { id: 'context', kind: 'context', section: '01 · Context' },
  { id: 'waterfall', kind: 'waterfall', section: '02 · The bridge' },
  { id: 'by-function', kind: 'byFunction', section: '03 · Allocation' },
  { id: 'headcount', kind: 'headcount', section: '03 · Allocation' },
  { id: 'cost-detail', kind: 'costDetail', section: '04 · Detail' },
  { id: 'anomaly', kind: 'anomaly', section: '04 · Detail' },
  { id: 'capex-opex', kind: 'capexOpex', section: '05 · Structure' },
  { id: 'scenarios', kind: 'scenarios', section: '06 · Scenarios' },
  { id: 'approval', kind: 'approval', section: '07 · Approval' },
];

export const SLIDE_COUNT = SLIDES.length;

/** The waterfall slide (the commanding visual) — used for the e2e deep link. */
export const WATERFALL_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'waterfall') + 1;

/* ------------------------------------------------------------------ */
/* Budget context — last year vs this year                             */
/* ------------------------------------------------------------------ */

export const CONTEXT = {
  headline: 'A 12% larger budget, and where every point of it goes.',
  last: { label: 'FY26 approved', value: '$61.4M' },
  next: { label: 'FY27 requested', value: '$68.9M' },
  deltaLabel: '+$7.5M · +12.2%',
  gloss:
    'The increase is real growth, not drift: most of it funds headcount and platform. One line — cloud egress — is up 38% and we have not solved it. This deck bridges from last year to this, line by line.',
} as const;

/* ------------------------------------------------------------------ */
/* THE waterfall — opening → +/− steps → closing (bespoke local SVG)   */
/* ------------------------------------------------------------------ */

export type WaterfallKind = 'opening' | 'increase' | 'decrease' | 'closing';

export interface WaterfallStep {
  id: string;
  label: string;
  /** Short axis label so adjacent bar captions never collide. */
  short: string;
  kind: WaterfallKind;
  /** Signed change in $M for increment/cut steps; the absolute value for opening/closing. */
  delta: number;
  /** Running total in $M after this step. */
  running: number;
  /** The oxblood anomaly bar. */
  flag?: string;
}

export const WATERFALL: readonly WaterfallStep[] = [
  { id: 'opening', label: 'FY26 baseline', short: 'FY26 base', kind: 'opening', delta: 61.4, running: 61.4 },
  { id: 'headcount', label: 'Headcount growth', short: 'Headcount', kind: 'increase', delta: 4.8, running: 66.2 },
  { id: 'platform', label: 'Cloud & platform', short: 'Platform', kind: 'increase', delta: 3.1, running: 69.3 },
  { id: 'vendors', label: 'Vendor consolidation', short: 'Vendors', kind: 'decrease', delta: -2.4, running: 66.9 },
  { id: 'security', label: 'Security & compliance', short: 'Security', kind: 'increase', delta: 1.6, running: 68.5 },
  {
    id: 'egress',
    label: 'Cloud egress',
    short: 'Cloud egress',
    kind: 'increase',
    delta: 2.1,
    running: 70.6,
    flag: CLOUD_EGRESS_ANOMALY,
  },
  { id: 'efficiency', label: 'Efficiency programme', short: 'Efficiency', kind: 'decrease', delta: -1.7, running: 68.9 },
  { id: 'closing', label: 'FY27 requested', short: 'FY27 req', kind: 'closing', delta: 68.9, running: 68.9 },
];

export const WATERFALL_MAX = 72; // y-axis ceiling in $M
export const WATERFALL_TITLE = 'From FY26 to FY27, line by line.';
export const WATERFALL_NOTE =
  'Every bar is one decision. Green adds, muted cuts. The one bar we cannot yet defend is oxblood: cloud egress, up 38% year-on-year and unresolved.';

/** Screen-reader readout scaffold for a focused bar. */
export function waterfallReadout(step: WaterfallStep): string {
  if (step.kind === 'opening' || step.kind === 'closing') {
    return `${step.label}: $${step.running.toFixed(1)}M`;
  }
  const sign = step.delta >= 0 ? '+' : '−';
  return `${step.label}: ${sign}$${Math.abs(step.delta).toFixed(1)}M → running total $${step.running.toFixed(1)}M`;
}

/* ------------------------------------------------------------------ */
/* Allocation by function — comp.category-bar-chart ($M)               */
/* ------------------------------------------------------------------ */

export const FUNCTIONS: readonly CategoryBarDatum[] = [
  { id: 'engineering', category: 'Engineering', value: 28.4 },
  { id: 'infrastructure', category: 'Infrastructure', value: 14.2 },
  { id: 'data-ml', category: 'Data & ML', value: 9.6 },
  { id: 'security', category: 'Security', value: 6.1 },
  { id: 'product', category: 'Product', value: 5.4 },
  { id: 'gna', category: 'G&A', value: 5.2 },
];

export const FUNCTION_NOTE =
  'FY27 allocation by function ($M). Infrastructure is the line to watch — inside it sits the unresolved egress cost.';

/* ------------------------------------------------------------------ */
/* Headcount plan — by team, quarter columns                           */
/* ------------------------------------------------------------------ */

export interface HeadcountRow {
  team: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export const HEADCOUNT: readonly HeadcountRow[] = [
  { team: 'Engineering', q1: 182, q2: 190, q3: 198, q4: 204 },
  { team: 'Infrastructure', q1: 44, q2: 46, q3: 48, q4: 49 },
  { team: 'Data & ML', q1: 38, q2: 42, q3: 46, q4: 50 },
  { team: 'Security', q1: 22, q2: 24, q3: 26, q4: 28 },
  { team: 'Product', q1: 34, q2: 35, q3: 36, q4: 37 },
  { team: 'G&A', q1: 30, q2: 30, q3: 31, q4: 31 },
];

export const HEADCOUNT_TOTAL = { q1: 350, q2: 367, q3: 385, q4: 399 } as const;
export const HEADCOUNT_NOTE =
  'Net add of 49 across the year, front-loaded into Data & ML. Fully funded by the headcount line on the bridge.';

/* ------------------------------------------------------------------ */
/* Cost detail — top line items ($M), the anomaly row lives here       */
/* ------------------------------------------------------------------ */

export interface CostRow {
  line: string;
  fy26: string;
  fy27: string;
  yoy: string;
  flag?: string;
}

export const COST_DETAIL: readonly CostRow[] = [
  { line: 'Salaries & benefits', fy26: '$38.9M', fy27: '$43.2M', yoy: '+11.1%' },
  { line: 'Cloud compute & storage', fy26: '$7.8M', fy27: '$8.6M', yoy: '+10.3%' },
  { line: 'Cloud egress', fy26: '$5.5M', fy27: '$7.6M', yoy: '+38.2%', flag: CLOUD_EGRESS_ANOMALY },
  { line: 'SaaS & licences', fy26: '$3.9M', fy27: '$3.4M', yoy: '−12.8%' },
  { line: 'Data platform', fy26: '$2.6M', fy27: '$3.1M', yoy: '+19.2%' },
  { line: 'Security tooling', fy26: '$1.5M', fy27: '$2.1M', yoy: '+40.0%' },
  { line: 'Facilities & other', fy26: '$1.2M', fy27: '$0.9M', yoy: '−25.0%' },
];

export const COST_DETAIL_NOTE =
  'Sorted by FY27 spend. The egress line is the only one flagged: its growth is unexplained and its owner has no plan yet.';

/* ------------------------------------------------------------------ */
/* The anomaly line — dedicated treatment                              */
/* ------------------------------------------------------------------ */

export const ANOMALY = {
  figure: '$7.6M',
  sub: 'FY27 cloud egress · up from $5.5M',
  headline: 'One line we are not signing off blind.',
  points: [
    'Cloud egress is up 38% year-on-year — faster than compute, faster than headcount, faster than revenue.',
    'No owner has produced a root cause: it may be cross-region replication, it may be an unbatched export job. We do not yet know.',
    'We are asking the committee to approve the budget with this line ring-fenced and reviewed at the FY27 mid-year, not buried in Infrastructure.',
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Capex vs opex split                                                 */
/* ------------------------------------------------------------------ */

export interface SplitRow {
  label: string;
  value: number;
  amount: string;
  note: string;
}

export const CAPEX_OPEX: readonly SplitRow[] = [
  { label: 'Opex', value: 88, amount: '$60.6M', note: 'Salaries, cloud, licences — the run-rate of the business.' },
  { label: 'Capex', value: 12, amount: '$8.3M', note: 'Data-centre buildout and hardware refresh, depreciated over three years.' },
];

export const CAPEX_OPEX_NOTE =
  'An 88/12 opex-to-capex split, unchanged from FY26. Nothing structural is moving; this is a bigger version of the same shape.';

/* ------------------------------------------------------------------ */
/* Scenarios — base / stretch / cut, three columns                     */
/* ------------------------------------------------------------------ */

export interface Scenario {
  id: string;
  name: string;
  total: string;
  delta: string;
  tone: 'base' | 'stretch' | 'cut';
  lines: readonly string[];
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'cut',
    name: 'Cut',
    total: '$64.2M',
    delta: '−$4.7M vs. request',
    tone: 'cut',
    lines: ['Freeze Data & ML hiring at Q1', 'Defer the hardware refresh', 'Egress stays a risk, unfunded'],
  },
  {
    id: 'base',
    name: 'Base',
    total: '$68.9M',
    delta: 'The request',
    tone: 'base',
    lines: ['Full headcount plan', 'Platform & security funded', 'Egress ring-fenced for review'],
  },
  {
    id: 'stretch',
    name: 'Stretch',
    total: '$73.6M',
    delta: '+$4.7M vs. request',
    tone: 'stretch',
    lines: ['Pull FY28 Data hires forward', 'Second region for resilience', 'Dedicated egress remediation squad'],
  },
];

export const SCENARIO_NOTE = 'We recommend Base — it funds growth and forces the egress question without betting on it.';

/* ------------------------------------------------------------------ */
/* Approval ask + sign-off block                                       */
/* ------------------------------------------------------------------ */

export const APPROVAL = {
  headline: 'The ask: approve Base, ring-fence egress.',
  detail:
    'Approve the FY27 budget of $68.9M on the Base scenario, with the cloud-egress line ring-fenced and a named owner reporting a remediation plan at the mid-year review.',
  signoffs: [
    { role: 'CFO', decision: 'Budget approved' },
    { role: 'CTO', decision: 'Allocation approved' },
    { role: 'Finance Committee', decision: 'Ratified' },
  ],
} as const;

export const DATA_NOTES =
  'All figures are synthetic and illustrative; no real company or budget is represented. Values are in USD millions unless stated.';
