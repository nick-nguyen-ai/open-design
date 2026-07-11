import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-team-contribution-impact-page",
  surface: "personal-page",
  title: "Team Contribution and Impact Page",
  designThesis: "Layers individual and team contribution data with restrained depth so impact reads as substance, not self-promotion.",
  grammarId: "signal-glass",
  audiences: ["personal-internal","business"],
  businessIntents: ["showcase-team-impact","support-recognition-process"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.kpi-tile","comp.trend-chart"],
  routes: [
    {
      "path": "/people/team-contribution-impact-page",
      "title": "Impact",
      "purpose": "Layered individual and team impact view"
    },
    {
      "path": "/people/team-contribution-impact-page/detail",
      "title": "Detail",
      "purpose": "Contribution detail by initiative"
    }
  ],
  tags: ["personal","team","impact"],
  whenToUse: "Use when contribution and impact data needs to be shown with enough restraint that it reads as evidence, not a highlight reel.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-03",
    "qualityScore": 77,
    "notes": []
  },
});
