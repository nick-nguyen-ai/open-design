import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'blueprint',
  familyName: 'Blueprint',
  kind: 'zones',
  description: 'Drafting-table estate map: dashed zone parcels, stencil units, dimension-ticked wires.',
  searchText: 'blueprint drafting technical architecture map zones parcels estate schematic cad',
  grammarId: 'drafting-board',
  sourceFile: 'packages/diagram-collections/src/blueprint/BlueprintZones.tsx',
  exportName: 'BlueprintZones',
  motionLevel: 1,
  themeModes: ['dark'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Connector routing is midpoint-elbow Manhattan, not obstacle-avoiding.',
  ],
});
