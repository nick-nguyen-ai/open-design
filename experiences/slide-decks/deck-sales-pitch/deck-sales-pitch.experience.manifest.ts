import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-sales-pitch',
  surface: 'slide-deck',
  title: 'Sales Pitch',
  designThesis:
    'Renders a sales proposal as the deliberately conventional deck a good account team makes in PowerPoint — problem, solution, proof, pricing, no surprises — executed flawlessly, and then risks the one slide a normal pitch never does: an honest “where we are not a fit”, because the candour is what earns the close.',
  grammarId: 'executive-editorial',
  audiences: ['business', 'executive'],
  businessIntents: ['pitch-a-solution', 'win-the-deal'],
  density: 'medium',
  motionLevel: 1,
  signatureSequence: 'ledger-reveal',
  corporateSuitability: 'standard',
  componentsUsed: ['comp.kpi-tile'],
  routes: [
    {
      path: '/decks/sales-pitch',
      title: 'The problem',
      purpose: 'Title, the client’s own words, and the cost of doing nothing',
    },
    {
      path: '/decks/sales-pitch/solution',
      title: 'The solution & proof',
      purpose: 'The before/after diagram, how it works, the outcome metrics, and the case study',
    },
    {
      path: '/decks/sales-pitch/close',
      title: 'Candour, pricing & the ask',
      purpose: 'Where we are not a fit, the three pricing tiers, and the ask with a six-week timeline',
    },
  ],
  tags: ['sales-pitch', 'proposal', 'business', 'slide-deck'],
  whenToUse:
    'Use to pitch a named prospect when the shape should be immediately familiar — problem to pricing — and the differentiator is honesty: naming exactly where the product does not fit, in the client’s own words.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 92,
    notes: [
      "Live build shipped (batch-2 decks F): 'The Straight Pitch' at /live/deck-sales-pitch — ten deliberately conventional light slides (problem → solution → proof → pricing) with a teal title bar, a 12-column content zone, and a footer rule (page number · confidentiality · synthetic notice). Renders a large client-quote treatment, a bespoke before/after 3-node local-SVG diagram, comp.kpi-tile customer outcomes, a named case study, and a 3-tier pricing table with the middle tier quietly pre-selected (no dark patterns). The anomaly is the honesty slide WHERE WE ARE NOT A FIT with three real bullets. ?slide= deep links, print stylesheet, stepped reduced-motion.",
    ],
  },
});
