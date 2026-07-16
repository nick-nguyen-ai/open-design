import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'circuit',
  familyName: 'Circuit',
  kind: 'cycle',
  description: 'Neon-terminal cycle: a phosphor ring bus with indexed glass stage chips.',
  searchText: 'circuit neon dark terminal glow cycle loop ring bus pipeline stages',
  grammarId: 'neon-circuit',
  sourceFile: 'packages/diagram-collections/src/circuit/CircuitCycle.tsx',
  exportName: 'CircuitCycle',
  motionLevel: 2,
  themeModes: ['dark'],
  knownLimitations: [
    'Trace dash-current is a continuous ambient loop; it stops entirely under reduced motion.',
    'Glow uses an SVG gaussian filter - rasterised per element, keep instances per viewport low.',
  ],
});
