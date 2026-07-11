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
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-10",
    "qualityScore": 69,
    "notes": [
      "Living-system maturity states pending a second round of tool-owner input."
    ]
  },
});
