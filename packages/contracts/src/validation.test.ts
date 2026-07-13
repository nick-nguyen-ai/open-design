import { describe, expect, it } from 'vitest';
import { ValidationResult, ValidationFinding } from './validation.js';

const validResult = {
  valid: true,
  score: 100,
  findings: [],
  metrics: {
    accessibility: 100,
    compatibility: 100,
    corporateSuitability: 100,
    contentCoverage: 100,
    performance: 100,
    originality: 100,
  },
};

describe('ValidationResult', () => {
  it('round-trips a clean result', () => {
    expect(ValidationResult.parse(validResult)).toEqual(validResult);
  });

  it('rejects a result missing a metric domain', () => {
    const { performance: _omit, ...partial } = validResult.metrics;
    const result = ValidationResult.safeParse({ ...validResult, metrics: partial });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'metrics.performance')).toBe(true);
    }
  });

  it('rejects a finding with an unknown severity', () => {
    const result = ValidationFinding.safeParse({
      ruleId: 'REG-001',
      severity: 'fatal',
      path: 'routes[0]',
      message: 'x',
      remediation: 'y',
      componentIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'severity')).toBe(true);
    }
  });
});
