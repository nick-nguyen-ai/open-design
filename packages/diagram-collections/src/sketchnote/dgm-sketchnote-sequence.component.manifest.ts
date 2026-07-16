import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'sequence',
  description: 'Hand-drawn sequence diagram: sticky actor plates, dashed lifelines, rough message arrows with notes.',
  searchText: 'sketchnote hand drawn excalidraw sequence diagram lifelines messages protocol oauth handshake walkthrough',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteSequence.tsx',
  exportName: 'SketchnoteSequence',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
