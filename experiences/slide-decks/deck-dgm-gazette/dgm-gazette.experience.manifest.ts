import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-dgm-gazette',
  surface: 'slide-deck',
  title: 'Gazette (Gazette Tour)',
  designThesis:
    'A grammar-tour field guide set like a vintage technical gazette: ink rules on cream, Fraunces display with a vermilion drop cap, numbered medallions, hatch-fill emphasis, and the full gazette diagram collection walking one discipline through all eight diagram kinds.',
  grammarId: 'print-gazette',
  audiences: ['business', 'technical'],
  businessIntents: ['publish-field-guide', 'compare-technique-tradeoffs'],
  density: 'medium',
  motionLevel: 1,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'expressive',
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
  routes: [
    {
      path: '/decks/dgm-gazette',
      title: 'The tour',
      purpose: 'Cover, eight diagram slides (one per kind), and the close',
    },
  ],
  tags: ['diagram-collection', 'gazette', 'grammar-tour', 'slide-deck'],
  whenToUse:
    'Use to publish a field guide or technique comparison that should feel edited and permanent — the deck walks one discipline through flow, sequence, layers, zones, cycle, compare, cells, and timeline.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-17',
    qualityScore: 88,
    notes: [
      "Grammar-tour world for the gazette diagram collection: ten printed plates at /live/deck-dgm-gazette, shipped story 'The observability field manual'. Plates settle like set type; reduced motion prints pages complete; hidden outline mirrors throughout; ?slide= deep links.",
    ],
  },
});
