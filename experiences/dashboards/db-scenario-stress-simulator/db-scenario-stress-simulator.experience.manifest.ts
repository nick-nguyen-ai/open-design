import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-scenario-stress-simulator",
  surface: "dashboard",
  title: "Scenario Stress Simulator",
  designThesis: "Compare stress scenarios side by side and trace which drivers actually move the outcome.",
  grammarId: "kinetic-intelligence",
  audiences: ["risk-and-governance"],
  businessIntents: ["compare-stress-scenarios","identify-key-drivers"],
  density: "high",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.trend-chart","comp.category-bar-chart","comp.kpi-tile"],
  routes: [
    {
      "path": "/dashboards/scenario-stress-simulator",
      "title": "Scenario Stress Simulator",
      "purpose": "Side-by-side stress scenario comparison with driver tracing"
    }
  ],
  tags: ["stress-testing","scenario-analysis","risk","dashboard"],
  whenToUse: "Use when a risk team needs to compare multiple stress scenarios and identify which drivers explain the difference between them.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-01",
    "qualityScore": 71,
    "notes": [
      "Scenario comparison interaction still being validated with the risk team."
    ]
  },
});
