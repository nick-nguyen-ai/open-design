import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-technical-training",
  surface: "slide-deck",
  title: "Technical Training",
  designThesis: "Paces a technical training session section by section, each building on the datum the previous one established.",
  grammarId: "technical-blueprint",
  audiences: ["technical"],
  businessIntents: ["deliver-technical-training","build-shared-mental-model"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.category-bar-chart"],
  routes: [
    {
      "path": "/decks/technical-training",
      "title": "Opening & Summary",
      "purpose": "Title slide and session outline"
    },
    {
      "path": "/decks/technical-training/evidence",
      "title": "Concepts",
      "purpose": "Section-by-section concept diagrams"
    },
    {
      "path": "/decks/technical-training/decision",
      "title": "Decision & Close",
      "purpose": "Recap and closing slide"
    }
  ],
  tags: ["training","technical","slide-deck"],
  whenToUse: "Use when running an internal technical training session that needs each section to visibly build on the last.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-29",
    "qualityScore": 77,
    "notes": []
  },
});
