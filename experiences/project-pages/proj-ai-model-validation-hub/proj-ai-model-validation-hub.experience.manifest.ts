import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-ai-model-validation-hub",
  surface: "project-page",
  title: "AI Model Validation Hub",
  designThesis: "Centralises model validation evidence, challenger results, and sign-off status so a validator's case file replaces a scattered email trail.",
  grammarId: "research-notebook",
  audiences: ["technical","risk-and-governance"],
  businessIntents: ["centralise-validation-evidence","track-sign-off-status"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.status-list","comp.trend-chart","comp.flow-diagram"],
  routes: [
    {
      "path": "/projects/ai-model-validation-hub",
      "title": "Overview",
      "purpose": "Programme landing page and current status"
    },
    {
      "path": "/projects/ai-model-validation-hub/overview",
      "title": "Validation Scope",
      "purpose": "Models in scope and validation approach"
    },
    {
      "path": "/projects/ai-model-validation-hub/progress",
      "title": "Progress",
      "purpose": "Sign-off progress across the model inventory"
    },
    {
      "path": "/projects/ai-model-validation-hub/analytics",
      "title": "Validation Analytics",
      "purpose": "Embedded challenger-model performance analysis"
    }
  ],
  tags: ["model-validation","governance","project-page"],
  whenToUse: "Use when a model validation function needs one page that a validator, model owner, and committee can all point to as the case file.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-12",
    "qualityScore": 92,
    "notes": [
      "Live build shipped (task 13): 'The Validation Ledger' at /live/proj-ai-model-validation-hub — bespoke pipeline ledger with a flagged stalled item, table mirror, decision log, full content pack."
    ]
  },
});
