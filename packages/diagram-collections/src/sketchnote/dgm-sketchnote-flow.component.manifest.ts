import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'flow',
  description: 'Hand-drawn step-by-step flow diagram: sticky-note nodes shaped by kind, rough dashed arrows, numbered step badges.',
  searchText: 'sketchnote hand drawn excalidraw whiteboard flow diagram how it works steps arrows process walkthrough',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteFlow.tsx',
  exportName: 'SketchnoteFlow',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
