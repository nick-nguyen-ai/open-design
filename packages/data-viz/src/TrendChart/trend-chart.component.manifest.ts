import type { ComponentManifest } from '@enterprise-design/contracts';

/**
 * TrendChart — time-series line/area chart built on the ECharts adapter
 * (`packages/data-viz/src/adapter`). See `TrendChart.tsx` for states and
 * `buildTrendChartOption.ts` for the pure, unit-tested option builder.
 */
const trendChartManifest: ComponentManifest = {
  schemaVersion: '1.0',
  id: 'comp.trend-chart',
  name: 'Trend Chart',
  version: '1.0.0',
  description:
    'A time-series line/area chart with per-series average reference lines, a visually-hidden data-table equivalent, and theme-reactive colour.',
  category: 'chart',
  subcategory: 'timeseries',
  sourcePath: 'packages/data-viz/src/TrendChart/TrendChart.tsx',
  exportName: 'TrendChart',
  previewRoute: '/components/comp.trend-chart',
  designGrammars: ['precision-grid'],
  compatibleSurfaces: ['dashboard', 'project-page', 'technical-explainer'],
  businessIntents: ['communicate-trend', 'communicate-performance'],
  audiences: ['executive', 'business', 'risk-and-governance', 'technical'],
  density: ['low', 'medium'],
  motionLevel: 2,
  corporateSuitability: ['restricted', 'standard', 'expressive'],
  themeModes: ['light', 'dark', 'adaptive'],
  contentRequirements: {
    requiredFields: ['series', 'title'],
    optionalFields: ['unit', 'yAxisLabel', 'variant', 'sourceNote', 'showAverageLine'],
    minItems: 1,
    acceptedDataShapes: ['time-series'],
    emptyStateSupported: true,
    loadingStateSupported: true,
    errorStateSupported: true,
  },
  dependencies: [
    {
      packageName: 'echarts',
      purpose: 'SVG-renderer line/area chart rendering (registered via the modular ECharts adapter)',
      optional: false,
      adapter: 'packages/data-viz/src/adapter',
    },
  ],
  compatibility: {
    worksWellWith: ['comp.kpi-tile', 'comp.category-bar-chart'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: ['min-width-320'],
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
    bundleCostKbGzip: 45,
    usesCanvas: false,
    usesWebGL: false,
    supportsLazyLoad: true,
    recommendedDataLimit: 500,
    fallbackComponentId: 'comp.kpi-tile',
  },
  provenance: {
    author: 'design-system',
    assetSources: [],
    licenceReviewed: true,
    generatedAssets: false,
    reviewRecord: 'REV-2026-T7-001',
  },
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-11',
    qualityScore: 90,
    notes: ['Series differentiated by line dash + marker shape, not colour alone.'],
  },
  tags: ['chart', 'trend', 'timeseries', 'line', 'area', 'echarts'],
  searchText:
    'Trend Chart. Time-series line or area chart for showing a metric changing over time, with an optional dashed average reference line per series. Use when you need to show trend, trajectory, or performance over a date/period axis for one or more series. Do not use for a single point-in-time comparison across categories (use Category Bar Chart instead) or for a single headline number (use KPI Tile).',
};

export default trendChartManifest;
