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
  componentsUsed: ["comp.trend-chart","comp.kpi-tile","comp.status-list"],
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
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-12",
    "qualityScore": 93,
    "notes": [
      "Live build shipped (task 15): 'The Committee Paper' at /live/deck-executive-decision-proposal — a formal credit-committee paper of a cover and nine numbered clauses on ivory laid stock, ink serif with one wax-seal red reserved for the decision. Recommendation-first ordering; an options table with the committee's own preferred Option 4 struck (declined by Model Risk) as the deliberate anomaly; one evidence chart (cost of the recommended path vs the incumbent left to run) via ChartFigure; a signature-block resolution with CARRIED/DECLINED. Keyboard-driven (arrows/Home/End), ?slide= deep links, print stylesheet, contents index as the accessible mirror.",
      "Licence reviewed: self-hosted OFL fonts only (Fraunces Variable, IBM Plex Mono); all figures synthetic demonstration data; no real-institution claims."
    ]
  },
});
