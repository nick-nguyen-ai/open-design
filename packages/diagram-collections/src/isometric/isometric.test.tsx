// @vitest-environment jsdom
import { runFamilySuite } from '../test/family-test-kit.js';
import { IsometricFlow } from './IsometricFlow.js';
import { IsometricSequence } from './IsometricSequence.js';
import { IsometricLayers } from './IsometricLayers.js';
import { IsometricZones } from './IsometricZones.js';
import { IsometricCycle } from './IsometricCycle.js';
import { IsometricCompare } from './IsometricCompare.js';
import { IsometricCells } from './IsometricCells.js';
import { IsometricTimeline } from './IsometricTimeline.js';

runFamilySuite('isometric', {
  flow: IsometricFlow,
  sequence: IsometricSequence,
  layers: IsometricLayers,
  zones: IsometricZones,
  cycle: IsometricCycle,
  compare: IsometricCompare,
  cells: IsometricCells,
  timeline: IsometricTimeline,
});
