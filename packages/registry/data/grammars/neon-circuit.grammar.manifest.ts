import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Neon Circuit — the Circuit diagram-collection family's grammar
 * (diagram-collections design spec, 2026-07-16). Owns the deck world-template
 * `dgm-circuit` and the eight `comp.dgm.circuit.*` components.
 */
const grammar: DesignGrammar = {
  id: 'neon-circuit',
  name: 'Neon Circuit',
  intent:
    'A neon-terminal grammar for surfaces that pulse: live systems drawn as powered boards - glass chips, phosphor traces, scanline corners - kinetic and confident, built for scale-and-throughput stories.',
  layoutRules: ['Content sits on a near-black board with a faint trace grid; sectors are dashed neon frames.', 'The diagram is the hero; supporting copy docks to edges in terminal-style tags.', 'Corners carry scanline accents, never content.'],
  typographyRules: ['Space Grotesk for labels and headers; IBM Plex Mono for trace tags, step markers like [03], and sector names.', 'Neon inks colour strokes and accents, never long text runs - body text stays near-white.'],
  navigationRules: [
    'Deck navigation lives in the template corners (arrows + counter); the diagram never hosts navigation.',
    'Section order follows the grammar tour: flow, sequence, layers, zones, cycle, compare, cells, timeline.',
  ],
  chartRules: ['Series glow like traces (gaussian filter) but data marks stay geometrically exact.', 'Grid lines stay in the dim board ink so glowing series carry the reading.'],
  diagramRules: ['Node kind is encoded by chip silhouette (pins, stacked slabs, diamond); the three phosphor inks rotate for grouping only.', 'Traces flow with a slow dash current - ambient, directional, and fully removed under reduced motion.', 'Glow is a per-element SVG filter; instances per viewport stay low by contract.'],
  motionRules: ['Chips power on (fade), traces carry a continuous dash current; durations and eases from tokens.', 'Reduced motion: no current, no power-on - the lit board renders complete and still.'],
  signatureSequences: ['data-ink-draw'],
  surfaceRules: ['Strongest on scale and capacity decks and live dashboards; strong on explainers for streaming and infra topics; avoid for conservative regulatory audiences.'],
  preferredComponents: ['comp.dgm.circuit.flow', 'comp.dgm.circuit.sequence', 'comp.dgm.circuit.layers', 'comp.dgm.circuit.zones', 'comp.dgm.circuit.cycle', 'comp.dgm.circuit.compare', 'comp.dgm.circuit.cells', 'comp.dgm.circuit.timeline'],
  prohibitedPatterns: ['Neon ink as the only differentiator between node kinds.', 'Glow filters on text.', 'Light-mode rendering - the family is dark by construction.'],
  accessibilityNotes: ['Text on board holds >= 15:1; phosphor green and cyan >= 9:1; magenta is always paired with silhouette or tag.', 'The ambient dash current stops entirely under reduced motion (vestibular safety).', 'Every diagram ships its textual outline.'],
  exampleExperienceIds: ['deck-dgm-circuit'],
};

export default grammar;
