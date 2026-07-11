import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-agent-workflow",
  surface: "technical-explainer",
  title: "Agent Workflow",
  designThesis: "Renders an agent's decision workflow as a living system of states and transitions, not a static flowchart poster.",
  grammarId: "living-system",
  audiences: ["technical"],
  businessIntents: ["explain-agent-decision-flow","support-debugging"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/explainers/agent-workflow",
      "title": "Workflow",
      "purpose": "Agent state machine and transitions"
    },
    {
      "path": "/explainers/agent-workflow/deep-dive",
      "title": "Deep Dive",
      "purpose": "Per-state decision logic"
    }
  ],
  tags: ["agent","workflow","explainer"],
  whenToUse: "Use when explaining or debugging an agent whose behaviour is genuinely stateful and transition-driven.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-30",
    "qualityScore": 76,
    "notes": []
  },
});
