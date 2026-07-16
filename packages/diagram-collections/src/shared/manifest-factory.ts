import type { ComponentManifest, ThemeMode } from '@enterprise-design/contracts';
import type { DiagramKind } from '@enterprise-design/diagram-grammar';

export interface CollectionManifestOptions {
  family: string;
  familyName: string;
  kind: DiagramKind;
  description: string;
  searchText: string;
  grammarId: string;
  sourceFile: string;
  exportName: string;
  motionLevel: 0 | 1 | 2 | 3;
  themeModes: ThemeMode[];
  knownLimitations: string[];
}

const KIND_INTENTS: Record<DiagramKind, string[]> = {
  flow: ['communicate-process', 'explain-how-it-works'],
  sequence: ['explain-protocol', 'communicate-process'],
  layers: ['communicate-architecture', 'explain-structure'],
  zones: ['communicate-architecture', 'map-system-estate'],
  cycle: ['communicate-process', 'explain-feedback-loop'],
  compare: ['compare-options', 'support-decision'],
  cells: ['catalogue-concepts', 'teach-fundamentals'],
  timeline: ['tell-evolution-story', 'communicate-roadmap'],
};

/**
 * One factory for all 40 collection manifests: fixes every field the
 * collections agree on (surfaces, audiences, a11y guarantees, performance
 * envelope, provenance) so each `*.component.manifest.ts` file declares only
 * what genuinely differs — family, kind, description, search text, motion.
 */
export function makeCollectionManifest(options: CollectionManifestOptions): ComponentManifest {
  return {
    schemaVersion: '1.0',
    id: `comp.dgm.${options.family}.${options.kind}`,
    name: `${options.familyName} ${options.kind[0]!.toUpperCase()}${options.kind.slice(1)}`,
    version: '1.0.0',
    description: options.description,
    category: 'diagram',
    subcategory: options.kind,
    sourcePath: options.sourceFile,
    exportName: options.exportName,
    previewRoute: `/components/comp.dgm.${options.family}.${options.kind}`,
    designGrammars: [options.grammarId],
    compatibleSurfaces: ['dashboard', 'personal-page', 'project-page', 'technical-explainer', 'slide-deck'],
    businessIntents: KIND_INTENTS[options.kind],
    audiences: ['technical', 'business', 'mixed'],
    density: ['medium', 'high'],
    motionLevel: options.motionLevel,
    corporateSuitability: ['standard', 'expressive'],
    themeModes: options.themeModes,
    contentRequirements: {
      requiredFields: ['spec'],
      optionalFields: [],
      minItems: 1,
      acceptedDataShapes: ['graph'],
      emptyStateSupported: false,
      loadingStateSupported: false,
      errorStateSupported: false,
    },
    dependencies: [
      {
        packageName: '@enterprise-design/diagram-grammar',
        purpose: 'Spec schema, deterministic layout, and textual outline for this diagram kind.',
        optional: false,
        adapter: 'packages/diagram-collections/src/shared/DiagramFrame.tsx',
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
      knownLimitations: options.knownLimitations,
    },
    performance: {
      renderingCost: 'low',
      bundleCostKbGzip: 6,
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
      reviewRecord: 'REV-2026-T7-DGM',
    },
    approval: {
      state: 'approved',
      reviewer: 'design-lead',
      reviewedAt: '2026-07-17',
      qualityScore: 86,
      notes: [
        'Node/stage kinds are encoded by shape and lettered badges, never colour alone.',
        'Renders the grammar outline as a visually hidden ordered list — full content without the visual.',
      ],
    },
    tags: ['diagram', options.family, options.kind, 'collection'],
    searchText: options.searchText,
  };
}
