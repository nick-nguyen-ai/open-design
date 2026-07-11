import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Monumental Type (plan §9) — typography-led storytelling. Lighter
 * catalogue grammar (complete and schema-valid; not one of the four RICH
 * grammars). Strongest surfaces: slides, landing pages.
 */
const monumentalType: DesignGrammar = {
  id: 'monumental-type',
  name: 'Monumental Type',
  intent:
    'A grammar that lets a single statement — a vision, a headline number, a title — carry a whole viewport, using scale and type as the primary design material rather than imagery or dense layout.',
  layoutRules: [
    'One statement per viewport, set large enough to be read at a glance; supporting detail lives below the fold, never competing for the same space.',
    'Generous margins on every side — Monumental Type is the least cluttered grammar in the set.',
  ],
  typographyRules: [
    'A single display face used at dramatic scale for the headline statement, with a plain, quiet body face for everything else.',
    'Numerals used as headline statements (a single KPI, a single date) are set at the same monumental scale as text headlines.',
  ],
  navigationRules: [
    'Section-to-section navigation is a deliberate, discrete jump (paging), not continuous scroll-linked reveal.',
  ],
  chartRules: [
    'At most one simplified chart per section, always subordinate to the headline statement it supports.',
  ],
  diagramRules: [
    'Diagrams are reduced to their single clearest form — a simplified flow, not a full technical diagram.',
  ],
  motionRules: [
    '`horizon-sweep` establishes each section\'s datum as the headline statement arrives, matching the grammar\'s one-statement-per-viewport structure.',
    'Supporting figures beneath the headline settle with `ledger-reveal` after the headline has registered, never before it.',
  ],
  signatureSequences: ['horizon-sweep', 'ledger-reveal'],
  surfaceRules: [
    'Primary home is slide decks and portfolio/landing-style personal pages built around a single vision statement.',
  ],
  preferredComponents: ['comp.kpi-tile', 'comp.status-list'],
  prohibitedPatterns: [
    'More than one headline-scale statement visible at once.',
    'Dense multi-panel grids (contradicts the one-statement-per-viewport rule).',
  ],
  accessibilityNotes: [
    'Headline-scale text still meets body-text contrast requirements, not just large-text contrast minimums, since it often carries the sole message.',
    'Reduced-motion mode presents the headline statement directly, with supporting figures as a single opacity step.',
  ],
  exampleExperienceIds: [
    'proj-platform-product-launch',
    'deck-product-vision',
    'home-research-publication-portfolio',
    'home-talks-presentation-archive',
  ],
};

export default monumentalType;
