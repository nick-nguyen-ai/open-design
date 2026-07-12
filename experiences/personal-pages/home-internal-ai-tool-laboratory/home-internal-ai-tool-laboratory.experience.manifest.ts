import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-internal-ai-tool-laboratory",
  surface: "personal-page",
  title: "Internal AI Tool Laboratory",
  designThesis: "Shows internal AI tools as live, evolving experiments with visible state, not a static catalogue page.",
  grammarId: "living-system",
  audiences: ["personal-internal","technical"],
  businessIntents: ["showcase-internal-tools","communicate-tool-maturity"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/people/internal-ai-tool-laboratory",
      "title": "Laboratory",
      "purpose": "Live internal tool experiments and their state"
    },
    {
      "path": "/people/internal-ai-tool-laboratory/archive",
      "title": "Archive",
      "purpose": "Retired or superseded tool experiments"
    }
  ],
  tags: ["personal","ai-tools","laboratory"],
  whenToUse: "Use when internal AI tools are genuinely still evolving and the page should show maturity state, not present them as finished products.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 90,
    "notes": [
      "Living-system maturity states pending a second round of tool-owner input.",
      "Live build shipped (task 18): 'The Greenhouse' at /live/home-internal-ai-tool-laboratory — a deep botanical glasshouse at dusk where each internal tool is a specimen whose adoption curve is drawn as a bespoke climbing-vine growth trace on a brass label plate, with growth stages SEED/CUTTING/ESTABLISHED/PRODUCTION. One specimen (gitwatch) is wilting and honestly labelled DEPRECATION CANDIDATE · SUCCESSOR: review-copilot (the anomaly); one bed is empty with a seed packet. Supporting: gardener's card, propagation-log table mirror, care-note cards, and a usage-pulse widget. DataInkDraw reveals the bench; the vine draw and pulse animate on token easings and go fully still under reduced motion. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE · SYNTHETIC mark in chrome."
    ]
  },
});
