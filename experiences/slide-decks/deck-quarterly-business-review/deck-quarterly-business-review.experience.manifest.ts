import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-quarterly-business-review',
  surface: 'slide-deck',
  title: 'Quarterly Business Review',
  designThesis:
    'Renders a quarterly business review as the deliberately conventional deck a competent operator makes in PowerPoint — a persistent title bar, a 12-column content grid, a numbered agenda, and a footer rule — executed flawlessly, so the whole quarter reads around its one unsparing figure: net revenue retention below the 100% floor.',
  grammarId: 'precision-grid',
  audiences: ['executive', 'business'],
  businessIntents: ['review-quarterly-performance', 'brief-the-board'],
  density: 'medium',
  motionLevel: 1,
  signatureSequence: 'ledger-reveal',
  corporateSuitability: 'standard',
  componentsUsed: ['comp.kpi-tile', 'comp.trend-chart', 'comp.category-bar-chart'],
  routes: [
    {
      path: '/decks/quarterly-business-review',
      title: 'Performance',
      purpose: 'Title, agenda, executive summary, the KPI row, and the revenue trend',
    },
    {
      path: '/decks/quarterly-business-review/execution',
      title: 'Segments & execution',
      purpose: 'Segment performance, wins and losses, and the pipeline',
    },
    {
      path: '/decks/quarterly-business-review/outlook',
      title: 'Risk & outlook',
      purpose: 'Risks and mitigations, next-quarter priorities, and the data-notes appendix',
    },
  ],
  tags: ['qbr', 'quarterly-business-review', 'executive', 'slide-deck'],
  whenToUse:
    'Use to walk a board or leadership team through a quarter when the shape should be immediately familiar — headline metrics, a revenue trend, segments, pipeline, risk, outlook — and one metric has to be named as a problem rather than buried.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 93,
    notes: [
      "Live build shipped (batch-2 decks F): 'The Quarter' at /live/deck-quarterly-business-review — eleven deliberately conventional light slides with a navy title bar, a 12-column content grid, a numbered agenda, section labels, and a footer rule (page number · confidentiality · synthetic notice). Renders comp.kpi-tile (revenue, NRR, margin, headcount), a comp.trend-chart revenue trend with a bespoke hover tooltip, and a comp.category-bar-chart segment view. The NRR anomaly (NRR 96% — BELOW 100% FLOOR) is the single red figure in a green KPI row, echoed in the executive summary. ?slide= deep links, print stylesheet, stepped reduced-motion.",
    ],
  },
});
