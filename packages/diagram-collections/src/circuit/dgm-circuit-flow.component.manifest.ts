import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'circuit',
  familyName: 'Circuit',
  kind: 'flow',
  description: 'Neon-terminal flow: glass chips wired by glowing phosphor traces with terminal step tags.',
  searchText: 'circuit neon dark terminal glow flow diagram traces chips steps process cyberpunk',
  grammarId: 'neon-circuit',
  sourceFile: 'packages/diagram-collections/src/circuit/CircuitFlow.tsx',
  exportName: 'CircuitFlow',
  motionLevel: 2,
  themeModes: ['dark'],
  knownLimitations: [
    'Trace dash-current is a continuous ambient loop; it stops entirely under reduced motion.',
    'Glow uses an SVG gaussian filter - rasterised per element, keep instances per viewport low.',
  ],
});
