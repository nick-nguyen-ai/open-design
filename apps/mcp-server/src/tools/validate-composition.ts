/**
 * `validate_composition` domain logic — adapter-independent (no SDK import).
 *
 * Validates a {@link DesignBlueprint} against the registry at the requested
 * profile via `@enterprise-design/validator`. A blueprint that FAILS design
 * rules is a SUCCESSFUL tool call: the findings come back in the result with
 * `valid: false`. Only a structurally malformed blueprint (rejected by the
 * advertised schema) is an `isError` `INVALID_INPUT`.
 *
 * Returns a structured {@link ToolOutcome}: the validation result on success,
 * or a contracts `INVALID_INPUT` when the blueprint is not schema-valid.
 */
import { validateComposition } from '@enterprise-design/validator';
import { ValidateCompositionInput, type ValidateCompositionOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';

export function validateCompositionTool(
  registry: RegistryData,
  rawInput: unknown,
): ToolOutcome<ValidateCompositionOutput> {
  const requestId = newRequestId();

  const parsed = ValidateCompositionInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for validate_composition.', {
        requestId,
        details: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: ['Provide a schema-valid DesignBlueprint under `blueprint` (see the tool input schema in tools/list).'],
      }),
    };
  }

  const { blueprint, validationProfile } = parsed.data;
  const result = validateComposition(blueprint, registry.domain, validationProfile);

  return { ok: true, data: { result } };
}
