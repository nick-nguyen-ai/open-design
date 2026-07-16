import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'flow',
  description: 'Isometric studio flow: extruded candy stations on a soft floor with ground arrows and numbered steps.',
  searchText: 'isometric 2.5d 3d blocks studio flow diagram extruded steps process candy',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricFlow.tsx',
  exportName: 'IsometricFlow',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
