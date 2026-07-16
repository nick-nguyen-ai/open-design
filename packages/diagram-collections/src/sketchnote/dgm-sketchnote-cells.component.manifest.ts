import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'cells',
  description: 'Hand-drawn top-N grid: rotated sticky notes with numbered badges and detail lines.',
  searchText: 'sketchnote hand drawn excalidraw grid cells top list concepts cheat sheet numbered',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteCells.tsx',
  exportName: 'SketchnoteCells',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
