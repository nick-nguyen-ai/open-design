import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-talks-presentation-archive",
  surface: "personal-page",
  title: "Talks and Presentation Archive",
  designThesis: "Archives talks and presentations as a typographic timeline that rewards browsing, not a flat download list.",
  grammarId: "monumental-type",
  audiences: ["personal-internal","mixed"],
  businessIntents: ["archive-talks","showcase-speaking-history"],
  density: "low",
  motionLevel: 2,
  signatureSequence: "ledger-reveal",
  corporateSuitability: "expressive",
  componentsUsed: ["comp.status-list","comp.kpi-tile"],
  routes: [
    {
      "path": "/people/talks-presentation-archive",
      "title": "Archive",
      "purpose": "Talks and presentations timeline"
    },
    {
      "path": "/people/talks-presentation-archive/materials",
      "title": "Materials",
      "purpose": "Slide and recording materials"
    }
  ],
  tags: ["personal","talks","archive"],
  whenToUse: "Use when someone has given enough talks that a flat download list has stopped doing the history justice.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 90,
    "notes": [
      "Live build shipped (task 20): 'The Playbill' at /live/home-talks-presentation-archive — a speaker's archive set as a theatre's season playbills. Stage-black field, warm marquee white, letterpress typography held to bank restraint. THE SEASON BILLS group talks by fiscal year into playbill columns; each engagement is billed with its title in display type, venue/month/house, a quoted audience NOTICE and a letterpress FORMAT badge (KEYNOTE/WORKSHOP/LIGHTNING). NOW SHOWING marquees the next scheduled talk with a bulb-dot border that shimmers slowly at L2 and holds static under reduced motion. One past engagement is kept honestly on the bill marked CANCELLED — SPEAKER ILLNESS · RESCHEDULED SEASON LATER (the anomaly). Supporting: the speaker's repertoire (four talks on request, abstracts as native disclosures), a box-office materials counter, and stagecraft notes (30 hours prepared per keynote hour). The engagements table is the accessible mirror. LedgerReveal resolves the season bills in reading order. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE · SYNTHETIC mark in chrome."
    ]
  },
});
