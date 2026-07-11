import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-vendor-assessment",
  surface: "project-page",
  title: "Vendor Assessment Project",
  designThesis: "Layers vendor risk, commercial, and technical assessments with restrained depth so no single lens dominates the decision.",
  grammarId: "signal-glass",
  audiences: ["business","risk-and-governance"],
  businessIntents: ["assess-vendor-risk","support-vendor-decision"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.category-bar-chart","comp.kpi-tile"],
  routes: [
    {
      "path": "/projects/vendor-assessment",
      "title": "Overview",
      "purpose": "Vendor assessment landing page"
    },
    {
      "path": "/projects/vendor-assessment/overview",
      "title": "Assessment Lenses",
      "purpose": "Risk, commercial, and technical assessment layers"
    },
    {
      "path": "/projects/vendor-assessment/progress",
      "title": "Progress",
      "purpose": "Assessment completion status"
    },
    {
      "path": "/projects/vendor-assessment/analytics",
      "title": "Comparison Analytics",
      "purpose": "Embedded vendor comparison analysis"
    }
  ],
  tags: ["vendor-management","risk","project-page"],
  whenToUse: "Use when a vendor decision genuinely depends on weighing several assessment lenses together, not picking the loudest one.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-26",
    "qualityScore": 76,
    "notes": []
  },
});
