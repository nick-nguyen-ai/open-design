/**
 * Content pack for "The Cutover" — the live rendering of
 * `deck-cloud-migration`.
 *
 * THE WORLD: a cloud-migration plan rendered as a draw.io working file. A flat
 * diagram-tool canvas (faint dot-grid), precise ORTHOGONAL connectors with port
 * dots, pastel-filled rounded system boxes with type badges, a layers legend
 * chip in the chrome, and draw.io selection handles on the "current focus" node
 * of each slide. The idiom is EXACT geometry — perfectly straight strokes, the
 * anti-excalidraw — distinct from The Sectional (cyanotype) and the Drawing
 * Office (drafting linework).
 *
 * Anomaly: one estate node is badged `MAINFRAME LEDGER — STAYS ON-PREM · LATENCY
 * SLA 4ms` — the single box that never moves, drawn with a padlock glyph and a
 * heavier stroke. It sits in the SAME place on both the current and the target
 * estate diagram.
 *
 * All systems and figures are a synthetic estate (declared in DECK.dataNotice).
 */
import type { StatusListItemDatum } from '@enterprise-design/content-components';
import type { FlowDiagramData } from '@enterprise-design/diagrams';

export const DECK = {
  code: 'CUTOVER-06',
  world: 'THE CUTOVER',
  file: 'cutover-plan.drawio',
  rev: 'rev 14',
  programme: 'CORE BANKING · CLOUD MIGRATION',
  editors: 'A. VOSS · L. CHEN · PLATFORM',
  dataNotice: 'SYNTHETIC ESTATE — DEMONSTRATION ONLY',
  keyboardHint: '← → NAVIGATE · HOME/END',
} as const;

/* ------------------------------------------------------------------ */
/* Estate model — nodes on a shared canvas, two layouts                */
/* ------------------------------------------------------------------ */

export type NodeKind = 'app' | 'data' | 'integration';
export type Disposition = 'rehost' | 'refactor' | 'replatform' | 'replace' | 'retire' | 'stays';

export interface EstateNode {
  id: string;
  label: string;
  kind: NodeKind;
  /** current-estate top-left */
  cx: number;
  cy: number;
  /** target-estate top-left */
  tx: number;
  ty: number;
  disposition: Disposition;
  /** the mainframe-ledger anomaly: locked, never moves */
  locked?: boolean;
  badge?: string;
}

export const NODE_W = 176;
export const NODE_H = 62;
export const ESTATE_VIEW = '0 0 1020 560';

export const NODES: readonly EstateNode[] = [
  { id: 'portal', label: 'Customer portal', kind: 'app', cx: 60, cy: 40, tx: 60, ty: 40, disposition: 'rehost' },
  { id: 'auth', label: 'Auth service', kind: 'app', cx: 60, cy: 250, tx: 60, ty: 250, disposition: 'replace' },
  { id: 'core', label: 'Core banking', kind: 'app', cx: 360, cy: 145, tx: 330, ty: 145, disposition: 'refactor' },
  { id: 'etl', label: 'Batch ETL', kind: 'integration', cx: 360, cy: 360, tx: 330, ty: 380, disposition: 'retire' },
  { id: 'gateway', label: 'File gateway', kind: 'integration', cx: 60, cy: 450, tx: 60, ty: 450, disposition: 'rehost' },
  {
    id: 'ledger',
    label: 'Mainframe ledger',
    kind: 'data',
    cx: 700,
    cy: 145,
    tx: 700,
    ty: 145,
    disposition: 'stays',
    locked: true,
    badge: 'MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms',
  },
  { id: 'reporting', label: 'Reporting DB', kind: 'data', cx: 700, cy: 360, tx: 640, ty: 360, disposition: 'replatform' },
];

export const ANOMALY_TEXT = 'MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms';
export const CURRENT_SLIDE_NUMBER = 2;
export const TARGET_SLIDE_NUMBER = 3;

/* ------------------------------------------------------------------ */
/* Orthogonal connector routing (exact, straight — draw.io idiom)      */
/* ------------------------------------------------------------------ */

type Side = 'l' | 'r' | 't' | 'b';
interface Box {
  x: number;
  y: number;
}
function port(box: Box, side: Side): readonly [number, number] {
  switch (side) {
    case 'l':
      return [box.x, box.y + NODE_H / 2];
    case 'r':
      return [box.x + NODE_W, box.y + NODE_H / 2];
    case 't':
      return [box.x + NODE_W / 2, box.y];
    case 'b':
      return [box.x + NODE_W / 2, box.y + NODE_H];
  }
}

/** An orthogonal path between two ports, one mid-bend (Z or L). */
function orth(p1: readonly [number, number], s1: Side, p2: readonly [number, number]): string {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  if (s1 === 'r' || s1 === 'l') {
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
}

export interface Connector {
  id: string;
  from: string;
  to: string;
  fromSide: Side;
  toSide: Side;
  label?: string;
}

const CURRENT_EDGES: readonly Connector[] = [
  { id: 'e1', from: 'portal', to: 'core', fromSide: 'r', toSide: 'l', label: 'https' },
  { id: 'e2', from: 'auth', to: 'core', fromSide: 'r', toSide: 'l', label: 'oauth' },
  { id: 'e3', from: 'core', to: 'ledger', fromSide: 'r', toSide: 'l', label: 'sql · 4ms' },
  { id: 'e4', from: 'core', to: 'etl', fromSide: 'b', toSide: 't', label: 'nightly' },
  { id: 'e5', from: 'etl', to: 'reporting', fromSide: 'r', toSide: 'l', label: 'load' },
  { id: 'e6', from: 'gateway', to: 'etl', fromSide: 'r', toSide: 'l', label: 'sftp' },
];

const TARGET_EDGES: readonly Connector[] = [
  { id: 't1', from: 'portal', to: 'core', fromSide: 'r', toSide: 'l', label: 'https' },
  { id: 't2', from: 'auth', to: 'core', fromSide: 'r', toSide: 'l', label: 'oidc' },
  { id: 't3', from: 'core', to: 'ledger', fromSide: 'r', toSide: 'l', label: 'sql · 4ms' },
  { id: 't4', from: 'core', to: 'reporting', fromSide: 'b', toSide: 't', label: 'stream' },
  { id: 't5', from: 'gateway', to: 'core', fromSide: 'r', toSide: 'l', label: 'events' },
];

function buildConnectors(edges: readonly Connector[], layout: 'current' | 'target') {
  const byId = new Map(NODES.map((n) => [n.id, n]));
  return edges.map((e) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const boxA: Box = layout === 'current' ? { x: a.cx, y: a.cy } : { x: a.tx, y: a.ty };
    const boxB: Box = layout === 'current' ? { x: b.cx, y: b.cy } : { x: b.tx, y: b.ty };
    const pA = port(boxA, e.fromSide);
    const pB = port(boxB, e.toSide);
    return { ...e, d: orth(pA, e.fromSide, pB), p1: pA, p2: pB };
  });
}

export const CURRENT_CONNECTORS = buildConnectors(CURRENT_EDGES, 'current');
export const TARGET_CONNECTORS = buildConnectors(TARGET_EDGES, 'target');

/** The on-prem zone box that surrounds the locked ledger in the target estate. */
export const ONPREM_ZONE = { x: 676, y: 116, w: 224, h: 122 } as const;

/* ------------------------------------------------------------------ */
/* Disposition labels                                                  */
/* ------------------------------------------------------------------ */

export const DISPOSITION_LABEL: Record<Disposition, string> = {
  rehost: 'REHOST',
  refactor: 'REFACTOR',
  replatform: 'REPLATFORM',
  replace: 'REPLACE',
  retire: 'RETIRE',
  stays: 'STAYS',
};

/** Focus node per estate slide — draw.io selection handles land on it. */
export const CURRENT_FOCUS = 'ledger';
export const TARGET_FOCUS = 'core';

/* ------------------------------------------------------------------ */
/* Estate zones — the accessible mirror groups each diagram by zone     */
/* ------------------------------------------------------------------ */

/**
 * The two diagrams differ by WHERE each system lives, not just by
 * disposition. The current estate is one on-prem data centre; the target
 * estate splits into a cloud landing zone plus the on-prem zone that keeps
 * the locked ledger (the `ONPREM_ZONE` box drawn on the target slide). The
 * accessible mirror is grouped by that same zone level, so a screen-reader
 * user reads a TRUE mirror of each diagram — the current mirror places a
 * system on-prem that the target mirror places in the cloud.
 */
export type Zone = 'onprem' | 'cloud';

export const ZONE_LABEL: Record<Zone, string> = {
  onprem: 'On-prem data centre',
  cloud: 'Cloud landing zone',
};

/** Zone of a node per estate: current is all on-prem; target moves all but the locked ledger to cloud. */
function zoneOf(node: EstateNode, layout: 'current' | 'target'): Zone {
  if (layout === 'current') return 'onprem';
  return node.locked ? 'onprem' : 'cloud';
}

export interface EstateMirrorSystem {
  id: string;
  label: string;
  kind: NodeKind;
  disposition: Disposition;
  locked?: boolean;
}

export interface EstateMirrorZone {
  zone: Zone;
  label: string;
  systems: readonly EstateMirrorSystem[];
}

function buildEstateMirror(layout: 'current' | 'target'): readonly EstateMirrorZone[] {
  const order: readonly Zone[] = ['onprem', 'cloud'];
  return order
    .map((zone) => ({
      zone,
      label: ZONE_LABEL[zone],
      systems: NODES.filter((n) => zoneOf(n, layout) === zone).map((n) => ({
        id: n.id,
        label: n.label,
        kind: n.kind,
        disposition: n.disposition,
        locked: n.locked,
      })),
    }))
    .filter((g) => g.systems.length > 0);
}

/** Current estate: one on-prem zone holding every system. */
export const CURRENT_ESTATE_MIRROR = buildEstateMirror('current');
/** Target estate: cloud landing zone + the on-prem zone that keeps the locked ledger. */
export const TARGET_ESTATE_MIRROR = buildEstateMirror('target');

/* ------------------------------------------------------------------ */
/* Title / thesis                                                      */
/* ------------------------------------------------------------------ */

export const THESIS = {
  line1: 'Move everything.',
  line2: 'Except one box.',
  standfirst:
    'Seven systems leave the data centre over three weekends. One does not: the mainframe ledger stays on-prem, because a four-millisecond posting SLA does not survive the trip. The whole plan is shaped around that single fixed point.',
} as const;

/* ------------------------------------------------------------------ */
/* The delta — what moves, what dies, what stays                       */
/* ------------------------------------------------------------------ */

export interface DeltaItem {
  system: string;
  note: string;
}
export const DELTA_MOVES: readonly DeltaItem[] = [
  { system: 'Customer portal', note: 'Rehost to managed containers, same code.' },
  { system: 'Core banking', note: 'Refactor into services as it migrates.' },
  { system: 'Reporting DB', note: 'Replatform to the cloud warehouse.' },
  { system: 'File gateway', note: 'Rehost; SFTP fronted by an event bus.' },
];
export const DELTA_DIES: readonly DeltaItem[] = [
  { system: 'Batch ETL', note: 'Retired — replaced by streaming from core.' },
  { system: 'Legacy auth', note: 'Replaced by managed identity (OIDC).' },
];
export const DELTA_STAYS: readonly DeltaItem[] = [
  { system: 'Mainframe ledger', note: 'Stays on-prem. 4ms posting SLA is non-negotiable.' },
];

/* ------------------------------------------------------------------ */
/* Migration waves — swimlane                                          */
/* ------------------------------------------------------------------ */

export interface Wave {
  id: string;
  name: string;
  when: string;
  chips: readonly { label: string; kind: NodeKind }[];
  note: string;
}
export const WAVES: readonly Wave[] = [
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
];

/* ------------------------------------------------------------------ */
/* Cutover night — comp.flow-diagram                                   */
/* ------------------------------------------------------------------ */

export const CUTOVER_FLOW: FlowDiagramData = {
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
};
export const CUTOVER_SLIDE_NUMBER = 6;

/* ------------------------------------------------------------------ */
/* Data sync & validation plan                                         */
/* ------------------------------------------------------------------ */

export interface SyncLine {
  id: string;
  stage: string;
  detail: string;
}
export const SYNC_PLAN: readonly SyncLine[] = [
  { id: 's1', stage: 'Bulk copy', detail: 'Full snapshot restored to the target ahead of the window.' },
  { id: 's2', stage: 'Change data capture', detail: 'CDC streams deltas until the source is frozen.' },
  { id: 's3', stage: 'Reconcile', detail: 'Row counts and control totals matched, source vs target.' },
  { id: 's4', stage: 'Shadow read', detail: 'Target serves reads in parallel; results diffed for a week.' },
  { id: 's5', stage: 'Sign-off', detail: 'Zero unexplained diffs for 72h before writes cut over.' },
];

/* ------------------------------------------------------------------ */
/* Rollback tree (bespoke small SVG tree)                              */
/* ------------------------------------------------------------------ */

export interface RollbackNode {
  id: string;
  label: string;
  x: number;
  y: number;
  tone: 'root' | 'ok' | 'abort';
}
export const ROLLBACK_VIEW = '0 0 1000 360';
export const ROLLBACK_NODES: readonly RollbackNode[] = [
  { id: 'r0', label: 'Validation gate', x: 420, y: 30, tone: 'root' },
  { id: 'r1', label: 'Pass → open to customers', x: 120, y: 170, tone: 'ok' },
  { id: 'r2', label: 'Fail → freeze target', x: 620, y: 170, tone: 'abort' },
  { id: 'r3', label: 'DNS back to source', x: 620, y: 270, tone: 'abort' },
  { id: 'r4', label: 'Unfreeze source writes', x: 620, y: 340, tone: 'abort' },
];
export const ROLLBACK_EDGES: readonly { from: string; to: string }[] = [
  { from: 'r0', to: 'r1' },
  { from: 'r0', to: 'r2' },
  { from: 'r2', to: 'r3' },
  { from: 'r3', to: 'r4' },
];
export const ROLLBACK_NOTE =
  'Rollback is bounded to the maintenance window: if validation fails, source is never more than a frozen delta behind, so we are back on the old estate inside the same night.';

/* ------------------------------------------------------------------ */
/* Risk register — comp.status-list                                    */
/* ------------------------------------------------------------------ */

export const RISKS: readonly StatusListItemDatum[] = [
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
];
export const RISK_SLIDE_NUMBER = 9;

/* ------------------------------------------------------------------ */
/* Closing — rev sign-off                                              */
/* ------------------------------------------------------------------ */

export const SIGNOFF = {
  title: 'Ready to sign rev 14.',
  detail:
    'The plan holds one fixed point and moves everything else around it. Three waves, one rehearsed cutover runbook, one bounded rollback. What we need from this review:',
  approvals: [
    { role: 'Platform', decision: 'Approve the three-weekend wave schedule.' },
    { role: 'Data & risk', decision: 'Confirm the ledger stays on-prem at 4ms SLA.' },
    { role: 'Change board', decision: 'Grant the three maintenance windows.' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                         */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'current'
  | 'target'
  | 'delta'
  | 'waves'
  | 'cutover'
  | 'sync'
  | 'rollback'
  | 'risk'
  | 'closing';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Cutover plan', kicker: 'CLOUD MIGRATION' },
  { id: 'current', kind: 'current', section: 'Current estate', kicker: '01 · CURRENT ESTATE' },
  { id: 'target', kind: 'target', section: 'Target estate', kicker: '02 · TARGET ESTATE' },
  { id: 'delta', kind: 'delta', section: 'The delta', kicker: '03 · MOVES / DIES / STAYS' },
  { id: 'waves', kind: 'waves', section: 'Migration waves', kicker: '04 · WAVES' },
  { id: 'cutover', kind: 'cutover', section: 'Cutover night', kicker: '05 · CUTOVER SEQUENCE' },
  { id: 'sync', kind: 'sync', section: 'Data sync', kicker: '06 · SYNC & VALIDATION' },
  { id: 'rollback', kind: 'rollback', section: 'Rollback', kicker: '07 · ROLLBACK TREE' },
  { id: 'risk', kind: 'risk', section: 'Risk register', kicker: '08 · RISK REGISTER' },
  { id: 'closing', kind: 'closing', section: 'Sign-off', kicker: '09 · REV SIGN-OFF' },
];

export const SLIDE_COUNT = SLIDES.length;
