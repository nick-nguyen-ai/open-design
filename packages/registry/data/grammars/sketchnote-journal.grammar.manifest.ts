import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Sketchnote Journal — the Sketchnote diagram-collection family's grammar
 * (diagram-collections design spec, 2026-07-16). Owns the deck world-template
 * `dgm-sketchnote` and the eight `comp.dgm.sketchnote.*` components.
 */
const grammar: DesignGrammar = {
  id: 'sketchnote-journal',
  name: 'Sketchnote Journal',
  intent:
    'A hand-journal grammar for surfaces that teach: concepts drawn the way a good engineer explains at a whiteboard - sticky notes, marker swipes, rough dashed arrows - warm and personal without losing precision about what connects to what.',
  layoutRules: ['Content reads as a journal spread: one idea per sticky cluster, generous paper margins, never a dense corporate grid.', 'Diagrams are the narrative spine; prose appears as short handwritten captions attached to drawings, not paragraphs.', 'Rotation and jitter are deterministic per element id - the page always redraws identically.'],
  typographyRules: ['A handwritten display face (Caveat) for titles and node labels; a quiet sans (Inter) for dense detail lines.', 'Title carries a marker-swipe underline; body text never does.', 'Uppercase is avoided - the register is lowercase, personal, first-person.'],
  navigationRules: [
    'Deck navigation lives in the template corners (arrows + counter); the diagram never hosts navigation.',
    'Section order follows the grammar tour: flow, sequence, layers, zones, cycle, compare, cells, timeline.',
  ],
  chartRules: ["Quantitative marks borrow the family's rough stroke but must keep true proportions - wobble never distorts data.", 'Every number is restated in a caption; the sketch aesthetic never stands alone for figures.'],
  diagramRules: ['Node kind is encoded by silhouette (pill, rect, diamond, cylinder, figure); sticky tints rotate for grouping only.', 'Edges are rough dashed strokes with hand-drawn arrowheads; numbered amber step badges order any walkthrough.', 'Every diagram ships its textual outline (the grammar mirror) - the sketch is never the only reading.'],
  motionRules: ['Elements settle in like notes being placed (opacity + 3px drop), edges trace on; both from motion tokens.', 'Reduced motion renders the finished page instantly - full content, zero animation.'],
  signatureSequences: ['data-ink-draw'],
  surfaceRules: ['Strongest on technical explainers and teaching decks; strong on personal pages; use sparingly on regulatory dashboards.'],
  preferredComponents: ['comp.dgm.sketchnote.flow', 'comp.dgm.sketchnote.sequence', 'comp.dgm.sketchnote.layers', 'comp.dgm.sketchnote.zones', 'comp.dgm.sketchnote.cycle', 'comp.dgm.sketchnote.compare', 'comp.dgm.sketchnote.cells', 'comp.dgm.sketchnote.timeline'],
  prohibitedPatterns: ['Corporate gradient fills or glassmorphism - the family is paper and ink.', 'Random (unseeded) jitter - every wobble must be reproducible.', 'Colour-only node distinction.'],
  accessibilityNotes: ['Ink on paper holds >= 13:1; sticky tints hold >= 7:1 under ink text.', 'The hidden outline lists every node, edge, and caption in reading order.', 'Reduced motion is a full-content render, not a cut-down one.'],
  exampleExperienceIds: [],
};

export default grammar;
