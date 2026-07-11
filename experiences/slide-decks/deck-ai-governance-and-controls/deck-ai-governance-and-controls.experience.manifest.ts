import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-ai-governance-and-controls",
  surface: "slide-deck",
  title: "AI Governance and Controls",
  designThesis: "Lays out the control framework with the same exactness a regulator would expect in a submission, not a marketing deck.",
  grammarId: "precision-grid",
  audiences: ["risk-and-governance"],
  businessIntents: ["present-control-framework","support-regulatory-submission"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.status-list","comp.category-bar-chart"],
  routes: [
    {
      "path": "/decks/ai-governance-and-controls",
      "title": "Opening & Summary",
      "purpose": "Title slide and control-framework summary"
    },
    {
      "path": "/decks/ai-governance-and-controls/evidence",
      "title": "Control Evidence",
      "purpose": "Control-by-control evidence"
    },
    {
      "path": "/decks/ai-governance-and-controls/decision",
      "title": "Decision & Close",
      "purpose": "Attestation and closing slide"
    }
  ],
  tags: ["governance","controls","slide-deck"],
  whenToUse: "Use when presenting an AI control framework to a body that will hold the presenter to every claim on the slide.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-19",
    "qualityScore": 84,
    "notes": []
  },
});
