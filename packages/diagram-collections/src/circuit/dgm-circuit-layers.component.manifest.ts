import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'circuit',
  familyName: 'Circuit',
  kind: 'layers',
  description: 'Neon-terminal layer rack: glass slabs with pin rails and item modules.',
  searchText: 'circuit neon dark terminal glow layer stack rack slabs osi levels',
  grammarId: 'neon-circuit',
  sourceFile: 'packages/diagram-collections/src/circuit/CircuitLayers.tsx',
  exportName: 'CircuitLayers',
  motionLevel: 2,
  themeModes: ['dark'],
  knownLimitations: [
    'Trace dash-current is a continuous ambient loop; it stops entirely under reduced motion.',
    'Glow uses an SVG gaussian filter - rasterised per element, keep instances per viewport low.',
  ],
});
