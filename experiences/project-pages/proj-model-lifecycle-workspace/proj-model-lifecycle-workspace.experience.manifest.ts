import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-model-lifecycle-workspace",
  surface: "project-page",
  title: "Model Lifecycle Workspace",
  designThesis: "Models move through develop, validate, deploy, and retire as visible state transitions, not a status column in a spreadsheet.",
  grammarId: "living-system",
  audiences: ["technical"],
  businessIntents: ["track-model-lifecycle-state","coordinate-lifecycle-transitions"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/projects/model-lifecycle-workspace",
      "title": "Overview",
      "purpose": "Model lifecycle workspace landing page"
    },
    {
      "path": "/projects/model-lifecycle-workspace/overview",
      "title": "Lifecycle Map",
      "purpose": "Full develop-validate-deploy-retire lifecycle"
    },
    {
      "path": "/projects/model-lifecycle-workspace/progress",
      "title": "Progress",
      "purpose": "Current state of every model in the inventory"
    },
    {
      "path": "/projects/model-lifecycle-workspace/analytics",
      "title": "Transition Analytics",
      "purpose": "Embedded lifecycle-duration analysis"
    }
  ],
  tags: ["model-lifecycle","mlops","project-page"],
  whenToUse: "Use when a model risk or MLOps team needs to see which lifecycle stage every model is in and how it got there.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-04",
    "qualityScore": 72,
    "notes": [
      "Lifecycle transition animation pending a second MLOps team review."
    ]
  },
});
