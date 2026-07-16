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
} from './fixtures.js';
import type { DiagramSpec } from './specs.js';
import { buildOutline } from './outline.js';

/**
 * The outline is the diagram's textual mirror: EVERY human-authored string in
 * a spec must appear, so no information lives only in the visual.
 */

function everyStringIn(spec: DiagramSpec): string[] {
  const strings: string[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value !== null && typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk(spec);
  // `kind`, ids, tones and other enum/id machinery are not editorial content.
  const machinery = new Set<string>([spec.kind]);
  if ('nodes' in spec) spec.nodes.forEach((n) => machinery.add(n.id) && machinery.add(n.kind));
  if (spec.kind === 'flow') spec.nodes.forEach((n) => machinery.add(n.kind));
  if (spec.kind === 'sequence') spec.actors.forEach((a) => { machinery.add(a.id); machinery.add(a.kind); });
  if (spec.kind === 'zones') {
    spec.zones.forEach((z) => { machinery.add(z.id); z.nodes.forEach((n) => machinery.add(n.id)); });
  }
  if (spec.kind === 'flow') spec.nodes.forEach((n) => machinery.add(n.id));
  if (spec.kind === 'layers') spec.layers.forEach((l) => { machinery.add(l.id); if (l.tone) machinery.add(l.tone); });
  if (spec.kind === 'cycle') spec.stages.forEach((s) => machinery.add(s.id));
  if (spec.kind === 'compare') spec.columns.forEach((c) => { machinery.add(c.id); if (c.tone) machinery.add(c.tone); });
  if (spec.kind === 'cells') spec.cells.forEach((c) => machinery.add(c.id));
  if (spec.kind === 'timeline') spec.eras.forEach((e) => machinery.add(e.id));
  return strings.filter((s) => !machinery.has(s));
}

const ALL: DiagramSpec[] = [
  FLOW_FIXTURE,
  SEQUENCE_FIXTURE,
  LAYERS_FIXTURE,
  ZONES_FIXTURE,
  CYCLE_FIXTURE,
  COMPARE_FIXTURE,
  CELLS_FIXTURE,
  TIMELINE_FIXTURE,
];

describe('buildOutline', () => {
  it.each(ALL.map((s) => [s.kind, s] as const))('%s outline carries every editorial string', (_kind, spec) => {
    const text = buildOutline(spec).join('\n');
    for (const s of everyStringIn(spec)) expect(text).toContain(s);
  });

  it('sequence outline preserves message order', () => {
    const lines = buildOutline(SEQUENCE_FIXTURE);
    const first = lines.findIndex((l) => l.includes('POST /token'));
    const last = lines.findIndex((l) => l.includes('200 access token'));
    expect(first).toBeGreaterThan(-1);
    expect(last).toBeGreaterThan(first);
  });

  it('layers outline reads top-to-bottom', () => {
    const lines = buildOutline(LAYERS_FIXTURE);
    const edge = lines.findIndex((l) => l.includes('Edge'));
    const infra = lines.findIndex((l) => l.includes('Infrastructure'));
    expect(edge).toBeGreaterThan(-1);
    expect(infra).toBeGreaterThan(edge);
  });

  it('cycle outline says the loop closes', () => {
    const text = buildOutline(CYCLE_FIXTURE).join('\n');
    expect(text).toMatch(/returns to|back to/i);
  });

  it('timeline outline names the current era', () => {
    const text = buildOutline(TIMELINE_FIXTURE).join('\n');
    expect(text).toMatch(/current: Orchestration/);
  });
});
