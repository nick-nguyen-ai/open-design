import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-genai-model-validation-report",
  surface: "slide-deck",
  title: "GenAI Model Validation Report",
  designThesis: "Walks a validation committee through evidence and test results in the same order the validation team actually reasoned through them.",
  grammarId: "research-notebook",
  audiences: ["technical","risk-and-governance"],
  businessIntents: ["present-validation-evidence","support-model-sign-off"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "restricted",
  componentsUsed: ["comp.trend-chart","comp.status-list","comp.category-bar-chart"],
  routes: [
    {
      "path": "/decks/genai-model-validation-report",
      "title": "Opening & Summary",
      "purpose": "Title slide and validation summary"
    },
    {
      "path": "/decks/genai-model-validation-report/evidence",
      "title": "Evidence",
      "purpose": "Test results and evaluation evidence"
    },
    {
      "path": "/decks/genai-model-validation-report/decision",
      "title": "Decision & Close",
      "purpose": "Sign-off recommendation and closing slide"
    }
  ],
  tags: ["genai","model-validation","slide-deck"],
  whenToUse: "Use when a validation committee needs to see the evidence trail behind a GenAI model sign-off, not just the conclusion.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-12",
    "qualityScore": 92,
    "notes": [
      "Live build shipped (task 15): 'The Lab Report' at /live/deck-genai-model-validation-report — a validation team's findings as numbered FIGURE PLATES from a laboratory notebook on cool grey-blue technical stock over a fine modular grid, with plate registration/crop marks and one stamp accent (verdict green). A cover and seven plates: scope & method, test-battery design, two evidence plates with real charts (FIG 1 hallucination-rate by prompt class via CategoryBarChart with the adversarial breach flagged; FIG 2 factuality/citation drift via TrendChart), a severity-tagged findings register (CRITICAL VF-07 OPEN — the deliberate anomaly — doubling as the accessible mirror), honest limitations, and a rubber-stamped APPROVED WITH CONDITIONS verdict. Cross-references the Validation Ledger world by programme code MVP-2026. Keyboard-driven (arrows/Home/End, R jumps to the register), ?slide= deep links, print stylesheet.",
      "Licence reviewed: self-hosted OFL fonts only (IBM Plex Mono, Fraunces Variable); all results synthetic demonstration data; no real system, result or institution implied."
    ]
  },
});
