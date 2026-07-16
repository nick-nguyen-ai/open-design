import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'compare',
  description: 'Hand-drawn versus panel: sticky column headers, ruled contrast rows, marker verdict strip.',
  searchText: 'sketchnote hand drawn excalidraw comparison versus vs table tradeoffs columns',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteCompare.tsx',
  exportName: 'SketchnoteCompare',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
