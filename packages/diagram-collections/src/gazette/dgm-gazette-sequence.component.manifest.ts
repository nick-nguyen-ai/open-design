import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'sequence',
  description: 'Print-atelier correspondence: ruled column heads, fine dispatch lines, italic annotations.',
  searchText: 'gazette print vintage editorial sequence diagram correspondence messages protocol',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteSequence.tsx',
  exportName: 'GazetteSequence',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
