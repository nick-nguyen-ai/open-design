/**
 * SDK adapter — the ONLY module that imports `@modelcontextprotocol/sdk`.
 *
 * It owns transport/registration concerns: creating the `McpServer`,
 * registering the two tools with their tight advertised schemas + annotations,
 * and translating a domain {@link ToolOutcome} into an MCP `CallToolResult`
 * (structured content + a JSON text fallback, or an `isError` result carrying
 * the structured `McpError`). Domain logic lives in adapter-independent
 * modules; an SDK major upgrade should touch this file (plus the transport
 * import in `index.ts`) and nothing else.
 *
 * Error-contract invariant: EVERY `isError: true` result — whether produced by
 * our domain handlers or by the SDK's own pre-handler argument validation —
 * carries a JSON-serialized contracts {@link McpError} in `content[0].text`.
 * The SDK, left alone, returns its argument-validation failures as a plain
 * string; {@link installStructuredErrorWrapper} intercepts that single choke
 * point so a client can always `JSON.parse(result.content[0].text)` into an
 * `McpError`.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import { ComponentManifest } from '@enterprise-design/contracts';
import type { McpErrorCode } from '@enterprise-design/contracts';
import type { RegistryData } from './registry-data.js';
import type { Logger } from './logger.js';
import { makeError, newRequestId, type ToolOutcome } from './errors.js';
import {
  ComposeDesignInput,
  ComposeDesignOutput,
  GetComponentInput,
  SearchComponentsInput,
  SearchComponentsOutput,
  ValidateCompositionInput,
  ValidateCompositionOutput,
} from './schemas.js';
import { getComponent } from './tools/get-component.js';
import { searchComponents } from './tools/search-components.js';
import { composeDesignTool } from './tools/compose-design.js';
import { validateCompositionTool } from './tools/validate-composition.js';

/** Read-only posture, identical for both tools (plus a per-tool `title`). */
const READ_ONLY_ANNOTATIONS: Omit<ToolAnnotations, 'title'> = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function toCallToolResult<T>(outcome: ToolOutcome<T>): CallToolResult {
  if (!outcome.ok) {
    return {
      content: [{ type: 'text', text: JSON.stringify(outcome.error) }],
      isError: true,
    };
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(outcome.data) }],
    structuredContent: outcome.data as { [key: string]: unknown },
  };
}

/**
 * Re-wrap the SDK's own tool-error path so it emits a structured `McpError`.
 *
 * The SDK catches argument-validation failures (and unknown-tool / output
 * failures) inside its CallTool handler and turns them into an `isError`
 * result via `McpServer.createToolError(message)`, whose body is a bare
 * string. We replace that method on the instance so the body is instead a
 * contracts `McpError`: a schema/type/bounds violation the SDK rejects before
 * our handler runs is reported as `INVALID_INPUT`, anything else as
 * `INTERNAL_ERROR`. This keeps the "every isError is a parseable McpError"
 * invariant without loosening the advertised schema.
 */
function installStructuredErrorWrapper(server: McpServer): void {
  const createStructuredError = (message: string): CallToolResult => {
    const isInputError = /input validation error/i.test(message);
    const code: McpErrorCode = isInputError ? 'INVALID_INPUT' : 'INTERNAL_ERROR';
    const error = makeError(code, isInputError ? 'Invalid tool arguments.' : 'Tool invocation failed.', {
      requestId: newRequestId(),
      details: [message],
      remediation: isInputError
        ? ['Check the tool input schema: required fields, correct types, and value bounds (see tools/list).']
        : [],
    });
    return { content: [{ type: 'text', text: JSON.stringify(error) }], isError: true };
  };
  (server as unknown as { createToolError: (message: string) => CallToolResult }).createToolError =
    createStructuredError;
}

export function createServer(registry: RegistryData, logger: Logger): McpServer {
  const server = new McpServer(
    { name: 'design-mcp-server', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );
  installStructuredErrorWrapper(server);

  server.registerTool(
    'get_component',
    {
      title: 'Get component manifest',
      description:
        'Returns the full design manifest for one component identified by its exact id (category, intents, audiences, accessibility, performance, provenance, approval). If you only have a description or intent, use search_components to find the id first.',
      inputSchema: GetComponentInput.shape,
      outputSchema: ComponentManifest.shape,
      annotations: { title: 'Get component manifest', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = getComponent(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'get_component', status: 'ok', durationMs, count: 1 });
      } else {
        logger.audit({ tool: 'get_component', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'search_components',
    {
      title: 'Search components',
      description:
        'Searches the component catalogue by natural-language intent plus optional hard facet filters, returning ranked components with a relevance score and the terms that matched. Searches components by default. Use get_component to fetch a full manifest by id.',
      inputSchema: SearchComponentsInput.shape,
      outputSchema: SearchComponentsOutput.shape,
      annotations: { title: 'Search components', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = searchComponents(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({
          tool: 'search_components',
          status: 'ok',
          durationMs,
          count: outcome.data.results.length,
        });
      } else {
        logger.audit({ tool: 'search_components', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'compose_design',
    {
      title: 'Compose design blueprint',
      description:
        'Generates a deterministic DesignBlueprint from a DesignContext: the third step of the analyse → search → compose → validate loop. Given the surface, audience, business intent and available content inventory, it selects real registry components, lays out routes/sections, picks one signature motion sequence, and returns three structural alternatives. It never invents content — anything it cannot map to an approved component is reported in the blueprint\'s implementationNotes/rejected candidates rather than fabricated. Pass selectedComponentIds to constrain the candidate pool. Feed the returned blueprint to validate_composition before shipping.',
      inputSchema: ComposeDesignInput.shape,
      outputSchema: ComposeDesignOutput.shape,
      annotations: { title: 'Compose design blueprint', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = composeDesignTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        const sections = outcome.data.blueprint.routes.reduce((n, route) => n + route.sections.length, 0);
        logger.audit({ tool: 'compose_design', status: 'ok', durationMs, count: sections });
      } else {
        logger.audit({ tool: 'compose_design', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'validate_composition',
    {
      title: 'Validate design blueprint',
      description:
        'Validates a DesignBlueprint against the registry and design rules (accessibility, compatibility, corporate suitability, content coverage, performance, originality): the final step of the analyse → search → compose → validate loop. Returns a structured result — valid flag, aggregate score, per-domain metrics, and a list of findings each naming a rule id, path and remediation. A blueprint that fails the rules is a SUCCESSFUL call that returns findings with valid=false (NOT an error); only a structurally malformed blueprint is rejected as invalid input. Choose the profile by rigour: draft, corporate (default), or release.',
      inputSchema: ValidateCompositionInput.shape,
      outputSchema: ValidateCompositionOutput.shape,
      annotations: { title: 'Validate design blueprint', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = validateCompositionTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({
          tool: 'validate_composition',
          status: 'ok',
          durationMs,
          count: outcome.data.result.findings.length,
        });
      } else {
        logger.audit({ tool: 'validate_composition', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  return server;
}
