import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-genai-model-validation-report",
  surface: "slide-deck",
  title: "GenAI Model Validation Report",
  designThesis: "Walks a validation committee through evidence and test results in the same order the validation team actually reasoned through them.",
  grammarId: "research-notebook",
  audiences: ["technical","risk-and-governance"],
  businessIntents: ["present-validation-evidence","support-model-sign-off"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.trend-chart","comp.status-list","comp.category-bar-chart"],
  routes: [
    {
      "path": "/decks/genai-model-validation-report",
      "title": "Opening & Summary",
      "purpose": "Title slide and validation summary"
    },
    {
      "path": "/decks/genai-model-validation-report/evidence",
      "title": "Evidence",
      "purpose": "Test results and evaluation evidence"
    },
    {
      "path": "/decks/genai-model-validation-report/decision",
      "title": "Decision & Close",
      "purpose": "Sign-off recommendation and closing slide"
    }
  ],
  tags: ["genai","model-validation","slide-deck"],
  whenToUse: "Use when a validation committee needs to see the evidence trail behind a GenAI model sign-off, not just the conclusion.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-09",
    "qualityScore": 82,
    "notes": []
  },
});
