import { z } from 'zod';

/** Plan §7.5 ValidationFinding — one diagnostic emitted by a validator rule. */
export const ValidationFinding = z.object({
  ruleId: z.string(),
  severity: z.enum(['info', 'warning', 'error']),
  path: z.string(),
  message: z.string(),
  remediation: z.string(),
  componentIds: z.array(z.string()),
});
export type ValidationFinding = z.infer<typeof ValidationFinding>;

/** Plan §7.5 ValidationResult. `metrics` are per-domain 0–100 scores; `score` is their aggregate. */
export const ValidationResult = z.object({
  valid: z.boolean(),
  score: z.number(),
  findings: z.array(ValidationFinding),
  metrics: z.object({
    accessibility: z.number(),
    compatibility: z.number(),
    corporateSuitability: z.number(),
    contentCoverage: z.number(),
    performance: z.number(),
    originality: z.number(),
  }),
});
export type ValidationResult = z.infer<typeof ValidationResult>;
