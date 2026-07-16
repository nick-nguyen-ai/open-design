import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'cycle',
  description: 'Drafting-table cycle: a compass ring with construction lines, stencil stations and arc bearings.',
  searchText: 'blueprint drafting technical cycle loop compass ring pipeline stages schematic',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintCycle.tsx',
  exportName: 'BlueprintCycle',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
