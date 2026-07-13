import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-project-kickoff',
  surface: 'slide-deck',
  title: 'Project Kickoff',
  designThesis:
    'Stages a programme kickoff as a physical planning wall — a single hand-drawn milestone route you can point at — so the plan, its owners, and its one unconfirmed dependency are all visible in the same glance rather than buried in a status pack.',
  grammarId: 'executive-editorial',
  audiences: ['business', 'technical'],
  businessIntents: ['align-project-kickoff', 'commit-milestones'],
  density: 'low',
  motionLevel: 2,
  signatureSequence: 'ledger-reveal',
  corporateSuitability: 'expressive',
  componentsUsed: ['comp.status-list'],
  routes: [
    {
      path: '/decks/project-kickoff',
      title: 'The wall & the route',
      purpose: 'Title, why-now, scope, and the milestone route',
    },
    {
      path: '/decks/project-kickoff/ownership',
      title: 'Ownership & workstreams',
      purpose: 'RACI grid and the four kickoff workstreams',
    },
    {
      path: '/decks/project-kickoff/ask',
      title: 'Risk, resourcing & the ask',
      purpose: 'Risk wall, resourcing, first ninety days, and the decision ask',
    },
  ],
  tags: ['project-kickoff', 'planning', 'milestones', 'slide-deck'],
  whenToUse:
    'Use to open a delivery programme with the sponsors and delivery team when everyone needs to leave with the same picture of the route, the owners, and the dependency that can move the dates.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 93,
    notes: [
      "Live build shipped (batch-2 decks D): 'The Planning Wall' at /live/deck-project-kickoff — ten keyboard-driven slides on warm butcher paper, a persistent hand-sketched milestone route (M0→M5) with the red-circled DATA PLATFORM SIGN-OFF dependency as the anomaly, ?slide= deep links, print stylesheet, accessible route + RACI mirror.",
    ],
  },
});
