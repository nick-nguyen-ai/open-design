import type { ComponentManifest } from '@enterprise-design/contracts';

/**
 * KpiTile — a set of KPI tiles: label, tabular-numeral value, delta, target,
 * and a non-colour-encoded status, revealed via `LedgerReveal`.
 */
const kpiTileManifest: ComponentManifest = {
  schemaVersion: '1.0',
  id: 'comp.kpi-tile',
  name: 'KPI Tile',
  version: '1.0.0',
  description:
    'A responsive set of KPI tiles — label, tabular-numeral value, delta, target, and status (badge + icon shape, never colour alone) — revealed in reading order via LedgerReveal.',
  category: 'content',
  subcategory: 'kpi',
  sourcePath: 'packages/content-components/src/KpiTile/KpiTile.tsx',
  exportName: 'KpiTile',
  previewRoute: '/preview/comp.kpi-tile',
  designGrammars: ['precision-grid'],
  compatibleSurfaces: ['dashboard', 'project-page', 'slide-deck'],
  businessIntents: ['communicate-status', 'communicate-performance'],
  audiences: ['executive', 'business', 'risk-and-governance'],
  density: ['low', 'medium', 'high'],
  motionLevel: 1,
  corporateSuitability: ['restricted', 'standard', 'expressive'],
  themeModes: ['light', 'dark', 'adaptive'],
  contentRequirements: {
    requiredFields: ['metrics'],
    optionalFields: ['title', 'loadingCount'],
    minItems: 1,
    acceptedDataShapes: ['kpi-set'],
    emptyStateSupported: true,
    loadingStateSupported: true,
    errorStateSupported: true,
  },
  dependencies: [],
  compatibility: {
    worksWellWith: ['comp.trend-chart', 'comp.category-bar-chart', 'comp.status-list'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: ['min-width-160'],
    compositionRoles: ['summary'],
    maxInstancesPerViewport: 6,
  },
  accessibility: {
    keyboardAccessible: true,
    screenReaderLabels: true,
    nonColourEncoding: true,
    reducedMotion: true,
    focusVisible: true,
    contrastTested: true,
    knownLimitations: [],
  },
  performance: {
    renderingCost: 'low',
    bundleCostKbGzip: 6,
    usesCanvas: false,
    usesWebGL: false,
    supportsLazyLoad: true,
  },
  provenance: {
    author: 'design-system',
    assetSources: [],
    licenceReviewed: true,
    generatedAssets: false,
    reviewRecord: 'REV-2026-T7-003',
  },
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-11',
    qualityScore: 93,
    notes: ['Status carries both a Badge tone and a distinct icon shape; delta direction is also an icon-shape change.'],
  },
  tags: ['kpi', 'metric', 'summary', 'status'],
  searchText:
    'KPI Tile. A set of headline metric tiles with label, value, delta versus prior period, optional target, and status (on track, at risk, off track). Use to summarise a handful of headline numbers at the top of a dashboard or report. Do not use for a single trend over time (use Trend Chart) or a long list of discrete status items (use Status List).',
};

export default kpiTileManifest;
