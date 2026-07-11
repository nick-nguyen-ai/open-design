import { describe, expect, it } from 'vitest';
import { buildFlowDiagramLayout, buildFlowDiagramOutline } from './buildFlowDiagramLayout.js';
import type { FlowDiagramData } from './buildFlowDiagramLayout.js';

const LINEAR: FlowDiagramData = {
  nodes: [
    { id: 'start', label: 'Intake request', kind: 'start' },
    { id: 'validate', label: 'Validate request', kind: 'process' },
    { id: 'route', label: 'Needs approval?', kind: 'decision' },
    { id: 'end', label: 'Close request', kind: 'end' },
  ],
  edges: [
    { id: 'e1', from: 'start', to: 'validate' },
    { id: 'e2', from: 'validate', to: 'route' },
    { id: 'e3', from: 'route', to: 'end', label: 'No' },
  ],
};

const BRANCHING: FlowDiagramData = {
  nodes: [
    { id: 'a', label: 'A', kind: 'start' },
    { id: 'b', label: 'B', kind: 'process' },
    { id: 'c', label: 'C', kind: 'process' },
    { id: 'd', label: 'D', kind: 'end' },
  ],
  edges: [
    { id: 'ab', from: 'a', to: 'b' },
    { id: 'ac', from: 'a', to: 'c' },
    { id: 'bd', from: 'b', to: 'd' },
    { id: 'cd', from: 'c', to: 'd' },
  ],
};

describe('buildFlowDiagramLayout', () => {
  it('assigns strictly increasing ranks (x positions) along a linear chain', () => {
    const layout = buildFlowDiagramLayout(LINEAR);
    const xs = layout.nodes.map((n) => n.x);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    expect(new Set(xs).size).toBe(4); // every node in the linear chain gets its own rank/column
  });

  it('places branching siblings (B, C) in the same rank/column, at different rows', () => {
    const layout = buildFlowDiagramLayout(BRANCHING);
    const byId = new Map(layout.nodes.map((n) => [n.id, n]));
    expect(byId.get('b')?.x).toBe(byId.get('c')?.x);
    expect(byId.get('b')?.y).not.toBe(byId.get('c')?.y);
    // D merges after both B and C, so it's strictly to the right of both.
    expect(byId.get('d')?.x).toBeGreaterThan(byId.get('b')?.x as number);
  });

  it('is deterministic: identical input produces byte-identical (deep-equal) output', () => {
    const first = buildFlowDiagramLayout(LINEAR);
    const second = buildFlowDiagramLayout(LINEAR);
    expect(second).toEqual(first);
  });

  it('every edge anchors to its resolved from/to node positions', () => {
    const layout = buildFlowDiagramLayout(LINEAR);
    const start = layout.nodes.find((n) => n.id === 'start');
    const validate = layout.nodes.find((n) => n.id === 'validate');
    const edge = layout.edges.find((e) => e.id === 'e1');
    expect(edge?.x1).toBe((start?.x ?? 0) + (start?.width ?? 0));
    expect(edge?.x2).toBe(validate?.x);
  });

  it('silently skips a dangling edge (references a node id that does not exist) rather than throwing', () => {
    const withDangling: FlowDiagramData = {
      nodes: LINEAR.nodes,
      edges: [...LINEAR.edges, { id: 'ghost', from: 'start', to: 'nonexistent' }],
    };
    expect(() => buildFlowDiagramLayout(withDangling)).not.toThrow();
    const layout = buildFlowDiagramLayout(withDangling);
    expect(layout.edges.find((e) => e.id === 'ghost')).toBeUndefined();
  });

  it('handles a cyclic graph without infinite-looping or throwing', () => {
    const cyclic: FlowDiagramData = {
      nodes: [
        { id: 'x', label: 'X', kind: 'process' },
        { id: 'y', label: 'Y', kind: 'process' },
      ],
      edges: [
        { id: 'xy', from: 'x', to: 'y' },
        { id: 'yx', from: 'y', to: 'x' },
      ],
    };
    expect(() => buildFlowDiagramLayout(cyclic)).not.toThrow();
    const layout = buildFlowDiagramLayout(cyclic);
    expect(layout.nodes).toHaveLength(2);
  });

  it('computes a bounding width/height that covers every node', () => {
    const layout = buildFlowDiagramLayout(LINEAR);
    for (const node of layout.nodes) {
      expect(node.x + node.width).toBeLessThanOrEqual(layout.width);
      expect(node.y + node.height).toBeLessThanOrEqual(layout.height);
    }
  });
});

describe('buildFlowDiagramOutline', () => {
  it('lists every node with its kind, then every edge with its resolved labels', () => {
    const outline = buildFlowDiagramOutline(LINEAR);
    expect(outline).toContain('Intake request (start)');
    expect(outline).toContain('Validate request (process)');
    expect(outline).toContain('Close request (end)');
    expect(outline).toContain('Intake request → Validate request');
    expect(outline).toContain('Validate request → Needs approval?');
  });

  it('includes the edge label when present', () => {
    const outline = buildFlowDiagramOutline(LINEAR);
    expect(outline).toContain('Needs approval? → Close request: No');
  });

  it('lists exactly nodes.length + edges.length lines', () => {
    const outline = buildFlowDiagramOutline(LINEAR);
    expect(outline).toHaveLength(LINEAR.nodes.length + LINEAR.edges.length);
  });
});
