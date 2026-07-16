import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Print Gazette — the Gazette diagram-collection family's grammar
 * (diagram-collections design spec, 2026-07-16). Owns the deck world-template
 * `dgm-gazette` and the eight `comp.dgm.gazette.*` components.
 */
const grammar: DesignGrammar = {
  id: 'print-gazette',
  name: 'Print Gazette',
  intent:
    'A print-atelier grammar for surfaces that chronicle: field guides and technical manuals set like a vintage gazette - ink rules on cream, serif display, one vermilion spot - calm, bookish, and permanent-feeling.',
  layoutRules: ['Pages are framed by double rules; content divides along column rules like set type.', 'Diagrams read as engraved plates with captions; medallions number every sequence.', 'Whitespace follows book margins - wide outer, tight inner.'],
  typographyRules: ['Fraunces for display and labels; Inter only for fine tabular detail.', 'Titles take a vermilion drop-cap first letter; annotations are italic footnotes.', 'No uppercase tracking except small badges - the register is literary.'],
  navigationRules: [
    'Deck navigation lives in the template corners (arrows + counter); the diagram never hosts navigation.',
    'Section order follows the grammar tour: flow, sequence, layers, zones, cycle, compare, cells, timeline.',
  ],
  chartRules: ['Charts are engraved figures: hairline axes, ink marks, vermilion for the single emphasised series.', 'Figure numbers and sources set in italic beneath, always.'],
  diagramRules: ['Node kind is encoded by plate silhouette and rule treatment; vermilion is an accent, never the sole encoding.', 'Hatch fills (45-degree vermilion) mark emphasis zones; medallions carry serif numerals.', 'Every plate ships its textual outline.'],
  motionRules: ['Plates settle like set type (fade), rules draw on; tokens only.', 'Reduced motion presents the printed page complete.'],
  signatureSequences: ['data-ink-draw', 'ledger-reveal'],
  surfaceRules: ['Strongest on field-guide decks and long-form explainers; strong on portfolio personal pages; use sparingly on live dashboards.'],
  preferredComponents: ['comp.dgm.gazette.flow', 'comp.dgm.gazette.sequence', 'comp.dgm.gazette.layers', 'comp.dgm.gazette.zones', 'comp.dgm.gazette.cycle', 'comp.dgm.gazette.compare', 'comp.dgm.gazette.cells', 'comp.dgm.gazette.timeline'],
  prohibitedPatterns: ['A second accent colour - vermilion is the only spot ink.', 'Glow, gradients, or glass effects.', 'Sans-serif display headings.'],
  accessibilityNotes: ['Ink on cream holds >= 15:1; vermilion accents pair with silhouette, position, or numerals.', 'Medallion numerals are white on vermilion at >= 4.5:1 and restated in the outline.', 'Reduced motion is a full-content render.'],
  exampleExperienceIds: ['deck-dgm-gazette'],
};

export default grammar;
