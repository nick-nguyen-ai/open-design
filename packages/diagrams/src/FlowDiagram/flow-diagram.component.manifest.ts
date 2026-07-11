import type { ComponentManifest } from '@enterprise-design/contracts';

/**
 * FlowDiagram — a small, deterministic node→edge SVG diagram with a
 * `thread-trace` node-by-node reveal, stable semantic ids, and an
 * always-present textual outline.
 */
const flowDiagramManifest: ComponentManifest = {
  schemaVersion: '1.0',
  id: 'comp.flow-diagram',
  name: 'Flow Diagram',
  version: '1.0.0',
  description:
    'A small, deterministic node→edge SVG diagram (start/process/decision/end/data nodes distinguished by shape) with a thread-trace reveal and an always-present textual outline.',
  category: 'diagram',
  subcategory: 'flow',
  sourcePath: 'packages/diagrams/src/FlowDiagram/FlowDiagram.tsx',
  exportName: 'FlowDiagram',
  previewRoute: '/preview/comp.flow-diagram',
  designGrammars: ['precision-grid'],
  compatibleSurfaces: ['dashboard', 'project-page', 'technical-explainer', 'slide-deck'],
  businessIntents: ['communicate-process', 'communicate-architecture'],
  audiences: ['technical', 'business', 'mixed'],
  density: ['medium', 'high'],
  motionLevel: 2,
  corporateSuitability: ['standard', 'expressive'],
  themeModes: ['light', 'dark', 'adaptive'],
  contentRequirements: {
    requiredFields: ['data', 'title'],
    optionalFields: ['sourceNote'],
    minItems: 1,
    acceptedDataShapes: ['graph'],
    emptyStateSupported: true,
    loadingStateSupported: true,
    errorStateSupported: true,
  },
  dependencies: [
    {
      packageName: 'motion',
      purpose: 'Per-rank thread-trace reveal (motion.g opacity transitions), composed from @enterprise-design/motion primitives',
      optional: false,
      adapter: 'packages/diagrams/src/FlowDiagram/useThreadTrace.ts',
    },
  ],
  compatibility: {
    worksWellWith: ['comp.status-list'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: ['min-width-360'],
    compositionRoles: ['primary-visual', 'detail'],
    maxInstancesPerViewport: 2,
  },
  accessibility: {
    keyboardAccessible: true,
    screenReaderLabels: true,
    nonColourEncoding: true,
    reducedMotion: true,
    focusVisible: true,
    contrastTested: true,
    knownLimitations: [
      'The reveal animates node-by-node once on mount; hover/selection-triggered re-illumination of a traversal path is not yet implemented.',
      'Edge routing is straight-line, not orthogonal — acceptable for the small (~20 node) diagrams this component targets.',
      'Nodes in a cycle or otherwise unreachable from any root collapse to rank 0; the layout stays deterministic and never throws, but such nodes may visually overlap root nodes in the same column. Intended for acyclic (DAG) flows.',
    ],
  },
  performance: {
    renderingCost: 'low',
    bundleCostKbGzip: 8,
    usesCanvas: false,
    usesWebGL: false,
    supportsLazyLoad: true,
    recommendedDataLimit: 30,
    fallbackComponentId: 'comp.status-list',
  },
  provenance: {
    author: 'design-system',
    assetSources: [],
    licenceReviewed: true,
    generatedAssets: false,
    reviewRecord: 'REV-2026-T7-005',
  },
  approval: {
    state: 'approved',
    reviewer: 'design-lead',
    reviewedAt: '2026-07-11',
    qualityScore: 87,
    notes: [
      'Node kind is encoded by shape (pill/rectangle/diamond/parallelogram/double-pill), not colour alone.',
      'DONE_WITH_CONCERNS scope note: entrance reveal only, no interactive re-trace on hover/selection; straight-line (not orthogonal) edge routing.',
    ],
  },
  tags: ['diagram', 'flow', 'graph', 'lineage', 'architecture'],
  searchText:
    'Flow Diagram. A small node-and-edge diagram (start, process, decision, end, data nodes) for showing a process flow, lineage, or simple architecture, with a deterministic layered layout and a thread-trace reveal. Use for a small (roughly under 20 node) directed flow. Do not use for a dense architecture map or a graph with many crossing edges — this is a minimal, straight-line-edge layout, not a general graph-layout engine.',
};

export default flowDiagramManifest;
