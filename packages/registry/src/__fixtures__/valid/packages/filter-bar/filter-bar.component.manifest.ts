import { buildComponent } from '../../../_builders.js';

export default buildComponent({
  id: 'comp.filter-bar',
  name: 'Filter Bar',
  category: 'navigation',
  subcategory: 'controls',
  motionLevel: 0,
  tags: ['filter', 'controls'],
  compatibility: {
    worksWellWith: [],
    conflictsWith: ['comp.kpi-tile'],
    requiresOneOf: [],
    layoutRequirements: [],
    compositionRoles: ['navigation'],
  },
});
