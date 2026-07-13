import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-research-discussion',
  surface: 'slide-deck',
  title: 'Research Discussion',
  designThesis:
    'Presents a working study as an annotated preprint under seminar discussion — with a second voice arguing back in the margins — so the reasoning, the figures, and the one finding that does not replicate are all open to audit rather than smoothed into a conclusion.',
  grammarId: 'research-notebook',
  audiences: ['technical', 'risk-and-governance'],
  businessIntents: ['present-research-findings', 'open-peer-discussion'],
  density: 'medium',
  motionLevel: 2,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'expressive',
  componentsUsed: ['comp.category-bar-chart'],
  routes: [
    {
      path: '/decks/research-discussion',
      title: 'Title, abstract & hypotheses',
      purpose: 'Paper header, abstract, and the hypothesis ladder',
    },
    {
      path: '/decks/research-discussion/results',
      title: 'Method & results',
      purpose: 'Method flow, effect-size figure, and the confidence-interval plate',
    },
    {
      path: '/decks/research-discussion/discussion',
      title: 'Replication, limitations & discussion',
      purpose: 'The null replication, limitations, discussion questions, and citation',
    },
  ],
  tags: ['research', 'preprint', 'evidence', 'discussion', 'slide-deck'],
  whenToUse:
    'Use to walk a technical or model-risk audience through a study when the point is to expose the reasoning and the caveats — including a result that does not replicate — for genuine discussion rather than to sell a headline.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 92,
    notes: [
      "Live build shipped (batch-2 decks D): 'The Preprint' at /live/deck-research-discussion — ten typeset preprint pages with blue-pencil margin annotations, an effect-size figure via comp.category-bar-chart and a bespoke confidence-interval dot-whisker plate (Figure 3), F3 stamped DOES NOT REPLICATE (n=12) as the anomaly, ?slide= deep links, print stylesheet, accessible CI table mirror.",
    ],
  },
});
