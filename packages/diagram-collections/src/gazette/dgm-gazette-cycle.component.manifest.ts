import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'cycle',
  description: 'Print-atelier rosette: numbered stages around an engraved ring with vermilion bearings.',
  searchText: 'gazette print vintage editorial cycle loop rosette ring stages',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteCycle.tsx',
  exportName: 'GazetteCycle',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
