import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'timeline',
  description: 'Hand-drawn timeline: rough axis, alternating sticky era cards, starred current era.',
  searchText: 'sketchnote hand drawn excalidraw timeline evolution eras roadmap history now marker',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteTimeline.tsx',
  exportName: 'SketchnoteTimeline',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
