import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-knowledge-atlas",
  surface: "personal-page",
  title: "Knowledge Atlas",
  designThesis: "Maps accumulated knowledge as a navigable atlas of topics and connections rather than a folder tree.",
  grammarId: "spatial-canvas",
  audiences: ["personal-internal","mixed"],
  businessIntents: ["organise-knowledge-base","aid-topic-discovery"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.flow-diagram","comp.category-bar-chart"],
  routes: [
    {
      "path": "/people/knowledge-atlas",
      "title": "Atlas",
      "purpose": "Navigable topic map"
    },
    {
      "path": "/people/knowledge-atlas/topic",
      "title": "Topic Detail",
      "purpose": "Single-topic detail view"
    }
  ],
  tags: ["personal","knowledge","atlas"],
  whenToUse: "Use when a knowledge base has enough cross-links between topics that a folder tree stops being the right shape for it.",
  approval: {
    "state": "experimental",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-11",
    "qualityScore": 71,
    "notes": [
      "Atlas navigation pending usability testing with a second reader."
    ]
  },
});
