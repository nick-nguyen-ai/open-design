import type { FlowSpecT } from '../specs.js';

/**
 * Deterministic layered flow layout (minimal Sugiyama, mirroring the approach
 * of `packages/diagrams` buildFlowDiagramLayout but owned by the grammar so
 * every collection shares one geometry): rank = longest path from a root,
 * stable input order within a rank. Long chains SERPENTINE: at most four
 * ranks per visual row, odd rows running right-to-left, so an eight-step
 * walkthrough reads as a compact S rather than a thin strip. Edge anchors are
 * positional (left/right/top/bottom centre of the closer sides). Cyclic /
 * unreachable nodes fall back to rank 0 — total, never throws on schema-valid
 * input.
 */

export const PADDING = 24;
const NODE_W = 150;
const NODE_H = 54;
const COL_GAP = 72;
const ROW_GAP = 28;
const RANKS_PER_ROW = 4;
const ROW_BLOCK_GAP = 56;

export interface FlowLayout {
  width: number;
  height: number;
  nodes: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    kind: FlowSpecT['nodes'][number]['kind'];
    label: string;
    rank: number;
  }>;
  edges: Array<{
    from: string;
    to: string;
    points: Array<[number, number]>;
    labelAt: [number, number];
    label?: string;
    step?: number;
  }>;
}

function computeRanks(spec: FlowSpecT): Map<string, number> {
  const incoming = new Map<string, number>(spec.nodes.map((n) => [n.id, 0]));
  const outgoing = new Map<string, string[]>(spec.nodes.map((n) => [n.id, []]));
  for (const edge of spec.edges) {
    outgoing.get(edge.from)?.push(edge.to);
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  }
  const rank = new Map<string, number>();
  const queue = spec.nodes.filter((n) => (incoming.get(n.id) ?? 0) === 0).map((n) => n.id);
  for (const nodeId of queue) rank.set(nodeId, 0);
  let cursor = 0;
  while (cursor < queue.length) {
    const current = queue[cursor]!;
    cursor += 1;
    const currentRank = rank.get(current) ?? 0;
    for (const next of outgoing.get(current) ?? []) {
      if ((rank.get(next) ?? -1) < currentRank + 1) rank.set(next, currentRank + 1);
      const remaining = (incoming.get(next) ?? 0) - 1;
      incoming.set(next, remaining);
      if (remaining === 0) queue.push(next);
    }
  }
  for (const node of spec.nodes) if (!rank.has(node.id)) rank.set(node.id, 0);
  return rank;
}

export function layoutFlow(spec: FlowSpecT): FlowLayout {
  const rankById = computeRanks(spec);
  const byRank = new Map<number, string[]>();
  for (const node of spec.nodes) {
    const r = rankById.get(node.id) ?? 0;
    const bucket = byRank.get(r);
    if (bucket) bucket.push(node.id);
    else byRank.set(r, [node.id]);
  }

  const totalRanks = Math.max(0, ...[...byRank.keys()]) + 1;
  const maxPerRank = Math.max(1, ...[...byRank.values()].map((ids) => ids.length));
  const colsUsed = Math.min(totalRanks, RANKS_PER_ROW);
  const rowBlockH = maxPerRank * NODE_H + (maxPerRank - 1) * ROW_GAP;

  const position = new Map<string, { x: number; y: number; rank: number }>();
  for (const [r, ids] of byRank) {
    const rowOf = Math.floor(r / RANKS_PER_ROW);
    const colRaw = r % RANKS_PER_ROW;
    const col = rowOf % 2 === 0 ? colRaw : Math.min(totalRanks - 1, RANKS_PER_ROW - 1) - colRaw;
    ids.forEach((nodeId, i) => {
      position.set(nodeId, {
        x: PADDING + col * (NODE_W + COL_GAP),
        y: PADDING + rowOf * (rowBlockH + ROW_BLOCK_GAP) + i * (NODE_H + ROW_GAP),
        rank: r,
      });
    });
  }

  const nodes: FlowLayout['nodes'] = spec.nodes.map((n) => {
    const p = position.get(n.id)!;
    return { id: n.id, x: p.x, y: p.y, w: NODE_W, h: NODE_H, kind: n.kind, label: n.label, rank: p.rank };
  });

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edges: FlowLayout['edges'] = spec.edges.map((e) => {
    const from = nodeById.get(e.from)!;
    const to = nodeById.get(e.to)!;
    let start: [number, number];
    let end: [number, number];
    if (to.x > from.x) {
      start = [from.x + from.w, from.y + from.h / 2];
      end = [to.x, to.y + to.h / 2];
    } else if (to.x < from.x) {
      start = [from.x, from.y + from.h / 2];
      end = [to.x + to.w, to.y + to.h / 2];
    } else if (to.y > from.y) {
      start = [from.x + from.w / 2, from.y + from.h];
      end = [to.x + to.w / 2, to.y];
    } else {
      start = [from.x + from.w / 2, from.y];
      end = [to.x + to.w / 2, to.y + to.h];
    }
    const labelAt: [number, number] = [
      Math.round((start[0] + end[0]) / 2),
      Math.round((start[1] + end[1]) / 2) - 6,
    ];
    return { from: e.from, to: e.to, points: [start, end], labelAt, label: e.label, step: e.step };
  });

  const rowsUsed = Math.ceil(totalRanks / RANKS_PER_ROW);
  return {
    width: PADDING * 2 + colsUsed * NODE_W + (colsUsed - 1) * COL_GAP,
    height: PADDING * 2 + rowsUsed * rowBlockH + (rowsUsed - 1) * ROW_BLOCK_GAP,
    nodes,
    edges,
  };
}
