/**
 * World-template descriptor for "THE LIT BOARD" (`deck-dgm-circuit`) — the circuit
 * grammar-tour deck. Sections and guidance come from the shared tour contract
 * (`_dgm-kit/dgm-fill.ts`, re-exported by the sibling fill file); parsing here
 * guarantees the descriptor is registry-valid.
 *
 * Targeting: unique businessIntents (scale-architecture-story / plan-capacity-growth) steer matching briefs here
 * without disturbing existing deck selections.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { SECTIONS, GUIDANCE } from './dgm-circuit-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'dgm-circuit',
  experienceId: 'deck-dgm-circuit',
  surface: 'slide-deck',
  style: 'art-directed',
  mood: 'dark',
  grammarId: 'neon-circuit',
  audiences: ['technical', 'mixed'],
  businessIntents: ['scale-architecture-story', 'plan-capacity-growth'],
  componentsUsed: [
    'comp.dgm.circuit.flow',
    'comp.dgm.circuit.sequence',
    'comp.dgm.circuit.layers',
    'comp.dgm.circuit.zones',
    'comp.dgm.circuit.cycle',
    'comp.dgm.circuit.compare',
    'comp.dgm.circuit.cells',
    'comp.dgm.circuit.timeline',
  ],
  sections: SECTIONS,
  guidance: GUIDANCE,
  craftRules: [
    {
      kind: 'no-back-edges',
      path: 'flow.edges',
      description: 'The flow diagram lays out as a DAG; a return edge strands its target node — express loops in the caption instead.',
    },
    {
      kind: 'required-nonempty',
      path: 'deck.notice',
      description: 'deck.notice must state data provenance (synthetic or sourced).',
    },
  ],
});

export default descriptor;
