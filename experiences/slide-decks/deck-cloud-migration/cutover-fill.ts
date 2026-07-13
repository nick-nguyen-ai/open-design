/**
 * The typed **fill** for "The Cutover" world-template.
 *
 * The template (`CutoverTemplate.tsx`) carries the whole craft — the draw.io
 * working-file idiom (dot-grid canvas, exact orthogonal connectors with port
 * dots, pastel system boxes with type badges, selection handles on the focus
 * node), the swimlane waves, the flow-diagram cutover sequence, the bespoke
 * rollback tree, the motion, and the chrome. This file carries only the CONTENT
 * contract: a Zod schema whose limits are derived from the shipped instance's
 * real magnitudes plus ~30% headroom, so that ANY schema-valid fill still yields
 * a composed, non-broken deck (the shared estate canvas stays legible, the
 * swimlanes and tables stay balanced, headlines never overflow).
 *
 * Two craft slots are mandatory: exactly one estate node carries the `stays`
 * anomaly disposition — padlocked, heavier-stroked, in the same place on both the
 * current and target estate, its badge the verbatim anomaly text — and the
 * synthetic-estate notice string.
 *
 * `CUTOVER_SLIDE_KINDS` re-states the same slots as the registry-serializable
 * `SlideKindSpec[]` the world-template descriptor advertises.
 */
import { z } from 'zod';
import type { SlideKindSpec } from '@enterprise-design/contracts';

const NodeKind = z.enum(['app', 'data', 'integration']);
const Disposition = z.enum(['rehost', 'refactor', 'replatform', 'replace', 'retire', 'stays']);
const Zone = z.enum(['onprem', 'cloud']);
const Side = z.enum(['l', 'r', 't', 'b']);
const FlowNodeKind = z.enum(['start', 'process', 'decision', 'end', 'data']);
const StatusKind = z.enum(['success', 'warning', 'danger', 'info', 'neutral']);
const RollbackTone = z.enum(['root', 'ok', 'abort']);

/* ------------------------------------------------------------------ */
/* Canvas bounds for OPTIONAL authored geometry                        */
/*                                                                     */
/* Estate node coords (cx/cy/tx/ty) and rollback node coords (x/y) are */
/* optional: when omitted the template auto-lays the node (by zone for */
/* the estate, by depth for the rollback tree). When PRESENT they are  */
/* bounded to the template canvases minus the node footprint so an     */
/* authored node can never render off-canvas. Values mirror the        */
/* template-fixed canvases in CutoverTemplate.tsx.                     */
/* ------------------------------------------------------------------ */

const ESTATE_CANVAS = { w: 1020, h: 560 } as const;
const ROLLBACK_CANVAS = { w: 1000, h: 360 } as const;
const NODE_W = 176;
const NODE_H = 62;

/** Estate node top-left: keeps the whole 176×62 box on the 1020×560 canvas. */
const estateX = z.number().min(0).max(ESTATE_CANVAS.w - NODE_W);
const estateY = z.number().min(0).max(ESTATE_CANVAS.h - NODE_H);
/** Rollback node is anchored at its centre-x; keep the anchor on the canvas. */
const rollbackX = z.number().min(0).max(ROLLBACK_CANVAS.w);
const rollbackY = z.number().min(0).max(ROLLBACK_CANVAS.h);

/* ------------------------------------------------------------------ */
/* Fill schema — content slots only                                    */
/* ------------------------------------------------------------------ */

/** Deck meta — the draw.io file header, the chrome, and the required notice. */
const DeckMeta = z.object({
  code: z.string().min(1).max(24),
  world: z.string().min(1).max(24),
  file: z.string().min(1).max(32),
  rev: z.string().min(1).max(16),
  programme: z.string().min(1).max(44),
  editors: z.string().min(1).max(44),
  /** REQUIRED craft slot: the synthetic-estate notice printed on every slide foot. */
  notice: z.string().min(1).max(52),
});

/**
 * `cx/cy` is its current-estate top-left, `tx/ty` its target-estate top-left.
 * The geometry is OPTIONAL: authored coords reproduce an exact draw.io working
 * file (bounded so a node can never render off-canvas); when a node omits its
 * coords for an estate the template auto-lays it by zone. `zone` is its
 * TARGET-estate placement — the current estate is one on-prem data centre, so
 * the accessible mirror reads current as all-on-prem and target by this field.
 * Exactly one node is the `stays` anomaly: `locked` with a `badge`.
 */
const EstateNode = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(28),
  kind: NodeKind,
  zone: Zone,
  disposition: Disposition,
  cx: estateX.optional(),
  cy: estateY.optional(),
  tx: estateX.optional(),
  ty: estateY.optional(),
  locked: z.boolean().optional(),
  badge: z.string().min(1).max(64).optional(),
});

/**
 * An orthogonal connector: its wire label and, OPTIONALLY, which ports it leaves
 * and enters. When a side is omitted the template derives it from the two node
 * centres (dominant axis → facing sides).
 */
const EstateEdge = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  fromSide: Side.optional(),
  toSide: Side.optional(),
  label: z.string().min(1).max(16).optional(),
});

const WaveChip = z.object({
  label: z.string().min(1).max(32),
  kind: NodeKind,
});

const Wave = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(24),
  when: z.string().min(1).max(16),
  chips: z.array(WaveChip).min(1).max(4),
  note: z.string().min(1).max(120),
});

const FlowNode = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(40),
  kind: FlowNodeKind,
});

const FlowEdge = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().min(1).max(16).optional(),
});

const SyncLine = z.object({
  id: z.string().min(1),
  stage: z.string().min(1).max(32),
  detail: z.string().min(1).max(120),
});

const RollbackNode = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(40),
  /** OPTIONAL: authored coords (bounded to the tree canvas) or template-laid by depth. */
  x: rollbackX.optional(),
  y: rollbackY.optional(),
  tone: RollbackTone,
});

const RollbackEdge = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
});

const RiskItem = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(44),
  status: StatusKind,
  description: z.string().min(1).max(220).optional(),
});

const DeltaItem = z.object({
  system: z.string().min(1).max(28),
  note: z.string().min(1).max(90),
});

const Approval = z.object({
  role: z.string().min(1).max(24),
  decision: z.string().min(1).max(90),
});

export const CutoverFill = z
  .object({
    deck: DeckMeta,
    thesis: z.object({
      line1: z.string().min(1).max(32),
      line2: z.string().min(1).max(32),
      standfirst: z.string().min(1).max(260),
    }),
    /**
     * The one-line captions under each estate diagram — the estate story, not
     * template craft. `current` frames what the estate is today; `target` frames
     * what changes after the move. Each wraps naturally under the canvas.
     */
    estateNotes: z.object({
      current: z.string().min(1).max(180),
      target: z.string().min(1).max(180),
    }),
    /**
     * The estate systems on the shared canvas. Exactly one carries the `stays`
     * anomaly disposition (padlocked, its badge the verbatim anomaly text). The
     * count is bounded so both the current and target diagrams stay composed.
     */
    nodes: z
      .array(EstateNode)
      .min(5)
      .max(9)
      .refine((rows) => rows.filter((n) => n.disposition === 'stays').length === 1, {
        message: 'Exactly one estate node must carry the "stays" anomaly disposition.',
      })
      .refine(
        (rows) => {
          const stays = rows.find((n) => n.disposition === 'stays');
          return stays ? stays.locked === true && typeof stays.badge === 'string' : false;
        },
        { message: 'The stays node must be locked and carry the anomaly badge text.' },
      ),
    /** Node id given draw.io selection handles on the current estate slide. */
    currentFocus: z.string().min(1).max(40),
    /** Node id given draw.io selection handles on the target estate slide. */
    targetFocus: z.string().min(1).max(40),
    currentEdges: z.array(EstateEdge).min(4).max(10),
    targetEdges: z.array(EstateEdge).min(4).max(10),
    delta: z.object({
      moves: z.array(DeltaItem).min(1).max(6),
      dies: z.array(DeltaItem).min(1).max(4),
      stays: z.array(DeltaItem).min(1).max(3),
    }),
    waves: z.array(Wave).min(2).max(5),
    cutoverFlow: z.object({
      nodes: z.array(FlowNode).min(3).max(9),
      edges: z.array(FlowEdge).min(2).max(10),
    }),
    syncPlan: z.array(SyncLine).min(3).max(7),
    rollback: z.object({
      nodes: z.array(RollbackNode).min(3).max(7),
      edges: z.array(RollbackEdge).min(2).max(8),
      note: z.string().min(1).max(240),
    }),
    risks: z.array(RiskItem).min(2).max(6),
    signoff: z.object({
      title: z.string().min(1).max(40),
      detail: z.string().min(1).max(240),
      approvals: z.array(Approval).min(1).max(5),
    }),
  })
  .refine((fill) => fill.nodes.some((n) => n.id === fill.currentFocus), {
    message: 'currentFocus must reference an existing estate node id.',
    path: ['currentFocus'],
  })
  .refine((fill) => fill.nodes.some((n) => n.id === fill.targetFocus), {
    message: 'targetFocus must reference an existing estate node id.',
    path: ['targetFocus'],
  });

export type CutoverFill = z.infer<typeof CutoverFill>;
export type CutoverNode = z.infer<typeof EstateNode>;
export type CutoverEdge = z.infer<typeof EstateEdge>;

/* ------------------------------------------------------------------ */
/* Slot specs — the registry-serializable descriptor view             */
/* ------------------------------------------------------------------ */

export const CUTOVER_SLIDE_KINDS: SlideKindSpec[] = [
  {
    kind: 'title',
    purpose: 'The file-header cover — draw.io file/rev, programme, editors, the two-line thesis, and the notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'deck.file', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'The draw.io working-file name, e.g. "cutover-plan.drawio" — shown in the file tab and every kicker row.' },
      { name: 'deck.rev', type: 'text', required: true, limits: { maxChars: 16 }, guidance: 'The revision marker, e.g. "rev 14" — paired with the file name and echoed on sign-off.' },
      { name: 'deck.programme', type: 'text', required: true, limits: { maxChars: 44 }, guidance: 'Programme line above the thesis, e.g. "CORE BANKING · CLOUD MIGRATION".' },
      { name: 'deck.editors', type: 'text', required: true, limits: { maxChars: 44 }, guidance: 'The draw.io editors line, e.g. "A. VOSS · L. CHEN · PLATFORM".' },
      { name: 'deck.notice', type: 'text', required: true, limits: { maxChars: 52 }, guidance: 'REQUIRED synthetic-estate notice printed on every slide foot and the footer.' },
      { name: 'thesis.line1', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'First display line of the cover thesis, e.g. "Move everything.".' },
      { name: 'thesis.line2', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'Second display line — the fixed-point twist, e.g. "Except one box.".' },
      { name: 'thesis.standfirst', type: 'longtext', required: true, limits: { maxChars: 260 }, guidance: 'One paragraph framing the migration around its single fixed point.' },
    ],
  },
  {
    kind: 'current',
    purpose: 'The current estate diagram on the shared draw.io canvas; selection handles on the focus node.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'nodes', type: 'nodes', required: true, limits: { minItems: 5, maxItems: 9 }, guidance: 'The estate systems (id, label, kind app|data|integration, target zone, disposition). Geometry (current cx/cy + target tx/ty) is OPTIONAL and bounded to the canvas when given; omit it and the template auto-lays the node by zone (on-prem left, cloud right). Exactly one carries disposition "stays" — the padlocked anomaly, in the same place on both estates.' },
      { name: 'currentEdges', type: 'edges', required: true, limits: { minItems: 4, maxItems: 10 }, guidance: 'Current-estate orthogonal connectors: from/to node ids, OPTIONAL exit/enter ports (l|r|t|b) derived from node positions when omitted, and an optional wire label (e.g. "sql · 4ms").' },
      { name: 'currentFocus', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'Node id given draw.io selection handles on the current estate slide — usually the fixed point.' },
      { name: 'estateNotes.current', type: 'longtext', required: true, limits: { maxChars: 180 }, guidance: 'One-line caption under the current-estate diagram — what the estate is today and which node is the selected fixed point.' },
    ],
  },
  {
    kind: 'target',
    purpose: 'The target estate diagram — same canvas, moved; the on-prem zone boxes the node that stays.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'targetEdges', type: 'edges', required: true, limits: { minItems: 4, maxItems: 10 }, guidance: 'Target-estate orthogonal connectors after the move; same shape as currentEdges (ports optional, derived when omitted).' },
      { name: 'targetFocus', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'Node id given selection handles on the target estate slide — usually the system being refactored.' },
      { name: 'estateNotes.target', type: 'longtext', required: true, limits: { maxChars: 180 }, guidance: 'One-line caption under the target-estate diagram — what changes after the move; the fixed point stays boxed in its on-prem zone.' },
    ],
  },
  {
    kind: 'delta',
    purpose: 'Three columns — what moves, what dies, what stays.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'delta.moves', type: 'items', required: true, limits: { minItems: 1, maxItems: 6 }, guidance: 'Systems that migrate; each a system name and a one-line disposition note.' },
      { name: 'delta.dies', type: 'items', required: true, limits: { minItems: 1, maxItems: 4 }, guidance: 'Systems retired or replaced; each a system name and a one-line note.' },
      { name: 'delta.stays', type: 'items', required: true, limits: { minItems: 1, maxItems: 3 }, guidance: 'Systems that stay put; the fixed point belongs here.' },
    ],
  },
  {
    kind: 'waves',
    purpose: 'The migration waves as a swimlane — each a weekend, its systems as chips.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'waves', type: 'items', required: true, limits: { minItems: 2, maxItems: 5 }, guidance: 'Each wave has a name, a when, one-to-four system chips (label + kind), and a one-line note.' },
    ],
  },
  {
    kind: 'cutover',
    purpose: 'The cutover-night sequence as a comp.flow-diagram, one path down to a validation gate.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'cutoverFlow.nodes', type: 'nodes', required: true, limits: { minItems: 3, maxItems: 9 }, guidance: 'Flow steps (id, label, kind start|process|decision|end|data); include one decision gate that branches to open vs. rollback.' },
      { name: 'cutoverFlow.edges', type: 'edges', required: true, limits: { minItems: 2, maxItems: 10 }, guidance: 'Flow transitions (from/to node ids); label the decision branches (e.g. "pass" / "fail").' },
    ],
  },
  {
    kind: 'sync',
    purpose: 'The data sync & validation plan as a numbered list.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'syncPlan', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Ordered sync stages; each a stage name and a one-line detail — nothing cuts over until the data agrees.' },
    ],
  },
  {
    kind: 'rollback',
    purpose: 'The bespoke rollback tree from the validation gate.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'rollback.nodes', type: 'nodes', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Rollback-tree nodes (id, label, tone root|ok|abort; optional x/y auto-laid by depth when omitted); the root is the validation gate.' },
      { name: 'rollback.edges', type: 'edges', required: true, limits: { minItems: 2, maxItems: 8 }, guidance: 'Rollback-tree edges (from/to node ids) — the pass branch and the fail chain.' },
      { name: 'rollback.note', type: 'longtext', required: true, limits: { maxChars: 240 }, guidance: 'One paragraph on why rollback is bounded to the maintenance window.' },
    ],
  },
  {
    kind: 'risk',
    purpose: 'The cutover risk register as a comp.status-list.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'risks', type: 'items', required: true, limits: { minItems: 2, maxItems: 6 }, guidance: 'Each risk: a label, a status (success|warning|danger|info|neutral), and a description.' },
    ],
  },
  {
    kind: 'closing',
    purpose: 'The rev sign-off — the decisions this review must grant.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'signoff.title', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'The sign-off headline, e.g. "Ready to sign rev 14.".' },
      { name: 'signoff.detail', type: 'longtext', required: true, limits: { maxChars: 240 }, guidance: 'One paragraph stating what the review must decide.' },
      { name: 'signoff.approvals', type: 'items', required: true, limits: { minItems: 1, maxItems: 5 }, guidance: 'Each approval: a role and the decision it must make, with a sign-off box.' },
    ],
  },
];

/** The craft guarantees the template makes and the descriptor advertises. */
export const CUTOVER_GUIDANCE: string[] = [
  'The draw.io working-file idiom: a flat dot-grid canvas, exact orthogonal connectors with port dots, pastel-filled system boxes with type badges, a layers legend chip in the chrome, and selection handles on each slide’s focus node.',
  'Exactly one estate node carries the "stays" anomaly disposition: padlocked, heavier-stroked, in the SAME place on both the current and target estate; its badge is the verbatim anomaly text, echoed on both estate slides.',
  'The synthetic-estate notice is required and prints on every slide’s print foot and the footer.',
  'Both estates expose a hidden zone-grouped accessible mirror derived from the same node data — the current estate reads all on-prem, the target splits into a cloud landing zone plus the on-prem zone that keeps the fixed point.',
  'Node and edge counts are bounded so the shared estate canvas, the swimlanes, and the flow diagram stay composed for any schema-valid fill.',
  'Motion level 2 (data-ink draw); the mood is locked light.',
];
