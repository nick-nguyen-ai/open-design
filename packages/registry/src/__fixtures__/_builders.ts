import type {
  AccessibilityManifest,
  ApprovalManifest,
  CompatibilityManifest,
  ComponentManifest,
  ContentRequirements,
  DesignGrammar,
  ExperienceManifest,
  MotionSequence,
  PerformanceManifest,
  ProvenanceManifest,
} from '@enterprise-design/contracts';

/**
 * Test-fixture builders. Every fixture manifest is a real source file that the
 * compiler dynamically imports; these builders keep them terse by supplying a
 * fully-valid baseline that individual fixtures override to exercise one rule.
 * Not discovered themselves (no `*.manifest.ts` suffix).
 */

export const DEFAULT_COMPATIBILITY: CompatibilityManifest = {
  worksWellWith: [],
  conflictsWith: [],
  requiresOneOf: [],
  layoutRequirements: [],
  compositionRoles: ['summary'],
};

export const DEFAULT_ACCESSIBILITY: AccessibilityManifest = {
  keyboardAccessible: true,
  screenReaderLabels: true,
  nonColourEncoding: true,
  reducedMotion: true,
  focusVisible: true,
  contrastTested: true,
  knownLimitations: [],
};

export const DEFAULT_PERFORMANCE: PerformanceManifest = {
  renderingCost: 'low',
  bundleCostKbGzip: 12,
  usesCanvas: false,
  usesWebGL: false,
  supportsLazyLoad: true,
};

export const DEFAULT_PROVENANCE: ProvenanceManifest = {
  author: 'design-system',
  assetSources: [],
  licenceReviewed: true,
  generatedAssets: false,
  reviewRecord: 'REV-2026-001',
};

export const DEFAULT_APPROVAL: ApprovalManifest = {
  state: 'approved',
  reviewer: 'design-lead',
  reviewedAt: '2026-01-01',
  qualityScore: 92,
  notes: [],
};

const DEFAULT_CONTENT_REQUIREMENTS: ContentRequirements = {
  requiredFields: ['title'],
  optionalFields: [],
  acceptedDataShapes: ['object'],
  emptyStateSupported: true,
  loadingStateSupported: true,
  errorStateSupported: true,
};

export function buildComponent(
  overrides: Partial<ComponentManifest> & { id: string; name: string },
): ComponentManifest {
  return {
    schemaVersion: '1.0',
    version: '1.0.0',
    description: `${overrides.name} for enterprise dashboards`,
    category: 'content',
    subcategory: 'summary',
    sourcePath: `packages/${overrides.id}/index.tsx`,
    exportName: 'Component',
    previewRoute: `/preview/${overrides.id}`,
    designGrammars: ['precision-grid'],
    compatibleSurfaces: ['dashboard'],
    businessIntents: ['communicate-status'],
    audiences: ['business'],
    density: ['medium'],
    motionLevel: 0,
    corporateSuitability: ['standard'],
    themeModes: ['light', 'dark'],
    contentRequirements: DEFAULT_CONTENT_REQUIREMENTS,
    dependencies: [],
    compatibility: DEFAULT_COMPATIBILITY,
    accessibility: DEFAULT_ACCESSIBILITY,
    performance: DEFAULT_PERFORMANCE,
    provenance: DEFAULT_PROVENANCE,
    approval: DEFAULT_APPROVAL,
    tags: ['sample'],
    searchText: `${overrides.name} enterprise dashboard component`,
    ...overrides,
  };
}

export function buildExperience(
  overrides: Partial<ExperienceManifest> & { id: string; title: string },
): ExperienceManifest {
  return {
    schemaVersion: '1.0',
    surface: 'dashboard',
    designThesis: `${overrides.title} presents risk exposure with executive clarity`,
    grammarId: 'precision-grid',
    audiences: ['executive'],
    businessIntents: ['communicate-risk'],
    density: 'high',
    motionLevel: 1,
    signatureSequence: 'reveal-sequence',
    corporateSuitability: 'standard',
    themeModes: ['light', 'dark'],
    componentsUsed: ['comp.kpi-tile', 'comp.trend-chart'],
    routes: [{ path: '/dashboard', title: 'Overview', purpose: 'landing' }],
    previewRoute: `/preview/${overrides.id}`,
    approval: DEFAULT_APPROVAL,
    tags: ['risk'],
    searchText: `${overrides.title} risk exposure executive dashboard`,
    ...overrides,
  };
}

export function buildGrammar(overrides: Partial<DesignGrammar> & { id: string }): DesignGrammar {
  return {
    name: 'Precision Grid',
    intent: 'Dense, trustworthy layouts for governance and risk surfaces',
    layoutRules: ['12-column grid', 'consistent gutters'],
    typographyRules: ['tabular numerals'],
    navigationRules: ['persistent left rail'],
    chartRules: ['no chartjunk'],
    diagramRules: ['orthogonal connectors'],
    motionRules: ['sub-200ms transitions'],
    signatureSequences: ['reveal-sequence'],
    surfaceRules: ['dashboard-first'],
    preferredComponents: ['comp.kpi-tile'],
    prohibitedPatterns: ['auto-playing video'],
    accessibilityNotes: ['WCAG AA contrast'],
    exampleExperienceIds: ['exp.risk-dashboard'],
    ...overrides,
  };
}

export function buildMotion(
  overrides: Partial<MotionSequence> & { sequenceId: string },
): MotionSequence {
  return {
    name: 'Reveal Sequence',
    description: 'Staggered entrance for dashboard summary tiles',
    trigger: 'enter',
    order: ['comp.kpi-tile', 'comp.trend-chart'],
    totalDurationMs: 600,
    reducedMotionVariant: 'instant fade with no stagger',
    ...overrides,
  };
}
