import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-mentoring-tutorial-hub",
  surface: "personal-page",
  title: "Mentoring and Tutorial Hub",
  designThesis: "Gives mentees a calm, operationally clear hub to find the right tutorial or mentor without hunting.",
  grammarId: "calm-command",
  audiences: ["personal-internal","mixed"],
  businessIntents: ["support-mentoring-programme","organise-tutorial-content"],
  density: "low",
  motionLevel: 1,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.flow-diagram"],
  routes: [
    {
      "path": "/people/mentoring-tutorial-hub",
      "title": "Hub",
      "purpose": "Mentoring and tutorial entry point"
    },
    {
      "path": "/people/mentoring-tutorial-hub/tutorials",
      "title": "Tutorials",
      "purpose": "Tutorial library"
    }
  ],
  tags: ["personal","mentoring","tutorials"],
  whenToUse: "Use when mentees need to find the right tutorial or mentor quickly, without a cluttered or overwhelming entry page.",
  approval: {
    "state": "reviewed",
    "reviewer": "design-lead",
    "reviewedAt": "2026-06-15",
    "qualityScore": 78,
    "notes": []
  },
});
