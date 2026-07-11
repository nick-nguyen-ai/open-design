import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-research-publication-portfolio",
  surface: "personal-page",
  title: "Research and Publication Portfolio",
  designThesis: "Presents a research portfolio with the typographic confidence of a publication list that deserves to be read, not scrolled past.",
  grammarId: "monumental-type",
  audiences: ["personal-internal","technical"],
  businessIntents: ["showcase-publications","build-research-credibility"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.status-list","comp.kpi-tile"],
  routes: [
    {
      "path": "/people/research-publication-portfolio",
      "title": "Portfolio",
      "purpose": "Publication and research portfolio"
    },
    {
      "path": "/people/research-publication-portfolio/archive",
      "title": "Archive",
      "purpose": "Full publication archive"
    }
  ],
  tags: ["personal","research","publications"],
  whenToUse: "Use when a researcher's publication list is itself the credibility statement and deserves a typographically confident presentation.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-13",
    "qualityScore": 75,
    "notes": []
  },
});
