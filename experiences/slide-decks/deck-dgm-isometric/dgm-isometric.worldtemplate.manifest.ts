/**
 * World-template descriptor for "THE STUDIO FLOOR" (`deck-dgm-isometric`) — the isometric
 * grammar-tour deck. Sections and guidance come from the shared tour contract
 * (`_dgm-kit/dgm-fill.ts`, re-exported by the sibling fill file); parsing here
 * guarantees the descriptor is registry-valid.
 *
 * Targeting: unique businessIntents (tour-platform-anatomy / onboard-into-infrastructure) steer matching briefs here
 * without disturbing existing deck selections.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { SECTIONS, GUIDANCE } from './dgm-isometric-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'dgm-isometric',
  experienceId: 'deck-dgm-isometric',
  surface: 'slide-deck',
  style: 'art-directed',
  mood: 'light',
  grammarId: 'isometric-studio',
  audiences: ['mixed', 'business'],
  businessIntents: ['tour-platform-anatomy', 'onboard-into-infrastructure'],
  componentsUsed: [
    'comp.dgm.isometric.flow',
    'comp.dgm.isometric.sequence',
    'comp.dgm.isometric.layers',
    'comp.dgm.isometric.zones',
    'comp.dgm.isometric.cycle',
    'comp.dgm.isometric.compare',
    'comp.dgm.isometric.cells',
    'comp.dgm.isometric.timeline',
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
