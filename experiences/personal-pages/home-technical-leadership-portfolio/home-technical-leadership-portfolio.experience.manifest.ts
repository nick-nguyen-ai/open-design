import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-technical-leadership-portfolio",
  surface: "personal-page",
  title: "Technical Leadership Portfolio",
  designThesis: "Presents technical leadership impact as a premium narrative of decisions and outcomes, not a bullet-point CV.",
  grammarId: "executive-editorial",
  audiences: ["personal-internal","executive"],
  businessIntents: ["showcase-leadership-impact","support-career-progression"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.kpi-tile","comp.trend-chart","comp.status-list"],
  routes: [
    {
      "path": "/people/technical-leadership-portfolio",
      "title": "Portfolio",
      "purpose": "Leadership narrative and impact"
    },
    {
      "path": "/people/technical-leadership-portfolio/archive",
      "title": "Archive",
      "purpose": "Full project and decision archive"
    }
  ],
  tags: ["personal","leadership","portfolio"],
  whenToUse: "Use when technical leadership impact needs to read as a narrative of decisions and outcomes for a promotion or review process.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-07",
    "qualityScore": 80,
    "notes": []
  },
});
