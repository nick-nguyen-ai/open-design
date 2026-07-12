/**
 * Content pack for "The Studio" — the live rendering of
 * `home-data-scientist-studio`.
 *
 * A personal internal homepage with atelier character: translucent panes
 * over a deep dusk field, several correlated signals visible at once, and
 * honesty as design — one experiment on the shelf failed and stays there,
 * labelled with what it taught.
 *
 * Everything here is TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE
 * AND SYNTHETIC (the page carries the mark); the production telemetry it
 * references lines up with the Model Risk Control Room's fleet — the same
 * bank, seen from one practitioner's bench.
 */
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';
import type { StatusListItemDatum } from '@enterprise-design/content-components';

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

export const PERSON = {
  name: 'Anaya Rao',
  role: 'Senior Data Scientist',
  team: 'Customer Decisioning',
  location: 'Sydney · L9 EAST',
  since: 'AT THE BANK SINCE 2022',
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
  timeOfDay: 'FRIDAY · LATE AFTERNOON',
  modelsInProduction: 2,
} as const;

export const STATEMENT: readonly string[] = ['Work in progress,', 'measured in public.'];

export const STATEMENT_SUBLINE =
  'This is my bench: live experiments, honest failures, and one production model I check on before coffee. Nothing here is finished. Everything here is measured.';

export interface IdentityFact {
  label: string;
  value: string;
}

export const IDENTITY_FACTS: readonly IdentityFact[] = [
  { label: 'TEAM', value: 'Customer Decisioning' },
  { label: 'MODELS IN PRODUCTION', value: '2' },
  { label: 'EXPERIMENTS OPEN', value: '3' },
  { label: 'LAST SHIPPED', value: 'Weekly retrain cadence · JUN' },
];

/* ------------------------------------------------------------------ */
/* Now working on                                                      */
/* ------------------------------------------------------------------ */

export const NOW = {
  title: 'churn-early-warning v3',
  line: 'Lifting the churn model from AUC 0.81 to 0.84 with lifecycle-aware tenure features — then facing the validation office with the evidence.',
  status: 'CHALLENGER IN PREP',
  checkpoints: [
    { label: 'HOLDOUT REFRESH', value: 'DONE · 08 JUL' },
    { label: 'CHALLENGER READ-OUT', value: '24 JUL' },
    { label: 'VALIDATION INTAKE', value: 'TARGET P09' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* The experiment shelf                                                */
/* ------------------------------------------------------------------ */

export type ExperimentStatus = 'running' | 'design' | 'shipped' | 'failed-kept';

export const EXPERIMENT_STATUS_LABEL: Record<ExperimentStatus, string> = {
  running: 'RUNNING',
  design: 'IN DESIGN',
  shipped: 'SHIPPED',
  'failed-kept': 'FAILED · KEPT',
};

export interface Experiment {
  id: string;
  code: string;
  title: string;
  hypothesis: string;
  status: ExperimentStatus;
  metric: string;
  /** Only the failed-and-learned card carries a lesson — honesty as design. */
  lesson?: string;
}

export const EXPERIMENTS: readonly Experiment[] = [
  {
    id: 'exp-114',
    code: 'EXP-114',
    title: 'Lifecycle-aware tenure features',
    hypothesis: 'Splitting tenure into lifecycle bands adds signal the trees cannot find alone.',
    status: 'running',
    metric: 'AUC 0.832 (+0.022) ON HOLDOUT',
  },
  {
    id: 'exp-109',
    code: 'EXP-109',
    title: 'Payee-network graph features',
    hypothesis: 'Shared-payee graph centrality predicts churn before balances move.',
    status: 'failed-kept',
    metric: '+0.001 AUC FOR +40 MS LATENCY',
    lesson:
      'The graph is real; the signal was already in the transactions. Written up so nobody pays 40 milliseconds for it twice.',
  },
  {
    id: 'exp-117',
    code: 'EXP-117',
    title: 'Complaint-text early signals',
    hypothesis: 'Complaint embeddings sixty days out flag churn the ledger cannot yet see.',
    status: 'design',
    metric: 'POWER ANALYSIS DRAFTED · NEEDS 8 WKS OF LABELS',
  },
  {
    id: 'exp-112',
    code: 'EXP-112',
    title: 'Weekly retrain cadence',
    hypothesis: 'Halving the retrain interval halves drift alerts without hurting stability.',
    status: 'shipped',
    metric: 'PSI ALERTS 6 → 3 PER QUARTER',
  },
];

/* ------------------------------------------------------------------ */
/* The drift widget — her model's weekly PSI                           */
/* ------------------------------------------------------------------ */

export const DRIFT_WIDGET = {
  title: 'churn-early-warning — weekly PSI, 12 weeks',
  source: 'Weekly 30-day-window PSI. Watch threshold 0.10. Synthetic demonstration data.',
  caption: 'In the watch band since w/c 22 JUN — the night watch sees the same number I do. Retrain queued.',
  watchThreshold: 0.1,
  current: 0.116,
} as const;

/** Week-commencing dates — ISO so the adapter's lexical ordering is chronological. */
const WEEKS = [
  '2026-04-20', '2026-04-27', '2026-05-04', '2026-05-11', '2026-05-18', '2026-05-25',
  '2026-06-01', '2026-06-08', '2026-06-15', '2026-06-22', '2026-06-29', '2026-07-06',
] as const;
const WEEKLY_PSI = [0.071, 0.068, 0.075, 0.082, 0.079, 0.088, 0.094, 0.097, 0.099, 0.106, 0.111, 0.116] as const;

export const DRIFT_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'psi',
    label: 'Weekly PSI',
    points: WEEKS.map((x, i) => ({ x, y: WEEKLY_PSI[i] as number })),
  },
  {
    id: 'watch',
    label: 'Watch threshold 0.10',
    points: WEEKS.map((x) => ({ x, y: 0.1 })),
  },
];

/* ------------------------------------------------------------------ */
/* The constellation — skills as stars, in three clusters              */
/* ------------------------------------------------------------------ */

export interface SkillStar {
  id: string;
  label: string;
  cluster: 'craft' | 'systems' | 'voice';
  /** Practice depth 1–3 — the star's magnitude. */
  depth: 1 | 2 | 3;
  /** Deterministic position in the constellation viewBox (0–100). */
  x: number;
  y: number;
}

export const CLUSTER_LABEL: Record<SkillStar['cluster'], string> = {
  craft: 'CRAFT',
  systems: 'SYSTEMS',
  voice: 'VOICE',
};

export const CONSTELLATION: readonly SkillStar[] = [
  // CRAFT — the modelling core, upper left
  { id: 'gbm', label: 'Gradient boosting', cluster: 'craft', depth: 3, x: 18, y: 26 },
  { id: 'causal', label: 'Causal inference', cluster: 'craft', depth: 2, x: 30, y: 14 },
  { id: 'exp-design', label: 'Experiment design', cluster: 'craft', depth: 3, x: 38, y: 30 },
  { id: 'survival', label: 'Survival analysis', cluster: 'craft', depth: 1, x: 24, y: 42 },
  // SYSTEMS — the engineering spine, centre right
  { id: 'python', label: 'Python', cluster: 'systems', depth: 3, x: 58, y: 22 },
  { id: 'feature-pipelines', label: 'Feature pipelines', cluster: 'systems', depth: 2, x: 70, y: 34 },
  { id: 'spark', label: 'Spark', cluster: 'systems', depth: 2, x: 82, y: 20 },
  { id: 'serving', label: 'Model serving', cluster: 'systems', depth: 1, x: 66, y: 52 },
  // VOICE — influence, lower band
  { id: 'reviews', label: 'Model reviews', cluster: 'voice', depth: 2, x: 34, y: 66 },
  { id: 'talks', label: 'Guild talks', cluster: 'voice', depth: 2, x: 50, y: 78 },
  { id: 'mentoring', label: 'Mentoring', cluster: 'voice', depth: 3, x: 64, y: 70 },
  { id: 'writing', label: 'Write-ups', cluster: 'voice', depth: 1, x: 46, y: 60 },
];

/** Edges within clusters — the constellation's connecting lines. */
export const CONSTELLATION_EDGES: readonly (readonly [string, string])[] = [
  ['gbm', 'causal'],
  ['causal', 'exp-design'],
  ['gbm', 'survival'],
  ['exp-design', 'gbm'],
  ['python', 'feature-pipelines'],
  ['feature-pipelines', 'spark'],
  ['feature-pipelines', 'serving'],
  ['reviews', 'writing'],
  ['writing', 'mentoring'],
  ['talks', 'mentoring'],
  // One bridge per pair of clusters — the practice is connected.
  ['exp-design', 'python'],
  ['serving', 'mentoring'],
  ['reviews', 'gbm'],
];

/* ------------------------------------------------------------------ */
/* Talks & notes shelf                                                 */
/* ------------------------------------------------------------------ */

export interface ShelfItem {
  id: string;
  kind: 'TALK' | 'NOTE' | 'DOC' | 'WORKSHOP';
  title: string;
  venue: string;
  date: string;
}

export const SHELF: readonly ShelfItem[] = [
  { id: 'shelf-1', kind: 'TALK', title: 'Why we killed the graph features', venue: 'DS GUILD', date: 'JUN 2026' },
  { id: 'shelf-2', kind: 'NOTE', title: 'Drift is a schedule, not a surprise', venue: 'INTERNAL NOTE', date: 'MAY 2026' },
  { id: 'shelf-3', kind: 'DOC', title: 'churn-early-warning v3 — design review', venue: 'DECISIONING WIKI', date: 'MAY 2026' },
  { id: 'shelf-4', kind: 'WORKSHOP', title: 'Feature stores for humans', venue: 'ONBOARDING SERIES', date: 'APR 2026' },
];

/* ------------------------------------------------------------------ */
/* Bench log (StatusList)                                              */
/* ------------------------------------------------------------------ */

export const BENCH_LOG: readonly StatusListItemDatum[] = [
  {
    id: 'log-0710',
    label: 'v3 challenger registered with the validation office',
    status: 'success',
    description: 'Intake targeted for P09 — the evidence pack is half-written already.',
    timestamp: '2026-07-10T15:20:00+10:00',
  },
  {
    id: 'log-0709',
    label: 'churn-early-warning PSI 0.116 — watch band, retrain queued',
    status: 'warning',
    description: 'Same number the night watch sees. Retrain lands with the weekly cadence.',
    timestamp: '2026-07-09T08:05:00+10:00',
  },
  {
    id: 'log-0708',
    label: 'EXP-114 holdout refreshed',
    status: 'info',
    description: 'AUC 0.832 held on the new window — +0.022 over champion.',
    timestamp: '2026-07-08T17:40:00+10:00',
  },
  {
    id: 'log-0703',
    label: 'complaint-triage-nlp v2 approved — congratulations filed',
    status: 'success',
    description: 'Team model cleared validation (MV-26-081, two minor findings).',
    timestamp: '2026-07-03T11:15:00+10:00',
  },
  {
    id: 'log-0701',
    label: 'EXP-117 power analysis drafted',
    status: 'info',
    description: 'Needs eight weeks of complaint labels before it can run honestly.',
    timestamp: '2026-07-01T16:00:00+10:00',
  },
];
