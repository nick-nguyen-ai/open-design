/**
 * Self-verifying demo client — the "test the MCP server successfully" evidence.
 *
 * Spawns the real server over stdio, drives a full workflow through the
 * official SDK client, and asserts every guarantee the brief calls for:
 * both tools advertised read-only, a valid manifest by id, a structured
 * UNKNOWN_COMPONENT for a bogus id, ranked search containing comp.trend-chart,
 * facet filtering, and limit truncation with the true total. Prints a
 * PASS/FAIL summary and exits non-zero on any failure.
 *
 * Run: `corepack pnpm --filter mcp-server demo`
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ComponentManifest, McpError } from '@enterprise-design/contracts';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, 'index.ts');

interface Check {
  name: string;
  pass: boolean;
  detail: string;
}
const checks: Check[] = [];
function check(name: string, pass: boolean, detail = ''): void {
  checks.push({ name, pass, detail });
}

/** Parse the `content[].text` JSON fallback that every tool response carries. */
function textPayload(result: CallToolResult): unknown {
  const first = result.content[0];
  if (!first || first.type !== 'text') return undefined;
  return JSON.parse(first.text);
}

async function main(): Promise<void> {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['--import', 'tsx', serverEntry],
    cwd: path.resolve(here, '..'),
    stderr: 'pipe',
  });

  // Collect the server's stderr to demonstrate logging stays off stdout.
  let stderrText = '';
  transport.stderr?.on('data', (chunk: Buffer) => {
    stderrText += chunk.toString();
  });

  const client = new Client({ name: 'design-mcp-demo-client', version: '0.1.0' });
  await client.connect(transport);

  try {
    // 1. Tools advertised with read-only annotations.
    const { tools } = await client.listTools();
    const byName = new Map(tools.map((tool) => [tool.name, tool]));
    check('both tools advertised', byName.has('get_component') && byName.has('search_components'), tools.map((t) => t.name).join(', '));
    for (const name of ['get_component', 'search_components']) {
      const ann = byName.get(name)?.annotations;
      check(
        `${name} read-only annotations`,
        ann?.readOnlyHint === true &&
          ann?.destructiveHint === false &&
          ann?.idempotentHint === true &&
          ann?.openWorldHint === false &&
          typeof ann?.title === 'string',
        JSON.stringify(ann),
      );
    }

    // 2a. get_component with a real id → schema-valid ComponentManifest.
    const good = (await client.callTool({ name: 'get_component', arguments: { componentId: 'comp.trend-chart' } })) as CallToolResult;
    const goodParsed = ComponentManifest.safeParse(good.structuredContent);
    check('get_component(valid) not isError', good.isError !== true);
    check('get_component(valid) structuredContent is a valid ComponentManifest', goodParsed.success && goodParsed.data.id === 'comp.trend-chart', goodParsed.success ? goodParsed.data.id : goodParsed.error.message);
    const goodText = ComponentManifest.safeParse(textPayload(good));
    check('get_component(valid) text fallback matches manifest', goodText.success && goodText.data.id === 'comp.trend-chart');

    // 2b. get_component with a bogus id → structured UNKNOWN_COMPONENT error.
    const bogus = (await client.callTool({ name: 'get_component', arguments: { componentId: 'comp.__does_not_exist__' } })) as CallToolResult;
    const bogusErr = McpError.safeParse(textPayload(bogus));
    check('get_component(bogus) isError', bogus.isError === true);
    check('get_component(bogus) structured UNKNOWN_COMPONENT', bogusErr.success && bogusErr.data.code === 'UNKNOWN_COMPONENT' && bogusErr.data.remediation.length > 0, bogusErr.success ? bogusErr.data.code : bogusErr.error.message);

    // 3a. search "time series line chart" → comp.trend-chart is ranked.
    const search = (await client.callTool({ name: 'search_components', arguments: { query: 'time series line chart' } })) as CallToolResult;
    const searchOut = search.structuredContent as { results: { id: string }[]; totalMatched: number } | undefined;
    check('search(query) returns comp.trend-chart', !!searchOut?.results.some((r) => r.id === 'comp.trend-chart'), (searchOut?.results ?? []).map((r) => r.id).join(', '));

    // 3b. facet filter applied.
    const filtered = (await client.callTool({ name: 'search_components', arguments: { query: 'chart', filters: { category: 'chart' } } })) as CallToolResult;
    const filteredOut = filtered.structuredContent as { results: { id: string; facets: { category?: string } }[] } | undefined;
    const allChart = (filteredOut?.results ?? []).every((r) => r.facets.category === 'chart');
    check('search(filter category=chart) only returns chart components', (filteredOut?.results.length ?? 0) > 0 && allChart, (filteredOut?.results ?? []).map((r) => `${r.id}:${r.facets.category}`).join(', '));

    // 3c. limit truncation + true total.
    const limited = (await client.callTool({ name: 'search_components', arguments: { query: '', limit: 2 } })) as CallToolResult;
    const limitedOut = limited.structuredContent as { results: unknown[]; totalMatched: number; note?: string } | undefined;
    check('search(limit=2) truncates to 2 with true total', (limitedOut?.results.length ?? 0) === 2 && (limitedOut?.totalMatched ?? 0) > 2 && !!limitedOut?.note?.includes('Showing 2 of'), JSON.stringify({ n: limitedOut?.results.length, total: limitedOut?.totalMatched, note: limitedOut?.note }));

    // 4. Logging stayed on stderr and is content-safe (no raw query text).
    check('server logged audit records to stderr', /"kind":"audit"/.test(stderrText), `${stderrText.split('\n').filter(Boolean).length} stderr lines`);
    check('stderr audit log is content-safe (no raw query text)', !stderrText.includes('time series line chart'));
  } finally {
    await client.close();
  }

  // Report.
  const failures = checks.filter((c) => !c.pass);
  console.log('\n=== MCP server demo ===');
  for (const c of checks) {
    console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  (${c.detail})` : ''}`);
  }
  console.log(`\n${failures.length === 0 ? 'PASS' : 'FAIL'}: ${checks.length - failures.length}/${checks.length} checks passed`);
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error: unknown) => {
  console.error(`demo-client fatal: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  process.exit(1);
});
