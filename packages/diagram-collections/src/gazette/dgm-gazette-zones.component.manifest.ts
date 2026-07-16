import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'zones',
  description: 'Print-atelier plate map: double-ruled districts, ink parcels, vermilion dispatch lines.',
  searchText: 'gazette print vintage editorial architecture map districts plate estate',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteZones.tsx',
  exportName: 'GazetteZones',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
