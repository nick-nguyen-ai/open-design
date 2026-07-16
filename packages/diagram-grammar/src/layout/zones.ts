import type { ZonesSpecT } from '../specs.js';
import { PADDING } from './flow.js';

/**
 * Zones (architecture-map) layout: zones tile a 2-column grid (3 columns from
 * five zones up); inside each zone, nodes tile a 2-column grid. Zones sharing
 * a grid row take the row's max height so the sheet reads as aligned panels.
 * Links route straight centre-to-centre with a midpoint label anchor — the
 * renderer may re-route, the anchor stays the semantic midpoint.
 */

const ZONE_W = 300;
const ZONE_GAP = 28;
const ZONE_HEADER_H = 40;
const ZONE_PAD = 14;
const NODE_W = 126;
const NODE_H = 42;
const NODE_GAP = 12;

export interface ZonesLayout {
  width: number;
  height: number;
  zones: Array<{ id: string; x: number; y: number; w: number; h: number; label: string; nodeIds: string[] }>;
  nodes: Array<{ id: string; x: number; y: number; w: number; h: number; label: string; zoneId: string }>;
  links: Array<{ from: string; to: string; points: Array<[number, number]>; labelAt: [number, number]; label?: string }>;
}

export function layoutZones(spec: ZonesSpecT): ZonesLayout {
  const cols = spec.zones.length <= 4 ? 2 : 3;

  const zoneHeights = spec.zones.map((zone) => {
    const rows = Math.ceil(zone.nodes.length / 2);
    return ZONE_HEADER_H + rows * NODE_H + (rows - 1) * NODE_GAP + ZONE_PAD * 2;
  });

  const zones: ZonesLayout['zones'] = [];
  const nodes: ZonesLayout['nodes'] = [];
  let rowY = PADDING;
  for (let rowStart = 0; rowStart < spec.zones.length; rowStart += cols) {
    const rowZones = spec.zones.slice(rowStart, rowStart + cols);
    const rowH = Math.max(...zoneHeights.slice(rowStart, rowStart + cols));
    rowZones.forEach((zone, i) => {
      const zx = PADDING + i * (ZONE_W + ZONE_GAP);
      zones.push({
        id: zone.id,
        x: zx,
        y: rowY,
        w: ZONE_W,
        h: rowH,
        label: zone.label,
        nodeIds: zone.nodes.map((n) => n.id),
      });
      zone.nodes.forEach((node, j) => {
        const col = j % 2;
        const row = Math.floor(j / 2);
        nodes.push({
          id: node.id,
          x: zx + ZONE_PAD + col * (NODE_W + NODE_GAP),
          y: rowY + ZONE_HEADER_H + ZONE_PAD + row * (NODE_H + NODE_GAP),
          w: NODE_W,
          h: NODE_H,
          label: node.label,
          zoneId: zone.id,
        });
      });
    });
    rowY += rowH + ZONE_GAP;
  }

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const links: ZonesLayout['links'] = spec.links.map((l) => {
    const a = nodeById.get(l.from)!;
    const b = nodeById.get(l.to)!;
    const start: [number, number] = [a.x + a.w / 2, a.y + a.h / 2];
    const end: [number, number] = [b.x + b.w / 2, b.y + b.h / 2];
    return {
      from: l.from,
      to: l.to,
      points: [start, end],
      labelAt: [Math.round((start[0] + end[0]) / 2), Math.round((start[1] + end[1]) / 2) - 6],
      label: l.label,
    };
  });

  const colsUsed = Math.min(cols, spec.zones.length);
  return {
    width: PADDING * 2 + colsUsed * ZONE_W + (colsUsed - 1) * ZONE_GAP,
    height: rowY - ZONE_GAP + PADDING,
    zones,
    nodes,
    links,
  };
}
