import { buildComponent, DEFAULT_ACCESSIBILITY } from '../../../_builders.js';

// motionLevel > 0 without reducedMotion → A11Y_REDUCED_MOTION.
export default buildComponent({
  id: 'comp.motion-heavy',
  name: 'Motion Heavy',
  motionLevel: 3,
  accessibility: { ...DEFAULT_ACCESSIBILITY, reducedMotion: false },
});
