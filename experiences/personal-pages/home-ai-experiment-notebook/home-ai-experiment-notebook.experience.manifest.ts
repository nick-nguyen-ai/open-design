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
  signatureSequence: "data-ink-draw",
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
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-25",
    "qualityScore": 76,
    "notes": []
  },
});
