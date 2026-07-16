import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'flow',
  description: 'Drafting-table flow diagram: stencil stations, strictly orthogonal wires, hexagonal step stamps on a cyanotype dot-grid sheet.',
  searchText: 'blueprint drafting drawio technical schematic flow diagram orthogonal steps process precise cad',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintFlow.tsx',
  exportName: 'BlueprintFlow',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
