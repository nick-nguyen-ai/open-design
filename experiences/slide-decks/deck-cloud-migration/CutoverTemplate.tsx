/**
 * "The Cutover" — the world-TEMPLATE. Carries the whole craft of
 * `deck-cloud-migration` and renders it from a typed {@link CutoverFill}
 * (content slots only). `CutoverPage` is now a thin wrapper that hands this
 * component the shipped fill; the rendered output is byte-for-byte what the page
 * rendered before templatization (the `LiveWorldsDecksE` + `live-decks-e` parity
 * oracles prove it).
 *
 * A cloud-migration plan rendered as a draw.io working file: a flat diagram-tool
 * canvas with a faint dot-grid, precise ORTHOGONAL connectors with port dots,
 * pastel-filled rounded system boxes with type badges, a layers legend chip in
 * the chrome, and draw.io selection handles on the focus node of each slide. The
 * idiom is exact geometry — straight strokes, the anti-excalidraw.
 *
 * Anomaly: the fill's single `stays` estate node is badged with its verbatim
 * anomaly text — the one box that never moves, drawn with a padlock and a heavier
 * stroke, in the same place on both the current and target estate.
 *
 * Deck mechanics via `useDeckNavigation`. Theme mood (light) is locked by
 * LiveExperience — not re-locked here.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector and consumed by the design skill): never rename or
 * remove one without updating LivePartIds.test.tsx.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import { StatusList } from '@enterprise-design/content-components';
import { FlowDiagram } from '@enterprise-design/diagrams';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './cutover.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import type { CutoverFill, CutoverNode, CutoverEdge } from './cutover-fill.js';

/* ------------------------------------------------------------------ */
/* Slide structure (template-fixed anatomy, not content)              */
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

const SLIDES: readonly Slide[] = [
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

const SLIDE_COUNT = SLIDES.length;

/** Estate slides — the e2e deep links (C jumps to current, T to target). */
const CURRENT_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'current') + 1;
const TARGET_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'target') + 1;

const KEYBOARD_HINT = '← → NAVIGATE · HOME/END';

/* ------------------------------------------------------------------ */
/* Geometry (template-fixed canvas dimensions, draw.io idiom)          */
/* ------------------------------------------------------------------ */

const NODE_W = 176;
const NODE_H = 62;
const ESTATE_W = 1020;
const ESTATE_H = 560;
const ESTATE_VIEW = '0 0 1020 560';
const ROLLBACK_W = 1000;
const ROLLBACK_H = 360;
const ROLLBACK_NODE_H = 40;
const ROLLBACK_VIEW = '0 0 1000 360';
/** Vertical gap between auto-laid estate nodes in a lane (mixed-lane fallback). */
const LANE_GAP = 24;
/**
 * Auto-grid tuning for a pure coordinate-free fill: a lane wider than
 * {@link LANE_COL_THRESHOLD} nodes splits into two columns; rows get a generous
 * gap for connector-label clearance; retired nodes (target estate) drop into a
 * bottom ghost band so the before/after has a visible delta under pure autolayout.
 */
const COL_GAP = 48;
const ROW_GAP = 42;
const GHOST_BAND_H = 96;
const LANE_COL_THRESHOLD = 4;
/**
 * Even padding used to DERIVE the dashed on-prem "stays" zone box from the
 * resolved position of the node that stays. Tuned so the shipped, authored ledger
 * (target tx/ty 700/145) yields a box within ~1px of the previously hardcoded one.
 */
const ZONE_PAD_X = 24;
const ZONE_PAD_Y = 30;

/* ------------------------------------------------------------------ */
/* Label maps                                                          */
/* ------------------------------------------------------------------ */

type NodeKind = CutoverNode['kind'];
type Disposition = CutoverNode['disposition'];
type Zone = CutoverNode['zone'];

const KIND_BADGE: Record<NodeKind, string> = {
  app: 'APP',
  data: 'DATA',
  integration: 'INT',
};

const DISPOSITION_LABEL: Record<Disposition, string> = {
  rehost: 'REHOST',
  refactor: 'REFACTOR',
  replatform: 'REPLATFORM',
  replace: 'REPLACE',
  retire: 'RETIRE',
  stays: 'STAYS',
};

const ZONE_LABEL: Record<Zone, string> = {
  onprem: 'On-prem data centre',
  cloud: 'Cloud landing zone',
};

/* ------------------------------------------------------------------ */
/* Orthogonal connector routing (exact, straight — draw.io idiom)      */
/* ------------------------------------------------------------------ */

type Side = 'l' | 'r' | 't' | 'b';
type EstateLayout = 'current' | 'target';
interface Box {
  x: number;
  y: number;
}
/** Resolved top-left positions for one estate: node id → box origin. */
type Positions = ReadonlyMap<string, Box>;

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

/* ------------------------------------------------------------------ */
/* Deterministic estate auto-layout (fallback when coords are omitted) */
/*                                                                     */
/* Authored nodes keep their exact top-left (so the shipped, fully     */
/* authored fill renders byte-identically). Any node missing coords is */
/* laid out in its zone lane — distinct zones in fill order become     */
/* lanes left→right (on-prem left, cloud right) — stacked and centred, */
/* dodging the y-bands of authored nodes in the same lane. Counts are  */
/* capped at 9, so a fully coordinate-free lane never overlaps.        */
/* ------------------------------------------------------------------ */

function laneOrder(nodes: readonly CutoverNode[]): Zone[] {
  const order: Zone[] = [];
  for (const n of nodes) if (!order.includes(n.zone)) order.push(n.zone);
  return order;
}

function laneX(laneIdx: number, laneCount: number): number {
  const gap = (ESTATE_W - laneCount * NODE_W) / (laneCount + 1);
  return gap + laneIdx * (NODE_W + gap);
}

/** Evenly-spaced, vertically-centred tops for k nodes stacked in one lane. */
function evenStackTops(k: number): number[] {
  if (k <= 1) return [(ESTATE_H - NODE_H) / 2];
  const ideal = NODE_H + LANE_GAP;
  const required = (k - 1) * ideal + NODE_H;
  const fits = required <= ESTATE_H;
  const spacing = fits ? ideal : (ESTATE_H - NODE_H) / (k - 1);
  const startY = fits ? (ESTATE_H - required) / 2 : 0;
  return Array.from({ length: k }, (_, j) => startY + j * spacing);
}

/** Place `count` auto tops in the largest free gaps around the authored tops. */
function gapFillTops(count: number, authoredTops: readonly number[]): number[] {
  const occupied = authoredTops
    .map((t) => [t, t + NODE_H] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    let bestStart = 0;
    let bestSize = -1;
    let cursor = 0;
    for (const [s, e] of occupied) {
      if (s - cursor > bestSize) {
        bestSize = s - cursor;
        bestStart = cursor;
      }
      cursor = Math.max(cursor, e);
    }
    if (ESTATE_H - cursor > bestSize) {
      bestSize = ESTATE_H - cursor;
      bestStart = cursor;
    }
    const y = Math.max(0, Math.min(ESTATE_H - NODE_H, bestStart + (bestSize - NODE_H) / 2));
    out.push(y);
    occupied.push([y, y + NODE_H]);
    occupied.sort((a, b) => a[0] - b[0]);
  }
  return out;
}

/** Even, vertically-centred tops for k nodes in a column of the given height. */
function stackTops(k: number, height: number, gap: number): number[] {
  if (k <= 1) return [(height - NODE_H) / 2];
  const ideal = NODE_H + gap;
  const required = (k - 1) * ideal + NODE_H;
  const fits = required <= height;
  const spacing = fits ? ideal : (height - NODE_H) / (k - 1);
  const startY = fits ? (height - required) / 2 : 0;
  return Array.from({ length: k }, (_, j) => startY + j * spacing);
}

/**
 * Boustrophedon (snake) cell assignment: fill order reads left→right along a row,
 * then wraps and reads right→left along the next, so a split lane keeps stable,
 * legible fill order across its two columns.
 */
function snakeCells(count: number, cols: number): { col: number; row: number }[] {
  const out: { col: number; row: number }[] = [];
  for (let i = 0; i < count; i += 1) {
    const row = Math.floor(i / cols);
    const posInRow = i % cols;
    const col = row % 2 === 0 ? posInRow : cols - 1 - posInRow;
    out.push({ col, row });
  }
  return out;
}

/**
 * The composition-improved layout for a fully coordinate-free estate. Lanes are
 * the zones in fill order (on-prem/cloud) placed left→right; a lane with more than
 * {@link LANE_COL_THRESHOLD} nodes snake-fills two columns; rows get {@link ROW_GAP}
 * clearance so connector labels don't sit on node rects; and in the TARGET estate
 * every `retire` node drops into a bottom ghost band, giving the before/after a
 * visible delta that the current estate (all nodes in the grid) does not show.
 */
function autoGridLayout(nodes: readonly CutoverNode[], layout: EstateLayout): Positions {
  const positions = new Map<string, Box>();
  const isGhost = (n: CutoverNode) => layout === 'target' && n.disposition === 'retire';
  const ghosts = nodes.filter(isGhost);
  const mainAreaH = ghosts.length > 0 ? ESTATE_H - GHOST_BAND_H : ESTATE_H;

  const lanes = laneOrder(nodes);
  const laneMains = lanes.map((zone) => nodes.filter((n) => n.zone === zone && !isGhost(n)));
  const laneCols = laneMains.map((m) => (m.length > LANE_COL_THRESHOLD ? 2 : 1));
  const laneWidths = laneCols.map((c) => c * NODE_W + (c - 1) * COL_GAP);
  const totalW = laneWidths.reduce((a, b) => a + b, 0);
  const gap = (ESTATE_W - totalW) / (lanes.length + 1);

  let cursorX = gap;
  lanes.forEach((_zone, li) => {
    const mains = laneMains[li]!;
    const cols = laneCols[li]!;
    const laneStartX = cursorX;
    cursorX += laneWidths[li]! + gap;
    if (mains.length === 0) return;
    const rows = Math.ceil(mains.length / cols);
    const rowTops = stackTops(rows, mainAreaH, ROW_GAP);
    const cells = snakeCells(mains.length, cols);
    mains.forEach((n, idx) => {
      const { col, row } = cells[idx]!;
      positions.set(n.id, { x: laneStartX + col * (NODE_W + COL_GAP), y: rowTops[row]! });
    });
  });

  if (ghosts.length > 0) {
    const g = ghosts.length;
    const gGap = (ESTATE_W - g * NODE_W) / (g + 1);
    const gy = mainAreaH + (GHOST_BAND_H - NODE_H) / 2;
    ghosts.forEach((n, i) => positions.set(n.id, { x: gGap + i * (NODE_W + gGap), y: gy }));
  }

  return positions;
}

function layoutEstate(nodes: readonly CutoverNode[], layout: EstateLayout): Positions {
  const getX = (n: CutoverNode) => (layout === 'current' ? n.cx : n.tx);
  const getY = (n: CutoverNode) => (layout === 'current' ? n.cy : n.ty);
  const isAuthored = (n: CutoverNode) => getX(n) !== undefined && getY(n) !== undefined;

  // Pure coordinate-free fill → the composition-improved auto grid. As soon as any
  // node carries authored coords (the shipped, fully-authored fill), the exact
  // authored path below runs and reproduces the working file byte-for-byte.
  if (nodes.every((n) => !isAuthored(n))) return autoGridLayout(nodes, layout);

  const lanes = laneOrder(nodes);
  const positions = new Map<string, Box>();

  lanes.forEach((zone, laneIdx) => {
    const laneNodes = nodes.filter((n) => n.zone === zone);
    const authored = laneNodes.filter(isAuthored);
    const autos = laneNodes.filter((n) => !isAuthored(n));
    for (const n of authored) positions.set(n.id, { x: getX(n)!, y: getY(n)! });
    if (autos.length === 0) return;
    const x = laneX(laneIdx, lanes.length);
    const tops =
      authored.length === 0
        ? evenStackTops(autos.length)
        : gapFillTops(
            autos.length,
            authored.map((n) => getY(n)!).sort((a, b) => a - b),
          );
    autos.forEach((n, j) => positions.set(n.id, { x, y: tops[j]! }));
  });

  return positions;
}

/**
 * Derive the port sides for an edge whose sides are omitted: compare the two node
 * centres and pick the dominant axis, so the connector leaves and enters on the
 * facing sides (right→left when the target is to the right, bottom→top when below,
 * and the mirrors).
 */
export function deriveSides(a: Box, b: Box): { fromSide: Side; toSide: Side } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { fromSide: 'r', toSide: 'l' } : { fromSide: 'l', toSide: 'r' };
  }
  return dy >= 0 ? { fromSide: 'b', toSide: 't' } : { fromSide: 't', toSide: 'b' };
}

interface BuiltConnector {
  id: string;
  label?: string;
  d: string;
  p1: readonly [number, number];
  p2: readonly [number, number];
  /** Extra vertical nudge for the LABEL only (one above its path, one below) —
   * set when this connector is one of an anti-parallel pair/stack. */
  labelDy?: number;
}

/**
 * Ports are per node-side midpoints, independent of direction — so an edge and
 * its reverse-direction mate (same {from,to} pair, swapped) resolve to the
 * exact same two ports and smudge into one path + one label. Nudge each
 * stacked-direction group a few px perpendicular to the connector's axis, one
 * side per direction, so anti-parallel pairs (and any same-pair stack) read as
 * distinct wires. A lone edge between a pair is untouched (returns 0).
 */
function antiParallelOffsets(edges: readonly CutoverEdge[]): ReadonlyMap<string, number> {
  const groups = new Map<string, CutoverEdge[]>();
  for (const e of edges) {
    const key = [e.from, e.to].slice().sort().join('\x1f');
    const list = groups.get(key);
    if (list) list.push(e);
    else groups.set(key, [e]);
  }
  const offsets = new Map<string, number>();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const lowId = group[0]!.from < group[0]!.to ? group[0]!.from : group[0]!.to;
    const forward = group.filter((e) => e.from === lowId);
    const backward = group.filter((e) => e.from !== lowId);
    // Only an opposite-direction mate warrants separation; a stack of edges
    // all running the same direction is a different concern (untouched).
    if (forward.length === 0 || backward.length === 0) continue;
    forward.forEach((e, i) => offsets.set(e.id, i + 1));
    backward.forEach((e, i) => offsets.set(e.id, -(i + 1)));
  }
  return offsets;
}

/** Per-mate port nudge (path separation, perpendicular to the connector's own axis). */
const ANTI_PARALLEL_PATH_OFFSET = 6;
/**
 * Per-mate label nudge. ALWAYS vertical (one label above its path, one below)
 * regardless of the connector's axis: label text is wide but short, so a
 * horizontal nudge big enough to clear an "exhausted"/"replay"-width label
 * would push the path offset out to an ugly distance, while a small vertical
 * step (label height + gap) reliably clears any label width.
 */
const ANTI_PARALLEL_LABEL_OFFSET = 18;

function buildConnectors(edges: readonly CutoverEdge[], positions: Positions): BuiltConnector[] {
  const offsets = antiParallelOffsets(edges);
  return edges.map((e) => {
    const a = positions.get(e.from)!;
    const b = positions.get(e.to)!;
    const derived = deriveSides(a, b);
    const fromSide = e.fromSide ?? derived.fromSide;
    const toSide = e.toSide ?? derived.toSide;
    let pA = port(a, fromSide);
    let pB = port(b, toSide);
    let labelDy = 0;
    const mult = offsets.get(e.id) ?? 0;
    if (mult !== 0) {
      const pathShift = mult * ANTI_PARALLEL_PATH_OFFSET;
      // The path nudge is perpendicular to whichever axis the connector
      // travels — horizontal (l/r ports) nudges vertically, vertical (t/b
      // ports) nudges horizontally — so the two mates read as distinct wires.
      if (fromSide === 'l' || fromSide === 'r') {
        pA = [pA[0], pA[1] + pathShift];
        pB = [pB[0], pB[1] + pathShift];
      } else {
        pA = [pA[0] + pathShift, pA[1]];
        pB = [pB[0] + pathShift, pB[1]];
      }
      // The label nudge is always vertical regardless of axis: text is wide
      // but short, so a small vertical step reliably clears any label width.
      labelDy = mult * ANTI_PARALLEL_LABEL_OFFSET;
    }
    return { id: e.id, label: e.label, d: orth(pA, fromSide, pB), p1: pA, p2: pB, labelDy };
  });
}

interface ZoneBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Derive the dashed on-prem "stays" zone box from the RESOLVED position of the
 * node that stays (rect + even padding, label above), so it wraps that node
 * whether the fill authored its coords or the template auto-laid it — never the
 * old hardcoded geometry that left the auto-laid ledger outside an empty box.
 */
function staysZoneBox(nodes: readonly CutoverNode[], positions: Positions): ZoneBox | null {
  const stays = nodes.find((n) => n.disposition === 'stays');
  const box = stays ? positions.get(stays.id) : undefined;
  if (!box) return null;
  return {
    x: box.x - ZONE_PAD_X,
    y: box.y - ZONE_PAD_Y,
    w: NODE_W + ZONE_PAD_X * 2,
    h: NODE_H + ZONE_PAD_Y * 2,
  };
}

/**
 * Deterministic rollback-tree layout: authored coords render as-is (shipped path);
 * if any node omits coords the whole tree is laid out by longest-path depth from
 * the roots, evenly across each level, with authored coords still honoured.
 */
function layoutRollback(rollback: CutoverFill['rollback']): Positions {
  const { nodes, edges } = rollback;
  const positions = new Map<string, Box>();
  const complete = nodes.every((n) => n.x !== undefined && n.y !== undefined);
  if (complete) {
    for (const n of nodes) positions.set(n.id, { x: n.x!, y: n.y! });
    return positions;
  }
  const depth = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  for (let i = 0; i < nodes.length; i += 1) {
    for (const e of edges) {
      const d = (depth.get(e.from) ?? 0) + 1;
      if (d > (depth.get(e.to) ?? 0)) depth.set(e.to, d);
    }
  }
  const byDepth = new Map<number, string[]>();
  for (const n of nodes) {
    const d = depth.get(n.id)!;
    const row = byDepth.get(d) ?? [];
    row.push(n.id);
    byDepth.set(d, row);
  }
  const maxDepth = Math.max(...byDepth.keys());
  const topY = 30;
  const levelGap = (ROLLBACK_H - ROLLBACK_NODE_H - topY) / Math.max(1, maxDepth);
  for (const [d, ids] of byDepth) {
    const y = topY + d * levelGap;
    ids.forEach((id, j) => {
      const node = nodes.find((n) => n.id === id)!;
      const autoX = (ROLLBACK_W * (j + 1)) / (ids.length + 1);
      positions.set(id, { x: node.x ?? autoX, y: node.y ?? y });
    });
  }
  return positions;
}

/* ------------------------------------------------------------------ */
/* Estate zones — the accessible mirror groups each diagram by zone     */
/* ------------------------------------------------------------------ */

/**
 * The two diagrams differ by WHERE each system lives, not just by disposition.
 * The current estate is one on-prem data centre; the target estate splits into a
 * cloud landing zone plus the on-prem zone that keeps the locked node. The
 * accessible mirror is grouped by that same zone level, so a screen-reader user
 * reads a TRUE mirror of each diagram.
 */
function zoneOf(node: CutoverNode, layout: 'current' | 'target'): Zone {
  if (layout === 'current') return 'onprem';
  return node.zone;
}

interface EstateMirrorSystem {
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

function buildEstateMirror(
  nodes: readonly CutoverNode[],
  layout: 'current' | 'target',
): readonly EstateMirrorZone[] {
  const order: readonly Zone[] = ['onprem', 'cloud'];
  return order
    .map((zone) => ({
      zone,
      label: ZONE_LABEL[zone],
      systems: nodes
        .filter((n) => zoneOf(n, layout) === zone)
        .map((n) => ({
          id: n.id,
          label: n.label,
          kind: n.kind,
          disposition: n.disposition,
          locked: n.locked,
        })),
    }))
    .filter((g) => g.systems.length > 0);
}

/* ------------------------------------------------------------------ */
/* Build wrapper                                                       */
/* ------------------------------------------------------------------ */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
  partId,
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
  partId?: string;
}) {
  return (
    <Tag
      className={className ? `cu-build ${className}` : 'cu-build'}
      style={{ ['--cu-i' as string]: i }}
      data-part-id={partId}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* The estate diagram — shared by current & target slides              */
/* ------------------------------------------------------------------ */

function SelectionHandles({ x, y }: { x: number; y: number }) {
  const pts: readonly [number, number][] = [
    [x, y],
    [x + NODE_W / 2, y],
    [x + NODE_W, y],
    [x, y + NODE_H / 2],
    [x + NODE_W, y + NODE_H / 2],
    [x, y + NODE_H],
    [x + NODE_W / 2, y + NODE_H],
    [x + NODE_W, y + NODE_H],
  ];
  return (
    <g className="cu-handles" aria-hidden="true">
      <rect className="cu-handle-outline" x={x - 4} y={y - 4} width={NODE_W + 8} height={NODE_H + 8} rx={4} />
      {pts.map(([hx, hy], i) => (
        <rect key={i} className="cu-handle" x={hx - 3.5} y={hy - 3.5} width={7} height={7} />
      ))}
    </g>
  );
}

function EstateDiagram({
  layout,
  nodes,
  positions,
  connectors,
  focus,
  anomalyText,
  testid,
}: {
  layout: 'current' | 'target';
  nodes: readonly CutoverNode[];
  positions: Positions;
  connectors: readonly BuiltConnector[];
  focus: string;
  anomalyText: string;
  testid: string;
}) {
  const focusBox = positions.get(focus)!;
  const fx = focusBox.x;
  const fy = focusBox.y;
  const zone = layout === 'target' ? staysZoneBox(nodes, positions) : null;
  return (
    <svg
      className="cu-estate-svg"
      viewBox={ESTATE_VIEW}
      role="img"
      aria-label={`${layout === 'current' ? 'Current' : 'Target'} estate diagram. ${nodes.map((n) => `${n.label}, ${DISPOSITION_LABEL[n.disposition]}`).join('; ')}. ${anomalyText}.`}
      data-testid={testid}
      data-part-id={`deck-cloud-migration/${layout}/estate-diagram`}
    >
      {/* target estate: the on-prem zone that keeps the locked node — derived from
          the node's resolved position so it wraps the ledger under autolayout too */}
      {zone ? (
        <g className="cu-zone" aria-hidden="true">
          <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={8} />
          <text className="cu-zone-label" x={zone.x + 10} y={zone.y + 20}>
            ON-PREM · STAYS
          </text>
        </g>
      ) : null}

      {/* connector lines + ports first, UNDER the boxes */}
      {connectors.map((c) => (
        <g key={c.id} className="cu-conn">
          <path className="cu-conn-line" d={c.d} />
          <circle className="cu-port" cx={c.p1[0]} cy={c.p1[1]} r={3} />
          <circle className="cu-port" cx={c.p2[0]} cy={c.p2[1]} r={3} />
        </g>
      ))}

      {/* selection handles on the focus node (draw.io idiom) */}
      <SelectionHandles x={fx} y={fy} />

      {/* the system boxes */}
      {nodes.map((n) => {
        const box = positions.get(n.id)!;
        const nx = box.x;
        const ny = box.y;
        const retired = layout === 'target' && n.disposition === 'retire';
        return (
          <g
            key={n.id}
            className="cu-node"
            data-kind={n.kind}
            data-locked={n.locked ? 'true' : undefined}
            data-retired={retired ? 'true' : undefined}
            data-focus={n.id === focus ? 'true' : undefined}
          >
            <rect className="cu-node-box" x={nx} y={ny} width={NODE_W} height={NODE_H} rx={7} />
            <text className="cu-node-kind" x={nx + 12} y={ny + 18}>
              {n.locked ? '\u{1F512} ' : ''}
              {KIND_BADGE[n.kind]}
            </text>
            <text className="cu-node-label" x={nx + 12} y={ny + 42}>
              {n.label}
            </text>
            <text className="cu-node-disp" x={nx + NODE_W - 12} y={ny + 18} textAnchor="end">
              {DISPOSITION_LABEL[n.disposition]}
            </text>
          </g>
        );
      })}

      {/* connector labels ON TOP of the boxes — each keeps a white halo so it
          stays legible with clearance even where an auto-laid wire runs tight */}
      {connectors.map((c) => {
        if (!c.label) return null;
        const lx = (c.p1[0] + c.p2[0]) / 2;
        const ly = (c.p1[1] + c.p2[1]) / 2 + (c.labelDy ?? 0);
        return (
          <g key={`${c.id}-label`} className="cu-conn-label-layer" aria-hidden="true">
            <rect
              className="cu-conn-label-bg"
              x={lx - (c.label.length * 6.2) / 2 - 4}
              y={ly - 17}
              width={c.label.length * 6.2 + 8}
              height={15}
              rx={2}
            />
            <text className="cu-conn-label" x={lx} y={ly - 5} textAnchor="middle">
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Accessible mirror — each estate grouped by zone, system by system   */
/* ------------------------------------------------------------------ */

function EstateMirror({
  title,
  groups,
  anomalyText,
  testid,
}: {
  title: string;
  groups: readonly EstateMirrorZone[];
  anomalyText: string;
  testid: string;
}) {
  return (
    <div data-testid={testid}>
      <h2>{title}</h2>
      <ul>
        {groups.map((g) => (
          <li key={g.zone}>
            {g.label}
            <ul>
              {g.systems.map((s) => (
                <li key={s.id}>
                  {s.label} — {s.kind} — {DISPOSITION_LABEL[s.disposition]}
                  {s.locked ? ` (${anomalyText})` : ''}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

interface Derived {
  currentPositions: Positions;
  targetPositions: Positions;
  rollbackPositions: Positions;
  currentConnectors: readonly BuiltConnector[];
  targetConnectors: readonly BuiltConnector[];
  anomalyText: string;
}

function KickerRow({ slide, fill }: { slide: Slide; fill: CutoverFill }) {
  return (
    <Build i={0} className="cu-kickerrow">
      <span className="cu-kicker">{slide.kicker}</span>
      <span className="cu-file">
        {fill.deck.file} · {fill.deck.rev}
      </span>
    </Build>
  );
}

function EstateSlide({
  layout,
  fill,
  positions,
  connectors,
  focus,
  anomalyText,
  testid,
  heading,
  note,
}: {
  layout: 'current' | 'target';
  fill: CutoverFill;
  positions: Positions;
  connectors: readonly BuiltConnector[];
  focus: string;
  anomalyText: string;
  testid: string;
  heading: string;
  note: string;
}) {
  return (
    <div className="cu-estate-body">
      <Build i={0} className="cu-kickerrow">
        <span className="cu-kicker">{layout === 'current' ? '01 · CURRENT ESTATE' : '02 · TARGET ESTATE'}</span>
        <span className="cu-file">
          {fill.deck.file} · {fill.deck.rev}
        </span>
      </Build>
      <Build i={1}>
        <h2 className="cu-heading cu-heading-tight">{heading}</h2>
      </Build>
      <Build i={2} className="cu-canvas">
        <EstateDiagram
          layout={layout}
          nodes={fill.nodes}
          positions={positions}
          connectors={connectors}
          focus={focus}
          anomalyText={anomalyText}
          testid={testid}
        />
      </Build>
      <Build i={3} className="cu-estate-foot">
        <p className="cu-estate-flag" data-testid={`${testid}-flag`}>
          <span className="cu-lock" aria-hidden="true">
            {'\u{1F512}'}
          </span>
          {anomalyText}
        </p>
        <p className="cu-canvas-note">{note}</p>
      </Build>
    </div>
  );
}

function SlideBody({ slide, fill, derived }: { slide: Slide; fill: CutoverFill; derived: Derived }) {
  switch (slide.kind) {
    case 'title':
      return (
        <div className="cu-cover">
          <Build i={0} className="cu-kickerrow">
            <span className="cu-kicker">{fill.deck.file} · {fill.deck.rev}</span>
            <span className="cu-file">{fill.deck.editors}</span>
          </Build>
          <Build i={1}>
            <p className="cu-filetab">{fill.deck.programme}</p>
          </Build>
          <h2 className="cu-display">
            <Build i={2}>
              <span className="cu-line">{fill.thesis.line1}</span>
            </Build>
            <Build i={3}>
              <span className="cu-line cu-focus-text">{fill.thesis.line2}</span>
            </Build>
          </h2>
          <Build i={4}>
            <p className="cu-standfirst">{fill.thesis.standfirst}</p>
          </Build>
        </div>
      );

    case 'current':
      return (
        <EstateSlide
          layout="current"
          fill={fill}
          positions={derived.currentPositions}
          connectors={derived.currentConnectors}
          focus={fill.currentFocus}
          anomalyText={derived.anomalyText}
          testid="current-estate"
          heading="What we have today."
          note={fill.estateNotes.current}
        />
      );

    case 'target':
      return (
        <EstateSlide
          layout="target"
          fill={fill}
          positions={derived.targetPositions}
          connectors={derived.targetConnectors}
          focus={fill.targetFocus}
          anomalyText={derived.anomalyText}
          testid="target-estate"
          heading="What we run after."
          note={fill.estateNotes.target}
        />
      );

    case 'delta':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading">{fill.headlines.delta}</h2>
          </Build>
          <div className="cu-delta-grid">
            <Build i={2} className="cu-delta-col" data-tone="move">
              <span className="cu-delta-head">MOVES</span>
              <ul>
                {fill.delta.moves.map((d) => (
                  <li key={d.system}>
                    <b>{d.system}</b>
                    {d.note}
                  </li>
                ))}
              </ul>
            </Build>
            <Build i={3} className="cu-delta-col" data-tone="die">
              <span className="cu-delta-head">DIES</span>
              <ul>
                {fill.delta.dies.map((d) => (
                  <li key={d.system}>
                    <b>{d.system}</b>
                    {d.note}
                  </li>
                ))}
              </ul>
            </Build>
            <Build i={4} className="cu-delta-col" data-tone="stay">
              <span className="cu-delta-head">STAYS</span>
              <ul>
                {fill.delta.stays.map((d) => (
                  <li key={d.system}>
                    <b>{d.system}</b>
                    {d.note}
                  </li>
                ))}
              </ul>
            </Build>
          </div>
        </div>
      );

    case 'waves':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">{fill.headlines.waves}</h2>
          </Build>
          <div className="cu-swimlanes" data-part-id="deck-cloud-migration/waves/swimlanes">
            {fill.waves.map((w, i) => (
              <Build key={w.id} i={i + 2} className="cu-lane">
                <div className="cu-lane-head">
                  <span className="cu-lane-name">{w.name}</span>
                  <span className="cu-lane-when">{w.when}</span>
                </div>
                <div className="cu-lane-chips">
                  {w.chips.map((c) => (
                    <span key={c.label} className="cu-chip" data-kind={c.kind}>
                      {c.label}
                    </span>
                  ))}
                </div>
                <p className="cu-lane-note">{w.note}</p>
              </Build>
            ))}
          </div>
        </div>
      );

    case 'cutover':
      return (
        <div className="cu-flow-body">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">{fill.headlines.cutover}</h2>
          </Build>
          <Build i={2} className="cu-flow-frame" partId="deck-cloud-migration/cutover/flow-frame">
            <FlowDiagram
              data={fill.cutoverFlow}
              title="Cutover-night sequence"
              sourceNote="Every step is reversible until the validation gate; a failed gate rolls straight back to source inside the same window."
            />
          </Build>
        </div>
      );

    case 'sync':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading">{fill.headlines.sync}</h2>
          </Build>
          <Build i={2} className="cu-sync-wrap">
            <ol className="cu-sync">
              {fill.syncPlan.map((s, i) => (
                <li key={s.id}>
                  <span className="cu-sync-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cu-sync-stage">{s.stage}</span>
                  <span className="cu-sync-detail">{s.detail}</span>
                </li>
              ))}
            </ol>
          </Build>
        </div>
      );

    case 'rollback':
      return (
        <div className="cu-flow-body">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading cu-heading-tight">{fill.headlines.rollback}</h2>
          </Build>
          <Build i={2} className="cu-canvas">
            <svg className="cu-rollback-svg" viewBox={ROLLBACK_VIEW} role="img" aria-label="Rollback tree from the validation gate: pass opens to customers; fail freezes the target, repoints DNS to source, and unfreezes source writes." data-testid="rollback-tree" data-part-id="deck-cloud-migration/rollback/rollback-tree">
              {fill.rollback.edges.map((e, i) => {
                const a = derived.rollbackPositions.get(e.from)!;
                const b = derived.rollbackPositions.get(e.to)!;
                const midY = (a.y + 26 + b.y) / 2;
                return (
                  <path
                    key={i}
                    className="cu-rb-edge"
                    d={`M ${a.x} ${a.y + 26} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`}
                  />
                );
              })}
              {fill.rollback.nodes.map((n) => {
                const p = derived.rollbackPositions.get(n.id)!;
                return (
                  <g key={n.id} className="cu-rb-node" data-tone={n.tone}>
                    <rect x={p.x - 130} y={p.y} width={260} height={40} rx={6} />
                    <text x={p.x} y={p.y + 25} textAnchor="middle">
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Build>
          <Build i={3}>
            <p className="cu-canvas-note">{fill.rollback.note}</p>
          </Build>
        </div>
      );

    case 'risk':
      return (
        <div className="cu-prose">
          <KickerRow slide={slide} fill={fill} />
          <Build i={1}>
            <h2 className="cu-heading">{fill.headlines.risk}</h2>
          </Build>
          <Build i={2} className="cu-risk-frame">
            <StatusList title="Cutover risk register" items={[...fill.risks]} />
          </Build>
        </div>
      );

    case 'closing':
      return (
        <div className="cu-closing">
          <Build i={0} className="cu-signoff">
            <div className="cu-signoff-head">
              <span className="cu-signoff-file">{fill.deck.file}</span>
              <span className="cu-signoff-rev">{fill.deck.rev} · READY FOR SIGN-OFF</span>
            </div>
            <h2 className="cu-signoff-title">{fill.signoff.title}</h2>
            <p className="cu-standfirst cu-standfirst-wide">{fill.signoff.detail}</p>
            <ul className="cu-approvals">
              {fill.signoff.approvals.map((a) => (
                <li key={a.role}>
                  <span className="cu-approval-role">{a.role}</span>
                  <span className="cu-approval-decision">{a.decision}</span>
                  <span className="cu-approval-box" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </Build>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export default function CutoverTemplate({ fill }: { fill: CutoverFill }) {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  const derived = useMemo<Derived>(() => {
    const currentPositions = layoutEstate(fill.nodes, 'current');
    const targetPositions = layoutEstate(fill.nodes, 'target');
    return {
      currentPositions,
      targetPositions,
      rollbackPositions: layoutRollback(fill.rollback),
      currentConnectors: buildConnectors(fill.currentEdges, currentPositions),
      targetConnectors: buildConnectors(fill.targetEdges, targetPositions),
      anomalyText: fill.nodes.find((n) => n.disposition === 'stays')?.badge ?? '',
    };
  }, [fill]);
  const currentMirror = useMemo(() => buildEstateMirror(fill.nodes, 'current'), [fill.nodes]);
  const targetMirror = useMemo(() => buildEstateMirror(fill.nodes, 'target'), [fill.nodes]);

  useEffect(() => {
    document.title = `${fill.deck.world} — ${fill.deck.file} — Live`;
  }, [fill.deck.world, fill.deck.file]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'c' || event.key === 'C') goTo(CURRENT_SLIDE_NUMBER);
      if (event.key === 't' || event.key === 'T') goTo(TARGET_SLIDE_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="cu-root" data-testid="live-cutover" data-reduced={reduced ? 'true' : undefined}>
      <header className="cu-chrome cu-chrome-top" aria-label="Deck chrome">
        <div className="cu-chrome-cell">
          <RouterLink to="/" className="cu-back">
            ◄ GALLERY
          </RouterLink>
          <span className="cu-chrome-rule" aria-hidden="true" />
          <span>
            {fill.deck.code} · {fill.deck.world}
          </span>
        </div>
        <div className="cu-chrome-cell">
          {/* the layers legend chip — draw.io chrome */}
          <span className="cu-legend" aria-hidden="true">
            <span className="cu-legend-chip" data-kind="app">
              APP
            </span>
            <span className="cu-legend-chip" data-kind="data">
              DATA
            </span>
            <span className="cu-legend-chip" data-kind="integration">
              INT
            </span>
          </span>
          <span className="cu-chrome-rule" aria-hidden="true" />
          <span data-testid="cutover-counter" aria-live="polite">
            {counter} · {activeSlide.section.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="cu-main">
        <h1>
          <VisuallyHidden>
            {fill.deck.world} — {fill.deck.programme}, a cloud-migration cutover plan rendered as a
            draw.io working file ({fill.deck.file}, {fill.deck.rev}). {fill.thesis.line1}{' '}
            {fill.thesis.line2} The fixed point stays on-prem: “{derived.anomalyText}”. Slide{' '}
            {activeNumber} of {SLIDE_COUNT}: {activeSlide.section}.
          </VisuallyHidden>
        </h1>
        <VisuallyHidden>
          <EstateMirror title="Current estate, system by system" groups={currentMirror} anomalyText={derived.anomalyText} testid="current-estate-mirror" />
          <EstateMirror title="Target estate, system by system" groups={targetMirror} anomalyText={derived.anomalyText} testid="target-estate-mirror" />
        </VisuallyHidden>
        <div className="cu-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="cu-slide"
                data-state={state}
                data-slide-id={slide.id}
                data-part-id={`deck-cloud-migration/${slide.kind}`}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Slide ${index + 1} of ${SLIDE_COUNT}: ${slide.section}`}
              >
                <div className="cu-slide-inner">
                  <SlideBody slide={slide} fill={fill} derived={derived} />
                </div>
                <div className="cu-print-foot" aria-hidden="true">
                  {fill.deck.code} · {slide.section} · SLIDE {String(index + 1).padStart(2, '0')} /{' '}
                  {SLIDE_COUNT} · {fill.deck.notice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="cu-chrome cu-chrome-bottom" aria-label="Deck controls">
        <span className="cu-notice">{fill.deck.notice}</span>
        <div className="cu-footer-nav">
          <span className="cu-hint">{KEYBOARD_HINT}</span>
          <button
            type="button"
            className="cu-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="cu-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === SLIDE_COUNT - 1}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
