import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: "home-data-scientist-studio",
  surface: "personal-page",
  title: "Data Scientist Studio",
  designThesis: "A working studio page where a data scientist's active projects, tooling, and current focus are visible at a glance, not buried in a wiki.",
  grammarId: "research-notebook",
  audiences: ["personal-internal","technical"],
  businessIntents: ["showcase-active-work","aid-team-discoverability"],
  density: "medium",
  motionLevel: 2,
  signatureSequence: "horizon-sweep",
  corporateSuitability: "standard",
  componentsUsed: ["comp.status-list","comp.trend-chart"],
  routes: [
    {
      "path": "/people/data-scientist-studio",
      "title": "Studio",
      "purpose": "Current projects, tooling, and focus"
    },
    {
      "path": "/people/data-scientist-studio/archive",
      "title": "Archive",
      "purpose": "Past project archive"
    }
  ],
  tags: ["personal","data-science","studio"],
  whenToUse: "Use when a data scientist wants colleagues to see what they are actually working on right now, sourced from one page.",
  approval: {
    "state": "approved",
    "reviewer": "design-lead",
    "reviewedAt": "2026-07-12",
    "qualityScore": 91,
    "notes": [
      "Live build shipped (task 13): 'The Studio' at /live/home-data-scientist-studio — signal-glass panes over a dusk field, experiment shelf with a kept failure, synthetic-profile mark, full content pack."
    ]
  },
});
