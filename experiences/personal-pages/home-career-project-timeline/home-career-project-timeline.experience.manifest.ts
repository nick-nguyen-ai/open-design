import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-career-project-timeline",
  surface: "personal-page",
  title: "Career and Project Timeline",
  designThesis: "Sequences a career as a chain of projects and outcomes, each visibly building on the last.",
  grammarId: "kinetic-intelligence",
  audiences: ["personal-internal"],
  businessIntents: ["showcase-career-trajectory","connect-projects-to-outcomes"],
  density: "medium",
  motionLevel: 3,
  signatureSequence: "data-ink-draw",
  corporateSuitability: "standard",
  componentsUsed: ["comp.trend-chart","comp.status-list"],
  routes: [
    {
      "path": "/people/career-project-timeline",
      "title": "Timeline",
      "purpose": "Career and project sequence with outcomes"
    },
    {
      "path": "/people/career-project-timeline/detail",
      "title": "Detail",
      "purpose": "Per-project detail view"
    }
  ],
  tags: ["personal","career","timeline"],
  whenToUse: "Use when the story of a career is genuinely a chain of cause and effect between projects, not a flat list of job titles.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 90,
    "notes": [
      "Live build shipped (task 19): 'The Line' at /live/home-career-project-timeline — a dark-slate transit-cartography world where a career is drawn as ONE continuous luminous survey line running top-to-bottom. Projects are stations (mono codes, dated, each with a real outcome number); promotions are GAUGE CHANGES where the line visibly thickens (analyst -> principal); side-projects are BRANCH lines that terminate honestly or rejoin carrying something back; and one two-year SWITCHBACK (the Northbridge migration, reversed out) is drawn as a loop and labelled with what it taught (the anomaly). Supporting: identity head with LINE OPEN 2014 - STILL RUNNING, an interchanges panel, a next-station-under-survey terminus, and a dated station-register table as the accessible mirror. DataInkDraw reveals the line on a token easing; fully drawn and static under reduced motion. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE - SYNTHETIC mark in chrome."
    ]
  },
});
