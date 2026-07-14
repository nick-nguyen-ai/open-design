/**
 * The MCP-generated sample fill for "The Cutover" world-template — a payments
 * retry pipeline and its Q3 cloud migration.
 *
 * This is the deliverable of the Phase B quality loop (ledger T30): the brief
 * "Explain how our payments retry pipeline works and what changes in the Q3
 * migration — platform engineering audience" was run through the real MCP path
 * (`compose_slide_deck`), which deterministically selected `deck-cloud-migration`
 * (The Cutover). This file is CONTENT ONLY — it carries no geometry: every
 * estate node, rollback node, and edge omits its coordinates and ports, so the
 * template's auto-layout must place everything. That is the point: it proves the
 * content-only contract, that any schema-valid fill yields a composed deck
 * without hand-tuned geometry.
 *
 * Anomaly (verbatim): one estate node is badged `SETTLEMENT LEDGER — STAYS
 * ON-PREM · BOOK OF RECORD 5ms SLA` — the settlement ledger is the legal book of
 * record with a hard posting SLA and data-residency obligation, so it never
 * leaves the data centre. The whole plan is shaped around that fixed point.
 *
 * All systems and figures are a synthetic estate (declared in `deck.notice`).
 * The Zod schema is `.parse`d at module load, so an out-of-contract edit fails
 * loudly wherever this fill is imported.
 */
import { CutoverFill } from '../deck-cloud-migration/cutover-fill.js';

export const sampleFill: CutoverFill = CutoverFill.parse({
  deck: {
    code: 'RETRY-Q3',
    world: 'THE CUTOVER',
    file: 'payments-retry.drawio',
    rev: 'rev 9',
    programme: 'PAYMENTS PLATFORM · Q3 CLOUD MIGRATION',
    editors: 'R. OKORO · M. IQBAL · PAYMENTS PLATFORM',
    notice: 'SYNTHETIC ESTATE — DEMONSTRATION ONLY',
  },

  thesis: {
    line1: 'Move the whole pipeline.',
    line2: 'Except the ledger.',
    standfirst:
      'Six systems in the payments retry pipeline leave the data centre over three weekends. One does not: the settlement ledger stays on-prem — the legal book of record, with a 5ms posting SLA. The whole plan is shaped around that single fixed point.',
  },

  estateNotes: {
    current:
      'Six systems in one data centre, hung off a retry orchestrator that posts every settlement to the ledger. Selected: the ledger — the fixed point.',
    target:
      'Same canvas, moved. The orchestrator refactors into the cloud; the nightly batch poster retires; the ledger stays exactly where it is, on-prem.',
  },

  /**
   * The editorial slide headlines — the deck's voice, one per content slide.
   * The waves headline matches the three waves below; the risk headline matches
   * the single flagged (warning) item in the register.
   */
  headlines: {
    delta: 'Three columns say the whole plan.',
    waves: 'Three weekends, three waves.',
    cutover: 'Cutover night, one path down.',
    sync: 'Nothing cuts over until the data agrees.',
    rollback: 'If it fails, we’re back by morning.',
    risk: 'The risk register, one open item.',
  },

  /**
   * The pipeline on a shared canvas. GEOMETRY OMITTED on every node so the
   * template auto-lays the estate by zone (cloud lane left, on-prem right).
   */
  nodes: [
    { id: 'gateway', label: 'Payment gateway', kind: 'app', zone: 'cloud', disposition: 'rehost' },
    { id: 'orchestrator', label: 'Retry orchestrator', kind: 'app', zone: 'cloud', disposition: 'refactor' },
    { id: 'dlq', label: 'Dead-letter queue', kind: 'integration', zone: 'cloud', disposition: 'replatform' },
    { id: 'scheduler', label: 'Backoff scheduler', kind: 'app', zone: 'cloud', disposition: 'replace' },
    { id: 'recon', label: 'Reconciliation', kind: 'data', zone: 'cloud', disposition: 'replatform' },
    {
      id: 'ledger',
      label: 'Settlement ledger',
      kind: 'data',
      zone: 'onprem',
      disposition: 'stays',
      locked: true,
      badge: 'SETTLEMENT LEDGER — STAYS ON-PREM · BOOK OF RECORD 5ms SLA',
    },
    { id: 'batch', label: 'Nightly batch poster', kind: 'integration', zone: 'cloud', disposition: 'retire' },
  ],

  /** Selection handles land on the ledger (current) and the orchestrator (target). */
  currentFocus: 'ledger',
  targetFocus: 'orchestrator',

  /** Edges carry NO ports — the template derives them from the auto-laid centres. */
  currentEdges: [
    { id: 'e1', from: 'gateway', to: 'orchestrator', label: 'authorize' },
    { id: 'e2', from: 'scheduler', to: 'orchestrator', label: 'retry tick' },
    { id: 'e3', from: 'orchestrator', to: 'ledger', label: 'post · 5ms' },
    { id: 'e4', from: 'orchestrator', to: 'dlq', label: 'exhausted' },
    { id: 'e5', from: 'dlq', to: 'batch', label: 'drain' },
    { id: 'e6', from: 'batch', to: 'recon', label: 'reconcile' },
  ],

  targetEdges: [
    { id: 't1', from: 'gateway', to: 'orchestrator', label: 'authorize' },
    { id: 't2', from: 'scheduler', to: 'orchestrator', label: 'schedule' },
    { id: 't3', from: 'orchestrator', to: 'ledger', label: 'post · 5ms' },
    { id: 't4', from: 'orchestrator', to: 'dlq', label: 'exhausted' },
    { id: 't5', from: 'dlq', to: 'orchestrator', label: 'replay' },
    { id: 't6', from: 'orchestrator', to: 'recon', label: 'stream' },
  ],

  delta: {
    moves: [
      { system: 'Payment gateway', note: 'Rehost to managed containers, no code change.' },
      { system: 'Retry orchestrator', note: 'Refactor into a stateless service as it migrates.' },
      { system: 'Dead-letter queue', note: 'Replatform onto the managed streaming bus.' },
      { system: 'Reconciliation', note: 'Replatform onto the cloud warehouse.' },
    ],
    dies: [
      { system: 'Nightly batch poster', note: 'Retired — replaced by streaming replay from the DLQ.' },
      { system: 'Backoff scheduler', note: 'Replaced by the managed scheduler; cron becomes queues.' },
    ],
    stays: [{ system: 'Settlement ledger', note: 'Stays on-prem. The legal book of record; 5ms posting SLA.' }],
  },

  waves: [
    {
      id: 'w1',
      name: 'Wave 1 · Edge',
      when: 'Weekend 1',
      chips: [
        { label: 'Payment gateway', kind: 'app' },
        { label: 'Dead-letter queue', kind: 'integration' },
      ],
      note: 'Stateless intake, low blast-radius — proves the pipeline and the runbook end to end.',
    },
    {
      id: 'w2',
      name: 'Wave 2 · Core',
      when: 'Weekend 2',
      chips: [
        { label: 'Retry orchestrator', kind: 'app' },
        { label: 'Scheduler → managed', kind: 'app' },
      ],
      note: 'The hard one. The orchestrator moves while it keeps its 5ms posting link back to the ledger.',
    },
    {
      id: 'w3',
      name: 'Wave 3 · Data',
      when: 'Weekend 3',
      chips: [
        { label: 'Reconciliation', kind: 'data' },
        { label: 'Retire batch poster', kind: 'integration' },
      ],
      note: 'Reconciliation replatformed; the nightly batch retires once streaming replay is verified.',
    },
  ],

  cutoverFlow: {
    nodes: [
      { id: 'start', label: 'Maintenance window opens', kind: 'start' },
      { id: 'freeze', label: 'Pause new authorizations', kind: 'process' },
      { id: 'drain', label: 'Drain in-flight retries', kind: 'process' },
      { id: 'replicate', label: 'Replicate DLQ & retry state', kind: 'process' },
      { id: 'switch', label: 'Repoint gateway traffic', kind: 'process' },
      { id: 'validate', label: 'Retry & settlement parity?', kind: 'decision' },
      { id: 'open', label: 'Resume authorizations', kind: 'end' },
      { id: 'rollback', label: 'Roll back to on-prem path', kind: 'end' },
    ],
    edges: [
      { id: 'f1', from: 'start', to: 'freeze' },
      { id: 'f2', from: 'freeze', to: 'drain' },
      { id: 'f3', from: 'drain', to: 'replicate' },
      { id: 'f4', from: 'replicate', to: 'switch' },
      { id: 'f5', from: 'switch', to: 'validate' },
      { id: 'f6', from: 'validate', to: 'open', label: 'pass' },
      { id: 'f7', from: 'validate', to: 'rollback', label: 'fail' },
    ],
  },

  syncPlan: [
    { id: 's1', stage: 'Bulk copy', detail: 'DLQ backlog and retry-state store snapshotted to the target ahead of the window.' },
    { id: 's2', stage: 'Change data capture', detail: 'CDC streams retry-state deltas until source authorizations are paused.' },
    { id: 's3', stage: 'Reconcile', detail: 'Settled totals matched against the on-prem ledger, source vs target.' },
    { id: 's4', stage: 'Shadow post', detail: 'Target posts to the ledger in shadow; every result diffed for a full week.' },
    { id: 's5', stage: 'Sign-off', detail: 'Zero unexplained settlement diffs for 72h before live traffic cuts over.' },
  ],

  rollback: {
    nodes: [
      { id: 'r0', label: 'Validation gate', tone: 'root' },
      { id: 'r1', label: 'Pass → resume authorizations', tone: 'ok' },
      { id: 'r2', label: 'Fail → pause target', tone: 'abort' },
      { id: 'r3', label: 'Repoint gateway to on-prem', tone: 'abort' },
      { id: 'r4', label: 'Resume on-prem retry path', tone: 'abort' },
    ],
    edges: [
      { from: 'r0', to: 'r1' },
      { from: 'r0', to: 'r2' },
      { from: 'r2', to: 'r3' },
      { from: 'r3', to: 'r4' },
    ],
    note: 'Rollback is bounded to the maintenance window: the on-prem retry path is never more than a frozen delta behind, so a failed gate returns payments to the old pipeline inside the same night.',
  },

  risks: [
    {
      id: 'rk-latency',
      label: 'Cross-link latency to the ledger',
      status: 'warning',
      description:
        'The orchestrator in cloud must still post to the on-prem ledger within 5ms. A dedicated low-latency link is provisioned and measured under peak retry load, not assumed.',
    },
    {
      id: 'rk-dupes',
      label: 'Duplicate settlement on retry',
      status: 'info',
      description:
        'Idempotency keys are carried end to end; DLQ replay is exactly-once against the ledger, verified by the week-long shadow-post diff before any cutover.',
    },
    {
      id: 'rk-window',
      label: 'Window overrun',
      status: 'success',
      description: 'Each wave is rehearsed end to end in staging; the runbook is timed with 40% headroom.',
    },
    {
      id: 'rk-rollback',
      label: 'Rollback confidence',
      status: 'success',
      description: 'Rollback executed cleanly in two rehearsals; the gateway repoint and pause steps are automated and timed.',
    },
  ],

  signoff: {
    title: 'Ready to sign rev 9.',
    detail:
      'The pipeline moves around one fixed point: the settlement ledger stays on-prem. Three waves, one rehearsed cutover runbook, one bounded rollback. What we need from this review:',
    approvals: [
      { role: 'Platform', decision: 'Approve the three-weekend wave schedule.' },
      { role: 'Payments risk', decision: 'Confirm the ledger stays on-prem at the 5ms posting SLA.' },
      { role: 'Change board', decision: 'Grant the three maintenance windows.' },
    ],
  },
});
