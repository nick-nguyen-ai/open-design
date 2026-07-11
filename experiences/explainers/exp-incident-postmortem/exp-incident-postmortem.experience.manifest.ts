import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-incident-postmortem",
  surface: "technical-explainer",
  title: "Incident Postmortem",
  designThesis: "Documents an incident postmortem to evidentiary standard — timeline, root cause, contributing factors, and action items, each attributable.",
  grammarId: "research-notebook",
  audiences: ["technical","risk-and-governance"],
  businessIntents: ["document-incident-root-cause","track-remediation-actions"],
  density: "high",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.status-list","comp.trend-chart","comp.flow-diagram"],
  routes: [
    {
      "path": "/explainers/incident-postmortem",
      "title": "Postmortem",
      "purpose": "Timeline, root cause, and contributing factors"
    },
    {
      "path": "/explainers/incident-postmortem/deep-dive",
      "title": "Deep Dive",
      "purpose": "Action item tracking and evidence"
    }
  ],
  tags: ["incident","postmortem","explainer"],
  whenToUse: "Use when a postmortem needs to hold up to scrutiny from a team that was not in the incident room.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-24",
    "qualityScore": 81,
    "notes": []
  },
});
