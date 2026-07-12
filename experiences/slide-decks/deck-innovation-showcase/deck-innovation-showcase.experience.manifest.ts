import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-innovation-showcase",
  surface: "slide-deck",
  title: "Innovation Showcase",
  designThesis: "Lets an audience explore a portfolio of innovation bets as a navigable map rather than a fixed slide order.",
  grammarId: "spatial-canvas",
  audiences: ["mixed"],
  businessIntents: ["showcase-innovation-portfolio","invite-open-exploration"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.flow-diagram","comp.kpi-tile","comp.trend-chart"],
  routes: [
    {
      "path": "/decks/innovation-showcase",
      "title": "Opening & Summary",
      "purpose": "Title slide and portfolio map entry point"
    },
    {
      "path": "/decks/innovation-showcase/evidence",
      "title": "Portfolio Map",
      "purpose": "Navigable innovation bet map"
    },
    {
      "path": "/decks/innovation-showcase/decision",
      "title": "Decision & Close",
      "purpose": "Highlights recap and closing slide"
    }
  ],
  tags: ["innovation","showcase","slide-deck"],
  whenToUse: "Use for a showcase audience that benefits from browsing bets in their own order rather than following a fixed slide sequence.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 91,
    "notes": [
      "Live build shipped (task 16): 'The Gallery Floor' at /live/deck-innovation-showcase — the innovation portfolio hung as an exhibition over a warm charcoal gallery dark with spotlight pools and museum-placard typography (small caps, catalogue numbers, warm serif wall text). The commanding visual is a bespoke top-down SVG FLOOR PLAN — three numbered halls, six plinths — that persists across the deck and pans/zooms across the floor as the audience walks (CSS transform on the plan group, token-driven easing; reduced motion is a hard cut with a position label). Each exhibit is a piece (a real TrendChart, a monumental claim numeral, or a row of measures) with a museum placard (title, team, year, materials) and a status band: IN PRODUCTION, PILOT, or the anomaly — a celebrated RETIRED piece (The Adaptive Queue, deliberately sunset with honours). The floor plan doubles as the accessible mirror (the catalogue list). Keyboard-driven (arrows/Home/End, R jumps to the retired piece), ?slide= deep links, print stylesheet.",
      "Licence reviewed: self-hosted OFL fonts only (IBM Plex Mono, Fraunces Variable); all figures synthetic demonstration data; no real product, result or institution implied."
    ]
  },
});
