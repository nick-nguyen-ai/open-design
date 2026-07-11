/**
 * PURE, deterministic layered layout for a small node→edge flow diagram — no
 * DOM. `FlowDiagram.tsx` renders whatever this returns as SVG; nothing about
 * the geometry is computed inside the component.
 *
 * Algorithm (a minimal Sugiyama-style layered layout, deliberately simple —
 * straight-line edges, no crossing minimisation): each node's RANK is its
 * longest path distance from a root (a node with no incoming edge); within a
 * rank, nodes keep their original input order (stable). This is enough for
 * the small (≤ ~20 node) architecture/lineage/flow diagrams this component
 * targets; it is not a general-purpose graph-layout engine.
 */
export type FlowNodeKind = 'start' | 'process' | 'decision' | 'end' | 'data';

export interface FlowNode {
  id: string;
  label: string;
  kind: FlowNodeKind;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface FlowDiagramData {
  nodes: readonly FlowNode[];
  edges: readonly FlowEdge[];
}

export interface PositionedNode extends FlowNode {
  rank: number;
  indexInRank: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionedEdge extends FlowEdge {
  /** Straight-line anchor points: right-centre of `from`, left-centre of `to`. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FlowDiagramLayout {
  nodes: PositionedNode[];
  edges: PositionedEdge[];
  width: number;
  height: number;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 56;
const COLUMN_GAP = 96;
const ROW_GAP = 32;
const MARGIN = 24;

/** Longest-path rank per node id. Cyclic/unreachable nodes fall back to rank 0 (documented limitation). */
function computeRanks(data: FlowDiagramData): Map<string, number> {
  const nodeIds = new Set(data.nodes.map((n) => n.id));
  const incoming = new Map<string, string[]>(data.nodes.map((n) => [n.id, []]));
  const outgoing = new Map<string, string[]>(data.nodes.map((n) => [n.id, []]));
  for (const edge of data.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue; // dangling edge: ignored, not crashed on
    outgoing.get(edge.from)?.push(edge.to);
    incoming.get(edge.to)?.push(edge.from);
  }

  const rank = new Map<string, number>();
  const inDegree = new Map<string, number>(data.nodes.map((n) => [n.id, incoming.get(n.id)?.length ?? 0]));
  // Roots first, in input order, for determinism.
  const queue: string[] = data.nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id);
  for (const id of queue) rank.set(id, 0);

  let cursor = 0;
  while (cursor < queue.length) {
    const id = queue[cursor];
    cursor += 1;
    if (id === undefined) continue;
    const currentRank = rank.get(id) ?? 0;
    for (const nextId of outgoing.get(id) ?? []) {
      const candidateRank = currentRank + 1;
      if ((rank.get(nextId) ?? -1) < candidateRank) rank.set(nextId, candidateRank);
      const remaining = (inDegree.get(nextId) ?? 0) - 1;
      inDegree.set(nextId, remaining);
      if (remaining === 0) queue.push(nextId);
    }
  }

  // Any node not reached (part of a cycle with no root) gets rank 0 — keeps
  // layout deterministic and total instead of throwing on cyclic input.
  for (const node of data.nodes) if (!rank.has(node.id)) rank.set(node.id, 0);
  return rank;
}

export function buildFlowDiagramLayout(data: FlowDiagramData): FlowDiagramLayout {
  const rankById = computeRanks(data);
  const byRank = new Map<number, FlowNode[]>();
  for (const node of data.nodes) {
    const rank = rankById.get(node.id) ?? 0;
    const bucket = byRank.get(rank);
    if (bucket) bucket.push(node);
    else byRank.set(rank, [node]);
  }

  const positioned = new Map<string, PositionedNode>();
  const ranks = [...byRank.keys()].sort((a, b) => a - b);
  for (const rank of ranks) {
    const nodesInRank = byRank.get(rank) ?? [];
    nodesInRank.forEach((node, indexInRank) => {
      positioned.set(node.id, {
        ...node,
        rank,
        indexInRank,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        x: MARGIN + rank * (NODE_WIDTH + COLUMN_GAP),
        y: MARGIN + indexInRank * (NODE_HEIGHT + ROW_GAP),
      });
    });
  }

  const nodes = data.nodes.map((n) => positioned.get(n.id)).filter((n): n is PositionedNode => n !== undefined);

  const edges: PositionedEdge[] = [];
  for (const edge of data.edges) {
    const from = positioned.get(edge.from);
    const to = positioned.get(edge.to);
    if (!from || !to) continue; // dangling edge reference: skipped, not thrown on
    edges.push({
      ...edge,
      x1: from.x + from.width,
      y1: from.y + from.height / 2,
      x2: to.x,
      y2: to.y + to.height / 2,
    });
  }

  const maxRank = ranks.length > 0 ? Math.max(...ranks) : 0;
  const maxIndexInRank = Math.max(0, ...[...byRank.values()].map((bucket) => bucket.length - 1));
  const width = MARGIN * 2 + (maxRank + 1) * NODE_WIDTH + maxRank * COLUMN_GAP;
  const height = MARGIN * 2 + (maxIndexInRank + 1) * NODE_HEIGHT + maxIndexInRank * ROW_GAP;

  return { nodes, edges, width, height };
}

/**
 * The textual outline required by plan §10.4: a screen-reader- and
 * search-friendly description of every node and edge, independent of the
 * SVG's visual layout.
 */
export function buildFlowDiagramOutline(data: FlowDiagramData): string[] {
  const labelById = new Map(data.nodes.map((n) => [n.id, n.label]));
  const lines: string[] = [];
  for (const node of data.nodes) lines.push(`${node.label} (${node.kind})`);
  for (const edge of data.edges) {
    const from = labelById.get(edge.from) ?? edge.from;
    const to = labelById.get(edge.to) ?? edge.to;
    lines.push(edge.label ? `${from} → ${to}: ${edge.label}` : `${from} → ${to}`);
  }
  return lines;
}
