import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-dgm-sketchnote',
  surface: 'slide-deck',
  title: 'Field Notebook (Sketchnote Tour)',
  designThesis:
    'A grammar-tour teaching deck drawn as an engineer’s paper field notebook: washi-taped pages, Caveat hand, marker-swipe underlines, and the full sketchnote diagram collection — rough seeded strokes, sticky-note nodes, numbered amber step badges — walking one topic through all eight diagram kinds.',
  grammarId: 'sketchnote-journal',
  audiences: ['technical', 'mixed'],
  businessIntents: ['teach-protocol-walkthrough', 'explain-how-it-works'],
  density: 'medium',
  motionLevel: 1,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'expressive',
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
  routes: [
    {
      path: '/decks/dgm-sketchnote',
      title: 'The notebook',
      purpose: 'Cover, eight diagram pages (one per kind), and the close',
    },
  ],
  tags: ['diagram-collection', 'sketchnote', 'teaching', 'slide-deck'],
  whenToUse:
    'Use to teach how a system actually works, step by step, when a warm whiteboard register lands better than a corporate one — the deck walks one topic through flow, sequence, layers, zones, cycle, compare, cells, and timeline.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-17',
    qualityScore: 88,
    notes: [
      "Grammar-tour world for the sketchnote diagram collection: ten paper pages at /live/deck-dgm-sketchnote, shipped story 'From URL to pixels'. Every diagram carries its hidden outline mirror; reduced motion renders finished pages instantly; ?slide= deep links.",
    ],
  },
});
