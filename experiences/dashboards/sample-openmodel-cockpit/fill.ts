/**
 * "The Cockpit" — experience-composer skill run: an ML-platform team's overnight
 * drift watch over the fleet of OPEN-WEIGHT models they serve in production
 * (openmodel-cockpit sample). CONTENT ONLY, conforming to {@link CockpitFill};
 * the template (`CockpitTemplate.tsx` + `DriftScope.tsx`) carries the whole craft.
 *
 * Every fact traces to the run's source context
 * (`docs/superpowers/specs/openmodel-cockpit-sample/source-context.md`). REAL:
 * the ten model names and their open-weight licences (Llama 3.3 70B, Qwen2.5-72B,
 * Mistral Small 3, Qwen2.5-Coder-32B, DeepSeek-V3, Mixtral 8x22B, Gemma 2 27B,
 * Phi-4, BGE-M3, Nomic Embed v1.5). SYNTHETIC ILLUSTRATIVE: every drift metric —
 * PSI values, thresholds, the 90-day trend, feature contributions, the incident
 * log, the gauges — covered by `watch.dataNotice` and the chart source notes.
 *
 * The single deliberate anomaly is `Qwen2.5-Coder-32B`, 0.041 PSI past its 0.25
 * breach limit: an upstream agent-harness revision changed the prompt mix on the
 * code desk. The whole dossier tells ITS story — the trend rises past the limit
 * on 2026-07-13, the feature contributions name the prompt-mix drivers (and sum
 * to the composite PSI), and the incident log matches. Deterministic: the trend
 * comes from a fixed pure formula (quiet regime) plus a hand-authored tail; no
 * Math.random, no Date.now-derived data.
 */
import { CockpitFill } from '../db-model-monitoring-cockpit/cockpit-fill.js';

/* ------------------------------------------------------------------ */
/* Drift-trend generation (pure math — produces the fill's trendPoints) */
/*                                                                      */
/* 90 days of daily 30-day-window PSI for Qwen2.5-Coder-32B, ending     */
/* 2026-07-14. The first ~79 days come from a fixed pure formula (quiet  */
/* regime, well inside the watch band); the final 11-day tail is        */
/* hand-authored so the limit crossing sits on 2026-07-13, exactly      */
/* where the dossier and log say it does. All SYNTHETIC ILLUSTRATIVE.    */
/* ------------------------------------------------------------------ */

const PSI_BREACH_THRESHOLD = 0.25;

function quietPsi(day: number): number {
  const base = 0.052 + 0.01 * Math.sin(day / 5.1) + 0.006 * Math.sin(day / 2.3 + 1.1);
  return Number(base.toFixed(3));
}

// Last 11 days: the drift acceleration. Crosses 0.250 on 2026-07-13 (0.263),
// current 30-day PSI 0.291 on 2026-07-14 — the value carried into the watchlist.
const TAIL: readonly number[] = [0.079, 0.089, 0.102, 0.118, 0.137, 0.159, 0.184, 0.211, 0.238, 0.263, 0.291];

const TREND_END_UTC = Date.UTC(2026, 6, 14); // 2026-07-14
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
/* The sample fill                                                      */
/* ------------------------------------------------------------------ */

export const openmodelCockpitFill: CockpitFill = CockpitFill.parse({
  watch: {
    pageTitle: 'The Model Platform Drift Watch, 03:12',
    commandLine: 'ML PLATFORM SRE · MODEL DRIFT WATCH · EST. 2023',
    environment: 'PROD',
    refreshCadence: 'REFRESH 30S',
    lastRefresh: 'LAST SWEEP 03:12:47',
    nextRefresh: 'NEXT 03:13:17',
    timezone: 'UTC',
    clockLabel: '03:12:47',
    sweepCadence: '9 S / REV',
    dataNotice: 'REAL MODEL NAMES · SYNTHETIC DRIFT METRICS — ILLUSTRATIVE',
    keyboardHint: 'TAB — INSTRUMENTS · P — HOLD SWEEP',
  },

  statement: {
    kicker: 'ML PLATFORM DRIFT WATCH · 03:12',
    lines: [
      'Ten open-weight models serve the platform.',
      'Nine sit inside their drift envelopes.',
      'The tenth pulled the code desk past its limit.',
    ],
    subline: 'QWEN2.5-CODER-32B CROSSED PSI 0.250 AT 22:40 MON · 29 H IN BREACH · RETRAIN QUEUED',
  },

  thresholds: {
    watch: 0.1,
    breach: PSI_BREACH_THRESHOLD,
  },

  scope: {
    caption:
      'Fleet drift scope: ten open-weight models we serve in production, plotted by 30-day population stability index within four deployment sectors. Qwen2.5-Coder-32B is beyond the 0.25 breach limit at PSI 0.291. The fleet watchlist table below carries the same data.',
    encodingNote: 'RADIUS = 30-DAY PSI · SECTOR = DEPLOYMENT',
    breachCalloutNote: '29 H IN BREACH · RETRAIN QUEUED',
  },

  fleet: {
    bandTitle: 'FLEET WATCHLIST',
    bandSub: 'TEXTUAL MIRROR OF THE SCOPE · 10 CONTACTS',
    tableCaption:
      "Fleet watchlist — the drift scope's contents as a table. Ten open-weight models with sector, 30-day PSI, limit, status, owner, and last retrain date.",
    sectors: [
      { id: 'chat', label: 'CHAT ASSISTANTS' },
      { id: 'code', label: 'CODE ASSISTANTS' },
      { id: 'batch', label: 'BATCH INFERENCE' },
      { id: 'embeddings', label: 'EMBEDDINGS & RETRIEVAL' },
    ],
    models: [
      // CHAT ASSISTANTS
      { id: 'llama-3-3-70b', name: 'Llama 3.3 70B', sectorId: 'chat', psi: 0.071, status: 'stable', owner: 'Platform Serving — Chat', lastRetrain: '2026-06-28' },
      { id: 'qwen2-5-72b', name: 'Qwen2.5-72B', sectorId: 'chat', psi: 0.134, status: 'watch', owner: 'Platform Serving — Chat', lastRetrain: '2026-06-12' },
      { id: 'mistral-small-3', name: 'Mistral Small 3', sectorId: 'chat', psi: 0.058, status: 'stable', owner: 'Platform Serving — Chat', lastRetrain: '2026-07-02' },
      // CODE ASSISTANTS
      { id: 'qwen2-5-coder-32b', name: 'Qwen2.5-Coder-32B', sectorId: 'code', psi: 0.291, status: 'breach', owner: 'Platform Serving — Code', lastRetrain: '2026-05-30' },
      { id: 'deepseek-v3', name: 'DeepSeek-V3', sectorId: 'code', psi: 0.152, status: 'watch', owner: 'Platform Serving — Code', lastRetrain: '2026-06-09' },
      // BATCH INFERENCE
      { id: 'mixtral-8x22b', name: 'Mixtral 8x22B', sectorId: 'batch', psi: 0.089, status: 'stable', owner: 'Batch Inference Platform', lastRetrain: '2026-06-20' },
      { id: 'gemma-2-27b', name: 'Gemma 2 27B', sectorId: 'batch', psi: 0.113, status: 'watch', owner: 'Batch Inference Platform', lastRetrain: '2026-06-05' },
      { id: 'phi-4', name: 'Phi-4', sectorId: 'batch', psi: 0.067, status: 'stable', owner: 'Batch Inference Platform', lastRetrain: '2026-06-25' },
      // EMBEDDINGS & RETRIEVAL
      { id: 'bge-m3', name: 'BGE-M3', sectorId: 'embeddings', psi: 0.045, status: 'stable', owner: 'Retrieval Platform', lastRetrain: '2026-07-01' },
      { id: 'nomic-embed-v1-5', name: 'Nomic Embed v1.5', sectorId: 'embeddings', psi: 0.081, status: 'stable', owner: 'Retrieval Platform', lastRetrain: '2026-06-18' },
    ],
  },

  dossier: {
    bandTitle: 'THE DOSSIER',
    bandSub: 'WHY THE SCOPE IS POINTING AT IT',
    trendHeading: 'DRIFT · 90 DAYS VS LIMIT',
    trendChartTitle: 'Qwen2.5-Coder-32B — population stability index, 90 days',
    trendChartSource: 'Daily 30-day-window PSI vs the 0.25 breach limit. Real model, synthetic metrics — illustrative.',
    trendPoints: TREND_POINTS,
    featureHeading: 'FEATURE CONTRIBUTIONS TO DRIFT',
    featureChartTitle: 'Qwen2.5-Coder-32B — feature-level PSI contribution',
    featureChartSource: 'Top six features by contribution to composite PSI. Real model, synthetic metrics — illustrative.',
    featureDrift: [
      { id: 'prompt-len', category: 'prompt_length_tokens', value: 0.079 },
      { id: 'lang-rust', category: 'request_lang_rust_share', value: 0.068 },
      { id: 'multiturn', category: 'multiturn_depth', value: 0.054 },
      { id: 'ctx-util', category: 'context_window_util', value: 0.041 },
      { id: 'sys-prompt', category: 'system_prompt_variant', value: 0.033 },
      { id: 'diff-ratio', category: 'diff_apply_ratio', value: 0.016 },
    ],
    registerHeading: 'REGISTER ENTRY',
    facts: [
      { label: 'MODEL', value: 'Qwen2.5-Coder-32B · served v2.4' },
      { label: 'WEIGHTS', value: 'OPEN-WEIGHT · APACHE-2.0 · HF: Qwen/Qwen2.5-Coder-32B' },
      { label: 'SECTOR', value: 'CODE ASSISTANTS · INLINE + AGENT' },
      { label: 'OWNER', value: 'PLATFORM SERVING — CODE' },
      { label: 'SERVING', value: 'vLLM · 4× H100 · TP=4 · FP8' },
      { label: 'DEPLOYED', value: '2026-03-22' },
      { label: 'LAST REFRESH', value: '2026-05-30 · LoRA refresh QC32-A17' },
      { label: 'BREACH DECLARED', value: '2026-07-13 22:40 · 3RD CONSEC. WINDOW' },
      { label: 'ROOT CAUSE', value: 'UPSTREAM AGENT HARNESS CHANGED PROMPT MIX' },
      { label: 'SLA', value: 'RESTORE ≤ 72 H · 43 H REMAINING' },
      { label: 'ACTION', value: 'ADAPTER RETRAIN QC32-A21 · CANARY 04:00' },
    ],
  },

  log: {
    heading: 'OVERNIGHT LOG',
    listTitle: 'Overnight event log',
    items: [
      { id: 'log-0305', label: 'Scope refresh complete — 10/10 models reporting', status: 'info', description: 'Full fleet telemetry received within the 30-second cadence.', timestamp: '2026-07-15T03:05:00+00:00' },
      { id: 'log-0148', label: 'Qwen2.5-Coder-32B PSI 0.291 — breach persists', status: 'danger', description: 'Third consecutive daily window above the 0.25 limit.', timestamp: '2026-07-15T01:48:00+00:00' },
      { id: 'log-0102', label: 'Root cause: upstream agent harness rev bumped', status: 'warning', description: 'New harness lengthened prompts and raised multi-turn depth.', timestamp: '2026-07-15T01:02:00+00:00' },
      { id: 'log-0037', label: 'Adapter retrain QC32-A21 submitted to queue', status: 'info', description: 'Feature window 2026-06-14 → 2026-07-14; canary at 04:00.', timestamp: '2026-07-15T00:37:00+00:00' },
      { id: 'log-2312', label: 'DeepSeek-V3 holding in watch band — no action', status: 'warning', description: 'PSI 0.152, flat 48 h; monitored, no retrain tonight.', timestamp: '2026-07-14T23:12:00+00:00' },
      { id: 'log-2140', label: 'Feature-store parity check clean', status: 'success', description: 'Nightly reconciliation: 0 divergent features across fleet.', timestamp: '2026-07-14T21:40:00+00:00' },
    ],
  },

  instruments: {
    bandTitle: 'SUPPORTING INSTRUMENTATION',
    bandSub: 'FLEET-LEVEL GAUGES · SUBORDINATE TO THE SCOPE',
    kpiTitle: 'Fleet gauges',
    kpis: [
      { id: 'kpi-envelope', label: 'Models in envelope', value: 9, unit: 'count', target: 10, status: 'at-risk' },
      { id: 'kpi-alerts', label: 'Overnight alerts', value: 4, unit: 'count', status: 'neutral' },
      { id: 'kpi-latency', label: 'Serving p99 (ms)', value: 214, unit: 'count', target: 250, status: 'on-track' },
      { id: 'kpi-gpu', label: 'GPU util, fleet', value: 0.716, unit: 'percent', target: 0.75, status: 'on-track' },
    ],
  },
});

/** Standard alias: the sample fill instance. */
export const SAMPLE_FILL = openmodelCockpitFill;
