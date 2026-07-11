import { describe, expect, it } from 'vitest';
import { RankedComponent, RecommendationEvidence } from './recommendation.js';

const validEvidence = {
  componentId: 'comp.kpi-tile',
  matchedIntents: ['monitor-risk'],
  matchedConstraints: ['density:high'],
  score: 0.87,
  explanation: 'Matches the risk-monitoring intent and the high-density requirement.',
};

const validRankedComponent = {
  componentId: 'comp.kpi-tile',
  role: 'summary',
  score: 0.87,
  evidence: validEvidence,
};

describe('RecommendationEvidence', () => {
  it('round-trips valid recommendation evidence', () => {
    const parsed = RecommendationEvidence.parse(validEvidence);
    expect(parsed).toEqual(validEvidence);
  });

  it('rejects a non-numeric score', () => {
    const result = RecommendationEvidence.safeParse({ ...validEvidence, score: 'high' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('score'))).toBe(true);
    }
  });
});

describe('RankedComponent', () => {
  it('round-trips a valid ranked component', () => {
    const parsed = RankedComponent.parse(validRankedComponent);
    expect(parsed).toEqual(validRankedComponent);
  });

  it('round-trips a valid ranked component with a fallback id', () => {
    const withFallback = { ...validRankedComponent, fallbackComponentId: 'comp.kpi-simple' };
    const parsed = RankedComponent.parse(withFallback);
    expect(parsed).toEqual(withFallback);
  });

  it('rejects a role value outside CompositionRole', () => {
    const result = RankedComponent.safeParse({ ...validRankedComponent, role: 'centerpiece' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('role'))).toBe(true);
    }
  });
});
