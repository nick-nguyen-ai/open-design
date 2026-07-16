import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-dgm-isometric',
  surface: 'slide-deck',
  title: 'Studio Floor (Isometric Tour)',
  designThesis:
    'A grammar-tour onboarding deck staged as small isometric dioramas: extruded candy blocks with three-face shading, soft ground shadows, billboarded labels, and the full isometric diagram collection walking one platform through all eight diagram kinds.',
  grammarId: 'isometric-studio',
  audiences: ['mixed', 'business'],
  businessIntents: ['tour-platform-anatomy', 'onboard-into-infrastructure'],
  density: 'medium',
  motionLevel: 1,
  signatureSequence: 'ledger-reveal',
  corporateSuitability: 'expressive',
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
  routes: [
    {
      path: '/decks/dgm-isometric',
      title: 'The tour',
      purpose: 'Cover, eight diagram slides (one per kind), and the close',
    },
  ],
  tags: ['diagram-collection', 'isometric', 'grammar-tour', 'slide-deck'],
  whenToUse:
    'Use to tour a platform’s anatomy for onboarding or mixed audiences — the spatial diorama register makes structure tangible; the deck walks one platform through flow, sequence, layers, zones, cycle, compare, cells, and timeline.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-17',
    qualityScore: 88,
    notes: [
      "Grammar-tour world for the isometric diagram collection: ten diorama slides at /live/deck-dgm-isometric, shipped story 'A data platform, floor by floor'. Blocks rise onto the floor; reduced motion places finished dioramas at once; hidden outline mirrors throughout; ?slide= deep links.",
    ],
  },
});
