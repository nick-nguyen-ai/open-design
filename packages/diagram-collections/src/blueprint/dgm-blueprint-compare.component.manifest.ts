import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'compare',
  description: 'Drafting-table specification table: contrast columns with ruled rows and an alert verdict strip.',
  searchText: 'blueprint drafting technical comparison versus specification table tradeoffs',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintCompare.tsx',
  exportName: 'BlueprintCompare',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
