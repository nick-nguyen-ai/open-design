/**
 * World-template descriptor for "THE DRAFTING BOARD" (`deck-dgm-blueprint`) — the blueprint
 * grammar-tour deck. Sections and guidance come from the shared tour contract
 * (`_dgm-kit/dgm-fill.ts`, re-exported by the sibling fill file); parsing here
 * guarantees the descriptor is registry-valid.
 *
 * Targeting: unique businessIntents (document-system-rails / specify-integration) steer matching briefs here
 * without disturbing existing deck selections.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { SECTIONS, GUIDANCE } from './dgm-blueprint-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'dgm-blueprint',
  experienceId: 'deck-dgm-blueprint',
  surface: 'slide-deck',
  style: 'art-directed',
  mood: 'dark',
  grammarId: 'drafting-board',
  audiences: ['technical', 'risk-and-governance'],
  businessIntents: ['document-system-rails', 'specify-integration'],
  componentsUsed: [
    'comp.dgm.blueprint.flow',
    'comp.dgm.blueprint.sequence',
    'comp.dgm.blueprint.layers',
    'comp.dgm.blueprint.zones',
    'comp.dgm.blueprint.cycle',
    'comp.dgm.blueprint.compare',
    'comp.dgm.blueprint.cells',
    'comp.dgm.blueprint.timeline',
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
