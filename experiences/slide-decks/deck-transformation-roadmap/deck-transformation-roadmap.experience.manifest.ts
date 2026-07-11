import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-transformation-roadmap",
  surface: "slide-deck",
  title: "Transformation Roadmap",
  designThesis: "Shows the roadmap as phases that visibly transition into one another, rather than static swimlanes.",
  grammarId: "living-system",
  audiences: ["executive","business"],
  businessIntents: ["present-transformation-roadmap","build-phase-confidence"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/decks/transformation-roadmap",
      "title": "Opening & Summary",
      "purpose": "Title slide and roadmap summary"
    },
    {
      "path": "/decks/transformation-roadmap/evidence",
      "title": "Phase Diagram",
      "purpose": "Roadmap phase transition diagram"
    },
    {
      "path": "/decks/transformation-roadmap/decision",
      "title": "Decision & Close",
      "purpose": "Next-phase ask and closing slide"
    }
  ],
  tags: ["roadmap","transformation","slide-deck"],
  whenToUse: "Use when a roadmap needs to communicate that phases genuinely build on one another, not just occupy sequential timeline bars.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-27",
    "qualityScore": 78,
    "notes": []
  },
});
