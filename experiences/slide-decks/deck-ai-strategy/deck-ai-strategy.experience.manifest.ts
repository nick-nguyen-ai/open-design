import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-ai-strategy",
  surface: "slide-deck",
  title: "AI Strategy",
  designThesis: "Frames the enterprise AI strategy as a small number of committed choices, argued in sequence rather than listed as sixty bullet points.",
  grammarId: "executive-editorial",
  audiences: ["executive"],
  businessIntents: ["present-ai-strategy","secure-executive-alignment"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.kpi-tile","comp.trend-chart"],
  routes: [
    {
      "path": "/decks/ai-strategy",
      "title": "Opening & Summary",
      "purpose": "Title slide and executive summary"
    },
    {
      "path": "/decks/ai-strategy/evidence",
      "title": "Evidence",
      "purpose": "Supporting market and capability evidence"
    },
    {
      "path": "/decks/ai-strategy/decision",
      "title": "Decision & Close",
      "purpose": "Recommendation, decision ask, and closing slide"
    }
  ],
  tags: ["ai-strategy","executive","slide-deck"],
  whenToUse: "Use when presenting AI strategy to an executive committee that needs to leave the room with a decision, not a survey of the landscape.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-12",
    "qualityScore": 93,
    "notes": [
      "Live build shipped (task 13): 'The Morning Board Pack' at /live/deck-ai-strategy — twelve keyboard-driven monumental-type slides, ?slide= deep links, print stylesheet, full content pack."
    ]
  },
});
