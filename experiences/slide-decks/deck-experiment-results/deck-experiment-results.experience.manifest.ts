import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-experiment-results",
  surface: "slide-deck",
  title: "Experiment Results",
  designThesis: "Sequences experiment results so cause and effect are traceable slide to slide, not just tabulated at the end.",
  grammarId: "kinetic-intelligence",
  audiences: ["technical","mixed"],
  businessIntents: ["present-experiment-results","support-experiment-decision"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.trend-chart","comp.category-bar-chart"],
  routes: [
    {
      "path": "/decks/experiment-results",
      "title": "Opening & Summary",
      "purpose": "Title slide and experiment summary"
    },
    {
      "path": "/decks/experiment-results/evidence",
      "title": "Results",
      "purpose": "Sequenced comparison of experiment results"
    },
    {
      "path": "/decks/experiment-results/decision",
      "title": "Decision & Close",
      "purpose": "Recommendation and closing slide"
    }
  ],
  tags: ["experimentation","results","slide-deck"],
  whenToUse: "Use when experiment results need to be understood as a comparison and a causal chain, not a final table of numbers.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 91,
    "notes": [
      "Live build shipped (task 16): 'The Readout' at /live/deck-experiment-results — a quarter of experiment results as a bench-oscilloscope readout session on a near-black instrument field with phosphor-teal traces, a faint graticule and a single restrained scanline (no strobe; pausable/absent under reduced motion). Slides are READINGS: a hypothesis in display type, the trace drawn on entry (TrendChart / CategoryBarChart via ChartFigure, data-ink-draw), a RESULT NUMERAL that counts up once to its value and holds (static under reduced motion), and a shape-and-word-coded verdict plate — SHIPPED, KILLED, or WITHHELD. The anomaly is Reading 03: a statistically significant fraud-loss win WITHHELD because the false-positive-hold guardrail regressed, stated plainly. The board slide is a real verdict-coded table and the accessible mirror. Keyboard-driven (arrows/Home/End, W jumps to the withheld reading), ?slide= deep links, print stylesheet.",
      "Licence reviewed: self-hosted OFL fonts only (IBM Plex Mono, Fraunces Variable); all results synthetic demonstration data; no real system, result or institution implied."
    ]
  },
});
