import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-dgm-blueprint',
  surface: 'slide-deck',
  title: 'Drafting Board (Blueprint Tour)',
  designThesis:
    'A grammar-tour specification deck drawn as a set of cyanotype engineering sheets: dot grids, title-block stamps, strictly orthogonal wires with dimension ticks, and the full blueprint diagram collection walking one system through all eight diagram kinds.',
  grammarId: 'drafting-board',
  audiences: ['technical', 'risk-and-governance'],
  businessIntents: ['document-system-rails', 'specify-integration'],
  density: 'medium',
  motionLevel: 1,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'expressive',
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
  routes: [
    {
      path: '/decks/dgm-blueprint',
      title: 'The tour',
      purpose: 'Cover, eight diagram slides (one per kind), and the close',
    },
  ],
  tags: ['diagram-collection', 'blueprint', 'grammar-tour', 'slide-deck'],
  whenToUse:
    'Use to specify how a system is wired — rails, contracts, integrations — when drafting-sheet authority lands better than prose; the deck walks one system through flow, sequence, layers, zones, cycle, compare, cells, and timeline.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-17',
    qualityScore: 88,
    notes: [
      "Grammar-tour world for the blueprint diagram collection: ten cyanotype sheets at /live/deck-dgm-blueprint, shipped story 'One order through the warehouse'. Every sheet carries its hidden outline mirror; reduced motion renders finished sheets instantly; ?slide= deep links.",
    ],
  },
});
