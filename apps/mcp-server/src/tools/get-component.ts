/**
 * `get_component` domain logic — adapter-independent (no SDK import).
 *
 * Looks up one component manifest by exact id. Returns a structured
 * {@link ToolOutcome}: the manifest on success, or a contracts `McpError` the
 * adapter renders as an `isError` tool result. Never throws for expected
 * failures (bad input, unknown id).
 */
import type { ComponentManifest } from '@enterprise-design/contracts';
import { GetComponentInput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';

export function getComponent(registry: RegistryData, rawInput: unknown): ToolOutcome<ComponentManifest> {
  const requestId = newRequestId();

  const parsed = GetComponentInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for get_component.', {
        requestId,
        details: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: ["Provide a non-empty string 'componentId'."],
      }),
    };
  }

  const manifest = registry.componentById.get(parsed.data.componentId);
  if (!manifest) {
    return {
      ok: false,
      error: makeError('UNKNOWN_COMPONENT', `No component with id '${parsed.data.componentId}'.`, {
        requestId,
        remediation: ['Use search_components to find valid component ids.'],
      }),
    };
  }

  return { ok: true, data: manifest };
}
