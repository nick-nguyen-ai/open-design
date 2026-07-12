import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { compileRegistry } from './compile.js';
import { serializeArtefacts, ARTEFACT_FILES } from './emit.js';
import { CompatibilityGraph } from './compatibility.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const VALID_ROOT = path.join(here, '__fixtures__', 'valid');

describe('compileRegistry — valid fixture set', () => {
  it('discovers and validates every manifest kind with no errors', async () => {
    const result = await compileRegistry({ cwd: VALID_ROOT });
    expect(result.ok).toBe(true);
    expect(result.errorCount).toBe(0);
    expect(result.warningCount).toBe(0);
    expect(result.components.map((c) => c.id)).toEqual([
      'comp.filter-bar',
      'comp.kpi-tile',
      'comp.trend-chart',
    ]);
    expect(result.experiences.map((e) => e.id)).toEqual(['exp.risk-dashboard']);
    expect(result.grammars.map((g) => g.id)).toEqual(['precision-grid']);
    expect(result.motionSequences.map((m) => m.sequenceId)).toEqual(['reveal-sequence']);
  });

  it('sorts every top-level array by id', async () => {
    const result = await compileRegistry({ cwd: VALID_ROOT });
    const ids = result.searchDocuments.map((d) => d.id);
    expect(ids).toEqual([...ids].sort());
    expect(result.compatibility.nodes.map((n) => n.id)).toEqual([
      'comp.filter-bar',
      'comp.kpi-tile',
      'comp.trend-chart',
    ]);
  });

  it('produces byte-identical artefacts across re-runs (deterministic)', async () => {
    const first = serializeArtefacts(await compileRegistry({ cwd: VALID_ROOT }));
    const second = serializeArtefacts(await compileRegistry({ cwd: VALID_ROOT }));
    expect(Object.keys(first).sort()).toEqual(Object.values(ARTEFACT_FILES).sort());
    for (const name of Object.keys(first)) {
      expect(second[name]).toBe(first[name]);
    }
  });

  it('emits stable, sorted JSON keys and a trailing newline', async () => {
    const artefacts = serializeArtefacts(await compileRegistry({ cwd: VALID_ROOT }));
    const grammars = artefacts[ARTEFACT_FILES.grammars] ?? '';
    expect(grammars.endsWith('\n')).toBe(true);
    // "id" sorts before "intent" before "name" — proves recursive key sorting.
    const parsed = JSON.parse(grammars) as Array<Record<string, unknown>>;
    expect(parsed).toHaveLength(1);
    const keys = Object.keys(parsed[0] ?? {});
    expect(keys).toEqual([...keys].sort());
  });
});

describe('compatibility graph', () => {
  it('answers worksWellWith / conflictsFor / rolesFor / requiresOneOf / maxInstancesFor', async () => {
    const result = await compileRegistry({ cwd: VALID_ROOT });
    const graph = new CompatibilityGraph(result.compatibility);

    expect(graph.worksWellWith('comp.kpi-tile')).toEqual(['comp.trend-chart']);
    expect(graph.conflictsFor('comp.kpi-tile')).toEqual(['comp.filter-bar']);
    expect(graph.conflictsFor('comp.filter-bar')).toEqual(['comp.kpi-tile']);
    expect(graph.rolesFor('comp.filter-bar')).toEqual(['navigation']);
    expect(graph.maxInstancesFor('comp.kpi-tile')).toBe(6);
    expect(graph.maxInstancesFor('comp.trend-chart')).toBeUndefined();
    expect(graph.has('comp.unknown')).toBe(false);
    expect(graph.conflictsFor('comp.unknown')).toEqual([]);
  });

  it('allows asymmetric worksWellWith without any diagnostic', async () => {
    const result = await compileRegistry({ cwd: VALID_ROOT });
    const graph = new CompatibilityGraph(result.compatibility);
    // comp.trend-chart works well with comp.filter-bar, which does not reciprocate.
    expect(graph.worksWellWith('comp.trend-chart')).toContain('comp.filter-bar');
    expect(graph.worksWellWith('comp.filter-bar')).not.toContain('comp.trend-chart');
    // Only conflictsWith is symmetry-checked, so this stays completely clean.
    expect(result.diagnostics).toEqual([]);
    expect(result.ok).toBe(true);
  });
});

describe('search document generation', () => {
  it('builds a component document with non-empty text and component facets', async () => {
    const result = await compileRegistry({ cwd: VALID_ROOT });
    const doc = result.searchDocuments.find((d) => d.id === 'comp.trend-chart');
    expect(doc).toBeDefined();
    expect(doc?.entityType).toBe('component');
    expect(doc?.title).toBe('Trend Chart');
    expect(doc?.text.length).toBeGreaterThan(0);
    expect(doc?.text).toContain('trend chart');
    expect(doc?.route).toBe('/preview/comp.trend-chart');
    expect(doc?.facets).toMatchObject({
      category: 'chart',
      motionLevel: 2,
      renderingCost: 'medium',
      usesCanvas: true,
      approval: 'approved',
    });
    // Components emit the full array of every density / suitability they support.
    expect(doc?.facets.density).toEqual(['low', 'medium']);
    expect(doc?.facets.corporateSuitability).toEqual(['standard', 'expressive']);
    // Components emit `surfaces` (array) from compatibleSurfaces — no single `surface`.
    expect(doc?.facets.surfaces).toEqual(['dashboard']);
    expect(doc?.facets.surface).toBeUndefined();
  });

  it('builds an experience document with surface + grammar facets (single values wrapped as arrays)', async () => {
    const result = await compileRegistry({ cwd: VALID_ROOT });
    const doc = result.searchDocuments.find((d) => d.id === 'exp.risk-dashboard');
    expect(doc?.entityType).toBe('experience');
    expect(doc?.text.length).toBeGreaterThan(0);
    expect(doc?.facets).toMatchObject({
      surface: 'dashboard',
      grammarId: 'precision-grid',
    });
    expect(doc?.facets.density).toEqual(['high']);
    expect(doc?.facets.corporateSuitability).toEqual(['standard']);
    // Experiences emit both the single `surface` (back-compat) and the array `surfaces`.
    expect(doc?.facets.surfaces).toEqual(['dashboard']);
  });

  it('builds grammar and motion documents with non-empty text', async () => {
    const result = await compileRegistry({ cwd: VALID_ROOT });
    const grammar = result.searchDocuments.find((d) => d.id === 'precision-grid');
    const motion = result.searchDocuments.find((d) => d.id === 'reveal-sequence');
    expect(grammar?.entityType).toBe('grammar');
    expect(grammar?.facets.grammarId).toBe('precision-grid');
    expect(grammar?.text.length).toBeGreaterThan(0);
    expect(motion?.entityType).toBe('motion');
    expect(motion?.text.length).toBeGreaterThan(0);
  });
});
