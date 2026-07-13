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
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-13",
    "qualityScore": 90,
    "notes": [
      "Live build shipped (task 20): 'The Atlas' at /live/home-knowledge-atlas — a dark nautical-chart world where a staff engineer's knowledge is drawn as a chart. Knowledge domains are TERRITORIES whose coastlines are composed from the content pack (landmass = breadth, contour density = mastery); artifacts are SETTLEMENTS marked with founding dates; SHIPPING LANES connect bridged territories; SOUNDINGS mark waters only sailed; and one honestly-drawn UNCHARTED region ('HERE BE GAPS — Rust, streaming at scale') admits the edges of the map (the anomaly). Territories are keyboard-focusable in west-to-east order, each with a proper accessible name, and focusing/selecting one raises its gazetteer entry; the full gazetteer table below is the accessible mirror. Compass rose, scale bar, chart legend and a SURVEYED 2014–2027 · SYNTHETIC CHART cartouche. Coastlines thread-trace on a token easing (fully drawn, static, under reduced motion); HorizonSweep registers the supporting panels. Font licences reviewed (Fraunces + IBM Plex Mono, both OFL). ILLUSTRATIVE PROFILE · SYNTHETIC mark in chrome."
    ]
  },
});
