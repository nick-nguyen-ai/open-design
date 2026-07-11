import { describe, expect, it } from 'vitest';
import { ComponentManifest } from './component-manifest.js';

const validComponentManifest = {
  schemaVersion: '1.0',
  id: 'comp.kpi-tile',
  name: 'KPI Tile',
  version: '1.0.0',
  description: 'Displays a single KPI value with a trend indicator.',
  category: 'content',
  subcategory: 'metric-display',
  sourcePath: 'src/components/KpiTile.tsx',
  exportName: 'KpiTile',
  previewRoute: '/preview/kpi-tile',
  designGrammars: ['precision-grid'],
  compatibleSurfaces: ['dashboard'],
  businessIntents: ['show-performance'],
  audiences: ['executive'],
  density: ['low', 'medium'],
  motionLevel: 1,
  corporateSuitability: ['standard'],
  themeModes: ['light', 'dark'],
  contentRequirements: {
    requiredFields: ['value'],
    optionalFields: ['trend'],
    acceptedDataShapes: ['scalar'],
    emptyStateSupported: true,
    loadingStateSupported: true,
    errorStateSupported: true,
  },
  dependencies: [
    { packageName: 'recharts', purpose: 'sparkline rendering', optional: true, adapter: 'recharts-adapter' },
  ],
  compatibility: {
    worksWellWith: ['comp.kpi-grid'],
    conflictsWith: [],
    requiresOneOf: [],
    layoutRequirements: ['grid-cell'],
    compositionRoles: ['summary'],
  },
  accessibility: {
    keyboardAccessible: true,
    screenReaderLabels: true,
    nonColourEncoding: true,
    reducedMotion: true,
    focusVisible: true,
    contrastTested: true,
    knownLimitations: [],
  },
  performance: {
    renderingCost: 'low',
    bundleCostKbGzip: 4.2,
    usesCanvas: false,
    usesWebGL: false,
    supportsLazyLoad: true,
  },
  provenance: {
    author: 'design-systems-team',
    assetSources: [],
    licenceReviewed: true,
    generatedAssets: false,
    reviewRecord: 'REVIEW-001',
  },
  approval: {
    state: 'approved',
    reviewer: 'jane.doe',
    reviewedAt: '2026-01-01T00:00:00.000Z',
    qualityScore: 0.92,
    notes: [],
  },
  tags: ['kpi', 'metric'],
  searchText: 'kpi tile metric performance trend indicator',
};

describe('ComponentManifest', () => {
  it('round-trips a valid component manifest', () => {
    const parsed = ComponentManifest.parse(validComponentManifest);
    expect(parsed).toEqual(validComponentManifest);
  });

  it('rejects a category value outside ComponentCategory', () => {
    const result = ComponentManifest.safeParse({ ...validComponentManifest, category: 'widget' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('category'))).toBe(true);
    }
  });

  it('rejects an empty searchText', () => {
    const result = ComponentManifest.safeParse({ ...validComponentManifest, searchText: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('searchText'))).toBe(true);
    }
  });

  it('rejects a manifest missing a required field', () => {
    const { description: _description, ...withoutDescription } = validComponentManifest;
    const result = ComponentManifest.safeParse(withoutDescription);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('description'))).toBe(true);
    }
  });

  it('rejects a schemaVersion other than "1.0"', () => {
    const result = ComponentManifest.safeParse({ ...validComponentManifest, schemaVersion: '2.0' });
    expect(result.success).toBe(false);
  });
});
