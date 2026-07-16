import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'circuit',
  familyName: 'Circuit',
  kind: 'compare',
  description: 'Neon-terminal diff view: session columns compared row by row with a verdict banner.',
  searchText: 'circuit neon dark terminal glow comparison versus diff columns tradeoffs',
  grammarId: 'neon-circuit',
  sourceFile: 'packages/diagram-collections/src/circuit/CircuitCompare.tsx',
  exportName: 'CircuitCompare',
  motionLevel: 2,
  themeModes: ['dark'],
  knownLimitations: [
    'Trace dash-current is a continuous ambient loop; it stops entirely under reduced motion.',
    'Glow uses an SVG gaussian filter - rasterised per element, keep instances per viewport low.',
  ],
});
