import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-migration-plan",
  surface: "technical-explainer",
  title: "Migration Plan",
  designThesis: "Presents a migration plan as an annotated blueprint of phases, cutovers, and rollback points.",
  grammarId: "technical-blueprint",
  audiences: ["technical","risk-and-governance"],
  businessIntents: ["communicate-migration-plan","de-risk-cutover"],
  density: "high",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list","comp.category-bar-chart"],
  routes: [
    {
      "path": "/explainers/migration-plan",
      "title": "Plan",
      "purpose": "Migration phases, cutovers, and rollback points"
    },
    {
      "path": "/explainers/migration-plan/deep-dive",
      "title": "Deep Dive",
      "purpose": "Per-phase risk and rollback detail"
    }
  ],
  tags: ["migration","planning","explainer"],
  whenToUse: "Use when a migration plan's cutover and rollback points need to be as legible as the migration steps themselves.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-20",
    "qualityScore": 79,
    "notes": []
  },
});
