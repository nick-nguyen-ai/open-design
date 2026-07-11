import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-product-vision",
  surface: "slide-deck",
  title: "Product Vision",
  designThesis: "Gives the product vision typographic ambition worthy of the bet, without losing the delivery detail underneath.",
  grammarId: "monumental-type",
  audiences: ["business","mixed"],
  businessIntents: ["communicate-product-vision","build-stakeholder-conviction"],
  density: "low",
  motionLevel: 3,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.kpi-tile","comp.trend-chart"],
  routes: [
    {
      "path": "/decks/product-vision",
      "title": "Opening & Summary",
      "purpose": "Vision statement title slide"
    },
    {
      "path": "/decks/product-vision/evidence",
      "title": "Evidence",
      "purpose": "Market and traction evidence"
    },
    {
      "path": "/decks/product-vision/decision",
      "title": "Decision & Close",
      "purpose": "Investment ask and closing slide"
    }
  ],
  tags: ["product-vision","storytelling","slide-deck"],
  whenToUse: "Use when a product vision needs to feel like a genuine moment, not another quarterly review deck.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-07",
    "qualityScore": 72,
    "notes": [
      "Motion level 3 headline entrance pending brand review."
    ]
  },
});
