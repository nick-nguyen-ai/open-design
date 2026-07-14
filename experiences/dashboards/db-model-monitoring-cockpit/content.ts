/**
 * The shipped fill for "The Cockpit" — "The Model Risk Control Room, 02:47".
 *
 * THE WORLD: a bank's overnight watch on its production model fleet, in the
 * visual register of a dealing-floor instrument. All the craft lives in
 * `CockpitTemplate.tsx` (with the bespoke `DriftScope.tsx` it imports); this file
 * carries only the CONTENT, validated against {@link CockpitFill} at load, so the
 * shipped cockpit is itself a proof that the contract admits the real design.
 *
 * Everything here is TYPED and DETERMINISTIC: no Math.random at render, no
 * Date.now-derived data. The watch clock STARTS at a fixed instant (watch.
 * clockLabel) and ticks forward from mount (presentation only — the data never
 * changes under it). All figures are synthetic demonstration data at realistic
 * institutional magnitudes (declared in `watch.dataNotice`); the one deliberate
 * anomaly is `card-fraud-v4`, 0.062 PSI past its breach limit.
 */
import { CockpitFill } from './cockpit-fill.js';

/* ------------------------------------------------------------------ */
/* Drift-trend generation (pure math — produces the fill's trendPoints) */
/*                                                                      */
/* 90 days of daily PSI for card-fraud-v4, ending 2026-07-11. The first */
/* ~78 days come from a fixed pure formula (quiet regime); the final    */
/* tail is hand-authored so the limit crossing sits exactly where the   */
/* narrative says it does.                                              */
/* ------------------------------------------------------------------ */

const PSI_BREACH_THRESHOLD = 0.25;

function quietPsi(day: number): number {
  const base = 0.058 + 0.011 * Math.sin(day / 5.3) + 0.006 * Math.sin(day / 2.1 + 1.7);
  return Number(base.toFixed(3));
}

const TAIL: readonly number[] = [
  0.079, 0.088, 0.101, 0.117, 0.13, 0.148, 0.171, 0.196, 0.224, 0.247, 0.268, 0.291, 0.312,
];

const TREND_END_UTC = Date.UTC(2026, 6, 11); // 2026-07-11
const TREND_DAYS = 90;
const DAY_MS = 86_400_000;

function isoDay(offsetFromEnd: number): string {
  const d = new Date(TREND_END_UTC - offsetFromEnd * DAY_MS);
  return d.toISOString().slice(0, 10);
}

const TREND_POINTS = Array.from({ length: TREND_DAYS }, (_, i) => {
  const fromEnd = TREND_DAYS - 1 - i;
  const tailIndex = TAIL.length - 1 - fromEnd;
  const y = tailIndex >= 0 ? (TAIL[tailIndex] as number) : quietPsi(i);
  return { x: isoDay(fromEnd), y };
});

/* ------------------------------------------------------------------ */
/* The shipped fill                                                     */
/* ------------------------------------------------------------------ */

export const cockpitFill: CockpitFill = CockpitFill.parse({
  watch: {
    pageTitle: 'The Model Risk Control Room, 02:47',
    commandLine: 'MODEL RISK COMMAND · NIGHT WATCH · EST. 2021',
    environment: 'PROD',
    refreshCadence: 'REFRESH 60S',
    lastRefresh: 'LAST SWEEP 02:47:12',
    nextRefresh: 'NEXT 02:48:12',
    timezone: 'AEST',
    clockLabel: '02:47:12',
    sweepCadence: '9 S / REV',
    dataNotice: 'SYNTHETIC DEMONSTRATION DATA · NOT CBA FIGURES',
    keyboardHint: 'TAB — INSTRUMENTS · P — HOLD SWEEP',
  },

  statement: {
    kicker: 'THE MODEL RISK CONTROL ROOM · 02:47',
    lines: [
      'Twelve models hold the night book.',
      'Eleven are inside their envelopes.',
      'The twelfth is why this room is lit.',
    ],
    subline: 'CARD-FRAUD-V4 CROSSED PSI 0.250 AT 09:41 THU · 41 H IN BREACH · RETRAIN QUEUED',
  },

  thresholds: {
    watch: 0.1,
    breach: PSI_BREACH_THRESHOLD,
  },

  scope: {
    caption:
      'Fleet drift scope: twelve production models plotted by 30-day population stability index within four business-line sectors. card-fraud-v4 is beyond the 0.25 breach limit at PSI 0.312. The fleet watchlist table below carries the same data.',
    encodingNote: 'RADIUS = 30-DAY PSI · SECTOR = BUSINESS LINE',
    breachCalloutNote: '41 H IN BREACH · RETRAIN QUEUED',
  },

  fleet: {
    bandTitle: 'FLEET WATCHLIST',
    bandSub: 'TEXTUAL MIRROR OF THE SCOPE · 12 CONTACTS',
    tableCaption:
      "Fleet watchlist — the drift scope's contents as a table. Twelve models with sector, 30-day PSI, limit, status, owner, and last retrain date.",
    sectors: [
      { id: 'fraud', label: 'FRAUD & FIN-CRIME' },
      { id: 'credit', label: 'CREDIT RISK' },
      { id: 'markets', label: 'MARKETS & TREASURY' },
      { id: 'customer', label: 'CUSTOMER OPS' },
    ],
    models: [
      // FRAUD & FIN-CRIME
      { id: 'card-fraud-v4', name: 'card-fraud-v4', sectorId: 'fraud', psi: 0.312, status: 'breach', owner: 'Decision Science — Cards', lastRetrain: '2026-05-28' },
      { id: 'aml-alert-ranker', name: 'aml-alert-ranker', sectorId: 'fraud', psi: 0.118, status: 'watch', owner: 'Financial Crime Analytics', lastRetrain: '2026-06-19' },
      { id: 'sanctions-screening-v3', name: 'sanctions-screening-v3', sectorId: 'fraud', psi: 0.052, status: 'stable', owner: 'Financial Crime Analytics', lastRetrain: '2026-07-01' },
      { id: 'merchant-risk-gbm', name: 'merchant-risk-gbm', sectorId: 'fraud', psi: 0.087, status: 'stable', owner: 'Decision Science — Merchants', lastRetrain: '2026-06-24' },
      // CREDIT RISK
      { id: 'mortgage-pd-b2', name: 'mortgage-pd-b2', sectorId: 'credit', psi: 0.064, status: 'stable', owner: 'Retail Credit Models', lastRetrain: '2026-04-30' },
      { id: 'credit-limit-optimiser', name: 'credit-limit-optimiser', sectorId: 'credit', psi: 0.141, status: 'watch', owner: 'Retail Credit Models', lastRetrain: '2026-06-07' },
      { id: 'collections-uplift', name: 'collections-uplift', sectorId: 'credit', psi: 0.049, status: 'stable', owner: 'Collections Strategy', lastRetrain: '2026-06-28' },
      // MARKETS & TREASURY
      { id: 'fx-liquidity-lstm', name: 'fx-liquidity-lstm', sectorId: 'markets', psi: 0.093, status: 'stable', owner: 'Markets Quant Engineering', lastRetrain: '2026-06-15' },
      { id: 'rate-path-scenario', name: 'rate-path-scenario', sectorId: 'markets', psi: 0.071, status: 'stable', owner: 'Treasury Analytics', lastRetrain: '2026-05-22' },
      // CUSTOMER OPS
      { id: 'churn-early-warning', name: 'churn-early-warning', sectorId: 'customer', psi: 0.116, status: 'watch', owner: 'Customer Decisioning', lastRetrain: '2026-06-11' },
      { id: 'kyc-doc-classifier', name: 'kyc-doc-classifier', sectorId: 'customer', psi: 0.083, status: 'stable', owner: 'Onboarding Automation', lastRetrain: '2026-06-30' },
      { id: 'complaint-triage-nlp', name: 'complaint-triage-nlp', sectorId: 'customer', psi: 0.044, status: 'stable', owner: 'Customer Decisioning', lastRetrain: '2026-07-03' },
    ],
  },

  dossier: {
    bandTitle: 'THE DOSSIER',
    bandSub: 'WHY THE SCOPE IS POINTING AT IT',
    trendHeading: 'DRIFT · 90 DAYS VS LIMIT',
    trendChartTitle: 'card-fraud-v4 — population stability index, 90 days',
    trendChartSource: 'Daily 30-day-window PSI vs the 0.25 breach limit. Synthetic demonstration data.',
    trendPoints: TREND_POINTS,
    featureHeading: 'FEATURE CONTRIBUTIONS TO DRIFT',
    featureChartTitle: 'card-fraud-v4 — feature-level PSI contribution',
    featureChartSource: 'Top six features by contribution to composite PSI. Synthetic demonstration data.',
    featureDrift: [
      { id: 'txn-amount', category: 'txn_amount_zscore', value: 0.084 },
      { id: 'merchant-entropy', category: 'merchant_category_entropy', value: 0.061 },
      { id: 'geo-velocity', category: 'geo_velocity_kmh', value: 0.049 },
      { id: 'card-present', category: 'card_present_ratio', value: 0.038 },
      { id: 'device-age', category: 'device_age_days', value: 0.031 },
      { id: 'mcc-risk', category: 'mcc_risk_score', value: 0.027 },
    ],
    registerHeading: 'REGISTER ENTRY',
    facts: [
      { label: 'MODEL', value: 'card-fraud-v4 · v4.2.1' },
      { label: 'TIER', value: '1 — CUSTOMER-FACING DECISIONING' },
      { label: 'OWNER', value: 'DECISION SCIENCE — CARDS & PAYMENTS' },
      { label: 'VALIDATOR', value: 'MODEL RISK OVERSIGHT' },
      { label: 'DEPLOYED', value: '2026-03-14' },
      { label: 'LAST RETRAIN', value: '2026-05-28 · JOB CF4-R104' },
      { label: 'BREACH DECLARED', value: '2026-07-10 09:41 · 3RD CONSEC. WINDOW' },
      { label: 'SLA', value: 'RESTORE ≤ 72 H · 31 H REMAINING' },
      { label: 'ACTION', value: 'RETRAIN CF4-R118 IN OVERNIGHT QUEUE' },
    ],
  },

  log: {
    heading: 'OVERNIGHT LOG',
    listTitle: 'Overnight event log',
    items: [
      { id: 'log-0240', label: 'Scope refresh complete — 12/12 models reporting', status: 'info', description: 'Full fleet telemetry received within cadence.', timestamp: '2026-07-12T02:40:00+10:00' },
      { id: 'log-0112', label: 'card-fraud-v4 PSI 0.312 — breach persists', status: 'danger', description: 'Third consecutive daily window above the 0.25 limit.', timestamp: '2026-07-12T01:12:00+10:00' },
      { id: 'log-0030', label: 'Challenger comparison queued: v4.2.1 vs v5.0-rc1', status: 'warning', description: 'Shadow-scoring window opens at 04:00.', timestamp: '2026-07-12T00:30:00+10:00' },
      { id: 'log-2347', label: 'Retrain CF4-R118 submitted to overnight queue', status: 'info', description: 'Feature window 2026-04-13 → 2026-07-11.', timestamp: '2026-07-11T23:47:00+10:00' },
      { id: 'log-2205', label: 'credit-limit-optimiser entered watch band', status: 'warning', description: 'PSI 0.141 — trending flat, no action required tonight.', timestamp: '2026-07-11T22:05:00+10:00' },
      { id: 'log-2100', label: 'Feature-store reconciliation clean', status: 'success', description: 'Nightly parity check: 0 divergent features.', timestamp: '2026-07-11T21:00:00+10:00' },
    ],
  },

  instruments: {
    bandTitle: 'SUPPORTING INSTRUMENTATION',
    bandSub: 'FLEET-LEVEL GAUGES · SUBORDINATE TO THE SCOPE',
    kpiTitle: 'Fleet gauges',
    kpis: [
      { id: 'kpi-envelope', label: 'Models in envelope', value: 11, unit: 'count', target: 12, status: 'at-risk' },
      { id: 'kpi-alerts', label: 'Overnight alerts', value: 3, unit: 'count', status: 'neutral' },
      { id: 'kpi-latency', label: 'Scoring p99 (ms)', value: 143, unit: 'count', target: 180, status: 'on-track' },
      { id: 'kpi-coverage', label: 'Feature coverage', value: 0.992, unit: 'percent', target: 0.99, status: 'on-track' },
    ],
  },
});

/** Standard certifier alias (Task 5): the shipped fill instance. */
export const SHIPPED_FILL = cockpitFill;
