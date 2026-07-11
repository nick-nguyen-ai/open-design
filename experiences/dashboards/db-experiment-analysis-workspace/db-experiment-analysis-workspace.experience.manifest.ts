import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-experiment-analysis-workspace",
  surface: "dashboard",
  title: "Experiment Analysis Workspace",
  designThesis: "Hypotheses, experiment lineage, metrics, and evidence held to the same standard as a published lab notebook.",
  grammarId: "research-notebook",
  audiences: ["technical"],
  businessIntents: ["review-experiment-evidence","support-model-sign-off"],
  density: "high",
  motionLevel: 1,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.trend-chart","comp.status-list","comp.kpi-tile"],
  routes: [
    {
      "path": "/dashboards/experiment-analysis-workspace",
      "title": "Experiment Analysis Workspace",
      "purpose": "Experiment lineage, metrics, and evidence review"
    }
  ],
  tags: ["experimentation","data-science","evidence","dashboard"],
  whenToUse: "Use when a data science team needs to review an experiment's evidence trail before promoting a model or closing a hypothesis.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-20",
    "qualityScore": 82,
    "notes": []
  },
});
