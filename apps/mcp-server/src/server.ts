/**
 * SDK adapter — the ONLY module that imports `@modelcontextprotocol/sdk`.
 *
 * It owns transport/registration concerns: creating the `McpServer`,
 * registering the two tools with their advertised schemas + annotations, and
 * translating a domain {@link ToolOutcome} into an MCP `CallToolResult`
 * (structured content + a JSON text fallback, or an `isError` result carrying
 * the structured `McpError`). Domain logic lives in adapter-independent
 * modules; an SDK major upgrade should touch this file and nothing else.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import { ComponentManifest } from '@enterprise-design/contracts';
import type { RegistryData } from './registry-data.js';
import type { Logger } from './logger.js';
import type { ToolOutcome } from './errors.js';
import {
  SearchComponentsOutput,
  getComponentInputShape,
  searchComponentsInputShape,
} from './schemas.js';
import { getComponent } from './tools/get-component.js';
import { searchComponents } from './tools/search-components.js';

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

export function createServer(registry: RegistryData, logger: Logger): McpServer {
  const server = new McpServer(
    { name: 'design-mcp-server', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get component manifest',
      description:
        'Returns the full design manifest for one component identified by its exact id (category, intents, audiences, accessibility, performance, provenance, approval). If you only have a description or intent, use search_components to find the id first.',
      inputSchema: getComponentInputShape,
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
      inputSchema: searchComponentsInputShape,
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

  return server;
}
