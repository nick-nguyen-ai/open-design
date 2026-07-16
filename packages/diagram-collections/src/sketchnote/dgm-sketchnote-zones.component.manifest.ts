import { makeCollectionManifest } from '../shared/manifest-factory.js';

export default makeCollectionManifest({
  family: 'sketchnote',
  familyName: 'Sketchnote',
  kind: 'zones',
  description: 'Hand-drawn architecture map: dashed zone frames, paper nodes, rough links.',
  searchText: 'sketchnote hand drawn excalidraw architecture map zones clusters estate systems links',
  grammarId: 'sketchnote-journal',
  sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteZones.tsx',
  exportName: 'SketchnoteZones',
  motionLevel: 1,
  themeModes: ['light'],
  knownLimitations: [
    'Entrance reveal only; no interactive re-trace.',
    'Hand-drawn wobble is seeded per element id - stable across renders by design.',
  ],
});
