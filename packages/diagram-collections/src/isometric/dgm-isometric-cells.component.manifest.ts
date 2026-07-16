import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'cells',
  description: 'Isometric showroom: each concept a candy block on the floor with its badge on the top face.',
  searchText: 'isometric 2.5d 3d blocks grid cells showroom top list concepts',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricCells.tsx',
  exportName: 'IsometricCells',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
