import { describe, expect, it } from 'vitest';
import { DesignContext } from './design-context.js';

const validDesignContext = {
  requestId: 'req-1',
  surface: 'dashboard',
  businessIntent: ['monitor-risk'],
  audience: ['executive', 'risk-and-governance'],
  contentSummary: 'Quarterly risk exposure summary for the executive committee.',
  availableContent: {
    headings: ['Overview', 'Key Risks'],
    narrativeSections: 1,
    kpis: 3,
    tables: 1,
    timeSeries: 2,
    categories: 0,
    processes: 0,
    entities: 0,
    decisions: 1,
    risks: 2,
    milestones: 0,
    codeBlocks: 0,
    citations: 0,
    mediaAssets: 0,
  },
  desiredTone: ['calm', 'authoritative'],
  density: 'medium',
  motionPreference: 1,
  themeMode: 'light',
  corporateSuitability: 'standard',
  technicalConstraints: {
    framework: 'react',
    buildTool: 'vite',
    styling: 'tailwind',
    externalRuntimeNetworkAllowed: false,
    approvedDependencies: [],
    prohibitedDependencies: [],
    targetBrowsers: ['chrome', 'edge'],
    ssrRequired: false,
    staticExportRequired: true,
  },
  accessibilityRequirements: {
    target: 'WCAG-2.2-AA',
    reducedMotionRequired: true,
    keyboardRequired: true,
    screenReaderRequired: true,
    highContrastRequired: false,
  },
  requiredCapabilities: [],
  prohibitedCapabilities: ['webgl'],
};

describe('DesignContext', () => {
  it('round-trips a valid design context', () => {
    const parsed = DesignContext.parse(validDesignContext);
    expect(parsed).toEqual(validDesignContext);
  });

  it('rejects a motionPreference outside 0-3', () => {
    const result = DesignContext.safeParse({ ...validDesignContext, motionPreference: 4 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('motionPreference'))).toBe(
        true,
      );
    }
  });

  it('rejects a technicalConstraints.framework value other than react', () => {
    const result = DesignContext.safeParse({
      ...validDesignContext,
      technicalConstraints: { ...validDesignContext.technicalConstraints, framework: 'vue' },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.join('.') === 'technicalConstraints.framework'),
      ).toBe(true);
    }
  });

  it('rejects accessibilityRequirements.reducedMotionRequired set to false', () => {
    const result = DesignContext.safeParse({
      ...validDesignContext,
      accessibilityRequirements: {
        ...validDesignContext.accessibilityRequirements,
        reducedMotionRequired: false,
      },
    });
    expect(result.success).toBe(false);
  });
});
