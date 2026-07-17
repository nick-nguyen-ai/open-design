/**
 * "The Water Works" — shipped content for `db-data-quality-operations`.
 *
 * Synthetic demonstration data for a fictional bank's data-quality operations.
 * The estate, incidents, and checks are invented.
 */

export type DocketState = 'isolated' | 'flushing' | 'repaired';
export type RunResult = 'pass' | 'warn' | 'fail';

/** A node on the as-built sheet. */
export interface WorksNode {
  id: string;
  label: string;
  sub: string;
  kind: 'source' | 'treatment' | 'main' | 'consumer';
  x: number;
  y: number;
}

/** A pipe between two nodes. */
export interface WorksPipe {
  id: string;
  from: string;
  to: string;
  /** Rows per night, for pipe weight. */
  flow: 1 | 2 | 3;
  state: 'clear' | 'affected';
}

/** A red-line incident markup pinned to a node. */
export interface WorksMarkup {
  id: string;
  ref: string;
  nodeId: string;
  /** Label offset from the node, sheet coordinates. */
  dx: number;
  dy: number;
}

export interface IncidentDocket {
  id: string;
  ref: string;
  where: string;
  title: string;
  found: string;
  blastRadius: string;
  owner: string;
  ownerDept: string;
  state: DocketState;
  note: string;
}

export interface CheckSuite {
  id: string;
  suite: string;
  checks: number;
  passed: number;
}

export interface RunLogItem {
  id: string;
  label: string;
  result: RunResult;
  at: string;
  detail: string;
}

export const WORKS = {
  masthead: 'MERIDIAN GROUP · DATA WORKS DEPARTMENT',
  sheetRef: 'AS-BUILT SHEET DW-104 · REVISION K · NIGHT RUN 14 JUL 2026',
  authority: 'DRAWN FROM PIPELINE LINEAGE · ANNOTATED BY THE OVERNIGHT QUALITY RUN',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT MERIDIAN FIGURES',
  kicker: 'THE OVERNIGHT RUN, AS ANNOTATED',
  statement: 'Two red-lines on the sheet.',
  subline:
    'The overnight quality run cleared 1,412 of 1,418 checks. Both failures trace to the customer-consolidation junction — marked on the as-built below, isolated at the valve, and routed to the owning crew. Nothing downstream of the isolation is serving stale water.',
  figures: [
    { label: 'PIPELINES ON SHEET', value: '34' },
    { label: 'CHECKS RUN OVERNIGHT', value: '1,418' },
    { label: 'RED-LINES OPEN', value: '2' },
    { label: 'ISOLATED CLEANLY', value: '100%' },
  ],
} as const;

export const SHEET = {
  title: 'The as-built sheet',
  sub: 'Sources → treatment → mains → consumers · red-lines mark tonight’s failures',
  caption:
    'As-built schematic of the data estate: three source systems feed two treatment stages into the customer and finance mains, which serve four consumers. Two red-line markups flag the customer-consolidation junction; the full incident dockets follow below.',
  legend: [
    { swatch: 'source', label: 'SOURCE SYSTEM' },
    { swatch: 'treatment', label: 'TREATMENT (TRANSFORM)' },
    { swatch: 'main', label: 'MAIN (MART)' },
    { swatch: 'consumer', label: 'CONSUMER' },
    { swatch: 'redline', label: 'RED-LINE MARKUP' },
  ],
} as const;

export const NODES: WorksNode[] = [
  { id: 'core', label: 'CORE BANKING', sub: 'SRC-01', kind: 'source', x: 70, y: 90 },
  { id: 'cards', label: 'CARDS LEDGER', sub: 'SRC-02', kind: 'source', x: 70, y: 210 },
  { id: 'crm', label: 'CRM EXTRACT', sub: 'SRC-03', kind: 'source', x: 70, y: 330 },
  { id: 'standardise', label: 'STANDARDISE', sub: 'TRT-11 · conform types', kind: 'treatment', x: 330, y: 150 },
  { id: 'consolidate', label: 'CUSTOMER CONSOLIDATION', sub: 'TRT-14 · entity resolution', kind: 'treatment', x: 330, y: 290 },
  { id: 'custmain', label: 'CUSTOMER MAIN', sub: 'MRT-21', kind: 'main', x: 640, y: 150 },
  { id: 'finmain', label: 'FINANCE MAIN', sub: 'MRT-24', kind: 'main', x: 640, y: 290 },
  { id: 'risk', label: 'RISK MODELS', sub: 'CNS-31', kind: 'consumer', x: 920, y: 70 },
  { id: 'regrep', label: 'REG REPORTING', sub: 'CNS-32', kind: 'consumer', x: 920, y: 180 },
  { id: 'exec', label: 'EXEC DASHBOARDS', sub: 'CNS-33', kind: 'consumer', x: 920, y: 290 },
  { id: 'marketing', label: 'MARKETING', sub: 'CNS-34', kind: 'consumer', x: 920, y: 390 },
];

export const PIPES: WorksPipe[] = [
  { id: 'p1', from: 'core', to: 'standardise', flow: 3, state: 'clear' },
  { id: 'p2', from: 'cards', to: 'standardise', flow: 2, state: 'clear' },
  { id: 'p3', from: 'cards', to: 'consolidate', flow: 2, state: 'affected' },
  { id: 'p4', from: 'crm', to: 'consolidate', flow: 2, state: 'affected' },
  { id: 'p5', from: 'standardise', to: 'custmain', flow: 3, state: 'clear' },
  { id: 'p6', from: 'consolidate', to: 'custmain', flow: 2, state: 'affected' },
  { id: 'p7', from: 'consolidate', to: 'finmain', flow: 2, state: 'clear' },
  { id: 'p8', from: 'standardise', to: 'finmain', flow: 1, state: 'clear' },
  { id: 'p9', from: 'custmain', to: 'risk', flow: 2, state: 'clear' },
  { id: 'p10', from: 'custmain', to: 'regrep', flow: 2, state: 'clear' },
  { id: 'p11', from: 'custmain', to: 'marketing', flow: 1, state: 'affected' },
  { id: 'p12', from: 'finmain', to: 'exec', flow: 2, state: 'clear' },
  { id: 'p13', from: 'finmain', to: 'regrep', flow: 1, state: 'clear' },
];

export const MARKUPS: WorksMarkup[] = [
  { id: 'm1', ref: 'RL-041', nodeId: 'consolidate', dx: -8, dy: 66 },
  { id: 'm2', ref: 'RL-042', nodeId: 'custmain', dx: 26, dy: -56 },
];

export const DOCKETS = {
  title: 'Incident dockets',
  sub: 'Each red-line, written up and routed to its accountable owner',
  items: [
    {
      id: 'd1',
      ref: 'RL-041',
      where: 'TRT-14 · CUSTOMER CONSOLIDATION',
      title: 'Duplicate-entity rate breached 0.5% after CRM schema drift',
      found: 'FOUND 02:14 BY CHECK DQ-3311',
      blastRadius: 'Customer main and its three consumers; finance main unaffected.',
      owner: 'A. Okafor',
      ownerDept: 'CUSTOMER DATA CREW',
      state: 'flushing',
      note: 'CRM feed pinned to last-good extract; entity-resolution rerun in progress, ETA 11:00.',
    },
    {
      id: 'd2',
      ref: 'RL-042',
      where: 'MRT-21 · CUSTOMER MAIN',
      title: 'Freshness SLA missed for marketing segment table (9h stale)',
      found: 'FOUND 05:40 BY CHECK DQ-2107',
      blastRadius: 'Marketing consumer only; flagged stale at the tap, not served.',
      owner: 'J. Reyes',
      ownerDept: 'MARTS CREW',
      state: 'isolated',
      note: 'Downstream of RL-041 — clears automatically once the consolidation rerun lands.',
    },
  ] as IncidentDocket[],
} as const;

export const CHECKS = {
  title: 'The checks board',
  sub: 'Overnight suites · passed against filed checks per suite',
  chartTitle: 'Overnight quality checks passed by suite, 14 July 2026',
  chartSource: 'Checks passed per suite against the filed total. Synthetic demonstration data.',
  suites: [
    { id: 's1', suite: 'SCHEMA', checks: 214, passed: 214 },
    { id: 's2', suite: 'FRESHNESS', checks: 187, passed: 186 },
    { id: 's3', suite: 'COMPLETENESS', checks: 341, passed: 341 },
    { id: 's4', suite: 'CONSISTENCY', checks: 296, passed: 291 },
    { id: 's5', suite: 'UNIQUENESS', checks: 380, passed: 380 },
  ] as CheckSuite[],
  logTitle: 'Latest runs',
  log: [
    { id: 'r1', label: 'DQ-3311 duplicate-entity rate · TRT-14', result: 'fail', at: '02:14', detail: '0.62% vs 0.50% limit — red-lined as RL-041' },
    { id: 'r2', label: 'DQ-2107 freshness · marketing segments', result: 'fail', at: '05:40', detail: '9h stale vs 6h SLA — red-lined as RL-042' },
    { id: 'r3', label: 'DQ-1888 row-count corridor · cards ledger', result: 'warn', at: '03:02', detail: '+4.1% vs corridor +4.0% — watch, not red-lined' },
    { id: 'r4', label: 'DQ-0450 reconciliation · core → finance main', result: 'pass', at: '04:19', detail: 'Penny-perfect across 2.1m rows' },
    { id: 'r5', label: 'DQ-1204 schema contract · CRM extract', result: 'pass', at: '01:47', detail: 'Contract v12 honoured after Friday’s patch' },
  ] as RunLogItem[],
} as const;

export const FOOT = {
  note: 'The sheet redraws from lineage nightly; red-lines stay pinned until their docket closes with evidence. Nothing is erased by hand.',
  next: 'NEXT NIGHT RUN BEGINS 00:30',
} as const;
