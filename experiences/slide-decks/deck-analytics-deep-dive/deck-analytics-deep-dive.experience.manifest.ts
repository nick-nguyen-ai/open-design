import { buildExperience } from '../../_shared/experience-builder.js';

export default buildExperience({
  id: 'deck-analytics-deep-dive',
  surface: 'slide-deck',
  title: 'Analytics Deep Dive',
  designThesis:
    'Reads a single business metric — 52 weeks of checkout conversion — as one continuous signal threaded across every slide, expanding on the hero slide into a keyboard-operable instrument, so a data deep-dive lands as an honest argument that keeps its worst week in view rather than a reel of favourable charts.',
  grammarId: 'signal-glass',
  audiences: ['executive', 'business'],
  businessIntents: ['read-a-metric-honestly', 'recommend-from-evidence'],
  density: 'medium',
  motionLevel: 2,
  signatureSequence: 'data-ink-draw',
  corporateSuitability: 'expressive',
  componentsUsed: ['comp.trend-chart', 'comp.kpi-tile'],
  routes: [
    {
      path: '/decks/analytics-deep-dive',
      title: 'The question & the data',
      purpose: 'Title, the question, and the dataset provenance',
    },
    {
      path: '/decks/analytics-deep-dive/instrument',
      title: 'The instrument',
      purpose: 'The interactive 52-week instrument, seasonality, and the week-37 anomaly',
    },
    {
      path: '/decks/analytics-deep-dive/read',
      title: 'The read & the recommendation',
      purpose: 'Cohorts, effect sizes, honest uncertainty, and the monitoring plan',
    },
  ],
  tags: ['analytics', 'deep-dive', 'metric', 'time-series', 'slide-deck'],
  whenToUse:
    'Use to walk a leadership team through one metric over time when the point is candour — a real level shift kept in the summary statistics, cohorts that isolate the cause, and a monitoring plan — rather than a tour of green dashboards.',
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-14',
    qualityScore: 93,
    notes: [
      "Live build shipped (batch-2 deck G): 'The Long Signal' at /live/deck-analytics-deep-dive — ten dark observatory slides threading ONE 52-week checkout-conversion series as a persistent, progressively annotated band; a full-viewport interactive instrument (crosshair readout, pinnable comparison marker, arrow-key week-walking scoped to the focused SVG, B-toggled baseline overlay, aria-live readout, hidden 52-row data table); the verbatim WEEK 37 REGIME CHANGE — FLAGGED, NOT SMOOTHED level-shift anomaly kept in every summary statistic; a comp.trend-chart cohort split and a comp.kpi-tile effect-size row; ?slide= deep links, print stylesheet, band table mirror.",
    ],
  },
});
