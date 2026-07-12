import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-ai-experiment-notebook",
  surface: "personal-page",
  title: "AI Experiment Notebook",
  designThesis: "Keeps AI experiments to the same evidentiary standard as a lab notebook — hypothesis, method, result, next step.",
  grammarId: "research-notebook",
  audiences: ["personal-internal","technical"],
  businessIntents: ["document-experiments","share-evidence-with-team"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "standard",
  componentsUsed: ["comp.trend-chart","comp.status-list"],
  routes: [
    {
      "path": "/people/ai-experiment-notebook",
      "title": "Notebook",
      "purpose": "Chronological experiment entries"
    },
    {
      "path": "/people/ai-experiment-notebook/entry",
      "title": "Entry Detail",
      "purpose": "Single experiment entry detail"
    }
  ],
  tags: ["personal","experimentation","notebook"],
  whenToUse: "Use when an individual's AI experiments should be auditable by a teammate, not just personal scratch notes.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 91,
    "notes": [
      "Live build shipped (task 18): 'The Bench Journal' at /live/home-ai-experiment-notebook — a warm grid-paper lab notebook in two inks, a reverse-chronological run of dated entries each stamped CONFIRMED/REFUTED/INCONCLUSIVE with an inline result sparkline, entry 38 struck through but fully legible with a margin note to the re-run that corrected it (the anomaly: nothing erased), two taped-in ChartFigure plates with data tables, an index card mirror, and a plainly-asked 'current question' panel. LedgerReveal choreographs the run; reduced-motion parity. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE · SYNTHETIC mark in chrome."
    ]
  },
});
