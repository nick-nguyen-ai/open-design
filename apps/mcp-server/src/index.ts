/**
 * Entrypoint: wire the read-only stdio MCP server and connect it.
 *
 * Startup does exactly three things: load + validate the compiled registry
 * (the server's only filesystem access), build the server/tools, and connect
 * the stdio transport. All diagnostics go to stderr — stdout is reserved for
 * MCP protocol frames.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { loadRegistryData } from './registry-data.js';
import { createLogger } from './logger.js';

async function main(): Promise<void> {
  const logger = createLogger();
  const registry = loadRegistryData();
  logger.info(`registry loaded: ${registry.components.length} components, ${registry.searchDocuments.length} documents`);

  const server = createServer(registry, logger);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('mcp-server ready on stdio');
}

main().catch((error: unknown) => {
  // Last-resort guard: report to stderr (never stdout) and exit non-zero.
  process.stderr.write(`fatal: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
