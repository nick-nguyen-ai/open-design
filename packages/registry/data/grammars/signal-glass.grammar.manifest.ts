import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Signal Glass (plan §9) — layered, restrained depth. Lighter catalogue
 * grammar (complete and schema-valid; not one of the four RICH grammars).
 * Strongest surfaces: monitoring, personal.
 */
const signalGlass: DesignGrammar = {
  id: 'signal-glass',
  name: 'Signal Glass',
  intent:
    'A layered grammar for surfaces that must show several correlated signals at once without any one of them dominating — translucent, stacked panes rather than a flat grid, so context stays visible behind whatever is in focus.',
  layoutRules: [
    'Content sits on two or three depth layers (background context, midground supporting panels, foreground focus) rather than a single flat plane.',
    'The foreground layer never fully occludes the layer behind it — background context stays faintly legible through restrained transparency.',
    'Panels are rounded and softly bordered, avoiding the hard rules of the grid-led grammars.',
  ],
  typographyRules: [
    'A single sans family with a wide weight range, using weight rather than size to separate foreground from background content.',
    'Background-layer text is set at reduced contrast (never below AA) to reinforce depth without sacrificing legibility.',
  ],
  navigationRules: [
    'Navigation lives in the foreground layer only; selecting a destination brings the relevant midground panel forward.',
  ],
  chartRules: [
    'Charts on the background/midground layers are simplified sparkline forms; full detail charts only appear once brought to the foreground.',
  ],
  diagramRules: [
    'Diagrams use layered panes to separate the overview map from the selected node\'s detail, rather than a single dense canvas.',
  ],
  motionRules: [
    'Bringing a panel forward uses `horizon-sweep` to re-register it against the page datum as it gains focus.',
    'Numeric content within a focused panel settles with `ledger-reveal` once the panel has finished moving to the foreground, never concurrently with the layer transition.',
  ],
  signatureSequences: ['horizon-sweep', 'ledger-reveal'],
  surfaceRules: [
    'Primary home is monitoring-style dashboards and personal knowledge/impact pages where layered correlated signals are the content.',
  ],
  preferredComponents: ['comp.status-list', 'comp.trend-chart', 'comp.kpi-tile'],
  prohibitedPatterns: [
    'More than three simultaneous depth layers (reads as visual noise rather than depth).',
    'Background-layer text below WCAG AA contrast.',
  ],
  accessibilityNotes: [
    'Depth is never the only cue for importance — the foreground panel is also labelled and focus-visible for keyboard users.',
    'Reduced-motion mode replaces the layer-forward transition with a single opacity step.',
  ],
  exampleExperienceIds: [
    'db-delivery-control-tower',
    'proj-vendor-assessment',
    'home-team-contribution-impact-page',
    'exp-testing-validation-strategy',
  ],
};

export default signalGlass;
