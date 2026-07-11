import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-innovation-showcase",
  surface: "slide-deck",
  title: "Innovation Showcase",
  designThesis: "Lets an audience explore a portfolio of innovation bets as a navigable map rather than a fixed slide order.",
  grammarId: "spatial-canvas",
  audiences: ["mixed"],
  businessIntents: ["showcase-innovation-portfolio","invite-open-exploration"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.flow-diagram","comp.kpi-tile"],
  routes: [
    {
      "path": "/decks/innovation-showcase",
      "title": "Opening & Summary",
      "purpose": "Title slide and portfolio map entry point"
    },
    {
      "path": "/decks/innovation-showcase/evidence",
      "title": "Portfolio Map",
      "purpose": "Navigable innovation bet map"
    },
    {
      "path": "/decks/innovation-showcase/decision",
      "title": "Decision & Close",
      "purpose": "Highlights recap and closing slide"
    }
  ],
  tags: ["innovation","showcase","slide-deck"],
  whenToUse: "Use for a showcase audience that benefits from browsing bets in their own order rather than following a fixed slide sequence.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-09",
    "qualityScore": 70,
    "notes": [
      "Non-linear navigable deck format pending a live audience pilot."
    ]
  },
});
