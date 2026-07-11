import { buildExperience } from '../../_shared/experience-builder.js';

// Grammar substitution: Plan §11.1 specifies "Monumental Type combined with Precision Grid"; substituted with the closest single grammar, precision-grid (strongest surface = dashboards).
export default buildExperience({
  id: "db-regulatory-control-hub",
  surface: "dashboard",
  title: "Regulatory Control Hub",
  designThesis: "High-level control posture headlined typographically, backed by evidence-dense detail on demand.",
  grammarId: "precision-grid",
  audiences: ["risk-and-governance"],
  businessIntents: ["communicate-control-posture","support-regulatory-evidence-requests"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.kpi-tile","comp.category-bar-chart","comp.status-list"],
  routes: [
    {
      "path": "/dashboards/regulatory-control-hub",
      "title": "Regulatory Control Hub",
      "purpose": "Control posture headline with evidence-backed detail"
    }
  ],
  tags: ["regulatory","controls","governance","dashboard"],
  whenToUse: "Use when a governance team must present overall control posture to a regulator or committee, with evidence one click behind every claim.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-28",
    "qualityScore": 83,
    "notes": []
  },
});
