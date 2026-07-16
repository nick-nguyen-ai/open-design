import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'isometric',
  familyName: 'Isometric',
  kind: 'zones',
  description: 'Isometric estate: zone parcels as tinted ground pads with candy system blocks and floor links.',
  searchText: 'isometric 2.5d 3d blocks architecture map zones parcels estate floor',
  grammarId: 'isometric-studio',
  sourceFile: 'packages/diagram-collections/src/isometric/IsometricZones.tsx',
  exportName: 'IsometricZones',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Fixed 30-degree isometric camera; no rotation or perspective controls.',
  ],
});
