import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'timeline',
  description: 'Isometric boulevard: a ground road with era blocks parked on alternating sides; the now era stands taller.',
  searchText: 'isometric 2.5d 3d blocks timeline road evolution eras roadmap now',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricTimeline.tsx',
  exportName: 'IsometricTimeline',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
