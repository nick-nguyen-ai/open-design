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
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 90,
    "notes": [
      "Live build shipped (task 19): 'The Reading Room' at /live/home-mentoring-tutorial-hub — the stillest world in the catalogue (motion level 1, settle-only; the stillness is the design statement). A warm lamplit-paper mentor's page with deep-green leather accents and small-caps library typography. THE SYLLABUS SHELF owns the page: mentoring paths are bound volumes standing on a bespoke plank; each opens IN PLACE via a native <details> disclosure (no modal, keyboard and screen-reader flawless) to its session table of contents. One volume ('Big Data on the Cluster') is retired and honestly labelled RETIRED READING - superseded by Streaming for Humans (the anomaly: curricula age and the room says so). Supporting: an office-hours card ('no question too small - bring the error message'), the register (past mentees by cohort and where they went next), a margin-notes panel of the mentor's rules, and a tutorial catalogue with honest last-revised staleness dates. LedgerReveal supplies the single settle entrance; NO continuous motion exists by design. Accessible structure IS the design. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE - SYNTHETIC mark in chrome."
    ]
  },
});
