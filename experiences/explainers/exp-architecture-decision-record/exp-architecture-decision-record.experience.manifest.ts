import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "exp-architecture-decision-record",
  surface: "technical-explainer",
  title: "Architecture Decision Record",
  designThesis: "Gives an architecture decision record the narrative shape it actually has: context, options considered, decision, consequences.",
  grammarId: "executive-editorial",
  audiences: ["technical","mixed"],
  businessIntents: ["document-architecture-decision","support-future-review"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.flow-diagram"],
  routes: [
    {
      "path": "/explainers/architecture-decision-record",
      "title": "Decision Record",
      "purpose": "Context, options, decision, and consequences"
    },
    {
      "path": "/explainers/architecture-decision-record/deep-dive",
      "title": "Deep Dive",
      "purpose": "Full options analysis"
    }
  ],
  tags: ["adr","architecture","explainer"],
  whenToUse: "Use when an architecture decision needs to be understandable, with its rationale, by someone reading it a year later.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-05",
    "qualityScore": 78,
    "notes": []
  },
});
