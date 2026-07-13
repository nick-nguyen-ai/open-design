import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-product-launch',
  surface: 'slide-deck',
  title: 'Product Launch',
  designThesis:
    'Stages a product go-live as a countdown sequence — a monumental T-minus stamp and a rising amber horizon on every slide — so the launch reads as a single sequence with one clock, one runbook, and the one gate still standing amber between the team and go.',
  grammarId: 'monumental-type',
  audiences: ['executive', 'business', 'technical'],
  businessIntents: ['plan-product-launch', 'commit-go-live'],
  density: 'low',
  motionLevel: 2,
  signatureSequence: 'horizon-sweep',
  corporateSuitability: 'expressive',
  componentsUsed: ['comp.status-list', 'comp.kpi-tile'],
  routes: [
    {
      path: '/decks/product-launch',
      title: 'The countdown',
      purpose: 'Title, the product in one sentence, and the launch thesis',
    },
    {
      path: '/decks/product-launch/readiness',
      title: 'Readiness & plan',
      purpose: 'Readiness gates, comms plan, pricing, and the day-0 runbook',
    },
    {
      path: '/decks/product-launch/go',
      title: 'Risk, metrics & go',
      purpose: 'Abort triggers and rollback, launch metrics, and the T-0 go decision',
    },
  ],
  tags: ['product-launch', 'go-live', 'countdown', 'slide-deck'],
  whenToUse:
    'Use to run a launch go/no-go with the launch team and sponsors when everyone needs the same countdown, the same day-0 runbook, and a shared view of the gates that still have to clear before go.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 93,
    notes: [
      "Live build shipped (batch-2 decks E): 'T-Minus' at /live/deck-product-launch — ten dark launch-control slides with a monumental T-minus countdown stamp and a rising amber horizon that reaches the top and turns GO-green at T-0, a comp.status-list readiness board carrying the amber SECURITY REVIEW PENDING — BLOCKS T-7 anomaly, a commanding day-0 runbook timeline (local SVG) with its hidden ordered-list mirror, a comp.kpi-tile launch-metrics row, ?slide= deep links, and a print stylesheet.",
    ],
  },
});
