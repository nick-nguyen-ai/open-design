/**
 * `compose_design` domain logic — adapter-independent (no SDK import).
 *
 * Deterministically composes a {@link DesignBlueprint} from a DesignContext and
 * the compiled registry via `@enterprise-design/composition`. The engine only
 * places real registry components and never invents content: anything it cannot
 * map surfaces in the blueprint's `implementationNotes`/rejected candidates.
 *
 * Returns a structured {@link ToolOutcome}: the blueprint on success, a
 * contracts `INVALID_INPUT` for a malformed context, or `UNKNOWN_COMPONENT`
 * when `selectedComponentIds` references an id not in the catalogue. Never
 * throws for expected failures.
 */
import { composeDesign } from '@enterprise-design/composition';
import { ComposeDesignInput, type ComposeDesignOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';

export function composeDesignTool(registry: RegistryData, rawInput: unknown): ToolOutcome<ComposeDesignOutput> {
  const requestId = newRequestId();

  const parsed = ComposeDesignInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for compose_design.', {
        requestId,
        details: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: ['Provide a full DesignContext under `context` (see the tool input schema in tools/list).'],
      }),
    };
  }

  const { context, selectedComponentIds, alternativeMode } = parsed.data;

  if (selectedComponentIds) {
    const unknown = selectedComponentIds.filter((id) => !registry.componentById.has(id));
    if (unknown.length > 0) {
      return {
        ok: false,
        error: makeError('UNKNOWN_COMPONENT', `Unknown component id(s): ${unknown.join(', ')}.`, {
          requestId,
          details: unknown,
          remediation: ['Use search_components to find valid component ids, or omit selectedComponentIds.'],
        }),
      };
    }
  }

  const options = selectedComponentIds ? { alternativeMode, selectedComponentIds } : { alternativeMode };
  const blueprint = composeDesign(context, registry.domain, options);

  return { ok: true, data: { blueprint } };
}
