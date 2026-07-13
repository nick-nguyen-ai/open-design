import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { compileRegistry } from '@enterprise-design/registry';
import { DesignBlueprint, type DesignContext, type SurfaceType } from '@enterprise-design/contracts';
import { composeDesign } from './compose.js';
import { rankCandidates } from './components.js';
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

  it('gives contexts differing only in density different blueprintIds', () => {
    const low = composeDesign(makeContext({ density: 'low' }), registry);
    const high = composeDesign(makeContext({ density: 'high' }), registry);
    expect(low.blueprintId).not.toBe(high.blueprintId);
  });

  it('gives contexts differing only in audience different blueprintIds', () => {
    const exec = composeDesign(makeContext({ audience: ['executive'] }), registry);
    const tech = composeDesign(makeContext({ audience: ['technical'] }), registry);
    expect(exec.blueprintId).not.toBe(tech.blueprintId);
  });

  it('carries real per-component evidence, not a rebuilt stub', () => {
    // Real registry components declare intents like 'communicate-risk' /
    // 'communicate-performance' (see comp.status-list, comp.kpi-tile); use
    // matching intents so we can assert matchedIntents actually flows through.
    const ctx = makeContext({ businessIntent: ['communicate-risk', 'communicate-performance'] });
    const bp = composeDesign(ctx, registry);
    const componentEvidence = bp.evidence.filter((e) => e.componentId !== bp.grammarId);
    expect(componentEvidence.length).toBeGreaterThan(0);
    for (const ev of componentEvidence) {
      expect(ev.matchedConstraints.length).toBeGreaterThan(0);
      // score must be the real selection score (a float around 1-3), never
      // the placement's ordinal priority (which would always be a small
      // positive integer counting up from 1 per section) masquerading as one.
      expect(ev.score).toBeGreaterThan(0);
      expect(ev.explanation).toContain(ev.componentId);
    }
    const withIntents = componentEvidence.filter((e) => e.matchedIntents.length > 0);
    expect(withIntents.length).toBeGreaterThan(0);
  });

  it('evidence score equals the real selection score, not the placement priority ordinal', () => {
    const bp = composeDesign(makeContext(), registry);
    const placements = bp.routes.flatMap((r) => r.sections.flatMap((s) => s.componentPlacements));
    const componentEvidence = bp.evidence.filter((e) => e.componentId !== bp.grammarId);
    expect(componentEvidence.length).toBeGreaterThan(0);
    for (const ev of componentEvidence) {
      const placement = placements.find((p) => p.componentId === ev.componentId);
      expect(placement).toBeDefined();
      if (!placement) continue;
      // Independently recompute the candidate's real score via the same
      // ranking function `compose.ts` uses for selection, and assert the
      // evidence score matches it exactly.
      const { ranked } = rankCandidates(placement.role, makeContext(), registry);
      const expected = ranked.find((c) => c.component.id === placement.componentId);
      expect(expected).toBeDefined();
      expect(ev.score).toBe(expected?.score);
      // The ordinal priority counts sections 1..N in placement order and is
      // unrelated to match quality — for this fixture (executive audience +
      // monitor-risk intent + medium density) at least one placed component
      // has a fractional real score, which an integer ordinal could never equal.
    }
    expect(componentEvidence.some((ev) => !Number.isInteger(ev.score))).toBe(true);
  });
});
