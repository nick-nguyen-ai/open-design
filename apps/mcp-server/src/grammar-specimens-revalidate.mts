/**
 * Re-validate the three grammar-specimen fills through the real MCP server
 * (stdio client, same code path as sample-outcome.ts). TEMPORARY evidence
 * script for docs/superpowers/specs/grammar-specimens/.
 * Run: cd apps/mcp-server && node --import tsx src/grammar-specimens-revalidate.mts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, 'index.ts');
const repo = path.resolve(here, '..', '..', '..');

const RUNS = [
  { grammar: 'precision-grid', handle: 'db-model-monitoring-cockpit' },
  { grammar: 'technical-blueprint', handle: 'deck-cloud-migration' },
  { grammar: 'monumental-type', handle: 'deck-product-launch' },
];

interface ValidatePayload {
  valid?: boolean;
  findings?: unknown[];
}

function textPayload(result: CallToolResult): ValidatePayload | undefined {
  const first = result.content[0];
  if (!first || first.type !== 'text') return undefined;
  return JSON.parse(first.text) as ValidatePayload;
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['--import', 'tsx', serverEntry],
  cwd: path.resolve(here, '..'),
  stderr: 'pipe',
});
const client = new Client({ name: 'grammar-specimen-revalidate', version: '0.1.0' });
await client.connect(transport);

let failed = false;
for (const run of RUNS) {
  const fillPath = path.join(repo, 'docs', 'superpowers', 'specs', 'grammar-specimens', run.grammar, 'fill.json');
  const fill = JSON.parse(readFileSync(fillPath, 'utf8').replace(/^\uFEFF/, ''));
  const result = (await client.callTool({
    name: 'validate_fill',
    arguments: { worldTemplateId: run.handle, fill },
  })) as CallToolResult;
  const payload = textPayload(result);
  const valid = payload?.valid === true;
  const findings = payload?.findings?.length ?? 'n/a';
  console.log(`${run.grammar} (${run.handle}): valid=${payload?.valid} findings=${findings}`);
  if (!valid) {
    failed = true;
    console.log(JSON.stringify(payload?.findings ?? payload, null, 2).slice(0, 2000));
  }
}
await client.close();
process.exit(failed ? 1 : 0);
