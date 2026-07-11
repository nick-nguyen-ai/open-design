import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-ai-risk-command-centre",
  surface: "dashboard",
  title: "AI Risk Command Centre",
  designThesis: "Portfolio-level AI risk posture with progressive drill-down, from a single board-ready risk statement down to the model-level evidence behind it.",
  grammarId: "calm-command",
  audiences: ["executive","risk-and-governance"],
  businessIntents: ["communicate-risk-posture","support-board-reporting"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.kpi-tile","comp.status-list","comp.trend-chart"],
  routes: [
    {
      "path": "/dashboards/ai-risk-command-centre",
      "title": "AI Risk Command Centre",
      "purpose": "Portfolio-level AI risk overview with drill-down to model-level evidence"
    }
  ],
  tags: ["risk","ai-governance","executive","dashboard"],
  whenToUse: "Use when a board or executive risk committee needs a single-glance AI risk posture that can be interrogated without leaving the page.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-02",
    "qualityScore": 84,
    "notes": [
      "Passed the boardroom test; legal copy sign-off pending."
    ]
  },
});
