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
  componentsUsed: ["comp.flow-diagram","comp.status-list","comp.trend-chart"],
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
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 92,
    "notes": [
      "Live build shipped (task 16): 'The River' at /live/deck-transformation-roadmap — a multi-year transformation told as one continuous waterway over a deep teal-green nocturne. The commanding visual is a single bespoke SVG route spine — a tapering river — that persists across every slide and PANS as the deck advances (CSS transform on the spine group, token-driven easing; reduced motion steps the position). Three reaches (H1/H2/H3), nine stations on the spine, two confluences where workstreams merge, and ONE flagged narrows — CAPACITY CONSTRAINT (S5, validation automation vs feature store competing for the same platform pool) — the deliberate anomaly, where the spine visibly thins. A benefit-vs-invest crossover curve (TrendChart) is the evidence slide. The route ledger is the accessible mirror. Cross-references the Validation Ledger world by programme code MVP-2026. Keyboard-driven (arrows/Home/End, N jumps to the narrows), ?slide= deep links, print stylesheet.",
      "Licence reviewed: self-hosted OFL fonts only (IBM Plex Mono, Fraunces Variable); all figures synthetic demonstration data; no real system, result or institution implied."
    ]
  },
});
