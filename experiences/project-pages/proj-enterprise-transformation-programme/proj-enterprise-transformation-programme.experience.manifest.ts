import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-enterprise-transformation-programme",
  surface: "project-page",
  title: "Enterprise Transformation Programme",
  designThesis: "Tracks a multi-year transformation as a narrative of committed outcomes, not a Gantt chart nobody reads.",
  grammarId: "executive-editorial",
  audiences: ["executive","business"],
  businessIntents: ["communicate-transformation-narrative","track-committed-outcomes"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  themeModes: ["light","dark","adaptive"],
  componentsUsed: ["comp.kpi-tile","comp.trend-chart","comp.status-list"],
  routes: [
    {
      "path": "/projects/enterprise-transformation-programme",
      "title": "Overview",
      "purpose": "Programme narrative landing page"
    },
    {
      "path": "/projects/enterprise-transformation-programme/overview",
      "title": "Outcomes",
      "purpose": "Committed outcomes and current status"
    },
    {
      "path": "/projects/enterprise-transformation-programme/progress",
      "title": "Progress",
      "purpose": "Programme-level progress against outcomes"
    },
    {
      "path": "/projects/enterprise-transformation-programme/analytics",
      "title": "Benefits Analytics",
      "purpose": "Embedded benefits-realisation analysis"
    }
  ],
  tags: ["transformation","programme","executive","project-page"],
  whenToUse: "Use when programme leadership needs an executive-readable narrative of a multi-year transformation, not a project-management artefact.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-08",
    "qualityScore": 81,
    "notes": []
  },
});
