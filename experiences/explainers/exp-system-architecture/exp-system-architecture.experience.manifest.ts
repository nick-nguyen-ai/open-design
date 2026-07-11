import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-system-architecture",
  surface: "technical-explainer",
  title: "System Architecture",
  designThesis: "Explains the platform's system architecture the way a well-drawn as-built diagram does — components, data flow, and trust boundaries in one legible map.",
  grammarId: "technical-blueprint",
  audiences: ["technical","mixed"],
  businessIntents: ["onboard-new-engineers","support-architecture-review"],
  density: "high",
  motionLevel: 2,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.status-list"],
  routes: [
    {
      "path": "/explainers/system-architecture",
      "title": "Architecture",
      "purpose": "Full system architecture diagram and narrative"
    },
    {
      "path": "/explainers/system-architecture/deep-dive",
      "title": "Deep Dive",
      "purpose": "Layer-by-layer architecture deep dive"
    }
  ],
  tags: ["architecture","explainer","engineering"],
  whenToUse: "Use as the canonical reference when anyone — new engineer, auditor, or partner team — needs to understand how the system is actually built.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-09",
    "qualityScore": 95,
    "notes": [
      "Anchor explainer for slice 1 — full content pack authored and standalone export verified."
    ]
  },
});
