import { buildComponent, DEFAULT_PERFORMANCE } from '../../../_builders.js';

export default buildComponent({
  id: 'comp.trend-chart',
  name: 'Trend Chart',
  category: 'chart',
  subcategory: 'timeseries',
  motionLevel: 2,
  tags: ['chart', 'trend'],
  performance: { ...DEFAULT_PERFORMANCE, renderingCost: 'medium', usesCanvas: true, bundleCostKbGzip: 48 },
  compatibility: {
    worksWellWith: ['comp.kpi-tile'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: [],
    compositionRoles: ['primary-visual'],
  },
});
