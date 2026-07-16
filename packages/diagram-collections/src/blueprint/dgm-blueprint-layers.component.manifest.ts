import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'layers',
  description: 'Drafting-table layer stack: numbered elevation bands with tone marks and item bays.',
  searchText: 'blueprint drafting technical layer stack elevation bands osi levels schematic',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintLayers.tsx',
  exportName: 'BlueprintLayers',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
