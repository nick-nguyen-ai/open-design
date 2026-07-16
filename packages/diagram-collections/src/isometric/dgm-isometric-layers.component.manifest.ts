import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'layers',
  description: 'Isometric terraces: layers as a descending staircase of slabs with item pads on top.',
  searchText: 'isometric 2.5d 3d slabs staircase layer stack terraces levels',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricLayers.tsx',
  exportName: 'IsometricLayers',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
