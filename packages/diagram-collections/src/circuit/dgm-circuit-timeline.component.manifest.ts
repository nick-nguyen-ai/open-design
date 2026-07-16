import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'circuit',
  familyName: 'Circuit',
  kind: 'timeline',
  description: 'Neon-terminal timeline: a phosphor bus with era chips docked above and below, LIVE marker.',
  searchText: 'circuit neon dark terminal glow timeline evolution eras bus roadmap live',
  grammarId: 'neon-circuit',
  sourceFile: 'packages/diagram-collections/src/circuit/CircuitTimeline.tsx',
  exportName: 'CircuitTimeline',
  motionLevel: 2,
  themeModes: ['dark'],
  knownLimitations: [
    'Trace dash-current is a continuous ambient loop; it stops entirely under reduced motion.',
    'Glow uses an SVG gaussian filter - rasterised per element, keep instances per viewport low.',
  ],
});
