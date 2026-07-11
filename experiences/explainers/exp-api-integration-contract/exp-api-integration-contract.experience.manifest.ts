import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-api-integration-contract",
  surface: "technical-explainer",
  title: "API and Integration Contract",
  designThesis: "Specifies an API integration contract with the exactness of a reference document a downstream team can build against unsupervised.",
  grammarId: "precision-grid",
  audiences: ["technical"],
  businessIntents: ["specify-integration-contract","reduce-integration-support-load"],
  density: "high",
  motionLevel: 1,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/explainers/api-integration-contract",
      "title": "Contract",
      "purpose": "Endpoint, schema, and integration contract"
    },
    {
      "path": "/explainers/api-integration-contract/deep-dive",
      "title": "Deep Dive",
      "purpose": "Error handling and versioning detail"
    }
  ],
  tags: ["api","integration","explainer"],
  whenToUse: "Use when a downstream team needs to integrate against a contract without needing a support call to clarify it.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-13",
    "qualityScore": 83,
    "notes": []
  },
});
