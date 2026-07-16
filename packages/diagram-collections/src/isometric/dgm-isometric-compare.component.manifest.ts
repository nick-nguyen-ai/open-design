import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'compare',
  description: 'Isometric podiums: header blocks at the back, value pads stepping forward, rose verdict slab.',
  searchText: 'isometric 2.5d 3d blocks comparison versus podiums tradeoffs',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricCompare.tsx',
  exportName: 'IsometricCompare',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
