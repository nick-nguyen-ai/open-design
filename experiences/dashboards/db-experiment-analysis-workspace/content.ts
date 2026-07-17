/**
 * "The Lab Bench" — shipped content for `db-experiment-analysis-workspace`.
 *
 * Synthetic demonstration data for a fictional data-science team's experiment
 * workspace. Hypotheses, runs, metrics, and verdicts are invented.
 */

export type HypothesisState = 'gathering' | 'supported' | 'refuted';
export type RunVerdict = 'uplift' | 'flat' | 'regression';

export interface Hypothesis {
  id: string;
  ref: string;
  statement: string;
  owner: string;
  stake: string;
  state: HypothesisState;
  evidenceNote: string;
  marginNote: string;
}

export interface ExperimentRun {
  id: string;
  run: string;
  hypothesisRef: string;
  delta: string;
  metric: string;
  ci: string;
  verdict: RunVerdict;
  date: string;
}

export interface UpliftPoint {
  x: string;
  y: number;
}

export interface FiledDecision {
  id: string;
  ref: string;
  decision: string;
  basis: string;
  filed: string;
  outcome: 'promoted' | 'closed';
}

export const BENCH = {
  masthead: 'MERIDIAN ML RESEARCH · EXPERIMENT WORKSPACE',
  notebookRef: 'BENCH BOOK 12 · PAGES 84–91 · WEEK OF 13 JUL 2026',
  standard: 'KEPT TO PUBLICATION STANDARD · EVERY CLAIM CARRIES ITS RUN ID',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT MERIDIAN RESEARCH',
  kicker: 'THE BENCH, AS LEFT LAST NIGHT',
  statement: 'Three hypotheses. One is ready to call.',
  subline:
    'The propensity-features hypothesis has held through five independent runs and two seed changes; its promotion memo is drafted below. The cold-start hypothesis is one run from a verdict, and the embeddings bet took its first regression on Friday — written up honestly, not quietly reset.',
  figures: [
    { label: 'ACTIVE HYPOTHESES', value: '3' },
    { label: 'RUNS THIS WEEK', value: '14' },
    { label: 'READY TO CALL', value: '1' },
    { label: 'DECISIONS FILED Q3', value: '6' },
  ],
} as const;

export const HYPOTHESES = {
  title: 'Hypotheses on the bench',
  sub: 'Each card carries its stake and its current standing — stamps are earned, not assigned',
  items: [
    {
      id: 'h1',
      ref: 'H-241',
      statement: 'Adding 90-day merchant-category features lifts card-propensity AUC by ≥ 0.01 without calibration loss.',
      owner: 'Chen W.',
      stake: 'Promotion of propensity-v6 to challenger',
      state: 'supported',
      evidenceNote: 'Five clean runs, two seeds, uplift stable at +0.013 AUC; calibration drift < 0.002.',
      marginNote: 'holds at seed 17 too ✓',
    },
    {
      id: 'h2',
      ref: 'H-244',
      statement: 'A two-stage cold-start blend beats the popularity fallback on week-one engagement by ≥ 5%.',
      owner: 'Osei K.',
      stake: 'Replacing the fallback ranker for new customers',
      state: 'gathering',
      evidenceNote: 'Three runs in: +6.2%, +4.8%, +5.5%. One more pre-registered run to verdict.',
      marginNote: 'run 4 queued for Mon',
    },
    {
      id: 'h3',
      ref: 'H-239',
      statement: 'Transaction-graph embeddings add signal beyond gradient-boosted features for mule detection.',
      owner: 'Varga L.',
      stake: 'A quarter of platform budget for a graph pipeline',
      state: 'refuted',
      evidenceNote: 'Friday’s ablation run showed the uplift was leakage through the account-age join. Written up in full.',
      marginNote: 'good catch — see p.89',
    },
  ] as Hypothesis[],
} as const;

export const RUNS = {
  title: 'The run ledger',
  sub: 'Every run pre-registered · config delta and confidence interval on record',
  caption:
    'Run ledger — fourteen experiment runs this week with hypothesis reference, configuration delta, primary metric, confidence interval, and verdict contribution.',
  items: [
    { id: 'r1', run: 'RUN-1187', hypothesisRef: 'H-241', delta: '+ mcc-90d features', metric: 'AUC 0.847', ci: '±0.003', verdict: 'uplift', date: '13 JUL' },
    { id: 'r2', run: 'RUN-1186', hypothesisRef: 'H-241', delta: 'seed 17 repeat', metric: 'AUC 0.846', ci: '±0.003', verdict: 'uplift', date: '12 JUL' },
    { id: 'r3', run: 'RUN-1184', hypothesisRef: 'H-244', delta: 'blend α=0.35', metric: 'ENG-W1 +5.5%', ci: '±1.1%', verdict: 'uplift', date: '11 JUL' },
    { id: 'r4', run: 'RUN-1182', hypothesisRef: 'H-239', delta: 'ablate account-age join', metric: 'PR-AUC 0.611', ci: '±0.006', verdict: 'regression', date: '10 JUL' },
    { id: 'r5', run: 'RUN-1181', hypothesisRef: 'H-244', delta: 'blend α=0.25', metric: 'ENG-W1 +4.8%', ci: '±1.2%', verdict: 'uplift', date: '10 JUL' },
    { id: 'r6', run: 'RUN-1179', hypothesisRef: 'H-241', delta: 'holdout Q2 cohort', metric: 'AUC 0.848', ci: '±0.004', verdict: 'uplift', date: '09 JUL' },
    { id: 'r7', run: 'RUN-1176', hypothesisRef: 'H-239', delta: '+ graph embeddings d=64', metric: 'PR-AUC 0.634', ci: '±0.006', verdict: 'flat', date: '08 JUL' },
  ] as ExperimentRun[],
} as const;

export const EVIDENCE = {
  title: 'Evidence: H-241 across runs',
  sub: 'The uplift, drawn run by run against the promotion bar',
  chartTitle: 'H-241 — AUC uplift vs baseline across its five runs',
  chartSource: 'Uplift in AUC over the frozen baseline per run; the promotion bar sits at +0.010. Synthetic demonstration data.',
  promotionBar: 0.01,
  points: [
    { x: 'RUN-1172', y: 0.011 },
    { x: 'RUN-1179', y: 0.014 },
    { x: 'RUN-1183', y: 0.012 },
    { x: 'RUN-1186', y: 0.012 },
    { x: 'RUN-1187', y: 0.013 },
  ] as UpliftPoint[],
  reading:
    'Reading: the uplift never dips below the promotion bar across cohorts or seeds, and calibration holds. This is what “ready to call” looks like on this bench — the memo cites all five run IDs, and any reviewer can re-run the pack from the ledger line alone.',
} as const;

export const DECISIONS = {
  title: 'Decisions filed',
  sub: 'What this bench has promoted or closed this quarter — with the evidence it stood on',
  items: [
    { id: 'dd1', ref: 'DEC-31', decision: 'Promote propensity-v6 features to challenger', basis: 'H-241 · five runs · memo p.91', filed: 'DRAFTED', outcome: 'promoted' },
    { id: 'dd2', ref: 'DEC-29', decision: 'Close the graph-embeddings bet for mule detection', basis: 'H-239 · leakage ablation · p.89', filed: '11 JUL', outcome: 'closed' },
    { id: 'dd3', ref: 'DEC-27', decision: 'Adopt stratified backtests for all fraud hypotheses', basis: 'Method note M-12 · p.77', filed: '02 JUL', outcome: 'promoted' },
  ] as FiledDecision[],
} as const;

export const FOOT = {
  note: 'Runs are pre-registered before execution; negative results are written up at the same standard as positive ones. A hypothesis leaves this bench only by verdict or by explicit closure — never by fading out.',
  next: 'NEXT BENCH REVIEW MON 20 JUL · 09:30',
} as const;
