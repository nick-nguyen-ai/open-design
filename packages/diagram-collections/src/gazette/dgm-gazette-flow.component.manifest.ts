import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'flow',
  description: 'Print-atelier flow: ruled plates joined by fine ink connectors with vermilion step medallions.',
  searchText: 'gazette print vintage editorial serif field manual flow diagram steps engraved',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteFlow.tsx',
  exportName: 'GazetteFlow',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
