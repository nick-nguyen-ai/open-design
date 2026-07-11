import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-talks-presentation-archive",
  surface: "personal-page",
  title: "Talks and Presentation Archive",
  designThesis: "Archives talks and presentations as a typographic timeline that rewards browsing, not a flat download list.",
  grammarId: "monumental-type",
  audiences: ["personal-internal","mixed"],
  businessIntents: ["archive-talks","showcase-speaking-history"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.status-list","comp.kpi-tile"],
  routes: [
    {
      "path": "/people/talks-presentation-archive",
      "title": "Archive",
      "purpose": "Talks and presentations timeline"
    },
    {
      "path": "/people/talks-presentation-archive/materials",
      "title": "Materials",
      "purpose": "Slide and recording materials"
    }
  ],
  tags: ["personal","talks","archive"],
  whenToUse: "Use when someone has given enough talks that a flat download list has stopped doing the history justice.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-17",
    "qualityScore": 74,
    "notes": []
  },
});
