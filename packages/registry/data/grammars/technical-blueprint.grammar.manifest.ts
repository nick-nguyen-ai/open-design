import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Technical Blueprint (plan §9) — architectural, annotated. RICH grammar:
 * one of the four grammars given full differentiated rule sets (task 8
 * brief). Strongest surfaces: explainers, technical slides.
 */
const technicalBlueprint: DesignGrammar = {
  id: 'technical-blueprint',
  name: 'Technical Blueprint',
  intent:
    'A drafting-table grammar for surfaces that explain how a system is actually built — components, data flow, trust boundaries — legible the way an as-built architecture drawing is legible: annotated, layered, and precise about what connects to what.',
  layoutRules: [
    'Content is organised as labelled panes on an implied drawing sheet: a title block, a legend, and one or more diagram panes — never a freeform scroll of prose interrupted by images.',
    'Diagrams are the primary content, not illustration alongside text; supporting prose is annotation attached to specific diagram regions.',
    'A persistent legend/key pane is always visible alongside the diagram, never collapsed behind a toggle.',
    'Panes snap to a technical-drawing grid (8px) with consistent margins, echoing a CAD sheet rather than a marketing layout.',
  ],
  typographyRules: [
    'A monospace or semi-monospace face for identifiers, endpoints, and code-adjacent labels, distinct from the sans face used for prose annotation.',
    'Annotation callouts are set smaller than body prose and always leader-lined to the diagram element they describe.',
    'Version, revision, and "last verified" metadata is always present in a title-block-style footer, echoing engineering-drawing convention.',
  ],
  navigationRules: [
    'Section navigation mirrors the system\'s own decomposition (e.g. by layer or by domain), not by document chapter — the map of the nav is the map of the system.',
    'A "focus mode" lets the reader isolate one subsystem and dim the rest, satisfying the plan\'s diagram progressive-disclosure requirement (§10.4).',
  ],
  chartRules: [
    'Charts are used only where they describe system behaviour (latency, throughput, error budget), never for narrative or motivational statistics.',
    'Every chart states its data source and collection window directly on the panel — Technical Blueprint never lets a number float without provenance.',
  ],
  diagramRules: [
    'Every node and edge carries a stable semantic id and a typed category (system, process, person, data store, control) distinguished by shape and label, not colour alone (plan §10.4).',
    'Layout is deterministic for a given input graph, so the same architecture always renders in the same place — required for visual-regression testing.',
    'Complex diagrams expose a textual outline equivalent listing every node and edge, satisfying keyboard and screen-reader access without the visual.',
  ],
  motionRules: [
    'Diagrams reveal with `data-ink-draw` in axes → series → annotation order, here read as structure → connections → labels — the diagram teaches its own reading order exactly as it does for a chart.',
    'Section transitions (moving between subsystems) use `horizon-sweep` to re-establish the drawing\'s datum line, never a directional slide or fade-through-white.',
    'Pan/zoom on the diagram itself is a direct-manipulation affordance, not a signature-sequence animation, and is always optional per plan §10.4.',
  ],
  signatureSequences: ['data-ink-draw', 'horizon-sweep'],
  surfaceRules: [
    'Primary home is the technical explainer; strong secondary home is the technical slide deck for architecture-explanation content.',
    'Rarely appropriate for personal pages, where the drawing-sheet register reads as overly formal.',
  ],
  preferredComponents: ['comp.flow-diagram', 'comp.status-list', 'comp.category-bar-chart'],
  prohibitedPatterns: [
    'Colour-only distinction between node categories (must pair with shape/icon per plan §10.4).',
    'Decorative isometric illustration standing in for an actual architecture diagram.',
    'Free-angle, hand-drawn-style connector routing.',
  ],
  accessibilityNotes: [
    'Every diagram ships a textual outline equivalent (node/edge list) independent of the visual (plan §10.4).',
    'Focus mode and progressive disclosure are keyboard-operable, not mouse-hover-only.',
    'Reduced-motion mode replaces the structure → connections → labels draw-on with the same three ordered opacity steps, capped at 400ms.',
  ],
  exampleExperienceIds: [
    'db-data-quality-operations',
    'proj-cloud-migration-programme',
    'deck-technical-architecture-explanation',
    'deck-technical-training',
    'exp-system-architecture',
    'exp-migration-plan',
  ],
};

export default technicalBlueprint;
