import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-data-lineage-map",
  surface: "technical-explainer",
  title: "Data Lineage Map",
  designThesis: "Makes data lineage navigable as a map from source to consumption, so provenance questions are answered by exploring, not asking.",
  grammarId: "spatial-canvas",
  audiences: ["technical"],
  businessIntents: ["explain-data-lineage","support-provenance-audits"],
  density: "high",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.flow-diagram","comp.category-bar-chart"],
  routes: [
    {
      "path": "/explainers/data-lineage-map",
      "title": "Lineage Map",
      "purpose": "Navigable source-to-consumption lineage"
    },
    {
      "path": "/explainers/data-lineage-map/deep-dive",
      "title": "Deep Dive",
      "purpose": "Per-dataset transformation detail"
    }
  ],
  tags: ["data-lineage","provenance","explainer"],
  whenToUse: "Use when a provenance or audit question is best answered by letting someone explore the lineage map themselves.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-08",
    "qualityScore": 72,
    "notes": [
      "Lineage map depth pending validation against the largest real pipeline."
    ]
  },
});
