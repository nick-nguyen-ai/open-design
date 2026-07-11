import type { ComponentManifest } from '@enterprise-design/contracts';

/**
 * CategoryBarChart — a categorical bar chart built on the ECharts adapter,
 * with an optional per-category target marker (diamond, distinct from the
 * bar shape) and always-visible value labels.
 */
const categoryBarChartManifest: ComponentManifest = {
  schemaVersion: '1.0',
  id: 'comp.category-bar-chart',
  name: 'Category Bar Chart',
  version: '1.0.0',
  description:
    'A categorical bar chart with always-visible value labels and an optional per-category target marker, built on the ECharts SVG-renderer adapter.',
  category: 'chart',
  subcategory: 'categorical',
  sourcePath: 'packages/data-viz/src/CategoryBarChart/CategoryBarChart.tsx',
  exportName: 'CategoryBarChart',
  previewRoute: '/preview/comp.category-bar-chart',
  designGrammars: ['precision-grid'],
  compatibleSurfaces: ['dashboard', 'project-page', 'technical-explainer'],
  businessIntents: ['communicate-comparison', 'communicate-performance'],
  audiences: ['executive', 'business', 'risk-and-governance', 'technical'],
  density: ['low', 'medium'],
  motionLevel: 2,
  corporateSuitability: ['restricted', 'standard', 'expressive'],
  themeModes: ['light', 'dark', 'adaptive'],
  contentRequirements: {
    requiredFields: ['data', 'title'],
    optionalFields: ['unit', 'orientation', 'sourceNote'],
    minItems: 1,
    acceptedDataShapes: ['categorical'],
    emptyStateSupported: true,
    loadingStateSupported: true,
    errorStateSupported: true,
  },
  dependencies: [
    {
      packageName: 'echarts',
      purpose: 'SVG-renderer bar/scatter chart rendering (registered via the modular ECharts adapter)',
      optional: false,
      adapter: 'packages/data-viz/src/adapter',
    },
  ],
  compatibility: {
    worksWellWith: ['comp.kpi-tile', 'comp.trend-chart'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: ['min-width-280'],
    compositionRoles: ['primary-visual', 'secondary-visual'],
    maxInstancesPerViewport: 4,
  },
  accessibility: {
    keyboardAccessible: true,
    screenReaderLabels: true,
    nonColourEncoding: true,
    reducedMotion: true,
    focusVisible: true,
    contrastTested: true,
    knownLimitations: [
      'The ECharts SVG mount is aria-hidden; the visually-hidden data table is the accessible content equivalent, not the chart canvas itself.',
    ],
  },
  performance: {
    renderingCost: 'medium',
    bundleCostKbGzip: 42,
    usesCanvas: false,
    usesWebGL: false,
    supportsLazyLoad: true,
    recommendedDataLimit: 200,
    fallbackComponentId: 'comp.kpi-tile',
  },
  provenance: {
    author: 'design-system',
    assetSources: [],
    licenceReviewed: true,
    generatedAssets: false,
    reviewRecord: 'REV-2026-T7-002',
  },
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-11',
    qualityScore: 90,
    notes: ['Values always carry a visible data label; target is a diamond marker, not a colour-only cue.'],
  },
  tags: ['chart', 'bar', 'categorical', 'echarts'],
  searchText:
    'Category Bar Chart. Bar chart for comparing a metric across a fixed set of categories, with always-visible value labels and an optional per-category target diamond marker. Use for ranking or comparing categories at a single point in time. Do not use for a metric changing over time (use Trend Chart) or for a single headline number (use KPI Tile).',
};

export default categoryBarChartManifest;
