import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-platform-product-launch",
  surface: "project-page",
  title: "Platform Product Launch",
  designThesis: "Gives a platform launch the typographic weight of a product moment, while keeping readiness detail one click away.",
  grammarId: "monumental-type",
  audiences: ["business","mixed"],
  businessIntents: ["build-launch-momentum","track-launch-readiness"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.kpi-tile","comp.status-list","comp.trend-chart"],
  routes: [
    {
      "path": "/projects/platform-product-launch",
      "title": "Launch",
      "purpose": "Headline launch statement and moment"
    },
    {
      "path": "/projects/platform-product-launch/overview",
      "title": "Readiness",
      "purpose": "Launch readiness overview"
    },
    {
      "path": "/projects/platform-product-launch/progress",
      "title": "Progress",
      "purpose": "Workstream progress toward launch"
    },
    {
      "path": "/projects/platform-product-launch/analytics",
      "title": "Adoption Analytics",
      "purpose": "Embedded early-adoption analysis"
    }
  ],
  tags: ["product-launch","go-to-market","project-page"],
  whenToUse: "Use when a platform launch deserves a distinct visual moment, not just another entry in a generic project tracker.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-02",
    "qualityScore": 74,
    "notes": [
      "Monumental Type readiness detail interaction pending stakeholder review."
    ]
  },
});
