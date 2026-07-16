import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'timeline',
  description: 'Print-atelier chronicle: an engraved rule with era plates and a marked present day.',
  searchText: 'gazette print vintage editorial timeline chronicle eras evolution history',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteTimeline.tsx',
  exportName: 'GazetteTimeline',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
