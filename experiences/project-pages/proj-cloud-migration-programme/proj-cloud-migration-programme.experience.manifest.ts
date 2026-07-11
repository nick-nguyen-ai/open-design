import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-cloud-migration-programme",
  surface: "project-page",
  title: "Cloud Migration Programme",
  designThesis: "Presents the migration as an annotated architecture-in-motion: workload by workload, dependency by dependency.",
  grammarId: "technical-blueprint",
  audiences: ["technical"],
  businessIntents: ["sequence-workload-migration","track-dependency-risk"],
  density: "high",
  motionLevel: 1,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list","comp.category-bar-chart"],
  routes: [
    {
      "path": "/projects/cloud-migration-programme",
      "title": "Overview",
      "purpose": "Migration programme landing page"
    },
    {
      "path": "/projects/cloud-migration-programme/overview",
      "title": "Target Architecture",
      "purpose": "Target-state architecture and migration waves"
    },
    {
      "path": "/projects/cloud-migration-programme/progress",
      "title": "Progress",
      "purpose": "Workload-by-workload migration status"
    },
    {
      "path": "/projects/cloud-migration-programme/analytics",
      "title": "Cutover Analytics",
      "purpose": "Embedded cutover-risk and dependency analysis"
    }
  ],
  tags: ["cloud-migration","architecture","project-page"],
  whenToUse: "Use when a migration team needs the architecture, the sequencing, and the dependency risk visible on the same page.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-11",
    "qualityScore": 80,
    "notes": []
  },
});
