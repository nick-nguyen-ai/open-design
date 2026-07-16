import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'cycle',
  description: 'Hand-drawn cycle: sticky stages on a ring with rough arc arrows and a hub scribble.',
  searchText: 'sketchnote hand drawn excalidraw cycle loop pipeline feedback ring stages',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteCycle.tsx',
  exportName: 'SketchnoteCycle',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
