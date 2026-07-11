import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-model-monitoring-cockpit",
  surface: "dashboard",
  title: "Model Monitoring Cockpit",
  designThesis: "Dense time-series monitoring of every production model's drift, latency, and data-quality signals, with nested navigation from fleet view to a single model's diagnostics.",
  grammarId: "precision-grid",
  audiences: ["technical","risk-and-governance"],
  businessIntents: ["monitor-model-health","detect-drift-early"],
  density: "high",
  motionLevel: 1,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.trend-chart","comp.category-bar-chart","comp.status-list"],
  routes: [
    {
      "path": "/dashboards/model-monitoring-cockpit",
      "title": "Model Monitoring Cockpit",
      "purpose": "Fleet-wide model health monitoring with nested per-model drill-down"
    }
  ],
  tags: ["monitoring","mlops","model-risk","dashboard"],
  whenToUse: "Use when a technical or model-risk team needs to watch many models' health signals at once and jump to any one model's detail without losing fleet context.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-08",
    "qualityScore": 94,
    "notes": [
      "Anchor experience for slice 1 — full content pack authored and render-tested."
    ]
  },
});
