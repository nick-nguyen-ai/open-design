import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Spatial Canvas (plan §9) — navigable system map. Lighter catalogue
 * grammar (complete and schema-valid; not one of the four RICH grammars).
 * Strongest surfaces: personal, explainers.
 */
const spatialCanvas: DesignGrammar = {
  id: 'spatial-canvas',
  name: 'Spatial Canvas',
  intent:
    'A grammar for content whose natural shape is a map, not a list — dependency networks, knowledge domains, data lineage — presented as a navigable canvas the reader explores rather than scrolls.',
  layoutRules: [
    'The canvas is the primary viewport; supporting detail opens in a side panel that never covers more than a third of the canvas.',
    'An overview/minimap affordance is always present so position on the canvas is never lost while zoomed in.',
  ],
  typographyRules: [
    'Node labels scale with zoom level so the canvas stays legible from both the overview and the close-up read.',
  ],
  navigationRules: [
    'Selecting a node opens its detail in the side panel without recentring or losing the reader\'s canvas position.',
    'A search-to-focus affordance lets the reader jump directly to a named node rather than panning to find it.',
  ],
  chartRules: [
    'Charts appear only inside a node\'s detail panel, never floating on the canvas itself.',
  ],
  diagramRules: [
    'The canvas itself is the diagram: nodes and edges have stable ids, deterministic layout, and a textual outline equivalent (plan §10.4).',
  ],
  motionRules: [
    '`horizon-sweep` establishes the canvas datum on first entry; the canvas does not re-sweep on every pan or zoom.',
    'Drawing in a newly focused subgraph uses `data-ink-draw` so the local structure builds progressively as the reader navigates to it.',
  ],
  signatureSequences: ['horizon-sweep', 'data-ink-draw'],
  surfaceRules: [
    'Primary home is personal knowledge pages and explainers where the content is genuinely a network (dependencies, lineage, topic maps).',
  ],
  preferredComponents: ['comp.flow-diagram', 'comp.category-bar-chart'],
  prohibitedPatterns: [
    'Canvas content with no textual/list-based fallback for non-pointer access.',
    'Auto-panning or auto-zooming without user action.',
  ],
  accessibilityNotes: [
    'Every canvas has a list-view equivalent reachable without pan or zoom, satisfying keyboard-only access.',
    'Reduced-motion mode omits the entry sweep; the canvas renders directly in its settled state.',
  ],
  exampleExperienceIds: [
    'db-dependency-network-explorer',
    'proj-data-modernisation-programme',
    'deck-innovation-showcase',
    'home-knowledge-atlas',
    'exp-data-lineage-map',
  ],
};

export default spatialCanvas;
