import { buildComponent } from '../../../_builders.js';

export default buildComponent({
  id: 'comp.kpi-tile',
  name: 'KPI Tile',
  category: 'content',
  motionLevel: 1,
  tags: ['kpi', 'metric'],
  compatibility: {
    worksWellWith: ['comp.trend-chart'],
    conflictsWith: ['comp.filter-bar'],
    requiresOneOf: [],
    layoutRequirements: ['min-width-160'],
    compositionRoles: ['summary'],
    maxInstancesPerViewport: 6,
  },
});
