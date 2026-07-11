import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "proj-regulatory-remediation-programme",
  surface: "project-page",
  title: "Regulatory Remediation Programme",
  designThesis: "Tracks every remediation commitment against its regulator-facing deadline with zero ambiguity about status.",
  grammarId: "calm-command",
  audiences: ["risk-and-governance"],
  businessIntents: ["track-remediation-commitments","demonstrate-regulator-progress"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.status-list","comp.kpi-tile","comp.category-bar-chart"],
  routes: [
    {
      "path": "/projects/regulatory-remediation-programme",
      "title": "Overview",
      "purpose": "Remediation programme landing page"
    },
    {
      "path": "/projects/regulatory-remediation-programme/overview",
      "title": "Commitments",
      "purpose": "Every remediation commitment and its deadline"
    },
    {
      "path": "/projects/regulatory-remediation-programme/progress",
      "title": "Progress",
      "purpose": "Status against each commitment"
    },
    {
      "path": "/projects/regulatory-remediation-programme/analytics",
      "title": "Commitment Analytics",
      "purpose": "Embedded on-time delivery analysis"
    }
  ],
  tags: ["regulatory","remediation","governance","project-page"],
  whenToUse: "Use when a governance team must demonstrate, without ambiguity, that every regulator commitment is on track or explain why it is not.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-16",
    "qualityScore": 85,
    "notes": []
  },
});
