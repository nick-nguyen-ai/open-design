import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-coding-agent-implementation-plan",
  surface: "technical-explainer",
  title: "Coding-Agent Implementation Plan",
  designThesis: "Lays out an implementation plan for a coding agent with the same task-by-task exactness the agent itself must follow.",
  grammarId: "precision-grid",
  audiences: ["technical"],
  businessIntents: ["plan-agent-implementation","communicate-task-sequencing"],
  density: "high",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list","comp.kpi-tile"],
  routes: [
    {
      "path": "/explainers/coding-agent-implementation-plan",
      "title": "Plan",
      "purpose": "Task-by-task implementation plan"
    },
    {
      "path": "/explainers/coding-agent-implementation-plan/deep-dive",
      "title": "Deep Dive",
      "purpose": "Per-task acceptance evidence"
    }
  ],
  tags: ["coding-agent","implementation-plan","explainer"],
  whenToUse: "Use when a coding agent's implementation plan needs to be exact enough that a reviewer can verify each task independently.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-01",
    "qualityScore": 82,
    "notes": []
  },
});
