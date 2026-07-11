import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-executive-decision-proposal",
  surface: "slide-deck",
  title: "Executive Decision Proposal",
  designThesis: "Builds a single decision proposal to its recommendation the way a well-argued paper does — options first, recommendation last.",
  grammarId: "executive-editorial",
  audiences: ["executive"],
  businessIntents: ["propose-executive-decision","secure-sign-off"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "standard",
  componentsUsed: ["comp.kpi-tile","comp.status-list"],
  routes: [
    {
      "path": "/decks/executive-decision-proposal",
      "title": "Opening & Summary",
      "purpose": "Title slide and proposal summary"
    },
    {
      "path": "/decks/executive-decision-proposal/evidence",
      "title": "Options",
      "purpose": "Options considered and supporting evidence"
    },
    {
      "path": "/decks/executive-decision-proposal/decision",
      "title": "Decision & Close",
      "purpose": "Recommendation and closing slide"
    }
  ],
  tags: ["decision-proposal","executive","slide-deck"],
  whenToUse: "Use when a single decision needs to be proposed and argued to a sign-off authority in one sitting.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-21",
    "qualityScore": 81,
    "notes": []
  },
});
