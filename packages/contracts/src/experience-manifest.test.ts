import { describe, expect, it } from 'vitest';
import { ExperienceManifest } from './experience-manifest.js';

const validExperienceManifest = {
  schemaVersion: '1.0',
  id: 'exp.risk-dashboard',
  surface: 'dashboard',
  title: 'Enterprise Risk Dashboard',
  designThesis: 'Give risk officers a single, dense view of exposure.',
  grammarId: 'precision-grid',
  audiences: ['risk-and-governance', 'executive'],
  businessIntents: ['monitor-risk'],
  density: 'high',
  motionLevel: 1,
  signatureSequence: 'ledger-reveal',
  corporateSuitability: 'standard',
  themeModes: ['light', 'dark'],
  componentsUsed: ['comp.kpi-tile', 'comp.risk-table'],
  routes: [{ path: '/risk', title: 'Risk Overview', purpose: 'Summarise top risks' }],
  approval: {
    state: 'approved',
    reviewer: 'jane.doe',
    reviewedAt: '2026-01-01T00:00:00.000Z',
    qualityScore: 0.9,
    notes: [],
  },
  tags: ['risk', 'dashboard'],
  searchText: 'risk dashboard exposure governance',
};

describe('ExperienceManifest', () => {
  it('round-trips a valid experience manifest', () => {
    const parsed = ExperienceManifest.parse(validExperienceManifest);
    expect(parsed).toEqual(validExperienceManifest);
  });

  it('round-trips a valid experience manifest with the optional fields present', () => {
    const withOptionals = {
      ...validExperienceManifest,
      contentPackId: 'pack.risk-q3',
      previewRoute: '/preview/exp-risk-dashboard',
      posterAsset: '/assets/exp-risk-dashboard-poster.png',
    };
    const parsed = ExperienceManifest.parse(withOptionals);
    expect(parsed).toEqual(withOptionals);
  });

  it('rejects a surface value outside SurfaceType', () => {
    const result = ExperienceManifest.safeParse({
      ...validExperienceManifest,
      surface: 'kanban-board',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('surface'))).toBe(true);
    }
  });

  it('rejects an empty searchText', () => {
    const result = ExperienceManifest.safeParse({ ...validExperienceManifest, searchText: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('searchText'))).toBe(true);
    }
  });

  it('rejects a route missing the purpose field', () => {
    const result = ExperienceManifest.safeParse({
      ...validExperienceManifest,
      routes: [{ path: '/risk', title: 'Risk Overview' }],
    });
    expect(result.success).toBe(false);
  });
});
