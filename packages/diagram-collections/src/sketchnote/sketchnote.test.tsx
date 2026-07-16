// @vitest-environment jsdom
import { runFamilySuite } from '../test/family-test-kit.js';
import { SketchnoteFlow } from './SketchnoteFlow.js';
import { SketchnoteSequence } from './SketchnoteSequence.js';
import { SketchnoteLayers } from './SketchnoteLayers.js';
import { SketchnoteZones } from './SketchnoteZones.js';
import { SketchnoteCycle } from './SketchnoteCycle.js';
import { SketchnoteCompare } from './SketchnoteCompare.js';
import { SketchnoteCells } from './SketchnoteCells.js';
import { SketchnoteTimeline } from './SketchnoteTimeline.js';

runFamilySuite('sketchnote', {
  flow: SketchnoteFlow,
  sequence: SketchnoteSequence,
  layers: SketchnoteLayers,
  zones: SketchnoteZones,
  cycle: SketchnoteCycle,
  compare: SketchnoteCompare,
  cells: SketchnoteCells,
  timeline: SketchnoteTimeline,
});
