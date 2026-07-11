import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Precision Grid (plan §9) — dense, structured, exact. RICH grammar: one of
 * the four grammars given full differentiated rule sets (task 8 brief).
 * Strongest surfaces: dashboards, explainers.
 */
const precisionGrid: DesignGrammar = {
  id: 'precision-grid',
  name: 'Precision Grid',
  intent:
    'A systems-of-record grammar for surfaces where every cell of a strict grid must earn its place and numbers must be scannable at a glance — the visual register of a control room, not a report.',
  layoutRules: [
    '12-column grid on an 8px baseline; every panel spans a whole multiple of columns, never a fractional remainder.',
    'Fixed gutters (16px desktop, 8px condensed) — panels never negotiate spacing individually.',
    'A persistent, pinned left rail; content reflows within the remaining columns but the rail itself never collapses into an overlay.',
    'No panel exceeds a 2:1 aspect ratio without an internal scroll region — density is achieved by panel count, not by stretching a single visual.',
    'Panel headers are single-line and truncate with a tooltip rather than wrap onto a second line.',
  ],
  typographyRules: [
    'Tabular (lining) numerals everywhere a number appears in a row or column, so digit columns align vertically.',
    'One display size for page titles, one for panel titles, one for body text — no ad-hoc intermediate sizes.',
    'Labels are set at the compact end of the type scale even on desktop; Precision Grid never inflates label size for approachability.',
    'Units and deltas are set in a secondary weight immediately adjacent to the value they qualify, never in a legend elsewhere on the page.',
  ],
  navigationRules: [
    'Left rail navigation with nested sections collapsed by default; breadcrumbs mirror the rail state exactly, with no divergence between the two.',
    'Every top-level destination is always visible in the rail — no primary section is hidden behind an overflow menu.',
    'Filters live in a persistent filter bar above the grid, never inside a modal, so the active filter state is always legible.',
  ],
  chartRules: [
    'Charts are compact and multiples-friendly: several small charts of identical size beat one large chart wherever the comparison is the point.',
    'Axes, units, and baselines are always printed on the chart itself, never inferred from a caption.',
    'No chart truncates its y-axis without an explicit disclosure badge.',
    'Colour encodes at most one dimension; a second dimension is encoded by position or shape, never by a second colour ramp layered on top.',
  ],
  diagramRules: [
    'Diagrams use orthogonal connectors on the same 8px grid as the surrounding layout — no free-angle routing.',
    'Every node carries a stable, visible identifier; diagrams are legible from the node labels alone, without hover.',
  ],
  motionRules: [
    'Entrances are restrained (motion level 1 by default): a single staggered settle, never a bounce or overshoot.',
    'Numeric tiles use `ledger-reveal` on mount and on `data-change` — values resolve once, in reading order, with no counting-up theatrics.',
    'Chart panels that need to show their own structure use `data-ink-draw` (axes, then series, then annotation) instead of `ledger-reveal`.',
    'No idle or looping motion anywhere on a Precision Grid dashboard — every animation resolves to stillness and stays still until the next state change.',
  ],
  signatureSequences: ['ledger-reveal', 'data-ink-draw'],
  surfaceRules: [
    'Primary home is the dashboard surface; secondary home is the technical explainer where a dense reference table or matrix is the content.',
    'Never used for slide decks — the grid density fights a presentation viewing distance.',
  ],
  preferredComponents: ['comp.kpi-tile', 'comp.trend-chart', 'comp.category-bar-chart', 'comp.status-list'],
  prohibitedPatterns: [
    'Full-bleed hero imagery or illustration above the fold.',
    'Auto-rotating carousels for KPI tiles.',
    'Colour-only status encoding (must pair with icon or label).',
  ],
  accessibilityNotes: [
    'Tabular numerals and consistent column alignment double as a low-vision aid — no separate low-vision layout is required.',
    'Every chart ships a keyboard-accessible data table equivalent alongside the visual.',
    'Reduced-motion mode replaces `ledger-reveal`/`data-ink-draw` with the same reading-order opacity steps, capped at 400ms.',
  ],
  exampleExperienceIds: [
    'db-model-monitoring-cockpit',
    'db-regulatory-control-hub',
    'deck-ai-governance-and-controls',
    'exp-coding-agent-implementation-plan',
    'exp-api-integration-contract',
  ],
};

export default precisionGrid;
