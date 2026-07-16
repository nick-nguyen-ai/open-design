import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'sequence',
  description: 'Isometric studio sequence: actor blocks on the back row, messages stepping down the floor.',
  searchText: 'isometric 2.5d 3d blocks sequence diagram actors messages protocol floor',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricSequence.tsx',
  exportName: 'IsometricSequence',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
