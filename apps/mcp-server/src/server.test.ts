/**
 * Integration tests: drive the real server through the SDK.
 *
 * Behavioural tests use the SDK's in-memory transport (fast, no process). One
 * dedicated test spawns the real stdio server and asserts stdout carries ONLY
 * JSON-RPC frames while logs go to stderr — the classic stdio-MCP bug.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ComponentManifest, McpError } from '@enterprise-design/contracts';
import { createServer } from './server.js';
import { loadRegistryData } from './registry-data.js';
import { createLogger } from './logger.js';
import { SearchComponentResult, SearchComponentsOutput } from './schemas.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const serverEntry = path.join(here, 'index.ts');

const registry = loadRegistryData();

interface Harness {
  client: Client;
  logs: Record<string, unknown>[];
  close: () => Promise<void>;
}

async function makeHarness(): Promise<Harness> {
  const logs: Record<string, unknown>[] = [];
  const logger = createLogger({ write: (line) => logs.push(JSON.parse(line) as Record<string, unknown>) });
  const server = createServer(registry, logger);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test-client', version: '0.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return {
    client,
    logs,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

function textPayload(result: CallToolResult): unknown {
  const first = result.content[0];
  if (!first || first.type !== 'text') return undefined;
  return JSON.parse(first.text);
}

describe('mcp-server tools', () => {
  let h: Harness;
  beforeEach(async () => {
    h = await makeHarness();
  });
  afterEach(async () => {
    await h.close();
  });

  it('advertises both tools with read-only annotations and a title', async () => {
    const { tools } = await h.client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(['get_component', 'search_components']);
    for (const tool of tools) {
      expect(tool.annotations).toMatchObject({
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      });
      expect(typeof tool.annotations?.title).toBe('string');
      // Structured output schema is advertised.
      expect(tool.outputSchema).toBeTypeOf('object');
    }
  });

  it('get_component returns a contracts-valid manifest (structured + text fallback)', async () => {
    const result = (await h.client.callTool({ name: 'get_component', arguments: { componentId: 'comp.trend-chart' } })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const structured = ComponentManifest.parse(result.structuredContent);
    expect(structured.id).toBe('comp.trend-chart');
    // The text fallback carries the same manifest.
    expect(ComponentManifest.parse(textPayload(result)).id).toBe('comp.trend-chart');
  });

  it('get_component with an unknown id returns a structured UNKNOWN_COMPONENT error', async () => {
    const result = (await h.client.callTool({ name: 'get_component', arguments: { componentId: 'comp.nope' } })) as CallToolResult;
    expect(result.isError).toBe(true);
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('UNKNOWN_COMPONENT');
    expect(error.remediation.length).toBeGreaterThan(0);
    expect(error.requestId).toBeTruthy();
  });

  it('get_component with an empty id returns a structured INVALID_INPUT error', async () => {
    const result = (await h.client.callTool({ name: 'get_component', arguments: { componentId: '' } })) as CallToolResult;
    expect(result.isError).toBe(true);
    expect(McpError.parse(textPayload(result)).code).toBe('INVALID_INPUT');
  });

  it('search_components ranks comp.trend-chart for a time-series query', async () => {
    const result = (await h.client.callTool({ name: 'search_components', arguments: { query: 'time series line chart' } })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const out = SearchComponentsOutput.parse(result.structuredContent);
    expect(out.results.map((r) => r.id)).toContain('comp.trend-chart');
    // Every result validates against the contracts-derived result shape.
    for (const r of out.results) expect(() => SearchComponentResult.parse(r)).not.toThrow();
  });

  it('search_components applies hard facet filters', async () => {
    const result = (await h.client.callTool({ name: 'search_components', arguments: { query: 'chart', filters: { category: 'chart' } } })) as CallToolResult;
    const out = SearchComponentsOutput.parse(result.structuredContent);
    expect(out.results.length).toBeGreaterThan(0);
    expect(out.results.every((r) => r.facets.category === 'chart')).toBe(true);
  });

  it('search_components truncates to limit and reports the true total', async () => {
    const result = (await h.client.callTool({ name: 'search_components', arguments: { query: '', limit: 2 } })) as CallToolResult;
    const out = SearchComponentsOutput.parse(result.structuredContent);
    expect(out.results).toHaveLength(2);
    expect(out.totalMatched).toBe(registry.components.length);
    expect(out.note).toMatch(/Showing 2 of/);
  });

  it('search_components with no match returns empty results and a note, not an error', async () => {
    const result = (await h.client.callTool({ name: 'search_components', arguments: { query: 'zzqqxx-nonexistent-token' } })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const out = SearchComponentsOutput.parse(result.structuredContent);
    expect(out.results).toHaveLength(0);
    expect(out.totalMatched).toBe(0);
    expect(out.note).toBeTruthy();
  });

  it('search_components with an out-of-range limit returns a structured INVALID_INPUT error', async () => {
    const result = (await h.client.callTool({ name: 'search_components', arguments: { query: 'chart', limit: 0 } })) as CallToolResult;
    expect(result.isError).toBe(true);
    expect(McpError.parse(textPayload(result)).code).toBe('INVALID_INPUT');
  });

  it('stays responsive after malformed requests (unknown tool + wrong-typed arg)', async () => {
    // Unknown tool.
    await h.client.callTool({ name: 'no_such_tool', arguments: {} }).catch(() => undefined);
    // Wrong-typed argument (SDK rejects before the handler; server must not crash).
    await h.client.callTool({ name: 'get_component', arguments: { componentId: 123 } }).catch(() => undefined);
    // Server is still alive and correct.
    const ok = (await h.client.callTool({ name: 'get_component', arguments: { componentId: 'comp.kpi-tile' } })) as CallToolResult;
    expect(ComponentManifest.parse(ok.structuredContent).id).toBe('comp.kpi-tile');
  });

  it('audit logs are content-safe: operational metadata only, never the query text', async () => {
    const secret = 'peculiar-marker-query-9137';
    await h.client.callTool({ name: 'search_components', arguments: { query: secret } });
    const audits = h.logs.filter((l) => l.kind === 'audit');
    expect(audits.length).toBeGreaterThan(0);
    expect(audits.at(-1)).toMatchObject({ tool: 'search_components', status: 'ok' });
    expect(audits.at(-1)).toHaveProperty('durationMs');
    // The raw query must never appear anywhere in the logs.
    expect(JSON.stringify(h.logs)).not.toContain(secret);
  });
});

describe('stdio protocol hygiene', () => {
  it('writes only JSON-RPC frames to stdout and logs to stderr', async () => {
    const child = spawn(process.execPath, ['--import', 'tsx', serverEntry], {
      cwd: appRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (c: Buffer) => (stdout += c.toString()));
    child.stderr.on('data', (c: Buffer) => (stderr += c.toString()));

    const send = (msg: unknown): void => {
      child.stdin.write(JSON.stringify(msg) + '\n');
    };

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timed out; stdout=${stdout} stderr=${stderr}`)), 20000);
      child.stdout.on('data', () => {
        if (stdout.includes('"id":2')) {
          clearTimeout(timer);
          resolve();
        }
      });
      child.on('error', reject);
      send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'raw', version: '0' } } });
      send({ jsonrpc: '2.0', method: 'notifications/initialized' });
      send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'get_component', arguments: { componentId: 'comp.trend-chart' } } });
    });

    child.kill();

    // Every non-empty stdout line is a JSON-RPC frame — nothing else leaked.
    const stdoutLines = stdout.split('\n').filter((l) => l.trim().length > 0);
    expect(stdoutLines.length).toBeGreaterThan(0);
    for (const line of stdoutLines) {
      const parsed = JSON.parse(line) as { jsonrpc?: string };
      expect(parsed.jsonrpc).toBe('2.0');
    }
    // Logs went to stderr (content-safe audit records), never stdout.
    expect(stderr).toMatch(/"kind":"audit"/);
    expect(stdout).not.toContain('"kind":"audit"');
  }, 25000);
});
