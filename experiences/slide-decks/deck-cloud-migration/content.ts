/**
 * The shipped fill for "The Cutover" — the first {@link CutoverFill} instance.
 *
 * THE WORLD: a cloud-migration plan rendered as a draw.io working file. A flat
 * diagram-tool canvas (faint dot-grid), precise ORTHOGONAL connectors with port
 * dots, pastel-filled rounded system boxes with type badges, a layers legend
 * chip in the chrome, and draw.io selection handles on the focus node of each
 * slide. The idiom is EXACT geometry — perfectly straight strokes, the
 * anti-excalidraw. All the craft lives in `CutoverTemplate.tsx`; this file
 * carries only the CONTENT, validated against the `CutoverFill` schema at load,
 * so the shipped deck is itself a proof that the contract admits the real design.
 *
 * Anomaly (verbatim): one estate node is badged `MAINFRAME LEDGER — STAYS
 * ON-PREM · LATENCY SLA 4ms` — the single box that never moves, drawn with a
 * padlock glyph and a heavier stroke, in the SAME place on both the current and
 * the target estate diagram.
 *
 * All systems and figures are a synthetic estate (declared in `deck.notice`).
 */
import { CutoverFill } from './cutover-fill.js';

export const cutoverFill: CutoverFill = CutoverFill.parse({
  deck: {
    code: 'CUTOVER-06',
    world: 'THE CUTOVER',
    file: 'cutover-plan.drawio',
    rev: 'rev 14',
    programme: 'CORE BANKING · CLOUD MIGRATION',
    editors: 'A. VOSS · L. CHEN · PLATFORM',
    notice: 'SYNTHETIC ESTATE — DEMONSTRATION ONLY',
  },

  thesis: {
    line1: 'Move everything.',
    line2: 'Except one box.',
    standfirst:
      'Seven systems leave the data centre over three weekends. One does not: the mainframe ledger stays on-prem, because a four-millisecond posting SLA does not survive the trip. The whole plan is shaped around that single fixed point.',
  },

  /** The estate on a shared canvas — two layouts (current cx/cy, target tx/ty). */
  nodes: [
    { id: 'portal', label: 'Customer portal', kind: 'app', zone: 'cloud', disposition: 'rehost', cx: 60, cy: 40, tx: 60, ty: 40 },
    { id: 'auth', label: 'Auth service', kind: 'app', zone: 'cloud', disposition: 'replace', cx: 60, cy: 250, tx: 60, ty: 250 },
    { id: 'core', label: 'Core banking', kind: 'app', zone: 'cloud', disposition: 'refactor', cx: 360, cy: 145, tx: 330, ty: 145 },
    { id: 'etl', label: 'Batch ETL', kind: 'integration', zone: 'cloud', disposition: 'retire', cx: 360, cy: 360, tx: 330, ty: 380 },
    { id: 'gateway', label: 'File gateway', kind: 'integration', zone: 'cloud', disposition: 'rehost', cx: 60, cy: 450, tx: 60, ty: 450 },
    {
      id: 'ledger',
      label: 'Mainframe ledger',
      kind: 'data',
      zone: 'onprem',
      disposition: 'stays',
      cx: 700,
      cy: 145,
      tx: 700,
      ty: 145,
      locked: true,
      badge: 'MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms',
    },
    { id: 'reporting', label: 'Reporting DB', kind: 'data', zone: 'cloud', disposition: 'replatform', cx: 700, cy: 360, tx: 640, ty: 360 },
  ],

  /** draw.io selection handles land on the ledger (current) and the core (target). */
  currentFocus: 'ledger',
  targetFocus: 'core',

  currentEdges: [
    { id: 'e1', from: 'portal', to: 'core', fromSide: 'r', toSide: 'l', label: 'https' },
    { id: 'e2', from: 'auth', to: 'core', fromSide: 'r', toSide: 'l', label: 'oauth' },
    { id: 'e3', from: 'core', to: 'ledger', fromSide: 'r', toSide: 'l', label: 'sql · 4ms' },
    { id: 'e4', from: 'core', to: 'etl', fromSide: 'b', toSide: 't', label: 'nightly' },
    { id: 'e5', from: 'etl', to: 'reporting', fromSide: 'r', toSide: 'l', label: 'load' },
    { id: 'e6', from: 'gateway', to: 'etl', fromSide: 'r', toSide: 'l', label: 'sftp' },
  ],

  targetEdges: [
    { id: 't1', from: 'portal', to: 'core', fromSide: 'r', toSide: 'l', label: 'https' },
    { id: 't2', from: 'auth', to: 'core', fromSide: 'r', toSide: 'l', label: 'oidc' },
    { id: 't3', from: 'core', to: 'ledger', fromSide: 'r', toSide: 'l', label: 'sql · 4ms' },
    { id: 't4', from: 'core', to: 'reporting', fromSide: 'b', toSide: 't', label: 'stream' },
    { id: 't5', from: 'gateway', to: 'core', fromSide: 'r', toSide: 'l', label: 'events' },
  ],

  delta: {
    moves: [
      { system: 'Customer portal', note: 'Rehost to managed containers, same code.' },
      { system: 'Core banking', note: 'Refactor into services as it migrates.' },
      { system: 'Reporting DB', note: 'Replatform to the cloud warehouse.' },
      { system: 'File gateway', note: 'Rehost; SFTP fronted by an event bus.' },
    ],
    dies: [
      { system: 'Batch ETL', note: 'Retired — replaced by streaming from core.' },
      { system: 'Legacy auth', note: 'Replaced by managed identity (OIDC).' },
    ],
    stays: [{ system: 'Mainframe ledger', note: 'Stays on-prem. 4ms posting SLA is non-negotiable.' }],
  },

  waves: [
    {
      id: 'w1',
      name: 'Wave 1 · Edge',
      when: 'Weekend 1',
      chips: [
        { label: 'Customer portal', kind: 'app' },
        { label: 'File gateway', kind: 'integration' },
      ],
      note: 'Stateless, low blast-radius — proves the pipeline and the runbook.',
    },
    {
      id: 'w2',
      name: 'Wave 2 · Core',
      when: 'Weekend 2',
      chips: [
        { label: 'Core banking', kind: 'app' },
        { label: 'Auth → managed identity', kind: 'app' },
      ],
      note: 'The hard one. Core moves while it keeps its 4ms link back to the ledger.',
    },
    {
      id: 'w3',
      name: 'Wave 3 · Data',
      when: 'Weekend 3',
      chips: [
        { label: 'Reporting DB', kind: 'data' },
        { label: 'Retire Batch ETL', kind: 'integration' },
      ],
      note: 'Reporting replatformed; batch retired once streaming is verified.',
    },
  ],

  cutoverFlow: {
    nodes: [
      { id: 'start', label: 'Maintenance window opens', kind: 'start' },
      { id: 'freeze', label: 'Freeze writes at source', kind: 'process' },
      { id: 'replicate', label: 'Final delta replication', kind: 'process' },
      { id: 'switch', label: 'Repoint DNS & traffic', kind: 'process' },
      { id: 'validate', label: 'Validation suite passes?', kind: 'decision' },
      { id: 'open', label: 'Open to customers', kind: 'end' },
      { id: 'rollback', label: 'Roll back to source', kind: 'end' },
    ],
    edges: [
      { id: 'f1', from: 'start', to: 'freeze' },
      { id: 'f2', from: 'freeze', to: 'replicate' },
      { id: 'f3', from: 'replicate', to: 'switch' },
      { id: 'f4', from: 'switch', to: 'validate' },
      { id: 'f5', from: 'validate', to: 'open', label: 'pass' },
      { id: 'f6', from: 'validate', to: 'rollback', label: 'fail' },
    ],
  },

  syncPlan: [
    { id: 's1', stage: 'Bulk copy', detail: 'Full snapshot restored to the target ahead of the window.' },
    { id: 's2', stage: 'Change data capture', detail: 'CDC streams deltas until the source is frozen.' },
    { id: 's3', stage: 'Reconcile', detail: 'Row counts and control totals matched, source vs target.' },
    { id: 's4', stage: 'Shadow read', detail: 'Target serves reads in parallel; results diffed for a week.' },
    { id: 's5', stage: 'Sign-off', detail: 'Zero unexplained diffs for 72h before writes cut over.' },
  ],

  rollback: {
    nodes: [
      { id: 'r0', label: 'Validation gate', x: 420, y: 30, tone: 'root' },
      { id: 'r1', label: 'Pass → open to customers', x: 120, y: 170, tone: 'ok' },
      { id: 'r2', label: 'Fail → freeze target', x: 620, y: 170, tone: 'abort' },
      { id: 'r3', label: 'DNS back to source', x: 620, y: 270, tone: 'abort' },
      { id: 'r4', label: 'Unfreeze source writes', x: 620, y: 340, tone: 'abort' },
    ],
    edges: [
      { from: 'r0', to: 'r1' },
      { from: 'r0', to: 'r2' },
      { from: 'r2', to: 'r3' },
      { from: 'r3', to: 'r4' },
    ],
    note: 'Rollback is bounded to the maintenance window: if validation fails, source is never more than a frozen delta behind, so we are back on the old estate inside the same night.',
  },

  risks: [
    {
      id: 'rk-latency',
      label: 'Cross-link latency to the ledger',
      status: 'warning',
      description: 'Core in cloud must still post to the on-prem ledger within 4ms. Dedicated low-latency link provisioned; measured, not assumed.',
    },
    {
      id: 'rk-data',
      label: 'Data reconciliation gaps',
      status: 'info',
      description: 'Shadow-read diffing runs a full week before any write cutover; any unexplained diff halts the wave.',
    },
    {
      id: 'rk-window',
      label: 'Window overrun',
      status: 'success',
      description: 'Each wave rehearsed end to end in staging; runbook timed with 40% headroom.',
    },
    {
      id: 'rk-rollback',
      label: 'Rollback confidence',
      status: 'success',
      description: 'Rollback executed in two rehearsals; DNS and freeze steps automated and timed.',
    },
  ],

  signoff: {
    title: 'Ready to sign rev 14.',
    detail:
      'The plan holds one fixed point and moves everything else around it. Three waves, one rehearsed cutover runbook, one bounded rollback. What we need from this review:',
    approvals: [
      { role: 'Platform', decision: 'Approve the three-weekend wave schedule.' },
      { role: 'Data & risk', decision: 'Confirm the ledger stays on-prem at 4ms SLA.' },
      { role: 'Change board', decision: 'Grant the three maintenance windows.' },
    ],
  },
});
