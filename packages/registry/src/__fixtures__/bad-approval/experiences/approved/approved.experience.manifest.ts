import { buildExperience } from '../../../_builders.js';

// Approved experience referencing a not-yet-approved component → APPROVAL warning.
export default buildExperience({
  id: 'exp.approved',
  title: 'Approved Experience',
  componentsUsed: ['comp.reviewed'],
});
