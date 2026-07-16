// @vitest-environment jsdom
import { runFamilySuite } from '../test/family-test-kit.js';
import { BlueprintFlow } from './BlueprintFlow.js';
import { BlueprintSequence } from './BlueprintSequence.js';
import { BlueprintLayers } from './BlueprintLayers.js';
import { BlueprintZones } from './BlueprintZones.js';
import { BlueprintCycle } from './BlueprintCycle.js';
import { BlueprintCompare } from './BlueprintCompare.js';
import { BlueprintCells } from './BlueprintCells.js';
import { BlueprintTimeline } from './BlueprintTimeline.js';

runFamilySuite('blueprint', {
  flow: BlueprintFlow,
  sequence: BlueprintSequence,
  layers: BlueprintLayers,
  zones: BlueprintZones,
  cycle: BlueprintCycle,
  compare: BlueprintCompare,
  cells: BlueprintCells,
  timeline: BlueprintTimeline,
});
