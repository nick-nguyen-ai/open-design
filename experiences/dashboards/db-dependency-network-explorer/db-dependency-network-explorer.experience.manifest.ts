import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-dependency-network-explorer",
  surface: "dashboard",
  title: "Dependency Network Explorer",
  designThesis: "Dependency network navigation with contextual side panels that keep the map primary and the detail secondary.",
  grammarId: "spatial-canvas",
  audiences: ["technical"],
  businessIntents: ["explore-system-dependencies","assess-change-impact"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  themeModes: ["light","dark","adaptive"],
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/dashboards/dependency-network-explorer",
      "title": "Dependency Network Explorer",
      "purpose": "Navigable system dependency map with contextual detail panels"
    }
  ],
  tags: ["architecture","dependencies","exploration","dashboard"],
  whenToUse: "Use when an architecture or platform team needs to assess the blast radius of a change by exploring the actual dependency graph.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-24",
    "qualityScore": 78,
    "notes": []
  },
});
