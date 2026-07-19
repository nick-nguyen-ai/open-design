/**
 * World-template descriptor for "The Field Notebook" (`deck-dgm-sketchnote`)
 * — the sketchnote grammar-tour deck. Sections and guidance come from the
 * shared tour contract (`_dgm-kit/dgm-fill.ts`, re-exported by the sibling
 * fill file); parsing here guarantees the descriptor is registry-valid.
 *
 * Targeting: unique businessIntents (`teach-protocol-walkthrough`,
 * `explain-how-it-works`) steer teaching/how-it-works briefs here without
 * disturbing existing deck selections.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { SECTIONS, GUIDANCE } from './dgm-sketchnote-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'dgm-sketchnote',
  experienceId: 'deck-dgm-sketchnote',
  surface: 'slide-deck',
  style: 'art-directed',
  mood: 'light',
  grammarId: 'sketchnote-journal',
  audiences: ['technical', 'mixed'],
  businessIntents: ['teach-protocol-walkthrough', 'explain-how-it-works'],
  componentsUsed: [
    'comp.dgm.sketchnote.flow',
    'comp.dgm.sketchnote.sequence',
    'comp.dgm.sketchnote.layers',
    'comp.dgm.sketchnote.zones',
    'comp.dgm.sketchnote.cycle',
    'comp.dgm.sketchnote.compare',
    'comp.dgm.sketchnote.cells',
    'comp.dgm.sketchnote.timeline',
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
