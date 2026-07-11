import { buildExperience } from '../../../_builders.js';

// References entities that no manifest declares → REG_UNKNOWN_REFERENCE.
export default buildExperience({
  id: 'exp.ghost',
  title: 'Ghost Experience',
  grammarId: 'ghost-grammar',
  signatureSequence: 'ghost-sequence',
  componentsUsed: ['comp.ghost'],
});
