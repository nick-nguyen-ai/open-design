import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-team-contribution-impact-page",
  surface: "personal-page",
  title: "Team Contribution and Impact Page",
  designThesis: "Layers individual and team contribution data with restrained depth so impact reads as substance, not self-promotion.",
  grammarId: "signal-glass",
  audiences: ["personal-internal","business"],
  businessIntents: ["showcase-team-impact","support-recognition-process"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.kpi-tile","comp.trend-chart"],
  routes: [
    {
      "path": "/people/team-contribution-impact-page",
      "title": "Impact",
      "purpose": "Layered individual and team impact view"
    },
    {
      "path": "/people/team-contribution-impact-page/detail",
      "title": "Detail",
      "purpose": "Contribution detail by initiative"
    }
  ],
  tags: ["personal","team","impact"],
  whenToUse: "Use when contribution and impact data needs to be shown with enough restraint that it reads as evidence, not a highlight reel.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 90,
    "notes": [
      "Live build shipped (task 19): 'The Dawn Wall' at /live/home-team-contribution-impact-page — a signal-glass world composed OPPOSITE to The Studio: a horizontal glass wall at first light where six translucent contribution streams (one per teammate, mono-labelled) flow left-to-right across a deep-indigo field warming to one amber horizon and converge into solid, bright shipped-outcome blocks. Stream widths are contribution share, drawn honestly as a bespoke computed Sankey. One stream (Wei Zhang) ends mid-wall with a tribute cap - a teammate who left - while their work stays credited in the outcomes (the anomaly: attribution survives departure). Supporting: the lead's card explicitly framed 'this page measures the team, not me'; impact receipts with before->after numbers and who drove each (names first, lead last); a measured rituals panel; and a person x outcome x share contributions table as the accessible mirror. HorizonSweep registers the wall and panels; static wall under reduced motion. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE - SYNTHETIC mark in chrome."
    ]
  },
});
