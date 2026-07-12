import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "deck-technical-training",
  surface: "slide-deck",
  title: "Technical Training",
  designThesis: "Paces a technical training session section by section, each building on the datum the previous one established.",
  grammarId: "technical-blueprint",
  audiences: ["technical"],
  businessIntents: ["deliver-technical-training","build-shared-mental-model"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.flow-diagram","comp.category-bar-chart"],
  routes: [
    {
      "path": "/decks/technical-training",
      "title": "Opening & Summary",
      "purpose": "Title slide and session outline"
    },
    {
      "path": "/decks/technical-training/evidence",
      "title": "Concepts",
      "purpose": "Section-by-section concept diagrams"
    },
    {
      "path": "/decks/technical-training/decision",
      "title": "Decision & Close",
      "purpose": "Recap and closing slide"
    }
  ],
  tags: ["training","technical","slide-deck"],
  whenToUse: "Use when running an internal technical training session that needs each section to visibly build on the last.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 89,
    "notes": [
      "Live build shipped (task 17): 'The Field Manual' at /live/deck-technical-training — internal training as a beloved technical field manual (FM-OPS-07 REV D, Unit 3: Moving Models Safely): aviation-ops-manual aesthetic on utilitarian paper, olive and graphite inks, safety-orange reserved for warnings ONLY. Pages are PROCEDURES (PROC 3.1 promoting features, PROC 3.2 deploying to staging, PROC 3.3 rolling back) set as strict two-column plates — numbered steps left, DO/DON'T machinery plates right with the DON'T diagrams struck through — plus two machinery-label warning callouts (never retrain on production labels; no quick-redeploy path), a mid-deck CHECKPOINT self-test with answers overleaf on a flipped olive plate, an approved-toolchain kit plate (six tools in a foam-cutout grid), and a sign-off page with competency register and trainee/instructor signature lines. The anomaly: PROC 3.2 step 4 is stamped REVISED AFTER INCIDENT IR-2214 with a terse margin note — the manual visibly learns. Procedures cite the Control Frame's control ids (CTRL-AI-003, -021, -022) where they enforce one. Keyboard-driven (arrows/Home/End, C jumps to the checkpoint), ?slide= deep links, print keeps the manual paper-true.",
      "Licence reviewed: self-hosted OFL fonts only (Inter Variable, IBM Plex Mono); all content synthetic demonstration data; no real institution, incident or toolchain implied."
    ]
  },
});
