/**
 * Structured error shaping — adapter-independent.
 *
 * Every failure the tools can surface is expressed as the contracts
 * {@link McpError} shape so the transport never has to throw. The adapter
 * turns one of these into an `isError` MCP tool result; the domain code that
 * produces it never touches the SDK.
 */
import { randomUUID } from 'node:crypto';
import type { McpError, McpErrorCode } from '@enterprise-design/contracts';

/** A tagged result: either the tool's payload, or a structured error to return as `isError`. */
export type ToolOutcome<T> = { ok: true; data: T } | { ok: false; error: McpError };

/** Fresh correlation id for one tool invocation, echoed back in any error. */
export function newRequestId(): string {
  return randomUUID();
}

/** Build a contracts-shaped {@link McpError}. `details`/`remediation` default to empty arrays. */
export function makeError(
  code: McpErrorCode,
  message: string,
  options: { requestId: string; details?: string[]; remediation?: string[] },
): McpError {
  return {
    code,
    message,
    details: options.details ?? [],
    remediation: options.remediation ?? [],
    requestId: options.requestId,
  };
}
