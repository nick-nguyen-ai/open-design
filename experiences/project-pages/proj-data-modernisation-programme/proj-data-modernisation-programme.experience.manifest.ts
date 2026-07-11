import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-data-modernisation-programme",
  surface: "project-page",
  title: "Data Modernisation Programme",
  designThesis: "Makes the target-state data estate navigable as a map, so migration sequencing reads as geography, not backlog.",
  grammarId: "spatial-canvas",
  audiences: ["technical"],
  businessIntents: ["communicate-target-state-architecture","sequence-data-migration"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "expressive",
  themeModes: ["light","dark","adaptive"],
  componentsUsed: ["comp.flow-diagram","comp.category-bar-chart"],
  routes: [
    {
      "path": "/projects/data-modernisation-programme",
      "title": "Overview",
      "purpose": "Data modernisation programme landing page"
    },
    {
      "path": "/projects/data-modernisation-programme/overview",
      "title": "Target Estate Map",
      "purpose": "Navigable target-state data estate"
    },
    {
      "path": "/projects/data-modernisation-programme/progress",
      "title": "Progress",
      "purpose": "Migration sequencing progress across the estate"
    },
    {
      "path": "/projects/data-modernisation-programme/analytics",
      "title": "Estate Analytics",
      "purpose": "Embedded data-domain migration analysis"
    }
  ],
  tags: ["data-modernisation","architecture","project-page"],
  whenToUse: "Use when the data estate is genuinely large and multi-domain, and sequencing needs to be understood spatially, not as a flat list.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-05",
    "qualityScore": 70,
    "notes": [
      "Spatial canvas navigation pending usability testing with the data architecture team."
    ]
  },
});
