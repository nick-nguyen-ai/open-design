import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'layers',
  description: 'Hand-drawn layer stack: sticky bands with lettered tone badges and item chips.',
  searchText: 'sketchnote hand drawn excalidraw layer stack osi levels bands stacked architecture',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteLayers.tsx',
  exportName: 'SketchnoteLayers',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
