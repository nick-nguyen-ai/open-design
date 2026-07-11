import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Executive Editorial (plan §9) — spacious, premium, narrative. RICH
 * grammar: one of the four grammars given full differentiated rule sets
 * (task 8 brief). Strongest surfaces: project pages, slide decks.
 */
const executiveEditorial: DesignGrammar = {
  id: 'executive-editorial',
  name: 'Executive Editorial',
  intent:
    'A narrative grammar for surfaces that must argue a case to a time-poor senior reader — generous whitespace and a single reading path, in the register of a well-edited board paper rather than a dashboard.',
  layoutRules: [
    'A single-column reading measure (max ~72 characters) for narrative text, widening only for supporting evidence panels.',
    'Generous vertical rhythm: sections are separated by whitespace, never by rules or dividers.',
    'At most one primary visual per viewport — competing visuals are moved to a subsequent section, never placed side by side.',
    'Section breaks fall on full page-height boundaries, never mid-panel, so the document paces like a printed report.',
  ],
  typographyRules: [
    'A serif or humanist display face for section headings, distinct from the sans body face — the one grammar in the set that mixes families deliberately.',
    'Generous leading (1.5–1.7×) on body copy; Executive Editorial is the least dense grammar in the set by design.',
    'Pull-quotes and single-statistic callouts are set at display size to carry the argument visually, not just numerically.',
  ],
  navigationRules: [
    'Top navigation only, collapsing to a single "Contents" affordance on narrower viewports — no persistent side rail competing for width with the reading column.',
    'A progress indicator (not a step count) shows position in the document, reinforcing the sense of a single authored path.',
  ],
  chartRules: [
    'At most one chart per section, annotated directly with a one-sentence takeaway above it — the chart illustrates the sentence, not the other way round.',
    'Charts favour clean line and simple bar forms; no multi-series scatter or dense heatmap, which read as analytical rather than narrative.',
  ],
  diagramRules: [
    'Diagrams are simplified to the three or four nodes that matter to the argument being made, with detail deferred to an appendix link.',
  ],
  motionRules: [
    'A single `horizon-sweep` establishes the page datum on entry or on section navigation — the baseline draws once, content registers onto it, and nothing repeats on scroll.',
    'Numeric callouts inside the narrative use `ledger-reveal`, sparingly, only for the one or two figures the argument turns on.',
    'No panel-level micro-animation independent of the page-level sequence — motion happens once, at the level of the whole section.',
  ],
  signatureSequences: ['horizon-sweep', 'ledger-reveal'],
  surfaceRules: [
    'Primary home is the project page and the slide deck; usable on personal pages for a leadership-narrative section.',
    'Never used for dense operational dashboards — the single-column, single-visual constraint cannot carry monitoring density.',
  ],
  preferredComponents: ['comp.kpi-tile', 'comp.trend-chart', 'comp.status-list'],
  prohibitedPatterns: [
    'Dense multi-panel grids competing for attention on one screen.',
    'More than one chart visible without scrolling.',
    'Sans-only typography for section headings (loses the editorial register).',
  ],
  accessibilityNotes: [
    'The single reading path is itself a screen-reader-friendly structure — heading order matches visual order exactly.',
    'Pull-quote and callout statistics repeat their value in body text, never conveyed by size alone.',
    'Reduced-motion mode drops the baseline draw to a single opacity step; section order is unchanged.',
  ],
  exampleExperienceIds: [
    'db-portfolio-performance-explorer',
    'proj-enterprise-transformation-programme',
    'deck-ai-strategy',
    'deck-executive-decision-proposal',
    'home-technical-leadership-portfolio',
    'exp-architecture-decision-record',
  ],
};

export default executiveEditorial;
