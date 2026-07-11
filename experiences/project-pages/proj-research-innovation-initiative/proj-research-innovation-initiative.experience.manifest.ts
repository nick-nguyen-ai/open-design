import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-research-innovation-initiative",
  surface: "project-page",
  title: "Research and Innovation Initiative",
  designThesis: "Treats exploratory research bets as a shared lab notebook — hypotheses, evidence, and next experiments in one page.",
  grammarId: "research-notebook",
  audiences: ["technical","mixed"],
  businessIntents: ["track-research-bets","share-experiment-evidence"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.trend-chart","comp.status-list","comp.kpi-tile"],
  routes: [
    {
      "path": "/projects/research-innovation-initiative",
      "title": "Overview",
      "purpose": "Research initiative landing page"
    },
    {
      "path": "/projects/research-innovation-initiative/overview",
      "title": "Active Bets",
      "purpose": "Current research bets and hypotheses"
    },
    {
      "path": "/projects/research-innovation-initiative/progress",
      "title": "Progress",
      "purpose": "Evidence gathered against each bet"
    },
    {
      "path": "/projects/research-innovation-initiative/analytics",
      "title": "Portfolio Analytics",
      "purpose": "Embedded research portfolio analysis"
    }
  ],
  tags: ["research","innovation","exploration","project-page"],
  whenToUse: "Use when a research function wants stakeholders to see the actual evidence behind an active bet, not just a status label.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-22",
    "qualityScore": 77,
    "notes": []
  },
});
