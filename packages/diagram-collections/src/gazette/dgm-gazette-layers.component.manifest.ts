import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'gazette',
  familyName: 'Gazette',
  kind: 'layers',
  description: 'Print-atelier stratigraphy: ruled bands with hatch emphasis and marginal medallions.',
  searchText: 'gazette print vintage editorial layer stack strata bands levels',
  grammarId: 'print-gazette',
  sourceFile: 'packages/diagram-collections/src/gazette/GazetteLayers.tsx',
  exportName: 'GazetteLayers',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Single spot colour by design - grouping beyond the vermilion accent relies on position and rules.',
  ],
});
