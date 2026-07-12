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
  signatureSequence: "ledger-reveal",
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
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 92,
    "notes": [
      "Live build shipped (task 18): 'The Annual Letter' at /live/home-technical-leadership-portfolio — ivory letterpress paper, ink Fraunces serif, a bespoke engraving-style tenure line that owns the page (nine systems, one cut short and marked SUNSET BY DESIGN), the required 'What I got wrong in FY26' correction section, a full record table mirror, principle pull quotes, and a signature block. LedgerReveal in reading order; reduced-motion parity. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE · SYNTHETIC mark in chrome."
    ]
  },
});
