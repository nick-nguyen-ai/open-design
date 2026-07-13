import type {
  ComponentManifest,
  DesignBlueprint,
  DesignGrammar,
  MotionSequence,
  ValidationFinding,
} from '@enterprise-design/contracts';

/** The slice of the compiled registry the validator reads. Passed as data — no filesystem access. */
export interface ValidationRegistry {
  components: ComponentManifest[];
  grammars: DesignGrammar[];
  motionSequences: MotionSequence[];
}

/** Validation strictness. Later profiles escalate warnings to errors (§17.3). */
export type ValidationProfile = 'draft' | 'corporate' | 'release';

export type Severity = ValidationFinding['severity'];

/** The metric domain a rule's findings deduct from (matches the six `ValidationResult.metrics` keys). */
export type MetricDomain =
  | 'accessibility'
  | 'compatibility'
  | 'corporateSuitability'
  | 'contentCoverage'
  | 'performance'
  | 'originality';

/** A finding without its resolved severity — the runner stamps severity from the profile. */
export type FindingSeed = Omit<ValidationFinding, 'severity'>;

export interface Rule {
  id: string;
  domain: MetricDomain;
  /** Natural severity before profile escalation. */
  baseSeverity: Severity;
  check(blueprint: DesignBlueprint, registry: ValidationRegistry): FindingSeed[];
}
