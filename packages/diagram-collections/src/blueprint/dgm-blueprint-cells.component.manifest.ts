import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'cells',
  description: 'Drafting-table catalogue grid: numbered part bays with spec notes.',
  searchText: 'blueprint drafting technical grid cells parts catalogue numbered bays cheat sheet',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintCells.tsx',
  exportName: 'BlueprintCells',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
