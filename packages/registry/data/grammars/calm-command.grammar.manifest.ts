import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Calm Command (plan §9) — operational clarity. RICH grammar: one of the
 * four grammars given full differentiated rule sets (task 8 brief).
 * Strongest surface: dashboards.
 */
const calmCommand: DesignGrammar = {
  id: 'calm-command',
  name: 'Calm Command',
  intent:
    'An operational grammar for surfaces that are watched under stress — regulatory reviews, incident bridges, board risk sessions — where the design job is to lower the reader\'s pulse, not raise it, while still surfacing the one number that matters first.',
  layoutRules: [
    'A strict summary-then-detail hierarchy: one hero metric or posture statement occupies the top band alone, with supporting panels below it, never beside it.',
    'Panels use soft, low-contrast dividers rather than hard rules — the page reads as calm, not gridded.',
    'Whitespace scales with severity: the higher the stakes of the surface, the more breathing room around the hero metric, never less.',
    'Drill-down opens as an in-place expansion of the panel the user selected, never a full-page navigation away from context.',
  ],
  typographyRules: [
    'A restrained two-weight type system (regular and medium only) — no bold-for-emphasis, which reads as alarm.',
    'Status language is precise and unhedged ("breach", "on track", "at risk") but never set in a colour-only alarm treatment.',
    'Numerals are tabular but set slightly larger and more spaced than Precision Grid — Calm Command trades a little density for legibility under stress.',
  ],
  navigationRules: [
    'A shallow navigation depth (two levels maximum) — a stressed reader should never be more than two clicks from the summary view.',
    'A persistent "back to summary" affordance is always visible once the reader has drilled down.',
  ],
  chartRules: [
    'Trend charts default to a smoothed, low-noise rendering with the raw series available as a toggle, so the headline read is calm and the detail is one click away.',
    'Thresholds and tolerance bands are drawn directly on the chart as shaded regions, never only described in a legend.',
  ],
  diagramRules: [
    'Process/remediation diagrams show current state highlighted against the full path, so the reader sees both "where we are" and "what is left" in one glance.',
  ],
  motionRules: [
    'The hero metric uses `ledger-reveal` alone, at motion level 1 — the calmest reveal in the catalogue, one settle, no stagger theatrics beyond it.',
    'Chart panels beneath the hero metric may use `data-ink-draw` on drill-down (`select` trigger) but never on every data refresh — recurring motion on a watched surface reads as alarm, not clarity.',
    'No motion above level 1 is permitted without an explicit exception recorded in the experience approval notes — Calm Command is the most conservative grammar for motion in the set.',
  ],
  signatureSequences: ['ledger-reveal', 'data-ink-draw'],
  surfaceRules: [
    'Primary and near-exclusive home is the dashboard surface, specifically executive risk, incident, and control-posture dashboards.',
    'Occasionally usable on a project page or personal hub page where the content is itself operational status rather than narrative.',
  ],
  preferredComponents: ['comp.kpi-tile', 'comp.status-list', 'comp.trend-chart'],
  prohibitedPatterns: [
    'Red/green colour-only severity encoding without an accompanying label.',
    'Auto-refreshing hero metrics without a visible "last updated" timestamp.',
    'Nested modals for drill-down (breaks the "always two clicks from summary" rule).',
  ],
  accessibilityNotes: [
    'Severity is always encoded by icon and label in addition to colour, and verified against the platform\'s non-colour-encoding contrast pairs.',
    'The "back to summary" affordance is reachable by keyboard from any drill-down depth in a single tab stop.',
    'Reduced-motion mode renders the hero metric as a single opacity step; no threshold band shading is lost in the reduced variant.',
  ],
  exampleExperienceIds: [
    'db-ai-risk-command-centre',
    'home-mentoring-tutorial-hub',
    'proj-operating-model-redesign',
    'proj-regulatory-remediation-programme',
  ],
};

export default calmCommand;
