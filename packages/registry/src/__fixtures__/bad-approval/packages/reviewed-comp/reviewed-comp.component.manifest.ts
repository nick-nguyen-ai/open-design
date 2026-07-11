import { buildComponent, DEFAULT_APPROVAL } from '../../../_builders.js';

// Not yet approved — an approved experience using it should warn.
export default buildComponent({
  id: 'comp.reviewed',
  name: 'Reviewed Component',
  approval: { ...DEFAULT_APPROVAL, state: 'reviewed' },
});
