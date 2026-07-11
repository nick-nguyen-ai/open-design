import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-operating-model-redesign",
  surface: "project-page",
  title: "Operating Model Redesign",
  designThesis: "Presents an operating-model redesign as an executive narrative of decisions taken, calmly, not a reorg chart.",
  grammarId: "calm-command",
  audiences: ["executive","business"],
  businessIntents: ["communicate-operating-model-decisions","track-transition-progress"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "standard",
  componentsUsed: ["comp.kpi-tile","comp.status-list","comp.trend-chart"],
  routes: [
    {
      "path": "/projects/operating-model-redesign",
      "title": "Overview",
      "purpose": "Operating model redesign landing page"
    },
    {
      "path": "/projects/operating-model-redesign/overview",
      "title": "Decisions",
      "purpose": "Operating model decisions taken and rationale"
    },
    {
      "path": "/projects/operating-model-redesign/progress",
      "title": "Progress",
      "purpose": "Transition progress against the new model"
    },
    {
      "path": "/projects/operating-model-redesign/analytics",
      "title": "Transition Analytics",
      "purpose": "Embedded headcount and capability transition analysis"
    }
  ],
  tags: ["operating-model","organisation-design","project-page"],
  whenToUse: "Use when leadership needs to communicate operating-model decisions calmly and track the transition without reopening every decision.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-30",
    "qualityScore": 79,
    "notes": []
  },
});
