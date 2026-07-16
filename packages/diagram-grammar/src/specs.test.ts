import { describe, expect, it } from 'vitest';
import {
  CellsSpec,
  CompareSpec,
  CycleSpec,
  DiagramSpec,
  FlowSpec,
  LayersSpec,
  SequenceSpec,
  TimelineSpec,
  ZonesSpec,
} from './specs.js';

/**
 * Contract tests for the eight bounded diagram spec schemas. Each kind gets a
 * minimal valid fixture (parses), an over-bound fixture (fails), and — where
 * the schema declares cross-references — a dangling-reference fixture (fails).
 */

export const VALID_FLOW = {
  kind: 'flow',
  title: 'Request lifecycle',
  nodes: [
    { id: 'in', label: 'Receive request', kind: 'start' },
    { id: 'check', label: 'Validate payload', kind: 'process' },
    { id: 'out', label: 'Respond', kind: 'end' },
  ],
  edges: [
    { from: 'in', to: 'check', step: 1 },
    { from: 'check', to: 'out', label: 'valid', step: 2 },
  ],
} as const;

export const VALID_SEQUENCE = {
  kind: 'sequence',
  title: 'Token exchange',
  actors: [
    { id: 'client', label: 'Client', kind: 'user' },
    { id: 'api', label: 'API', kind: 'service' },
  ],
  messages: [
    { from: 'client', to: 'api', label: 'POST /token' },
    { from: 'api', to: 'client', label: '200 access token', reply: true },
  ],
} as const;

export const VALID_LAYERS = {
  kind: 'layers',
  title: 'Service stack',
  layers: [
    { id: 'edge', label: 'Edge', detail: 'CDN and WAF', tone: 'accent' },
    { id: 'app', label: 'Application', items: ['API', 'Workers'] },
    { id: 'data', label: 'Data', tone: 'base' },
  ],
} as const;

export const VALID_ZONES = {
  kind: 'zones',
  title: 'Deployment estate',
  zones: [
    { id: 'onprem', label: 'On-prem', nodes: [{ id: 'db', label: 'Ledger DB' }] },
    { id: 'cloud', label: 'Cloud', nodes: [{ id: 'api', label: 'API' }, { id: 'queue', label: 'Queue' }] },
  ],
  links: [{ from: 'api', to: 'db', label: 'sql' }],
} as const;

export const VALID_CYCLE = {
  kind: 'cycle',
  title: 'Deploy loop',
  stages: [
    { id: 'build', label: 'Build' },
    { id: 'test', label: 'Test', detail: 'Unit and e2e gates' },
    { id: 'ship', label: 'Ship' },
  ],
  hubLabel: 'CI',
} as const;

export const VALID_COMPARE = {
  kind: 'compare',
  title: 'REST vs GraphQL',
  columns: [
    { id: 'rest', label: 'REST' },
    { id: 'gql', label: 'GraphQL', tone: 'accent' },
  ],
  rows: [
    { label: 'Payload shape', values: ['fixed per endpoint', 'client-selected'] },
    { label: 'Caching', values: ['HTTP-native', 'needs tooling'] },
  ],
  verdict: 'Pick per read-pattern, not fashion.',
} as const;

export const VALID_CELLS = {
  kind: 'cells',
  title: 'Caching strategies',
  cells: [
    { id: 'aside', label: 'Cache-aside', detail: 'App owns the read path' },
    { id: 'through', label: 'Read-through', badge: '02' },
    { id: 'write', label: 'Write-through' },
    { id: 'behind', label: 'Write-behind' },
  ],
  columnsHint: 2,
} as const;

export const VALID_TIMELINE = {
  kind: 'timeline',
  title: 'Cloud eras',
  eras: [
    { id: 'iron', label: 'Bare metal', marker: '2000s' },
    { id: 'vm', label: 'Virtual machines', detail: 'Consolidation era' },
    { id: 'k8s', label: 'Orchestration', marker: 'now' },
  ],
  nowIndex: 2,
} as const;

describe('spec schemas — valid fixtures parse', () => {
  it.each([
    ['flow', FlowSpec, VALID_FLOW],
    ['sequence', SequenceSpec, VALID_SEQUENCE],
    ['layers', LayersSpec, VALID_LAYERS],
    ['zones', ZonesSpec, VALID_ZONES],
    ['cycle', CycleSpec, VALID_CYCLE],
    ['compare', CompareSpec, VALID_COMPARE],
    ['cells', CellsSpec, VALID_CELLS],
    ['timeline', TimelineSpec, VALID_TIMELINE],
  ] as const)('%s parses', (_kind, schema, fixture) => {
    expect(schema.safeParse(fixture).success).toBe(true);
  });

  it('DiagramSpec discriminates on kind for all eight fixtures', () => {
    for (const fixture of [
      VALID_FLOW,
      VALID_SEQUENCE,
      VALID_LAYERS,
      VALID_ZONES,
      VALID_CYCLE,
      VALID_COMPARE,
      VALID_CELLS,
      VALID_TIMELINE,
    ]) {
      const parsed = DiagramSpec.safeParse(fixture);
      expect(parsed.success).toBe(true);
      if (parsed.success) expect(parsed.data.kind).toBe(fixture.kind);
    }
  });
});

describe('spec schemas — bounds are enforced', () => {
  it('flow rejects a thirteenth node', () => {
    const nodes = Array.from({ length: 13 }, (_, i) => ({
      id: `n${i}`,
      label: `Node ${i}`,
      kind: 'process' as const,
    }));
    const spec = { ...VALID_FLOW, nodes, edges: [{ from: 'n0', to: 'n1' }, { from: 'n1', to: 'n2' }] };
    expect(FlowSpec.safeParse(spec).success).toBe(false);
  });

  it('sequence rejects a seventh actor', () => {
    const actors = Array.from({ length: 7 }, (_, i) => ({
      id: `a${i}`,
      label: `Actor ${i}`,
      kind: 'service' as const,
    }));
    expect(SequenceSpec.safeParse({ ...VALID_SEQUENCE, actors }).success).toBe(false);
  });

  it('layers rejects two layers (minimum is three)', () => {
    expect(LayersSpec.safeParse({ ...VALID_LAYERS, layers: VALID_LAYERS.layers.slice(0, 2) }).success).toBe(false);
  });

  it('cells rejects three cells (minimum is four)', () => {
    expect(CellsSpec.safeParse({ ...VALID_CELLS, cells: VALID_CELLS.cells.slice(0, 3) }).success).toBe(false);
  });

  it('cycle rejects a ninth stage', () => {
    const stages = Array.from({ length: 9 }, (_, i) => ({ id: `s${i}`, label: `Stage ${i}` }));
    expect(CycleSpec.safeParse({ ...VALID_CYCLE, stages }).success).toBe(false);
  });

  it('labels are capped at 80 characters', () => {
    expect(
      CycleSpec.safeParse({ ...VALID_CYCLE, title: 'x'.repeat(81) }).success,
    ).toBe(false);
  });
});

describe('spec schemas — cross-references must resolve', () => {
  it('flow rejects an edge to a missing node', () => {
    expect(
      FlowSpec.safeParse({ ...VALID_FLOW, edges: [...VALID_FLOW.edges, { from: 'in', to: 'ghost' }] }).success,
    ).toBe(false);
  });

  it('sequence rejects a message from a missing actor', () => {
    expect(
      SequenceSpec.safeParse({
        ...VALID_SEQUENCE,
        messages: [...VALID_SEQUENCE.messages, { from: 'ghost', to: 'api', label: 'boo' }],
      }).success,
    ).toBe(false);
  });

  it('zones rejects a link to a node outside every zone', () => {
    expect(
      ZonesSpec.safeParse({ ...VALID_ZONES, links: [{ from: 'api', to: 'ghost' }] }).success,
    ).toBe(false);
  });

  it('compare rejects a row whose width mismatches the columns', () => {
    expect(
      CompareSpec.safeParse({
        ...VALID_COMPARE,
        rows: [{ label: 'Odd row', values: ['only one'] }, ...VALID_COMPARE.rows],
      }).success,
    ).toBe(false);
  });

  it('timeline rejects a nowIndex past the last era', () => {
    expect(TimelineSpec.safeParse({ ...VALID_TIMELINE, nowIndex: 3 }).success).toBe(false);
  });
});
