import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'compare',
  description: 'Print-atelier tariff table: ruled columns, hatch-accented head, ink verdict colophon.',
  searchText: 'gazette print vintage editorial comparison versus tariff table tradeoffs',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteCompare.tsx',
  exportName: 'GazetteCompare',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
