import { describe, expect, it } from 'vitest';
import {
  CELLS_FIXTURE,
  COMPARE_FIXTURE,
  CYCLE_FIXTURE,
  FLOW_FIXTURE,
  LAYERS_FIXTURE,
  SEQUENCE_FIXTURE,
  TIMELINE_FIXTURE,
  ZONES_FIXTURE,
} from '../fixtures.js';
import { layoutFlow } from './flow.js';
import { layoutSequence } from './sequence.js';
import { layoutLayers } from './layers.js';
import { layoutZones } from './zones.js';
import { layoutCycle } from './cycle.js';
import { layoutCompare } from './compare.js';
import { layoutCells } from './cells.js';
import { layoutTimeline } from './timeline.js';

/** Rectangles overlap strictly (touching edges is allowed). */
function overlaps(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

describe('layout engines — determinism', () => {
  it('same spec twice yields deep-equal geometry for every kind', () => {
    expect(layoutFlow(FLOW_FIXTURE)).toEqual(layoutFlow(FLOW_FIXTURE));
    expect(layoutSequence(SEQUENCE_FIXTURE)).toEqual(layoutSequence(SEQUENCE_FIXTURE));
    expect(layoutLayers(LAYERS_FIXTURE)).toEqual(layoutLayers(LAYERS_FIXTURE));
    expect(layoutZones(ZONES_FIXTURE)).toEqual(layoutZones(ZONES_FIXTURE));
    expect(layoutCycle(CYCLE_FIXTURE)).toEqual(layoutCycle(CYCLE_FIXTURE));
    expect(layoutCompare(COMPARE_FIXTURE)).toEqual(layoutCompare(COMPARE_FIXTURE));
    expect(layoutCells(CELLS_FIXTURE)).toEqual(layoutCells(CELLS_FIXTURE));
    expect(layoutTimeline(TIMELINE_FIXTURE)).toEqual(layoutTimeline(TIMELINE_FIXTURE));
  });
});

describe('layout engines — geometry stays inside the canvas', () => {
  it('flow nodes and edge points are within bounds', () => {
    const l = layoutFlow(FLOW_FIXTURE);
    for (const n of l.nodes) {
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.x + n.w).toBeLessThanOrEqual(l.width);
      expect(n.y + n.h).toBeLessThanOrEqual(l.height);
    }
    for (const e of l.edges)
      for (const [x, y] of e.points) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(l.width);
        expect(y).toBeLessThanOrEqual(l.height);
      }
  });

  it('sequence actors and message rows are within bounds and ordered', () => {
    const l = layoutSequence(SEQUENCE_FIXTURE);
    for (const a of l.actors) {
      expect(a.x).toBeGreaterThan(0);
      expect(a.x).toBeLessThan(l.width);
    }
    let lastY = 0;
    for (const m of l.messages) {
      expect(m.y).toBeGreaterThan(lastY);
      expect(m.y).toBeLessThan(l.height);
      lastY = m.y;
    }
  });

  it('layers bands tile the column top-to-bottom without overlap', () => {
    const l = layoutLayers(LAYERS_FIXTURE);
    const bands = [...l.bands].sort((a, b) => a.y - b.y);
    for (let i = 1; i < bands.length; i += 1) {
      const prev = bands[i - 1]!;
      expect(bands[i]!.y).toBeGreaterThanOrEqual(prev.y + prev.h);
    }
    const last = bands[bands.length - 1]!;
    expect(last.y + last.h).toBeLessThanOrEqual(l.height);
  });

  it('zones do not overlap and every node sits inside its zone', () => {
    const l = layoutZones(ZONES_FIXTURE);
    for (let i = 0; i < l.zones.length; i += 1)
      for (let j = i + 1; j < l.zones.length; j += 1) expect(overlaps(l.zones[i]!, l.zones[j]!)).toBe(false);
    for (const zone of l.zones)
      for (const nodeId of zone.nodeIds) {
        const node = l.nodes.find((n) => n.id === nodeId)!;
        expect(node.x).toBeGreaterThanOrEqual(zone.x);
        expect(node.y).toBeGreaterThanOrEqual(zone.y);
        expect(node.x + node.w).toBeLessThanOrEqual(zone.x + zone.w);
        expect(node.y + node.h).toBeLessThanOrEqual(zone.y + zone.h);
      }
  });

  it('cycle stages sit on a ring around the centre, first stage at the top', () => {
    const l = layoutCycle(CYCLE_FIXTURE);
    for (const s of l.stages) {
      const dx = s.cx - l.centre[0];
      const dy = s.cy - l.centre[1];
      expect(Math.round(Math.hypot(dx, dy))).toBe(l.radius);
    }
    const first = l.stages[0]!;
    expect(Math.abs(first.cx - l.centre[0])).toBeLessThanOrEqual(1);
    expect(first.cy).toBeLessThan(l.centre[1]);
  });

  it('compare columns and cells do not overlap', () => {
    const l = layoutCompare(COMPARE_FIXTURE);
    expect(l.columns).toHaveLength(COMPARE_FIXTURE.columns.length);
    for (let i = 1; i < l.columns.length; i += 1)
      expect(l.columns[i]!.x).toBeGreaterThanOrEqual(l.columns[i - 1]!.x + l.columns[i - 1]!.w);
    for (const row of l.rows) expect(row.cells).toHaveLength(l.columns.length);
  });

  it('cells honour the columnsHint and never overlap', () => {
    const l = layoutCells(CELLS_FIXTURE);
    expect(l.columns).toBe(3);
    for (let i = 0; i < l.cells.length; i += 1)
      for (let j = i + 1; j < l.cells.length; j += 1) expect(overlaps(l.cells[i]!, l.cells[j]!)).toBe(false);
  });

  it('timeline eras advance along the axis and the now marker indexes an era', () => {
    const l = layoutTimeline(TIMELINE_FIXTURE);
    for (let i = 1; i < l.eras.length; i += 1) expect(l.eras[i]!.x).toBeGreaterThan(l.eras[i - 1]!.x);
    expect(l.nowX).toBe(l.eras[3]!.x);
  });
});

describe('layout engines — degenerate input stays total', () => {
  it('flow with a cycle does not throw and keeps every node', () => {
    const cyclic = {
      ...FLOW_FIXTURE,
      nodes: [
        { id: 'a', label: 'A', kind: 'process' as const },
        { id: 'b', label: 'B', kind: 'process' as const },
        { id: 'c', label: 'C', kind: 'process' as const },
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'a' },
      ],
    };
    const l = layoutFlow(cyclic);
    expect(l.nodes).toHaveLength(3);
  });

  it('sequence self-message routes as a loop on one lifeline', () => {
    const spec = {
      ...SEQUENCE_FIXTURE,
      messages: [
        { from: 'api', to: 'api', label: 'retry with backoff' },
        { from: 'client', to: 'api', label: 'GET /health' },
      ],
    };
    const l = layoutSequence(spec);
    expect(l.messages[0]!.selfLoop).toBe(true);
    expect(l.messages[0]!.x1).toBe(l.messages[0]!.x2);
  });

  it('max-bound cells fixture stays composed', () => {
    const cells = Array.from({ length: 12 }, (_, i) => ({
      id: `c${i}`,
      label: `Concept ${i + 1}`,
      detail: 'A bounded detail line that should wrap inside its cell without escaping.',
    }));
    const l = layoutCells({ kind: 'cells', title: 'Twelve concepts', cells });
    expect(l.columns).toBe(4);
    const last = l.cells[l.cells.length - 1]!;
    expect(last.y + last.h).toBeLessThanOrEqual(l.height);
  });
});
