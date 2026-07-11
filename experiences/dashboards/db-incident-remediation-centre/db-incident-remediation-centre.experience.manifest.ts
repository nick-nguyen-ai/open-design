import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-incident-remediation-centre",
  surface: "dashboard",
  title: "Incident Remediation Centre",
  designThesis: "Incident state and remediation workflow rendered as an animated living system, not a static ticket table.",
  grammarId: "living-system",
  audiences: ["risk-and-governance","technical"],
  businessIntents: ["coordinate-incident-remediation","communicate-incident-state"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.flow-diagram","comp.kpi-tile"],
  routes: [
    {
      "path": "/dashboards/incident-remediation-centre",
      "title": "Incident Remediation Centre",
      "purpose": "Live incident state and remediation workflow tracking"
    }
  ],
  tags: ["incident-management","remediation","operations","dashboard"],
  whenToUse: "Use during an active incident when responders need to see current state and remediation steps at a glance, not scroll through a ticket history.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-03",
    "qualityScore": 73,
    "notes": [
      "Living-system state diagram pending a second incident-response walkthrough."
    ]
  },
});
