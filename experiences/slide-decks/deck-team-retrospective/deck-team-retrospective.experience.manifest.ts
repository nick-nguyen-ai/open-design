import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-team-retrospective',
  surface: 'slide-deck',
  title: 'Team Retrospective',
  designThesis:
    'Stages a sprint retrospective as the whiteboard it actually happened on — marker frame, sticky walls, dot-votes and hand-drawn arrows — so the conversation, its one recurring un-owned problem, and the actions that come out of it stay in the room’s own handwriting rather than a sanitised summary.',
  grammarId: 'executive-editorial',
  audiences: ['technical', 'mixed'],
  businessIntents: ['run-team-retrospective', 'commit-improvement-actions'],
  density: 'low',
  motionLevel: 2,
  signatureSequence: 'ledger-reveal',
  corporateSuitability: 'expressive',
  componentsUsed: ['comp.status-list'],
  routes: [
    {
      path: '/decks/team-retrospective',
      title: 'The board',
      purpose: 'Title, how the room felt, and the went-well / didn’t sticky walls',
    },
    {
      path: '/decks/team-retrospective/actions',
      title: 'The one thing & actions',
      purpose: 'The one big thing, the typed actions board, and the red-circled anomaly',
    },
    {
      path: '/decks/team-retrospective/next',
      title: 'Ownership & next sprint',
      purpose: 'Ownership map, the next-sprint experiment, and the close',
    },
  ],
  tags: ['retrospective', 'team', 'agile', 'slide-deck'],
  whenToUse:
    'Use to run or share a team retro when the value is in keeping the room’s own board — the stickies, the votes, the arrows — and turning it into a small set of owned actions rather than a tidy status update.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 92,
    notes: [
      "Live build shipped (batch-2 decks E): 'The Whiteboard' at /live/deck-team-retrospective — nine light marker-whiteboard slides with a hand-drawn board frame, muted yellow/pink sticky walls, dot-vote mood scale and hand-drawn ownership arrows, a comp.status-list actions board framed as a taped printout carrying the red triple-circled CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP anomaly, hidden per-column list mirrors, ?slide= deep links, and a print stylesheet. Deterministic Caveat handwriting; distinct from The Planning Wall's pencil-on-butcher-paper.",
    ],
  },
});
