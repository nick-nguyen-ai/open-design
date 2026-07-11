import { buildComponent, DEFAULT_PERFORMANCE } from '../../../_builders.js';

export default buildComponent({
  id: 'comp.trend-chart',
  name: 'Trend Chart',
  category: 'chart',
  subcategory: 'timeseries',
  motionLevel: 2,
  // Multi-valued facets: this component must be discoverable under both densities
  // and both suitabilities it supports.
  density: ['low', 'medium'],
  corporateSuitability: ['standard', 'expressive'],
  tags: ['chart', 'trend'],
  performance: { ...DEFAULT_PERFORMANCE, renderingCost: 'medium', usesCanvas: true, bundleCostKbGzip: 48 },
  compatibility: {
    // worksWellWith is intentionally asymmetric: comp.filter-bar does NOT list
    // comp.trend-chart back. This must produce zero diagnostics (only
    // conflictsWith is symmetry-checked).
    worksWellWith: ['comp.kpi-tile', 'comp.filter-bar'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: [],
    compositionRoles: ['primary-visual'],
  },
});
