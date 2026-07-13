import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { compileRegistry } from '@enterprise-design/registry';
import { composeDesign } from '@enterprise-design/composition';
import type {
  ComponentManifest,
  ContentDensity,
  CorporateSuitability,
  DesignBlueprint,
  DesignContext,
  SurfaceType,
} from '@enterprise-design/contracts';
import { validateComposition } from './validate.js';
import type { ValidationRegistry } from './types.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

let registry: ValidationRegistry;

beforeAll(async () => {
  const compiled = await compileRegistry({ cwd: REPO_ROOT });
  expect(compiled.ok).toBe(true);
  registry = {
    components: compiled.components,
    grammars: compiled.grammars,
    motionSequences: compiled.motionSequences,
  };
});

function makeContext(overrides: Partial<DesignContext> = {}): DesignContext {
  return {
    requestId: 'req-validate',
    surface: 'dashboard',
    businessIntent: ['monitor-risk'],
    audience: ['executive'],
    contentSummary: 'Executive risk overview.',
    availableContent: {
      headings: ['Overview', 'Trends'],
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

const clone = (bp: DesignBlueprint): DesignBlueprint => structuredClone(bp);
const ruleIds = (bp: unknown, reg = registry, profile: 'draft' | 'corporate' | 'release' = 'release') =>
  new Set(validateComposition(bp, reg, profile).findings.map((f) => f.ruleId));

/** Registry with an injected conflict/companion edge, for the compatibility fixtures. */
function withComponentEdit(id: string, edit: (c: ComponentManifest) => void): ValidationRegistry {
  const components = registry.components.map((c) => {
    if (c.id !== id) return c;
    const copy = structuredClone(c);
    edit(copy);
    return copy;
  });
  return { ...registry, components };
}

describe('validateComposition — clean blueprints', () => {
  it('a composed blueprint validates clean at release', () => {
    const bp = composeDesign(makeContext(), registry);
    const result = validateComposition(bp, registry, 'release');
    if (!result.valid) console.error(JSON.stringify(result.findings, null, 2));
    expect(result.valid).toBe(true);
    expect(result.findings).toEqual([]);
    expect(result.score).toBe(100);
  });
});

describe('validateComposition — seeded invalid fixtures (one per rule)', () => {
  it('SCHEMA-001: structurally invalid blueprint', () => {
    const bp = clone(composeDesign(makeContext(), registry)) as unknown as Record<string, unknown>;
    delete bp.blueprintId;
    expect(ruleIds(bp)).toEqual(new Set(['SCHEMA-001']));
  });

  it('REG-001: unknown component id', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    const first = bp.routes[0]!.sections[0]!.componentPlacements[0]!;
    first.componentId = 'comp.does-not-exist';
    expect(ruleIds(bp)).toContain('REG-001');
    expect([...ruleIds(bp)].every((r) => r === 'REG-001' || r === 'COMP-002')).toBe(true);
  });

  it('COMP-001: explicit component conflict (via registry edge)', () => {
    const bp = composeDesign(makeContext(), registry);
    const reg = withComponentEdit('comp.kpi-tile', (c) => {
      c.compatibility.conflictsWith = ['comp.trend-chart'];
    });
    expect(ruleIds(bp, reg)).toContain('COMP-001');
  });

  it('COMP-002: missing required companion (via registry edge)', () => {
    const bp = composeDesign(makeContext(), registry);
    const reg = withComponentEdit('comp.kpi-tile', (c) => {
      c.compatibility.requiresOneOf = ['comp.ghost-companion'];
    });
    expect(ruleIds(bp, reg)).toContain('COMP-002');
  });

  it('IA-001: excessive navigation depth without breadcrumb', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.routes[0]!.path = '/a/b/c/d';
    expect(ruleIds(bp)).toContain('IA-001');
  });

  it('IA-002: multiple dominant visuals in one section', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    const section = bp.routes[0]!.sections.find((s) =>
      s.componentPlacements.some((p) => p.role === 'primary-visual'),
    )!;
    const existing = section.componentPlacements.find((p) => p.role === 'primary-visual')!;
    section.componentPlacements.push({ ...existing, componentId: 'comp.category-bar-chart' });
    expect(ruleIds(bp)).toEqual(new Set(['IA-002']));
  });

  it('CONTENT-001: unmapped required content (missing: marker)', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.routes[0]!.sections[0]!.componentPlacements[0]!.propsMapping.data = 'missing:q3-figure';
    expect(ruleIds(bp)).toEqual(new Set(['CONTENT-001']));
  });

  it('A11Y-001: primary visual without a textual equivalent', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.accessibilityStrategy.chartEquivalents = {};
    expect(ruleIds(bp)).toContain('A11Y-001');
  });

  it('A11Y-002: reduced-motion fallback absent', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    const section = bp.routes[0]!.sections.find((s) => s.motionSequence)!;
    // A single space keeps the schema's min(1) happy so the finding reaches A11Y-002.
    section.motionSequence!.reducedMotionVariant = ' ';
    expect(ruleIds(bp)).toEqual(new Set(['A11Y-002']));
  });

  it('MOTION-001: surface motion cap exceeded', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.motionLevel = 3; // dashboard cap is 2
    expect(ruleIds(bp)).toEqual(new Set(['MOTION-001']));
  });

  it('MOTION-002: signature-moment count not exactly one', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    for (const section of bp.routes[0]!.sections) delete section.motionSequence;
    expect(ruleIds(bp)).toEqual(new Set(['MOTION-002']));
  });

  it('PERF-001: more than two high-cost visuals in one section', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    const section = bp.routes[0]!.sections[0]!;
    const costly = { ...section.componentPlacements[0]!, role: 'secondary-visual' as const };
    section.componentPlacements = [
      { ...costly, componentId: 'comp.trend-chart', region: 'r1' },
      { ...costly, componentId: 'comp.category-bar-chart', region: 'r2' },
      { ...costly, componentId: 'comp.trend-chart', region: 'r3' },
    ];
    // chart placements need equivalents to isolate PERF-001 from A11Y-001; these are secondary-visual so A11Y-001 (primary only) does not fire.
    expect(ruleIds(bp)).toContain('PERF-001');
  });

  it('CORP-001: expressive-only component in restricted mode', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.implementationNotes = ['corporate-mode:restricted'];
    // Ensure a non-restricted-safe component (flow-diagram) is present.
    bp.routes[0]!.sections[0]!.componentPlacements.push({
      ...bp.routes[0]!.sections[0]!.componentPlacements[0]!,
      componentId: 'comp.flow-diagram',
      role: 'detail',
    });
    expect(ruleIds(bp)).toContain('CORP-001');
  });

  it('THEME-001: raw colour value in token overrides', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.tokens.colour = { '--surface-raised': '#ff0000' };
    expect(ruleIds(bp)).toEqual(new Set(['THEME-001']));
  });
});

describe('validateComposition — profile escalation', () => {
  it('a warning-level finding blocks at release but not at draft', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.motionLevel = 3; // MOTION-001 (base warning)
    expect(validateComposition(bp, registry, 'draft').valid).toBe(true);
    expect(validateComposition(bp, registry, 'release').valid).toBe(false);
  });

  it('a corporate warning escalates to an error at the corporate profile', () => {
    const bp = clone(composeDesign(makeContext(), registry));
    bp.implementationNotes = ['corporate-mode:restricted'];
    bp.routes[0]!.sections[0]!.componentPlacements.push({
      ...bp.routes[0]!.sections[0]!.componentPlacements[0]!,
      componentId: 'comp.flow-diagram',
      role: 'detail',
    });
    expect(validateComposition(bp, registry, 'draft').valid).toBe(true);
    expect(validateComposition(bp, registry, 'corporate').valid).toBe(false);
  });
});

describe('keystone round-trip — every composed blueprint validates clean at release', () => {
  const surfaces: SurfaceType[] = [
    'dashboard',
    'project-page',
    'slide-deck',
    'personal-page',
    'technical-explainer',
  ];
  const densities: ContentDensity[] = ['low', 'high'];
  const corps: CorporateSuitability[] = ['restricted', 'standard'];

  it('validates clean across the full 5×2×2 context matrix', () => {
    const failures: string[] = [];
    for (const surface of surfaces) {
      for (const density of densities) {
        for (const corporateSuitability of corps) {
          const context = makeContext({ surface, density, corporateSuitability, motionPreference: 2 });
          const bp = composeDesign(context, registry);
          const result = validateComposition(bp, registry, 'release');
          if (!result.valid) {
            failures.push(
              `${surface}/${density}/${corporateSuitability}: ${result.findings.map((f) => f.ruleId).join(',')}`,
            );
          }
        }
      }
    }
    if (failures.length) console.error('Round-trip failures:\n' + failures.join('\n'));
    expect(failures).toEqual([]);
  });
});
