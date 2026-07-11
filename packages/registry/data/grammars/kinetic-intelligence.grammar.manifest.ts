import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Kinetic Intelligence (plan §9) — sequenced data relationships. Lighter
 * catalogue grammar (complete and schema-valid; not one of the four RICH
 * grammars). Strongest surfaces: slides, explainers.
 */
const kineticIntelligence: DesignGrammar = {
  id: 'kinetic-intelligence',
  name: 'Kinetic Intelligence',
  intent:
    'A grammar for content whose point is a relationship between data points, not any single value — comparisons, drivers, and cause-and-effect chains presented so the connection is the thing the reader sees first.',
  layoutRules: [
    'Comparative content is placed side by side on a shared baseline and shared scale, never in separate panels the reader must reconcile mentally.',
    'One relationship per screen — a driver comparison and a scenario comparison are never shown in the same viewport.',
  ],
  typographyRules: [
    'Comparison labels are set directly at the point of comparison (on the chart, on the diagram) rather than in a separate legend block.',
  ],
  navigationRules: [
    'Selecting one item in a comparison set filters the rest of the view to related items only, keeping the relationship visible at every navigation step.',
  ],
  chartRules: [
    'Multi-series and small-multiple charts are the default form; single-series charts are used only when no comparison exists.',
    'Shared axes and shared colour mapping across every chart on the page, so a series means the same thing everywhere it appears.',
  ],
  diagramRules: [
    'Driver/cause diagrams show weighted edges so the reader can see which relationships matter most, not just that a relationship exists.',
  ],
  motionRules: [
    'Series draw in with `data-ink-draw` so the comparison builds progressively rather than appearing all at once.',
    'Section or scenario changes use `horizon-sweep` to re-establish the shared baseline before the next comparison draws in.',
  ],
  signatureSequences: ['data-ink-draw', 'horizon-sweep'],
  surfaceRules: [
    'Primary home is slide decks presenting experiment or scenario results, and explainers walking through an algorithm step by step.',
  ],
  preferredComponents: ['comp.trend-chart', 'comp.category-bar-chart', 'comp.flow-diagram'],
  prohibitedPatterns: [
    'Inconsistent axis scales across charts intended to be compared.',
    'Colour reused for unrelated series across different charts on the same page.',
  ],
  accessibilityNotes: [
    'Every comparison chart has an accompanying data table so the relationship is available without relying on colour or position.',
    'Reduced-motion mode presents the full comparison at once rather than a partial draw-on state.',
  ],
  exampleExperienceIds: [
    'db-scenario-stress-simulator',
    'deck-experiment-results',
    'home-career-project-timeline',
    'exp-algorithm-explanation',
  ],
};

export default kineticIntelligence;
