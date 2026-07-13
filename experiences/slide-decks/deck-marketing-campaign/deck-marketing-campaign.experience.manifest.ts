import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-marketing-campaign',
  surface: 'slide-deck',
  title: 'Marketing Campaign',
  designThesis:
    'Pitches a launch campaign as a war-room at night — one electric signal in the dark, a hand-drawn conversion funnel as the spine and an interactive channel-mix bar as the evidence — so the argument to spend less and aim harder lands as conviction, not a media plan.',
  grammarId: 'monumental-type',
  audiences: ['executive', 'business'],
  businessIntents: ['pitch-campaign', 'commit-launch-budget'],
  density: 'low',
  motionLevel: 2,
  signatureSequence: 'horizon-sweep',
  corporateSuitability: 'expressive',
  componentsUsed: ['comp.kpi-tile'],
  routes: [
    {
      path: '/decks/marketing-campaign',
      title: 'The idea',
      purpose: 'Cover, audience insight, and the big idea',
    },
    {
      path: '/decks/marketing-campaign/plan',
      title: 'The funnel & the mix',
      purpose: 'Conversion funnel, interactive channel mix, and flight plan',
    },
    {
      path: '/decks/marketing-campaign/ask',
      title: 'Creative, measurement & the ask',
      purpose: 'Creative direction, measurement plan, and the budget ask',
    },
  ],
  tags: ['marketing', 'campaign', 'launch', 'slide-deck'],
  whenToUse:
    'Use to take a campaign proposal to a leadership team that must commit budget — when the case is to concentrate spend, cut an underperforming channel, and back one idea rather than spread across all of them.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 93,
    notes: [
      "Live build shipped (batch-2 decks D): 'The Campaign Room' at /live/deck-marketing-campaign — nine dark war-room slides, a hand-sketched conversion funnel with the struck-through PAID SOCIAL — CUT · CAC 4.1× TARGET anomaly, a keyboard-operable interactive channel-mix bar with aria-live readout, a comp.kpi-tile headline row, ?slide= deep links, print stylesheet, funnel + channel-mix table mirrors.",
    ],
  },
});
