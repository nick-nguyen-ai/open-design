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
import {
  ComponentManifest,
  DesignBlueprint,
  McpError,
  ValidationResult,
  type DesignContext,
} from '@enterprise-design/contracts';
import { createServer } from './server.js';
import { loadRegistryData } from './registry-data.js';
import { createLogger } from './logger.js';
import { ComposeSlideDeckOutput, SearchComponentResult, SearchComponentsOutput, ValidateFillOutput } from './schemas.js';
import { quarterFill } from '../../../experiences/slide-decks/deck-quarterly-business-review/content.js';

/** A slide-deck DesignContext-lite for compose_slide_deck. */
function deckContext(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    surface: 'slide-deck',
    audience: ['executive', 'business'],
    businessIntent: ['review-quarterly-performance'],
    corporateSuitability: 'restricted',
    motionPreference: 1,
    ...overrides,
  };
}

/** A realistic executive model-monitoring DesignContext. */
function makeContext(overrides: Partial<DesignContext> = {}): DesignContext {
  return {
    requestId: 'test-compose',
    surface: 'dashboard',
    businessIntent: ['monitor-risk', 'communicate-performance'],
    audience: ['executive'],
    contentSummary: 'Executive overview of production model health and drift.',
    availableContent: {
      headings: ['Model health', 'Drift trend', 'Open risks'],
      narrativeSections: 1,
      kpis: 4,
      tables: 1,
      timeSeries: 2,
      categories: 3,
      processes: 1,
      entities: 2,
      decisions: 1,
      risks: 3,
      milestones: 0,
      codeBlocks: 0,
      citations: 0,
      mediaAssets: 0,
    },
    desiredTone: ['calm'],
    density: 'medium',
    motionPreference: 2,
    themeMode: 'light',
    corporateSuitability: 'standard',
    technicalConstraints: {
      framework: 'react',
      buildTool: 'vite',
      styling: 'tailwind',
      externalRuntimeNetworkAllowed: false,
      approvedDependencies: [],
      prohibitedDependencies: [],
      targetBrowsers: ['chrome', 'edge'],
      ssrRequired: false,
      staticExportRequired: true,
    },
    accessibilityRequirements: {
      target: 'WCAG-2.2-AA',
      reducedMotionRequired: true,
      keyboardRequired: true,
      screenReaderRequired: true,
      highContrastRequired: false,
    },
    requiredCapabilities: [],
    prohibitedCapabilities: [],
    ...overrides,
  };
}

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

  it('advertises all tools with read-only annotations and a title', async () => {
    const { tools } = await h.client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      'compose_design',
      'compose_slide_deck',
      'get_component',
      'search_components',
      'validate_composition',
      'validate_fill',
    ]);
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
    const result = (await h.client.callTool({ name: 'search_components', arguments: { query: 'time series line chart', limit: 2 } })) as CallToolResult;
    const out = SearchComponentsOutput.parse(result.structuredContent);
    expect(out.results).toHaveLength(2);
    expect(out.totalMatched).toBeGreaterThan(2);
    expect(out.note).toMatch(/Showing 2 of \d+/);
  });

  it('search_components with no match returns empty results and a note, not an error', async () => {
    const result = (await h.client.callTool({ name: 'search_components', arguments: { query: 'zzqqxx-nonexistent-token' } })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const out = SearchComponentsOutput.parse(result.structuredContent);
    expect(out.results).toHaveLength(0);
    expect(out.totalMatched).toBe(0);
    expect(out.note).toBeTruthy();
  });

  // The error-contract invariant: EVERY invalid input returns isError with a
  // parseable, structured McpError(INVALID_INPUT) — whether the SDK rejects the
  // arguments before the handler (type violations) or the domain layer does
  // (bounds). No path leaks a bare, non-JSON string.
  it.each([
    ['get_component wrong-typed id', 'get_component', { componentId: 123 }],
    ['get_component empty id', 'get_component', { componentId: '' }],
    ['search_components out-of-range limit', 'search_components', { query: 'chart', limit: 0 }],
    ['search_components wrong-typed limit', 'search_components', { query: 'chart', limit: '10' }],
    ['search_components empty query', 'search_components', { query: '' }],
  ])('invalid input (%s) returns a parseable structured INVALID_INPUT', async (_label, name, args) => {
    const result = (await h.client.callTool({ name, arguments: args })) as CallToolResult;
    expect(result.isError).toBe(true);
    // A client doing JSON.parse(content[0].text) must get a valid McpError.
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.requestId).toBeTruthy();
  });

  it('every isError result (including unknown tool) carries a parseable McpError, and the server stays responsive', async () => {
    const unknown = (await h.client.callTool({ name: 'no_such_tool', arguments: {} })) as CallToolResult;
    expect(unknown.isError).toBe(true);
    expect(() => McpError.parse(textPayload(unknown))).not.toThrow();
    // Server is still alive and correct after the malformed traffic above.
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

  // === compose_design + validate_composition: the full loop (Task 22) ===

  async function compose(args: Record<string, unknown>): Promise<CallToolResult> {
    return (await h.client.callTool({ name: 'compose_design', arguments: args })) as CallToolResult;
  }
  async function validate(args: Record<string, unknown>): Promise<CallToolResult> {
    return (await h.client.callTool({ name: 'validate_composition', arguments: args })) as CallToolResult;
  }

  it('compose_design returns a schema-valid blueprint with real ids, one signature, non-empty evidence', async () => {
    const result = await compose({ context: makeContext(), alternativeMode: 'recommended' });
    expect(result.isError).not.toBe(true);
    const bp = DesignBlueprint.parse((result.structuredContent as { blueprint: unknown }).blueprint);
    const placements = bp.routes.flatMap((r) => r.sections.flatMap((s) => s.componentPlacements));
    expect(placements.length).toBeGreaterThan(0);
    const known = new Set(registry.components.map((c) => c.id));
    expect(placements.every((p) => known.has(p.componentId))).toBe(true);
    const signatures = bp.routes.flatMap((r) => r.sections).filter((s) => s.motionSequence).length;
    expect(signatures).toBe(1);
    expect(bp.evidence.length).toBeGreaterThan(0);
  });

  it('validate_composition marks a freshly composed blueprint valid at corporate', async () => {
    const composed = await compose({ context: makeContext() });
    const bp = DesignBlueprint.parse((composed.structuredContent as { blueprint: unknown }).blueprint);
    const result = await validate({ blueprint: bp, validationProfile: 'corporate' });
    expect(result.isError).not.toBe(true);
    const res = ValidationResult.parse((result.structuredContent as { result: unknown }).result);
    expect(res.valid).toBe(true);
  });

  it('validate_composition on a tampered blueprint is a successful call reporting THEME-001 + REG-001, valid=false', async () => {
    const composed = await compose({ context: makeContext() });
    const bp = DesignBlueprint.parse((composed.structuredContent as { blueprint: unknown }).blueprint);
    bp.tokens.colour = { '--surface-raised': '#ff0000' };
    bp.routes[0]!.sections[0]!.componentPlacements[0]!.componentId = 'comp.does-not-exist';
    const result = await validate({ blueprint: bp, validationProfile: 'corporate' });
    expect(result.isError).not.toBe(true); // failing validation is a SUCCESSFUL call
    const res = ValidationResult.parse((result.structuredContent as { result: unknown }).result);
    const ruleIds = new Set(res.findings.map((f) => f.ruleId));
    expect(ruleIds).toContain('THEME-001');
    expect(ruleIds).toContain('REG-001');
    expect(res.valid).toBe(false);
  });

  it('compose_design slide-deck expressive vs conservative are structurally different', async () => {
    const expr = await compose({ context: makeContext({ surface: 'slide-deck', motionPreference: 3 }), alternativeMode: 'expressive' });
    const cons = await compose({ context: makeContext({ surface: 'slide-deck', motionPreference: 3 }), alternativeMode: 'conservative' });
    const exprBp = DesignBlueprint.parse((expr.structuredContent as { blueprint: unknown }).blueprint);
    const consBp = DesignBlueprint.parse((cons.structuredContent as { blueprint: unknown }).blueprint);
    expect(exprBp.blueprintId).not.toBe(consBp.blueprintId);
    expect(exprBp.motionLevel).toBeGreaterThanOrEqual(consBp.motionLevel);
    for (const alt of exprBp.alternatives.filter((a) => a.mode !== 'recommended')) {
      expect(alt.differenceSummary.length).toBeGreaterThan(0);
      expect(alt.differenceSummary.join(' ').toLowerCase()).not.toContain('theme');
    }
  });

  it('compose_design with a schema-garbage context returns a structured INVALID_INPUT', async () => {
    const result = await compose({ context: { nonsense: true } });
    expect(result.isError).toBe(true);
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.requestId).toBeTruthy();
  });

  it('compose_design with an unknown selectedComponentId returns a structured UNKNOWN_COMPONENT', async () => {
    const result = await compose({ context: makeContext(), selectedComponentIds: ['comp.__ghost__'] });
    expect(result.isError).toBe(true);
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('UNKNOWN_COMPONENT');
    expect(error.remediation.length).toBeGreaterThan(0);
  });

  it('validate_composition with a structurally malformed blueprint returns a structured INVALID_INPUT', async () => {
    const result = await validate({ blueprint: { schemaVersion: '1.0' }, validationProfile: 'corporate' });
    expect(result.isError).toBe(true);
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('INVALID_INPUT');
  });

  // === compose_slide_deck + validate_fill: the world-template loop (Task 29) ===

  async function composeDeck(args: Record<string, unknown>): Promise<CallToolResult> {
    return (await h.client.callTool({ name: 'compose_slide_deck', arguments: args })) as CallToolResult;
  }
  async function validateFill(args: Record<string, unknown>): Promise<CallToolResult> {
    return (await h.client.callTool({ name: 'validate_fill', arguments: args })) as CallToolResult;
  }

  it('compose_slide_deck selects deck-cloud-migration for a technical migration brief', async () => {
    const result = await composeDeck({
      context: deckContext({ audience: ['technical', 'risk-and-governance'], businessIntent: ['plan-cloud-migration'], corporateSuitability: 'standard', motionPreference: 2 }),
      contentBrief: 'Explain the estate migration and the cutover-night sequence for platform engineering.',
    });
    expect(result.isError).not.toBe(true);
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.experienceId).toBe('deck-cloud-migration');
    expect(out.worldTemplateId).toBe('cutover');
    expect(out.evidence.length).toBeGreaterThan(0);
    expect(out.fillSkeleton.slideKinds.length).toBeGreaterThan(0);
    expect(out.fillSkeleton.craftGuarantees.length).toBeGreaterThan(0);
    // Every slot carries a non-empty, descriptor-drawn example.
    for (const kind of out.fillSkeleton.slideKinds) {
      for (const slot of kind.slots) expect(slot.example.length).toBeGreaterThan(0);
    }
  });

  it('compose_slide_deck selects deck-quarterly-business-review for a conventional business brief', async () => {
    const result = await composeDeck({
      context: deckContext(),
      contentBrief: 'Quarterly business review of revenue, pipeline, and next-quarter priorities for the board.',
    });
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.experienceId).toBe('deck-quarterly-business-review');
    expect(out.worldTemplateId).toBe('quarter');
  });

  it('compose_slide_deck honours the styleHint hard filter', async () => {
    // An executive/business audience would normally pick the conventional Quarter,
    // but an art-directed styleHint forces the Cutover.
    const result = await composeDeck({ context: deckContext({ styleHint: 'art-directed' }), contentBrief: 'A deck.' });
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.worldTemplateId).toBe('cutover');
  });

  it('compose_slide_deck with a malformed context returns a structured INVALID_INPUT', async () => {
    const result = await composeDeck({ context: { surface: 'dashboard' }, contentBrief: 'x' });
    expect(result.isError).toBe(true);
    expect(McpError.parse(textPayload(result)).code).toBe('INVALID_INPUT');
  });

  it('validate_fill marks the shipped Quarter instance fill valid=true with no findings', async () => {
    const result = await validateFill({ worldTemplateId: 'quarter', fill: quarterFill });
    expect(result.isError).not.toBe(true);
    const out = ValidateFillOutput.parse(result.structuredContent);
    expect(out.findings).toEqual([]);
    expect(out.valid).toBe(true);
  });

  it('validate_fill accepts the experienceId as the template identifier too', async () => {
    const result = await validateFill({ worldTemplateId: 'deck-quarterly-business-review', fill: quarterFill });
    expect(ValidateFillOutput.parse(result.structuredContent).valid).toBe(true);
  });

  it('validate_fill flags a tampered fill (anomaly removed + oversize headline) with precise findings', async () => {
    const tampered = structuredClone(quarterFill) as typeof quarterFill;
    // Remove the anomaly: no KPI is off-track anymore.
    tampered.kpis = tampered.kpis.map((k) => ({ ...k, status: 'on-track' as const }));
    // Oversize headline: summary.lead cap is 110.
    tampered.summary.lead = 'x'.repeat(200);
    const result = await validateFill({ worldTemplateId: 'quarter', fill: tampered });
    expect(result.isError).not.toBe(true); // a bad fill is a successful call
    const out = ValidateFillOutput.parse(result.structuredContent);
    expect(out.valid).toBe(false);
    const craft = out.findings.find((f) => f.rule === 'craft' && f.path === 'kpis');
    expect(craft?.message).toMatch(/exactly-one at "kpis" where status="off-track"/);
    const oversize = out.findings.find((f) => f.rule === 'maxChars' && f.path === 'summary.lead');
    expect(oversize).toBeTruthy();
    expect(oversize?.guidance).toBeTruthy();
  });

  it('validate_fill flags an emptied deck.notice via the required-nonempty craft rule', async () => {
    const tampered = structuredClone(quarterFill) as typeof quarterFill;
    tampered.deck.notice = '   ';
    const result = await validateFill({ worldTemplateId: 'quarter', fill: tampered });
    expect(result.isError).not.toBe(true); // a bad fill is a successful call
    const out = ValidateFillOutput.parse(result.structuredContent);
    expect(out.valid).toBe(false);
    const craft = out.findings.find((f) => f.rule === 'craft' && f.path === 'deck.notice');
    expect(craft?.message).toMatch(/required-nonempty at "deck\.notice"/);
  });

  it('validate_fill on an unknown template returns a structured UNKNOWN_TEMPLATE', async () => {
    const result = await validateFill({ worldTemplateId: 'no-such-template', fill: {} });
    expect(result.isError).toBe(true);
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('UNKNOWN_TEMPLATE');
    expect(error.remediation.length).toBeGreaterThan(0);
  });

  it('validate_fill with a missing worldTemplateId returns a structured INVALID_INPUT', async () => {
    const result = await validateFill({ fill: {} });
    expect(result.isError).toBe(true);
    expect(McpError.parse(textPayload(result)).code).toBe('INVALID_INPUT');
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
