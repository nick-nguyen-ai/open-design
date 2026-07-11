import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-experiment-results",
  surface: "slide-deck",
  title: "Experiment Results",
  designThesis: "Sequences experiment results so cause and effect are traceable slide to slide, not just tabulated at the end.",
  grammarId: "kinetic-intelligence",
  audiences: ["technical","mixed"],
  businessIntents: ["present-experiment-results","support-experiment-decision"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.trend-chart","comp.category-bar-chart"],
  routes: [
    {
      "path": "/decks/experiment-results",
      "title": "Opening & Summary",
      "purpose": "Title slide and experiment summary"
    },
    {
      "path": "/decks/experiment-results/evidence",
      "title": "Results",
      "purpose": "Sequenced comparison of experiment results"
    },
    {
      "path": "/decks/experiment-results/decision",
      "title": "Decision & Close",
      "purpose": "Recommendation and closing slide"
    }
  ],
  tags: ["experimentation","results","slide-deck"],
  whenToUse: "Use when experiment results need to be understood as a comparison and a causal chain, not a final table of numbers.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-06",
    "qualityScore": 73,
    "notes": [
      "Motion level 3 pacing pending a live presenter run-through."
    ]
  },
});
