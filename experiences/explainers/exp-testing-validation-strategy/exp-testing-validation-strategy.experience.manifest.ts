import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-testing-validation-strategy",
  surface: "technical-explainer",
  title: "Testing and Validation Strategy",
  designThesis: "Layers unit, integration, and validation evidence with restrained depth so test coverage claims are inspectable, not asserted.",
  grammarId: "signal-glass",
  audiences: ["technical","risk-and-governance"],
  businessIntents: ["explain-test-strategy","support-coverage-audit"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.category-bar-chart","comp.flow-diagram"],
  routes: [
    {
      "path": "/explainers/testing-validation-strategy",
      "title": "Strategy",
      "purpose": "Layered unit, integration, and validation evidence"
    },
    {
      "path": "/explainers/testing-validation-strategy/deep-dive",
      "title": "Deep Dive",
      "purpose": "Per-layer coverage detail"
    }
  ],
  tags: ["testing","validation","explainer"],
  whenToUse: "Use when a testing strategy's coverage claims need to be inspectable layer by layer, not taken on trust.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-28",
    "qualityScore": 80,
    "notes": []
  },
});
