// @vitest-environment jsdom
import { runFamilySuite } from '../test/family-test-kit.js';
import { CircuitFlow } from './CircuitFlow.js';
import { CircuitSequence } from './CircuitSequence.js';
import { CircuitLayers } from './CircuitLayers.js';
import { CircuitZones } from './CircuitZones.js';
import { CircuitCycle } from './CircuitCycle.js';
import { CircuitCompare } from './CircuitCompare.js';
import { CircuitCells } from './CircuitCells.js';
import { CircuitTimeline } from './CircuitTimeline.js';

runFamilySuite('circuit', {
  flow: CircuitFlow,
  sequence: CircuitSequence,
  layers: CircuitLayers,
  zones: CircuitZones,
  cycle: CircuitCycle,
  compare: CircuitCompare,
  cells: CircuitCells,
  timeline: CircuitTimeline,
});
