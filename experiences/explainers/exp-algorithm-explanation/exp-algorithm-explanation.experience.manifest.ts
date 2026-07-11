import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-algorithm-explanation",
  surface: "technical-explainer",
  title: "Algorithm Explanation",
  designThesis: "Sequences an algorithm's steps so each transformation of the data is visible before the next one begins.",
  grammarId: "kinetic-intelligence",
  audiences: ["technical"],
  businessIntents: ["teach-algorithm-mechanics","support-code-review"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.trend-chart"],
  routes: [
    {
      "path": "/explainers/algorithm-explanation",
      "title": "Algorithm",
      "purpose": "Step-by-step algorithm walkthrough"
    },
    {
      "path": "/explainers/algorithm-explanation/deep-dive",
      "title": "Deep Dive",
      "purpose": "Worked example with real data"
    }
  ],
  tags: ["algorithm","explainer","engineering"],
  whenToUse: "Use when an algorithm is easier to understand as a sequence of visible data transformations than as pseudocode alone.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-06",
    "qualityScore": 71,
    "notes": [
      "Step sequencing pending a second read-through with a non-author engineer."
    ]
  },
});
