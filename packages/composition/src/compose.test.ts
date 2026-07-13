import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { compileRegistry } from '@enterprise-design/registry';
import { DesignBlueprint, type DesignContext, type SurfaceType } from '@enterprise-design/contracts';
import { composeDesign } from './compose.js';
import type { CompositionRegistry } from './types.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

let registry: CompositionRegistry;

beforeAll(async () => {
  const compiled = await compileRegistry({ cwd: REPO_ROOT });
  expect(compiled.ok).toBe(true);
  registry = {
    components: compiled.components,
    grammars: compiled.grammars,
    motionSequences: compiled.motionSequences,
  };
});

export function makeContext(overrides: Partial<DesignContext> = {}): DesignContext {
  return {
    requestId: 'req-compose',
    surface: 'dashboard',
    businessIntent: ['monitor-risk'],
    audience: ['executive'],
    contentSummary: 'Executive risk overview.',
    availableContent: {
      headings: ['Overview', 'Trends', 'Status'],
      narrativeSections: 1,
      kpis: 4,
      tables: 1,
      timeSeries: 2,
      categories: 3,
      processes: 1,
      entities: 2,
      decisions: 1,
      risks: 3,
      milestones: 0,
      codeBlocks: 0,
      citations: 0,
      mediaAssets: 0,
    },
    desiredTone: ['calm'],
    density: 'medium',
    motionPreference: 2,
    themeMode: 'light',
    corporateSuitability: 'standard',
    technicalConstraints: {
      framework: 'react',
      buildTool: 'vite',
      styling: 'tailwind',
      externalRuntimeNetworkAllowed: false,
      approvedDependencies: [],
      prohibitedDependencies: [],
      targetBrowsers: ['chrome', 'edge'],
      ssrRequired: false,
      staticExportRequired: true,
    },
    accessibilityRequirements: {
      target: 'WCAG-2.2-AA',
      reducedMotionRequired: true,
      keyboardRequired: true,
      screenReaderRequired: true,
      highContrastRequired: false,
    },
    requiredCapabilities: [],
    prohibitedCapabilities: [],
    ...overrides,
  };
}

describe('composeDesign', () => {
  it('produces a schema-valid blueprint', () => {
    const bp = composeDesign(makeContext(), registry);
    expect(DesignBlueprint.safeParse(bp).success).toBe(true);
  });

  it('covers multiple composition roles from real component ids', () => {
    const bp = composeDesign(makeContext(), registry);
    const placed = bp.routes.flatMap((r) => r.sections.flatMap((s) => s.componentPlacements));
    const roles = new Set(placed.map((p) => p.role));
    expect(roles.has('summary')).toBe(true);
    expect(roles.has('primary-visual')).toBe(true);
    expect(roles.has('detail')).toBe(true);
    // Only real registry ids are ever placed.
    const known = new Set(registry.components.map((c) => c.id));
    expect(placed.every((p) => known.has(p.componentId))).toBe(true);
  });

  it('is deterministic — identical inputs give a byte-identical blueprint', () => {
    const a = composeDesign(makeContext(), registry);
    const b = composeDesign(makeContext(), registry);
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
    expect(a.blueprintId).toBe(b.blueprintId);
  });

  it('emits exactly one signature motion sequence within the 1200ms cap', () => {
    const bp = composeDesign(makeContext(), registry);
    const sigIds = new Set(registry.motionSequences.map((m) => m.sequenceId));
    const signatureCount = bp.routes
      .flatMap((r) => r.sections)
      .filter((s) => s.motionSequence && sigIds.has(s.motionSequence.sequenceId)).length;
    expect(signatureCount).toBe(1);
    const seq = bp.routes.flatMap((r) => r.sections).find((s) => s.motionSequence)?.motionSequence;
    expect(seq?.totalDurationMs).toBeLessThanOrEqual(1200);
    expect(seq?.reducedMotionVariant.length).toBeGreaterThan(0);
  });

  it('produces three structurally-distinct alternatives (not theme swaps)', () => {
    const bp = composeDesign(makeContext(), registry);
    const modes = bp.alternatives.map((a) => a.mode);
    expect(modes).toEqual(['conservative', 'recommended', 'expressive']);
    const ids = bp.alternatives.map((a) => a.blueprintId);
    expect(new Set(ids).size).toBe(3); // all distinct
    for (const alt of bp.alternatives) {
      expect(alt.differenceSummary.length).toBeGreaterThan(0);
      // No alternative describes itself purely as a theme change.
      expect(alt.differenceSummary.join(' ').toLowerCase()).not.toContain('theme');
    }
    // conservative and expressive differ in motion from recommended.
    const conservative = composeDesign(makeContext(), registry, { alternativeMode: 'conservative' });
    const expressive = composeDesign(makeContext(), registry, { alternativeMode: 'expressive' });
    expect(conservative.motionLevel).toBeLessThanOrEqual(expressive.motionLevel);
    expect(conservative.blueprintId).not.toBe(expressive.blueprintId);
  });

  it('every placement carries responsive rules (responsive fallback presence)', () => {
    const bp = composeDesign(makeContext(), registry);
    const placed = bp.routes.flatMap((r) => r.sections.flatMap((s) => s.componentPlacements));
    expect(placed.length).toBeGreaterThan(0);
    expect(placed.every((p) => p.responsiveRules.length > 0)).toBe(true);
  });

  it('honours selectedComponentIds as a candidate pool restriction', () => {
    const bp = composeDesign(makeContext(), registry, { selectedComponentIds: ['comp.kpi-tile'] });
    const placed = bp.routes.flatMap((r) => r.sections.flatMap((s) => s.componentPlacements));
    expect(placed.every((p) => p.componentId === 'comp.kpi-tile')).toBe(true);
  });

  it('never places an expressive-only component in a restricted context', () => {
    const bp = composeDesign(makeContext({ corporateSuitability: 'restricted' }), registry);
    const placed = bp.routes.flatMap((r) => r.sections.flatMap((s) => s.componentPlacements));
    // comp.flow-diagram is not restricted-safe; it must not appear.
    expect(placed.some((p) => p.componentId === 'comp.flow-diagram')).toBe(false);
    expect(bp.implementationNotes.some((n) => n.startsWith('corporate-mode:restricted'))).toBe(true);
  });

  it('clamps motion to the surface cap', () => {
    const surfaces: SurfaceType[] = ['dashboard', 'project-page'];
    for (const surface of surfaces) {
      const bp = composeDesign(makeContext({ surface, motionPreference: 3 }), registry);
      expect(bp.motionLevel).toBeLessThanOrEqual(2); // dashboard/project cap
    }
  });
});
