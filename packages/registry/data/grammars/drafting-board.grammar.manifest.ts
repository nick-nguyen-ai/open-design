import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Drafting Board — the Blueprint diagram-collection family's grammar
 * (diagram-collections design spec, 2026-07-16). Owns the deck world-template
 * `dgm-blueprint` and the eight `comp.dgm.blueprint.*` components.
 */
const grammar: DesignGrammar = {
  id: 'drafting-board',
  name: 'Drafting Board',
  intent:
    'A cyanotype drafting grammar for surfaces that specify: systems drawn as engineering sheets - dot grids, orthogonal wires, dimension ticks, title-block stamps - authoritative the way an as-built drawing is authoritative.',
  layoutRules: ['Every diagram sits on a bordered sheet with a title-block stamp; panes align to the dot grid.', 'Connectors are strictly orthogonal with midpoint elbows; free-angle routing is a defect.', 'Density is welcome; whitespace is engineered, not decorative.'],
  typographyRules: ['IBM Plex Mono everywhere - identifiers, labels, annotations; uppercase tracked headers.', 'Annotations are smaller than labels and always attached to a tick or leader.', 'Sheet stamps (DGM-KIND-01) echo drawing-number convention.'],
  navigationRules: [
    'Deck navigation lives in the template corners (arrows + counter); the diagram never hosts navigation.',
    'Section order follows the grammar tour: flow, sequence, layers, zones, cycle, compare, cells, timeline.',
  ],
  chartRules: ['Charts render as instrument readouts: hairline axes, mono tick labels, cyan series on the cyanotype field.', 'Every chart states its source and window in the sheet footer.'],
  diagramRules: ['Node kind is encoded by stencil silhouette; accent cyan marks decisions, amber marks alerts - always paired with shape.', 'Wires carry dimension ticks at midpoints; arrowheads are closed triangles.', 'Construction lines (dashed, faint) may scaffold ring and axis geometry.'],
  motionRules: ['Stations fade to placement, wires trace on in structure then connection order; tokens only.', 'Reduced motion presents the finished sheet immediately.'],
  signatureSequences: ['data-ink-draw', 'horizon-sweep'],
  surfaceRules: ['Strongest on technical explainers and architecture decks; strong on engineering dashboards; too formal for personal pages.'],
  preferredComponents: ['comp.dgm.blueprint.flow', 'comp.dgm.blueprint.sequence', 'comp.dgm.blueprint.layers', 'comp.dgm.blueprint.zones', 'comp.dgm.blueprint.cycle', 'comp.dgm.blueprint.compare', 'comp.dgm.blueprint.cells', 'comp.dgm.blueprint.timeline'],
  prohibitedPatterns: ['Hand-drawn or wobbled strokes - precision IS the craft.', 'Decorative isometric illustration standing in for the drawing.', 'More than the two accent inks (cyan, amber) on one sheet.'],
  accessibilityNotes: ['Hairlines on cyanotype hold >= 12:1; both accents hold >= 8:1.', 'Every diagram ships its textual outline; sheet stamps are decorative and aria-hidden.', 'Reduced motion is a full-content render.'],
  exampleExperienceIds: [],
};

export default grammar;
