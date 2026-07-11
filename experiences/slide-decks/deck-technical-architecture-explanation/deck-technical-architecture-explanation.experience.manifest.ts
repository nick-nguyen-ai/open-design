import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-technical-architecture-explanation",
  surface: "slide-deck",
  title: "Technical Architecture Explanation",
  designThesis: "Explains a system's architecture the way an as-built drawing does: layer by layer, annotated, never all at once.",
  grammarId: "technical-blueprint",
  audiences: ["technical"],
  businessIntents: ["explain-system-architecture","onboard-technical-audience"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/decks/technical-architecture-explanation",
      "title": "Opening & Summary",
      "purpose": "Title slide and architecture summary"
    },
    {
      "path": "/decks/technical-architecture-explanation/evidence",
      "title": "Diagram",
      "purpose": "Layered architecture diagram walkthrough"
    },
    {
      "path": "/decks/technical-architecture-explanation/decision",
      "title": "Decision & Close",
      "purpose": "Architectural trade-offs and closing slide"
    }
  ],
  tags: ["architecture","technical","slide-deck"],
  whenToUse: "Use when onboarding a technical audience to a system's architecture and the diagram itself is the main content.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-12",
    "qualityScore": 80,
    "notes": []
  },
});
