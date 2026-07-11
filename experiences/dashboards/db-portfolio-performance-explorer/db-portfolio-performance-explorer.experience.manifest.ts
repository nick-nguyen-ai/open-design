import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "db-portfolio-performance-explorer",
  surface: "dashboard",
  title: "Portfolio Performance Explorer",
  designThesis: "Guided analytical storytelling through portfolio performance, rather than a card wall of disconnected metrics.",
  grammarId: "executive-editorial",
  audiences: ["business"],
  businessIntents: ["explain-portfolio-performance","support-quarterly-review"],
  density: "medium",
  motionLevel: 1,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  themeModes: ["light","dark","adaptive"],
  componentsUsed: ["comp.trend-chart","comp.kpi-tile","comp.category-bar-chart"],
  routes: [
    {
      "path": "/dashboards/portfolio-performance-explorer",
      "title": "Portfolio Performance Explorer",
      "purpose": "Narrative walk-through of portfolio performance drivers"
    }
  ],
  tags: ["portfolio","performance","narrative","dashboard"],
  whenToUse: "Use when the goal is to explain why portfolio performance moved, not just report the number it moved to.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-14",
    "qualityScore": 80,
    "notes": []
  },
});
