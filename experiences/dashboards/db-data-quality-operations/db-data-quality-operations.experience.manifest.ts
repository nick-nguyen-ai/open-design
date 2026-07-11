import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-data-quality-operations",
  surface: "dashboard",
  title: "Data Quality Operations",
  designThesis: "Lineage-aware data quality incidents routed to the accountable owner, annotated like an as-built diagram rather than a raw ticket queue.",
  grammarId: "technical-blueprint",
  audiences: ["technical"],
  businessIntents: ["triage-data-quality-incidents","assign-ownership"],
  density: "high",
  motionLevel: 1,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.flow-diagram","comp.category-bar-chart"],
  routes: [
    {
      "path": "/dashboards/data-quality-operations",
      "title": "Data Quality Operations",
      "purpose": "Lineage-aware data quality incident triage and ownership"
    }
  ],
  tags: ["data-quality","lineage","operations","dashboard"],
  whenToUse: "Use when a data engineering team needs to see which pipeline a quality incident originates from and who owns fixing it.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-18",
    "qualityScore": 79,
    "notes": []
  },
});
