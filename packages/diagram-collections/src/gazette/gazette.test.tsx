// @vitest-environment jsdom
import { runFamilySuite } from '../test/family-test-kit.js';
import { GazetteFlow } from './GazetteFlow.js';
import { GazetteSequence } from './GazetteSequence.js';
import { GazetteLayers } from './GazetteLayers.js';
import { GazetteZones } from './GazetteZones.js';
import { GazetteCycle } from './GazetteCycle.js';
import { GazetteCompare } from './GazetteCompare.js';
import { GazetteCells } from './GazetteCells.js';
import { GazetteTimeline } from './GazetteTimeline.js';

runFamilySuite('gazette', {
  flow: GazetteFlow,
  sequence: GazetteSequence,
  layers: GazetteLayers,
  zones: GazetteZones,
  cycle: GazetteCycle,
  compare: GazetteCompare,
  cells: GazetteCells,
  timeline: GazetteTimeline,
});
