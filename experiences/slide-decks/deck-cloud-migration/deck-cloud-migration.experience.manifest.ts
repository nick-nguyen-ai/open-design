import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-cloud-migration',
  surface: 'slide-deck',
  title: 'Cloud Migration',
  designThesis:
    'Renders a core-banking cloud migration as the draw.io working file the team actually plans in — exact orthogonal connectors, pastel system boxes, swimlane waves and selection handles — so the whole cutover reads around its one fixed point: the mainframe ledger that stays on-prem for a four-millisecond SLA.',
  grammarId: 'technical-blueprint',
  audiences: ['technical', 'risk-and-governance'],
  businessIntents: ['plan-cloud-migration', 'commit-cutover'],
  density: 'medium',
  motionLevel: 2,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'expressive',
  componentsUsed: ['comp.flow-diagram', 'comp.status-list'],
  routes: [
    {
      path: '/decks/cloud-migration',
      title: 'The estates',
      purpose: 'File header, the current estate, and the target estate diagram',
    },
    {
      path: '/decks/cloud-migration/plan',
      title: 'The delta & the waves',
      purpose: 'What moves, dies and stays, and the three migration waves',
    },
    {
      path: '/decks/cloud-migration/cutover',
      title: 'Cutover, rollback & sign-off',
      purpose: 'Cutover-night sequence, data sync, rollback tree, risk register, and rev sign-off',
    },
  ],
  tags: ['cloud-migration', 'cutover', 'architecture', 'slide-deck'],
  whenToUse:
    'Use to walk a change board and platform team through a cutover plan when the estate, the waves, and the rollback all have to be seen on one canvas — and when one legacy system deliberately stays put and the whole plan bends around it.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 93,
    notes: [
      "Live build shipped (batch-2 decks E): 'The Cutover' at /live/deck-cloud-migration — ten light draw.io-canvas slides with a dot-grid, exact orthogonal connectors and port dots, pastel system boxes with type badges, selection handles on the focus node, current + target estate diagrams sharing one canvas, a comp.flow-diagram cutover-night sequence and a comp.status-list risk register. The mainframe-ledger anomaly (MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms) is padlocked and heavier-stroked in the same place on both estates; both estates have hidden nested-list mirrors. ?slide= deep links and a print stylesheet.",
    ],
  },
});
