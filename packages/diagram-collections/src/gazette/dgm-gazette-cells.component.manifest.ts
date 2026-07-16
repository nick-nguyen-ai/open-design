import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'cells',
  description: 'Print-atelier gazetteer: ruled entry cards with vermilion medallion numerals.',
  searchText: 'gazette print vintage editorial grid cells gazetteer entries top list',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteCells.tsx',
  exportName: 'GazetteCells',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
