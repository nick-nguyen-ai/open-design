import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-dgm-circuit',
  surface: 'slide-deck',
  title: 'Lit Board (Circuit Tour)',
  designThesis:
    'A grammar-tour scale story told on a powered near-black board: glass chips, phosphor traces with a slow dash current, scanline corners, and the full circuit diagram collection walking one platform through all eight diagram kinds.',
  grammarId: 'neon-circuit',
  audiences: ['technical', 'mixed'],
  businessIntents: ['scale-architecture-story', 'plan-capacity-growth'],
  density: 'medium',
  motionLevel: 2,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'expressive',
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
  routes: [
    {
      path: '/decks/dgm-circuit',
      title: 'The tour',
      purpose: 'Cover, eight diagram slides (one per kind), and the close',
    },
  ],
  tags: ['diagram-collection', 'circuit', 'grammar-tour', 'slide-deck'],
  whenToUse:
    'Use to tell a scale or capacity story — traffic growing, systems powering on — when a kinetic neon-terminal register fits the audience; the deck walks one platform through flow, sequence, layers, zones, cycle, compare, cells, and timeline.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-17',
    qualityScore: 88,
    notes: [
      "Grammar-tour world for the circuit diagram collection: ten lit-board slides at /live/deck-dgm-circuit, shipped story 'Anatomy of a streaming platform'. Trace currents stop entirely under reduced motion; every diagram carries its hidden outline mirror; ?slide= deep links.",
    ],
  },
});
