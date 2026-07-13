import { describe, expect, it } from 'vitest';
import { DesignBlueprint, ComponentPlacement, TokenOverrides } from './blueprint.js';

const validPlacement = {
  componentId: 'comp.kpi-tile',
  variant: 'default',
  role: 'summary',
  region: 'summary-zone',
  priority: 1,
  propsMapping: { items: 'availableContent.kpis' },
  responsiveRules: ['stack below md'],
};

const validBlueprint = {
  schemaVersion: '1.0',
  blueprintId: 'bp_abc123',
  title: 'Risk Dashboard',
  rationale: 'Calm-command grammar fits an executive risk overview.',
  surface: 'dashboard',
  audience: ['executive'],
  grammarId: 'calm-command',
  themeId: 'enterprise-neutral-light',
  motionLevel: 1,
  density: 'medium',
  routes: [
    {
      path: '/dashboard',
      title: 'Risk Dashboard',
      purpose: 'Portfolio risk overview',
      layoutComponentId: 'layout.dashboard-grid',
      sections: [
        {
          id: 'summary',
          purpose: 'Headline metrics',
          order: 0,
          componentPlacements: [validPlacement],
          contentMapping: { kpis: 'availableContent.kpis' },
        },
      ],
    },
  ],
  globalComponents: [],
  tokens: { density: 'default' },
  responsiveStrategy: {
    breakpoints: ['sm', 'md', 'lg', 'xl'],
    reflowRules: ['split-pane collapses to stacked below md'],
    densityReduction: ['secondary KPIs summarised at narrow widths'],
    touchAdjustments: ['larger tap targets on touch'],
  },
  accessibilityStrategy: {
    landmarkPlan: ['main', 'nav'],
    headingOutline: ['h1 Risk Dashboard'],
    focusOrderNotes: ['summary first'],
    liveRegions: [],
    chartEquivalents: {},
  },
  implementationNotes: ['corporate-mode:standard'],
  alternatives: [
    { mode: 'recommended', blueprintId: 'bp_abc123', differenceSummary: ['baseline'] },
  ],
  evidence: [
    {
      componentId: 'comp.kpi-tile',
      matchedIntents: ['monitor-risk'],
      matchedConstraints: ['surface:dashboard'],
      score: 0.9,
      explanation: 'KPI tile carries the summary role.',
    },
  ],
};

describe('DesignBlueprint', () => {
  it('round-trips a valid blueprint', () => {
    const parsed = DesignBlueprint.parse(validBlueprint);
    expect(parsed.blueprintId).toBe('bp_abc123');
  });

  it('rejects a schemaVersion other than 1.0', () => {
    const result = DesignBlueprint.safeParse({ ...validBlueprint, schemaVersion: '2.0' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'schemaVersion')).toBe(true);
    }
  });

  it('rejects a motionLevel outside 0-3', () => {
    const result = DesignBlueprint.safeParse({ ...validBlueprint, motionLevel: 4 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('motionLevel'))).toBe(true);
    }
  });

  it('rejects a component placement with an invalid composition role', () => {
    const result = ComponentPlacement.safeParse({ ...validPlacement, role: 'not-a-role' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'role')).toBe(true);
    }
  });

  it('accepts a token-override density enum and rejects an unknown one', () => {
    expect(TokenOverrides.safeParse({ density: 'spacious' }).success).toBe(true);
    const bad = TokenOverrides.safeParse({ density: 'ultra' });
    expect(bad.success).toBe(false);
    if (!bad.success) {
      expect(bad.error.issues.some((i) => i.path.join('.') === 'density')).toBe(true);
    }
  });
});
