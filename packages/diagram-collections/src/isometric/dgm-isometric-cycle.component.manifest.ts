import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'cycle',
  description: 'Isometric carousel: stage blocks on a ground ring with floor arc arrows and a hub podium.',
  searchText: 'isometric 2.5d 3d blocks cycle loop ring carousel stages',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricCycle.tsx',
  exportName: 'IsometricCycle',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
