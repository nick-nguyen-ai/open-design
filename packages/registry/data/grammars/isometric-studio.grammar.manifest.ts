import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Isometric Studio — the Isometric diagram-collection family's grammar
 * (diagram-collections design spec, 2026-07-16). Owns the deck world-template
 * `dgm-isometric` and the eight `comp.dgm.isometric.*` components.
 */
const grammar: DesignGrammar = {
  id: 'isometric-studio',
  name: 'Isometric Studio',
  intent:
    'A 2.5D studio grammar for surfaces that tour: platforms presented as small candy-coloured dioramas - extruded blocks, soft shadows, terraced slabs - inviting and spatial, built for anatomy and onboarding stories.',
  layoutRules: ['Scenes are true 30-degree isometric dioramas; the floor plane organises everything.', 'Back-to-front paint order is computed, never hand-tuned; text is billboarded, never skewed.', 'One diorama per pane - the family does not tile small multiples.'],
  typographyRules: ['Inter with confident weights; labels float on halo strokes so they read over any face.', 'Labels name blocks from above (top-face altitude); details sit one step lower.'],
  navigationRules: [
    'Deck navigation lives in the template corners (arrows + counter); the diagram never hosts navigation.',
    'Section order follows the grammar tour: flow, sequence, layers, zones, cycle, compare, cells, timeline.',
  ],
  chartRules: ['Quantities may extrude (height = value) but always carry an exact numeral label.', 'No perspective distortion of data - isometric projection only.'],
  diagramRules: ['Node kind is encoded by structure: footprint shape, stack count, height class - colour rotates for rhythm only.', 'Connectors travel the ground plane with flat arrowheads; ground pads mark territories.', 'Every scene ships its textual outline.'],
  motionRules: ['Blocks rise onto the floor (lift ease), ground wires trace; tokens only.', 'Reduced motion places the finished diorama at once.'],
  signatureSequences: ['ledger-reveal'],
  surfaceRules: ['Strongest on onboarding decks and platform-anatomy explainers; strong on personal pages; weaker where dense data tables dominate.'],
  preferredComponents: ['comp.dgm.isometric.flow', 'comp.dgm.isometric.sequence', 'comp.dgm.isometric.layers', 'comp.dgm.isometric.zones', 'comp.dgm.isometric.cycle', 'comp.dgm.isometric.compare', 'comp.dgm.isometric.cells', 'comp.dgm.isometric.timeline'],
  prohibitedPatterns: ['Mixed camera angles or perspective foreshortening.', 'Skewed (non-billboarded) text on faces.', 'Shadowless blocks - grounding is part of legibility.'],
  accessibilityNotes: ['Ink on mist floor holds >= 12:1; labels carry floor-coloured halo strokes for guaranteed contrast over faces.', 'Height and structure encodings are restated in the outline text.', 'Reduced motion is a full-content render.'],
  exampleExperienceIds: ['deck-dgm-isometric'],
};

export default grammar;
