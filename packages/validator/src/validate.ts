import { DesignBlueprint } from '@enterprise-design/contracts';
import type { ValidationFinding, ValidationResult } from '@enterprise-design/contracts';
import type {
  MetricDomain,
  Rule,
  Severity,
  ValidationProfile,
  ValidationRegistry,
} from './types.js';
import { RULES } from './rules.js';

/**
 * Severity escalation by profile (§17.3). `info` never blocks. Warnings
 * escalate to errors as strictness rises:
 *  - draft: natural severity only (just natural errors block).
 *  - corporate: warnings in the accessibility and corporateSuitability domains
 *    become errors.
 *  - release: every warning becomes an error.
 */
function resolveSeverity(rule: Rule, profile: ValidationProfile): Severity {
  if (rule.baseSeverity !== 'warning') return rule.baseSeverity;
  if (profile === 'release') return 'error';
  if (profile === 'corporate' && (rule.domain === 'accessibility' || rule.domain === 'corporateSuitability')) {
    return 'error';
  }
  return 'warning';
}

const DEDUCTION: Record<Severity, number> = { error: 25, warning: 10, info: 5 };
const DOMAINS: MetricDomain[] = [
  'accessibility',
  'compatibility',
  'corporateSuitability',
  'contentCoverage',
  'performance',
  'originality',
];

/**
 * Validate a {@link DesignBlueprint} against the registry at the given profile
 * (plan §17). Deterministic and pure. SCHEMA-001 is a hard first gate: if the
 * blueprint is not schema-valid, only SCHEMA-001 findings are returned (the
 * other rules assume a well-formed structure).
 *
 * Scoring: each of the six metric domains starts at 100 and is deducted per
 * finding in that domain (error −25, warning −10, info −5), clamped to [0,100].
 * `score` is the rounded mean of the six domain metrics.
 */
export function validateComposition(
  blueprint: unknown,
  registry: ValidationRegistry,
  profile: ValidationProfile,
): ValidationResult {
  const parsed = DesignBlueprint.safeParse(blueprint);
  if (!parsed.success) {
    const findings: ValidationFinding[] = parsed.error.issues.map((issue) => ({
      ruleId: 'SCHEMA-001',
      severity: 'error' as const,
      path: issue.path.join('.') || '(root)',
      message: issue.message,
      remediation: 'Fix the blueprint so it conforms to the DesignBlueprint schema.',
      componentIds: [],
    }));
    return finalise(findings);
  }

  const bp = parsed.data;
  const findings: ValidationFinding[] = [];
  for (const rule of RULES) {
    const severity = resolveSeverity(rule, profile);
    for (const seed of rule.check(bp, registry)) {
      findings.push({ ...seed, severity });
    }
  }
  return finalise(findings);
}

function finalise(findings: ValidationFinding[]): ValidationResult {
  const metrics: Record<MetricDomain, number> = {
    accessibility: 100,
    compatibility: 100,
    corporateSuitability: 100,
    contentCoverage: 100,
    performance: 100,
    originality: 100,
  };
  for (const finding of findings) {
    const domain = domainForRule(finding.ruleId);
    metrics[domain] = Math.max(0, metrics[domain] - DEDUCTION[finding.severity]);
  }
  const score = Math.round(DOMAINS.reduce((sum, d) => sum + metrics[d], 0) / DOMAINS.length);
  const valid = findings.every((f) => f.severity !== 'error');
  return { valid, score, findings, metrics };
}

/** Map a rule id to the metric domain it deducts from. Kept explicit for auditability. */
function domainForRule(ruleId: string): MetricDomain {
  if (ruleId.startsWith('A11Y')) return 'accessibility';
  if (ruleId.startsWith('CONTENT')) return 'contentCoverage';
  if (ruleId.startsWith('PERF')) return 'performance';
  if (ruleId.startsWith('CORP') || ruleId.startsWith('THEME')) return 'corporateSuitability';
  if (ruleId.startsWith('ORIG')) return 'originality';
  // SCHEMA / REG / COMP / IA / MOTION → structural compatibility.
  return 'compatibility';
}

/** The rule ids this validator implements (for tooling / MCP surface). */
export const IMPLEMENTED_RULES = ['SCHEMA-001', ...RULES.map((r) => r.id)];
