import { buildComponent } from '../../../_builders.js';

// alpha declares a conflict with beta, but beta does not reciprocate.
export default buildComponent({
  id: 'comp.alpha',
  name: 'Alpha',
  compatibility: {
    worksWellWith: [],
    conflictsWith: ['comp.beta'],
    requiresOneOf: [],
    layoutRequirements: [],
    compositionRoles: ['summary'],
  },
});
