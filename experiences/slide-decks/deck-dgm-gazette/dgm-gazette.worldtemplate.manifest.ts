/**
 * World-template descriptor for "THE GAZETTE" (`deck-dgm-gazette`) — the gazette
 * grammar-tour deck. Sections and guidance come from the shared tour contract
 * (`_dgm-kit/dgm-fill.ts`, re-exported by the sibling fill file); parsing here
 * guarantees the descriptor is registry-valid.
 *
 * Targeting: unique businessIntents (publish-field-guide / compare-technique-tradeoffs) steer matching briefs here
 * without disturbing existing deck selections.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { SECTIONS, GUIDANCE } from './dgm-gazette-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'dgm-gazette',
  experienceId: 'deck-dgm-gazette',
  surface: 'slide-deck',
  style: 'art-directed',
  mood: 'light',
  grammarId: 'print-gazette',
  audiences: ['business', 'technical'],
  businessIntents: ['publish-field-guide', 'compare-technique-tradeoffs'],
  componentsUsed: [
    'comp.dgm.gazette.flow',
    'comp.dgm.gazette.sequence',
    'comp.dgm.gazette.layers',
    'comp.dgm.gazette.zones',
    'comp.dgm.gazette.cycle',
    'comp.dgm.gazette.compare',
    'comp.dgm.gazette.cells',
    'comp.dgm.gazette.timeline',
  ],
  sections: SECTIONS,
  guidance: GUIDANCE,
  craftRules: [
    {
      kind: 'required-nonempty',
      path: 'deck.notice',
      description: 'deck.notice must state data provenance (synthetic or sourced).',
    },
  ],
});

export default descriptor;
