import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-delivery-control-tower",
  surface: "dashboard",
  title: "Delivery Control Tower",
  designThesis: "Milestones, blockers, dependencies, and delivery confidence surfaced through layered, restrained depth rather than a flat status wall.",
  grammarId: "signal-glass",
  audiences: ["business","executive"],
  businessIntents: ["track-delivery-confidence","surface-blockers-early"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.kpi-tile","comp.flow-diagram"],
  routes: [
    {
      "path": "/dashboards/delivery-control-tower",
      "title": "Delivery Control Tower",
      "purpose": "Programme-wide milestone, blocker, and dependency overview"
    }
  ],
  tags: ["delivery","programme-management","dashboard"],
  whenToUse: "Use when programme leadership needs delivery confidence across several workstreams without being buried in individual task trackers.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-10",
    "qualityScore": 81,
    "notes": []
  },
});
