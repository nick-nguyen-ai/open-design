import type { ComponentManifest } from '@enterprise-design/contracts';

/**
 * StatusList — a list of status items, each with an icon (shape) + label +
 * colour, timestamped rows optionally forming an event log.
 */
const statusListManifest: ComponentManifest = {
  schemaVersion: '1.0',
  id: 'comp.status-list',
  name: 'Status List',
  version: '1.0.0',
  description:
    'A list of status items, each encoded by a Badge tone AND a distinct icon shape (never colour alone), with an optional timestamp for an event-log view.',
  category: 'status',
  subcategory: 'list',
  sourcePath: 'packages/content-components/src/StatusList/StatusList.tsx',
  exportName: 'StatusList',
  previewRoute: '/components/comp.status-list',
  designGrammars: ['precision-grid'],
  compatibleSurfaces: ['dashboard', 'project-page', 'technical-explainer'],
  businessIntents: ['communicate-status', 'communicate-risk'],
  audiences: ['business', 'risk-and-governance', 'technical'],
  density: ['medium', 'high'],
  motionLevel: 0,
  corporateSuitability: ['restricted', 'standard', 'expressive'],
  themeModes: ['light', 'dark', 'adaptive'],
  contentRequirements: {
    requiredFields: ['items'],
    optionalFields: ['title', 'loadingCount'],
    acceptedDataShapes: ['categorical', 'event-log'],
    emptyStateSupported: true,
    loadingStateSupported: true,
    errorStateSupported: true,
  },
  dependencies: [],
  compatibility: {
    worksWellWith: ['comp.kpi-tile'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: ['min-width-240'],
    compositionRoles: ['detail', 'evidence'],
    maxInstancesPerViewport: 3,
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
    bundleCostKbGzip: 5,
    usesCanvas: false,
    usesWebGL: false,
    supportsLazyLoad: true,
    recommendedDataLimit: 100,
  },
  provenance: {
    author: 'design-system',
    assetSources: [],
    licenceReviewed: true,
    generatedAssets: false,
    reviewRecord: 'REV-2026-T7-004',
  },
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-11',
    qualityScore: 91,
    notes: ['Every status row carries a Badge tone and a distinct icon shape.'],
  },
  tags: ['status', 'list', 'event-log'],
  searchText:
    'Status List. A vertical list of status items — icon, label, badge, optional description, optional timestamp — for showing the state of a set of discrete things (checks, feeds, approvals) or a chronological event log. Use for a set of individually-labelled statuses. Do not use for a single aggregate metric (use KPI Tile) or a continuous series over time (use Trend Chart).',
};

export default statusListManifest;
