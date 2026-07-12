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
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 92,
    "notes": [
      "Live build shipped (task 17): 'The Manifesto' at /live/deck-product-vision — a product vision set as nine letterpress POSTERS on a warm near-white cotton field, ink black, ONE electric accent (signal red). The most extreme type treatment in the catalogue: monumental Inter (its full wght axis, hairline to poster-black on adjacent words), tight optical tracking, deliberate asymmetric placement, generous silence. No charts, the thinnest chrome in the set (a hairline rule top and bottom, a mono folio). The argument: a customer should never explain herself twice; the anomaly is a poster that indicts our own product ('Our own systems ask her fourteen times.'); three principle posters; a promise with a date; the measure as a single monumental numeral (the fourteen becomes 1). Two principle posters and the measure numeral settle letter by letter on entrance (L3) via buildStaggeredTimeline; reduced motion renders them already set, then absolute stillness. Keyboard-driven (arrows/Home/End, I index, X jumps to the indictment), ?slide= deep links, print keeps ink on white.",
      "Licence reviewed: self-hosted OFL fonts only (Inter Variable, IBM Plex Mono); all figures synthetic demonstration data; no real product, customer or institution implied."
    ]
  },
});
