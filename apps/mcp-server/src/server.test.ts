/**
 * Integration tests: drive the real server through the SDK.
 *
 * Behavioural tests use the SDK's in-memory transport (fast, no process). One
 * dedicated test spawns the real stdio server and asserts stdout carries ONLY
 * JSON-RPC frames while logs go to stderr — the classic stdio-MCP bug.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
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
import {
  PART_SOURCE_URI_TEMPLATE,
  RENDER_FILE_URI_TEMPLATE,
  TEMPLATE_SOURCE_URI_TEMPLATE,
} from './resources.js';
import { loadRegistryData } from './registry-data.js';
import { createLogger } from './logger.js';
import { listRenderFiles, MAX_RENDERS, readRenderFile, renderFs } from './render-store.js';
import {
  ComposeSlideDeckOutput,
  RenderExperienceOutput,
  SearchComponentResult,
  SearchComponentsOutput,
  ValidateFillOutput,
} from './schemas.js';
import { quarterFill } from '../../../experiences/slide-decks/deck-quarterly-business-review/content.js';
import { cockpitFill } from '../../../experiences/dashboards/db-model-monitoring-cockpit/content.js';

/**
 * The longest plain-ASCII string value in a fill - a marker that survives
 * minification verbatim (string literal contents are preserved) and that no
 * other fill in this repo carries. Restricted to characters a minifier never
 * has to escape, so the search is a straight substring match.
 */
function fillMarker(fill: unknown): string {
  let best = '';
  const visit = (node: unknown): void => {
    if (typeof node === 'string') {
      if (node.length > best.length && /^[A-Za-z0-9 ,.:%()-]+$/.test(node)) best = node;
    } else if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === 'object') Object.values(node).forEach(visit);
  };
  visit(fill);
  if (best.length < 20) throw new Error('no usable fill marker found');
  return best;
}

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

/** The first content block of a resources/read result, as text (fails if it came back as a blob). */
function resourceText(read: { contents: Array<{ text?: string; blob?: string }> }): string {
  const first = read.contents[0];
  if (!first || typeof first.text !== 'string') throw new Error('resource did not return text content');
  return first.text;
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
      'compose_dashboard',
      'compose_design',
      'compose_explainer',
      'compose_personal_page',
      'compose_project_page',
      'compose_slide_deck',
      'get_component',
      'get_part_reference',
      'render_experience',
      'search_components',
      'validate_composition',
      'validate_fill',
    ]);
    for (const tool of tools) {
      // render_experience is the ONE writing tool: it builds a bundle into
      // render-out/, so it is neither read-only nor idempotent.
      expect(tool.annotations).toMatchObject(
        tool.name === 'render_experience'
          ? { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false }
          : { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      );
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
    expect(out.fillSkeleton.sections.length).toBeGreaterThan(0);
    expect(out.fillSkeleton.craftGuarantees.length).toBeGreaterThan(0);
    // Every slot carries a non-empty, descriptor-drawn example.
    for (const kind of out.fillSkeleton.sections) {
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
    // An executive/business restricted brief would normally pick the conventional
    // Quarter, but an art-directed styleHint excludes it and forces the Cutover
    // (the brief's cloud-migration intent gives the art-directed pick genuine fit).
    const result = await composeDeck({
      context: deckContext({ styleHint: 'art-directed' }),
      contentBrief: 'Our cloud migration cutover plan and target-state architecture.',
    });
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

  it('compose_slide_deck returns winner-first alternatives and honours pinTemplateId', async () => {
    const args = {
      context: {
        surface: 'slide-deck',
        audience: ['technical', 'mixed'],
        businessIntent: ['internal-enablement'],
        corporateSuitability: 'standard',
        motionPreference: 2,
      },
      contentBrief: 'Internal walkthrough of our design system tooling for engineers and PMs.',
    };
    const first = (await h.client.callTool({ name: 'compose_slide_deck', arguments: args })) as CallToolResult;
    expect(first.isError).not.toBe(true);
    const out = ComposeSlideDeckOutput.parse(first.structuredContent);
    expect(out.alternatives.length).toBeGreaterThan(0);
    expect(out.alternatives.length).toBeLessThanOrEqual(3);
    expect(out.alternatives[0]?.worldTemplateId).toBe(out.worldTemplateId);
    for (const alt of out.alternatives) expect(alt.score).toBeGreaterThan(0);

    // Pick a NON-winning alternative (when one exists) and pin it.
    const other = out.alternatives.find((a) => a.worldTemplateId !== out.worldTemplateId);
    if (other) {
      const pinned = (await h.client.callTool({
        name: 'compose_slide_deck',
        arguments: { ...args, context: { ...args.context, pinTemplateId: other.worldTemplateId } },
      })) as CallToolResult;
      expect(pinned.isError).not.toBe(true);
      const pinnedOut = ComposeSlideDeckOutput.parse(pinned.structuredContent);
      expect(pinnedOut.worldTemplateId).toBe(other.worldTemplateId);
      expect(pinnedOut.rationale).toContain('Pinned');
    }
  });

  it('validate_fill advertises fill as "type":"object" on the wire (stringified-fill regression)', async () => {
    // z.unknown() emits a property with NO "type", and at least one client
    // transport stringified the whole fill object because of it. The record
    // schema must advertise an object type so SDKs pass the object through.
    const { tools } = await h.client.listTools();
    const tool = tools.find((t) => t.name === 'validate_fill');
    expect(tool).toBeDefined();
    const fillSchema = (tool?.inputSchema as { properties?: Record<string, { type?: unknown }> }).properties?.fill;
    expect(fillSchema?.type).toBe('object');
  });

  it('validate_fill rejects a stringified fill with INVALID_INPUT instead of validating garbage', async () => {
    const result = await validateFill({ worldTemplateId: 'quarter', fill: '{"deck":{}}' });
    expect(result.isError).toBe(true);
    expect(McpError.parse(textPayload(result)).code).toBe('INVALID_INPUT');
  });

  // === Four per-surface compose tools (Task 4) ===
  // Post dashboard pilot (Task 7): the registry publishes templates for
  // slide-deck AND dashboard (the 'cockpit'); the remaining three surfaces are
  // live tools with an (as yet) empty pool.

  const NEW_SURFACE_TOOLS = [
    ['compose_dashboard', 'dashboard'],
    ['compose_project_page', 'project-page'],
    ['compose_personal_page', 'personal-page'],
    ['compose_explainer', 'technical-explainer'],
  ] as const;

  /** The surfaces that still have NO live template published (dashboard + technical-explainer + project-page + personal-page now do). */
  const LIVE_SURFACES: readonly string[] = ['dashboard', 'technical-explainer', 'project-page', 'personal-page'];
  const EMPTY_SURFACE_TOOLS = NEW_SURFACE_TOOLS.filter(([, surface]) => !LIVE_SURFACES.includes(surface));

  /** A surface-lite context for a new-surface compose tool (mirrors deckContext). */
  function surfaceContextArgs(surface: string, overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      surface,
      audience: ['technical', 'business'],
      businessIntent: ['explain-architecture'],
      corporateSuitability: 'standard',
      motionPreference: 1,
      ...overrides,
    };
  }

  it.each(NEW_SURFACE_TOOLS)('%s is advertised in tools/list', async (name) => {
    const { tools } = await h.client.listTools();
    expect(tools.map((t) => t.name)).toContain(name);
  });

  it.each(NEW_SURFACE_TOOLS)('%s rejects a context with the wrong surface literal as INVALID_INPUT', async (name) => {
    // A slide-deck literal on any non-deck tool violates its fixed surface literal.
    const result = (await h.client.callTool({
      name,
      arguments: { context: surfaceContextArgs('slide-deck'), contentBrief: 'x' },
    })) as CallToolResult;
    expect(result.isError).toBe(true);
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.requestId).toBeTruthy();
  });

  it.each(EMPTY_SURFACE_TOOLS)('%s returns NO_TEMPLATE_FIT with no live template on %s', async (name, surface) => {
    const result = (await h.client.callTool({
      name,
      arguments: { context: surfaceContextArgs(surface), contentBrief: 'Any brief; no template is published for this surface yet.' },
    })) as CallToolResult;
    expect(result.isError).toBe(true);
    const error = McpError.parse(textPayload(result));
    expect(error.code).toBe('NO_TEMPLATE_FIT');
    expect(error.remediation.length).toBeGreaterThan(0);
    expect(error.requestId).toBeTruthy();
  });

  it('compose_dashboard selects the live cockpit for a model-monitoring brief (dashboard pilot)', async () => {
    const result = (await h.client.callTool({
      name: 'compose_dashboard',
      arguments: {
        context: surfaceContextArgs('dashboard', {
          audience: ['technical', 'risk-and-governance'],
          businessIntent: ['monitor-model-health', 'detect-drift-early'],
        }),
        contentBrief: 'Fleet-wide model-monitoring dashboard: watch every production model’s drift against its breach limit and flag the one in breach.',
      },
    })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.worldTemplateId).toBe('cockpit');
    expect(out.experienceId).toBe('db-model-monitoring-cockpit');
  });

  it('compose_explainer selects the live drawing-office for a system-architecture brief (technical-explainer pilot)', async () => {
    const result = (await h.client.callTool({
      name: 'compose_explainer',
      arguments: {
        context: surfaceContextArgs('technical-explainer', {
          audience: ['technical', 'mixed'],
          businessIntent: ['onboard-new-engineers', 'support-architecture-review'],
        }),
        contentBrief: 'The canonical as-built explainer of our model-decision platform architecture: components, data flow across trust boundaries, and where the system is capacity-constrained.',
      },
    })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.worldTemplateId).toBe('drawing-office');
    expect(out.experienceId).toBe('exp-system-architecture');
  });

  it('compose_project_page selects the live ledger for a model-validation programme brief (project-page pilot)', async () => {
    const result = (await h.client.callTool({
      name: 'compose_project_page',
      arguments: {
        context: surfaceContextArgs('project-page', {
          audience: ['technical', 'risk-and-governance'],
          businessIntent: ['centralise-validation-evidence', 'track-sign-off-status'],
        }),
        contentBrief: 'The model-validation programme hub: every in-flight model on the pipeline from intake to sign-off, the one item stalled past its review threshold flagged up front, recent sign-off outcomes on file, and the decision log.',
      },
    })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.worldTemplateId).toBe('ledger');
    expect(out.experienceId).toBe('proj-ai-model-validation-hub');
  });

  it('compose_personal_page selects the live the-line for a career-timeline brief (personal-page pilot)', async () => {
    const result = (await h.client.callTool({
      name: 'compose_personal_page',
      arguments: {
        context: surfaceContextArgs('personal-page', {
          audience: ['personal-internal'],
          businessIntent: ['showcase-career-trajectory', 'connect-projects-to-outcomes'],
        }),
        contentBrief: 'A personal page telling the story of a twelve-year engineering career as one continuous line of projects — each station a shipped project with a real outcome, promotions where the line steps up, side-projects that branched off, and the one detour reversed out of left in honestly.',
      },
    })) as CallToolResult;
    expect(result.isError).not.toBe(true);
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.worldTemplateId).toBe('the-line');
    expect(out.experienceId).toBe('home-career-project-timeline');
  });

  describe('templateFidelity', () => {
    it('compose_slide_deck defaults to strict and returns a reference manifest of URIs only', async () => {
      const result = (await h.client.callTool({
        name: 'compose_slide_deck',
        arguments: { context: deckContext(), contentBrief: 'quarterly business review' },
      })) as CallToolResult;
      expect(result.isError).toBeFalsy();
      const out = ComposeSlideDeckOutput.parse(result.structuredContent);
      expect(out.reference).toBeDefined();
      expect(out.reference!.templateId).toBe(out.worldTemplateId);
      expect(out.reference!.sourceFiles.length).toBeGreaterThan(0);
      for (const f of out.reference!.sourceFiles) {
        expect(f.uri).toBe(`opendesign://templates/${out.worldTemplateId}/source/${f.path}`);
        expect(f.bytes).toBeGreaterThan(0);
      }
      // BORROW invariant: the manifest points at DESIGN, never at shipped
      // editorial content. Listing content.ts under a note that says "port
      // this design faithfully" told the porter to reproduce the words too.
      // Registry manifests carry no design either.
      const paths = out.reference!.sourceFiles.map((f) => f.path);
      expect(paths.some((p) => /\.(tsx|css)$/.test(p))).toBe(true);
      for (const p of paths) {
        expect(p).toMatch(/\.(tsx|ts|css)$/);
        expect(p).not.toMatch(/(^|\/)(content\.ts|[^/]*\.manifest\.ts)$/);
      }
      // ...and the fill module IS listed: it is the schema and section specs
      // the template's `import type ... from './quarter-fill.js'` resolves to,
      // not copy. Withholding it left that import dangling for the porter.
      expect(paths.some((p) => /(^|\/)[^/]*fill\.ts$/.test(p))).toBe(true);

      // by-reference contract: no file content anywhere in the payload
      expect(JSON.stringify(out)).not.toContain('import ');
    });

    it("templateFidelity 'free' omits the reference manifest", async () => {
      const result = (await h.client.callTool({
        name: 'compose_slide_deck',
        arguments: { context: deckContext(), contentBrief: 'quarterly business review', templateFidelity: 'free' },
      })) as CallToolResult;
      const out = ComposeSlideDeckOutput.parse(result.structuredContent);
      expect(out.reference).toBeUndefined();
    });
  });

  describe('reference resources', () => {
    it('serves template source by URI', async () => {
      const res = await h.client.readResource({
        uri: 'opendesign://templates/cockpit/source/CockpitTemplate.tsx',
      });
      const first = res.contents[0]!;
      expect(first.mimeType).toBe('text/plain');
      if (!('text' in first)) throw new Error('expected text content');
      expect(first.text).toContain('CockpitTemplate');
    });

    it('serves part source by URI', async () => {
      const res = await h.client.readResource({
        uri: 'opendesign://parts/deck-cloud-migration/CutoverTemplate.tsx',
      });
      const first = res.contents[0]!;
      if (!('text' in first)) throw new Error('expected text content');
      expect(first.text).toContain('data-part-id');
    });

    it('rejects unknown template ids and traversal', async () => {
      await expect(
        h.client.readResource({ uri: 'opendesign://templates/nope/source/x.tsx' }),
      ).rejects.toThrow();
      await expect(
        h.client.readResource({ uri: 'opendesign://templates/cockpit/source/../../package.json' }),
      ).rejects.toThrow();
    });

    it('keeps the templates/ and parts/ id-namespaces distinct: an experienceId in the templates/ slot is unknown', async () => {
      // 'cutover' is the canonical world-template id; 'deck-cloud-migration' is
      // its experienceId. Only the canonical id may resolve under templates/ -
      // the experienceId belongs to parts/, not templates/.
      await expect(
        h.client.readResource({
          uri: 'opendesign://templates/deck-cloud-migration/source/CutoverTemplate.tsx',
        }),
      ).rejects.toThrow(/Unknown world template/);

      const res = await h.client.readResource({
        uri: 'opendesign://templates/cutover/source/CutoverTemplate.tsx',
      });
      const first = res.contents[0]!;
      if (!('text' in first)) throw new Error('expected text content');
      expect(first.text).toContain('CutoverTemplate');
    });

    it('distinguishes an unknown experienceId from a known experience missing a file, for part-source', async () => {
      await expect(
        h.client.readResource({ uri: 'opendesign://parts/does-not-exist/whatever.tsx' }),
      ).rejects.toThrow(/Unknown experience/);
      await expect(
        h.client.readResource({ uri: 'opendesign://parts/deck-cloud-migration/does-not-exist.tsx' }),
      ).rejects.toThrow(/No source file/);
    });
  });

  describe('resource URI templates', () => {
    // The entire opendesign:// scheme depends on RFC 6570 reserved expansion
    // ({+file}) matching file segments that contain '/'. A future SDK bump or
    // a template-string typo (e.g. {+file} -> {file}) would silently break
    // nested-path resources without touching any fixture, since no experience
    // directory in this repo currently has subdirectories. Assert directly on
    // the matcher so that regression is caught without a fixture.
    it('matches a nested file path via {+file} reserved expansion', () => {
      // Uses the SAME template string constant the server registers with
      // (exported from resources.ts) - not a hand-copied literal - so a typo
      // there (e.g. {+file} -> {file}) fails this test.
      const template = new ResourceTemplate(TEMPLATE_SOURCE_URI_TEMPLATE, { list: undefined });
      const variables = template.uriTemplate.match(
        'opendesign://templates/cockpit/source/sections/Foo.tsx',
      );
      expect(variables).toEqual({ templateId: 'cockpit', file: 'sections/Foo.tsx' });
    });

    it('matches a nested file path for parts/ too', () => {
      const template = new ResourceTemplate(PART_SOURCE_URI_TEMPLATE, { list: undefined });
      const variables = template.uriTemplate.match(
        'opendesign://parts/deck-cloud-migration/sections/Foo.tsx',
      );
      expect(variables).toEqual({ experienceId: 'deck-cloud-migration', file: 'sections/Foo.tsx' });
    });

    it('matches a nested file path for renders/ too', () => {
      const template = new ResourceTemplate(RENDER_FILE_URI_TEMPLATE, { list: undefined });
      const variables = template.uriTemplate.match(
        'opendesign://renders/11111111-2222-3333-4444-555555555555/assets/index-abc.js',
      );
      expect(variables).toEqual({
        renderId: '11111111-2222-3333-4444-555555555555',
        file: 'assets/index-abc.js',
      });
    });
  });

  describe('render_experience', () => {
    it(
      'builds a standalone bundle and serves it via renders resources',
      async () => {
        const result = (await h.client.callTool({
          name: 'render_experience',
          arguments: { worldTemplateId: 'cockpit', fill: cockpitFill },
        })) as CallToolResult;
        expect(result.isError).toBeFalsy();
        const out = RenderExperienceOutput.parse(result.structuredContent);
        expect(out.entryUri).toBe(`opendesign://renders/${out.renderId}/index.html`);
        expect(out.files.map((f) => f.path)).toContain('index.html');
        expect(out.totalBytes).toBeGreaterThan(10_000);
        expect(out.buildMs).toBeGreaterThan(0);

        // The pointer list is capped, so `fileCount` is the honest total and
        // the truncation is declared rather than silent. The entry survives
        // the cap unconditionally.
        expect(out.fileCount).toBeGreaterThanOrEqual(out.files.length);
        expect(out.files.length).toBeLessThanOrEqual(50);
        expect(out.filesTruncated).toBe(out.fileCount > out.files.length);
        expect(out.files[0]!.path).toBe('index.html');

        // outDir is the whole point of item 2: a local client copies the
        // directory instead of issuing one resources/read per emitted file.
        expect(path.isAbsolute(out.outDir)).toBe(true);
        expect(out.outDir).toBe(path.join(appRoot, 'render-out', out.renderId, 'bundle'));
        expect(readFileSync(path.join(out.outDir, 'index.html'), 'utf8')).toContain('<div id="root">');

        // The build's OWN inputs live beside the bundle, never inside it: not
        // listed, not fetchable, not copied along with the artifact.
        const inputDir = path.join(appRoot, 'render-out', out.renderId, 'input');
        expect(readFileSync(path.join(inputDir, 'render-config.json'), 'utf8')).toContain('cockpit');
        expect(listRenderFiles(out.renderId)!.some((f) => f.path.includes('input/'))).toBe(false);
        expect(readdirSync(out.outDir)).not.toContain('input');
        expect(readRenderFile(out.renderId, '../input/fill.json')).toBeUndefined();
        await expect(
          h.client.readResource({ uri: `opendesign://renders/${out.renderId}/../input/fill.json` }),
        ).rejects.toThrow();

        const entry = await h.client.readResource({ uri: out.entryUri });
        expect(resourceText(entry)).toContain('<div id="root">');

        // A nested asset is readable through the same template, and its byte
        // size matches the pointer the tool handed back.
        const asset = out.files.find((f) => f.path.endsWith('.js'))!;
        const assetRead = await h.client.readResource({ uri: asset.uri });
        expect(Buffer.byteLength(resourceText(assetRead), 'utf8')).toBe(asset.bytes);

        // Contract: the committed render-host sample is STATIC - no build
        // writes it, so no render can dirty the working tree or leave a
        // client's fill sitting in a tracked file.
        const generated = path.join(appRoot, 'render-host', 'generated');
        expect(readFileSync(path.join(generated, 'render-config.json'), 'utf8')).toBe(
          '{\n  "templateId": "cockpit"\n}\n',
        );
        expect(readFileSync(path.join(generated, 'fill.json'), 'utf8')).toBe('{}\n');
      },
      240_000,
    );

    it('rejects an invalid fill without building', async () => {
      const result = (await h.client.callTool({
        name: 'render_experience',
        arguments: { worldTemplateId: 'cockpit', fill: { nonsense: true } },
      })) as CallToolResult;
      expect(result.isError).toBe(true);
      const err = JSON.parse((result.content as Array<{ text: string }>)[0]!.text) as McpError;
      expect(err.code).toBe('INVALID_INPUT');
      expect(err.details.length).toBeGreaterThan(0);
    });

    it('unknown template is UNKNOWN_TEMPLATE-style NOT_FOUND', async () => {
      const result = (await h.client.callTool({
        name: 'render_experience',
        arguments: { worldTemplateId: 'nope', fill: {} },
      })) as CallToolResult;
      expect(result.isError).toBe(true);
      const err = JSON.parse((result.content as Array<{ text: string }>)[0]!.text) as McpError;
      expect(err.code).toBe('UNKNOWN_TEMPLATE');
    });

    it('rejects an experienceId in the worldTemplateId slot (render-host is keyed by canonical id)', async () => {
      const result = (await h.client.callTool({
        name: 'render_experience',
        arguments: { worldTemplateId: 'db-model-monitoring-cockpit', fill: {} },
      })) as CallToolResult;
      expect(result.isError).toBe(true);
      const err = JSON.parse((result.content as Array<{ text: string }>)[0]!.text) as McpError;
      expect(err.code).toBe('UNKNOWN_TEMPLATE');
    });

    it(
      'keeps only the MAX_RENDERS most recent bundles and fails reads of evicted ones',
      async () => {
        // Plant MAX_RENDERS + 2 older placeholder bundles, then build: the
        // build's evict pass must drop the oldest ones. Placeholders are aged
        // by mtime so the ordering is deterministic without extra builds.
        const outRoot = path.join(appRoot, 'render-out');
        const planted: string[] = [];
        try {
          for (let i = 0; i < MAX_RENDERS + 2; i += 1) {
            // Placeholders carry UUID-shaped ids because that is the only id
            // shape the store will touch (see the traversal guard).
            const id = `00000000-0000-4000-8000-00000000000${i}`;
            const dir = path.join(outRoot, id);
            mkdirSync(path.join(dir, 'bundle'), { recursive: true });
            writeFileSync(path.join(dir, 'bundle', 'index.html'), '<div id="root"></div>');
            const aged = new Date(Date.now() - (MAX_RENDERS + 2 - i) * 60_000);
            utimesSync(dir, aged, aged);
            planted.push(id);
          }
          const oldest = planted[0]!;
          expect(readRenderFile(oldest, 'index.html')).toBeDefined();

          const result = (await h.client.callTool({
            name: 'render_experience',
            arguments: { worldTemplateId: 'cockpit', fill: cockpitFill },
          })) as CallToolResult;
          expect(result.isError).toBeFalsy();

          expect(readdirSync(outRoot, { withFileTypes: true }).filter((e) => e.isDirectory())).toHaveLength(
            MAX_RENDERS,
          );
          expect(readRenderFile(oldest, 'index.html')).toBeUndefined();
          await expect(
            h.client.readResource({ uri: `opendesign://renders/${oldest}/index.html` }),
          ).rejects.toThrow(/re-run render_experience/);
        } finally {
          // Self-contained: survivors of the evict pass must not linger in
          // render-out/ for the next run to trip over.
          for (const id of planted) rmSync(path.join(outRoot, id), { recursive: true, force: true });
        }
      },
      240_000,
    );

    it('reading an unknown render id fails with a re-run instruction', async () => {
      await expect(
        h.client.readResource({ uri: 'opendesign://renders/not-a-render/index.html' }),
      ).rejects.toThrow(/re-run render_experience/);
    });

    it('refuses a renderId that is itself a traversal', async () => {
      // The id is client-controlled and arrives un-decoded from
      // opendesign://renders/{renderId}/{+file}. Joined unchecked it escapes
      // render-out/ BEFORE the relPath guard runs: `../..` puts the base at
      // apps/mcp-server, making its package.json readable.
      const realFile = path.join(appRoot, 'package.json');
      expect(readFileSync(realFile, 'utf8')).toContain('"name": "mcp-server"');
      for (const id of ['..', '../..', '../../..', 'a/../..', 'a\\..\\..', '']) {
        expect(readRenderFile(id, 'package.json')).toBeUndefined();
        expect(readRenderFile(id, 'apps/mcp-server/package.json')).toBeUndefined();
        expect(listRenderFiles(id)).toBeUndefined();
      }
      // ...and no traversal URI can reach content through resources/read.
      //
      // The BACKSLASH form is the one that matters. `opendesign://renders/../package.json`
      // is normalised by URL parsing BEFORE the template matcher sees it, so
      // it never reaches the handler with a traversal id at all and would pass
      // with the guard deleted - a vacuous test. `opendesign:` is not a
      // special scheme, so backslashes survive parsing verbatim and the id
      // `..\..\apps\mcp-server` reaches renderDir intact (on win32 that is a
      // real escape). Asserting the handler's own message proves the request
      // got there and was refused, rather than dying somewhere upstream.
      await expect(
        h.client.readResource({ uri: 'opendesign://renders/..\\..\\apps\\mcp-server/package.json' }),
      ).rejects.toThrow(/re-run render_experience/);
    });

    it('refuses a traversal experienceId on the parts resource', async () => {
      // `opendesign:` is not a special scheme, so backslashes survive URL
      // parsing intact and reach experienceDir verbatim - on win32 that id
      // resolves to apps/mcp-server and served its package.json before the
      // guard. (The store-level proof lives in reference-files.test.ts.)
      //
      // Only the backslash form is asserted. The forward-slash sibling
      // (`opendesign://parts/../../apps/mcp-server/package.json`) is
      // normalised away by URL parsing before the template matcher runs, so it
      // never reaches the handler and passed even with the guard removed.
      await expect(
        h.client.readResource({ uri: 'opendesign://parts/..\\..\\apps\\mcp-server/package.json' }),
      ).rejects.toThrow(/Unknown experience/);
    });

    it('reports an fs failure as a structured McpError and leaves no render dir behind', async () => {
      // No vite build: the injected failure fires at the second per-render
      // input write, so this exercises the total-failure path (and the
      // structured-error contract) in milliseconds.
      const outRoot = path.join(appRoot, 'render-out');
      const dirsBefore = () =>
        new Set(
          existsSync(outRoot)
            ? readdirSync(outRoot, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
            : [],
        );
      const before = dirsBefore();
      const realWrite = renderFs.writeFileSync;
      renderFs.writeFileSync = ((file: string, data: string, ...rest: unknown[]) => {
        if (String(file).endsWith('fill.json')) {
          throw Object.assign(new Error('EPERM: operation not permitted, open fill.json'), { code: 'EPERM' });
        }
        return (realWrite as (...a: unknown[]) => unknown)(file, data, ...rest);
      }) as typeof realWrite;
      try {
        const result = (await h.client.callTool({
          name: 'render_experience',
          arguments: { worldTemplateId: 'cockpit', fill: cockpitFill },
        })) as CallToolResult;
        expect(result.isError).toBe(true);
        const err = McpError.parse(JSON.parse((result.content as Array<{ text: string }>)[0]!.text));
        expect(err.code).toBe('INTERNAL_ERROR');
        expect(err.details.join('\n')).toContain('EPERM');
      } finally {
        renderFs.writeFileSync = realWrite;
      }
      // A failed render leaves NOTHING: the half-written input directory is
      // removed along with the (never created) bundle.
      expect([...dirsBefore()]).toEqual([...before]);
    });

    it(
      'gives every render its own build inputs',
      async () => {
        // The bug this guards: builds used to write the caller's template id
        // and fill into the SHARED tracked render-host/generated/*.json before
        // shelling out. Inputs are now PER-RENDER, under
        // render-out/<renderId>/input/, so a bundle can only contain its own.
        //
        // This is a plumbing guard, NOT a race detector: both calls would go
        // through one process and the in-process render queue serializes them,
        // so the interleaving window a cross-process race needs never opens.
        // One build is therefore all it takes - and it is deliberately a
        // DIFFERENT template from the cockpit render above, so a leak from the
        // shared file that render would have written shows up here.
        //
        // The proof is the FILL, not the template id: vite inlines the imported
        // fill JSON into the entry chunk, so a leak shows up as this bundle
        // carrying the other render's editorial strings.
        const res = (await h.client.callTool({
          name: 'render_experience',
          arguments: { worldTemplateId: 'quarter', fill: quarterFill },
        })) as CallToolResult;
        expect(res.isError).toBeFalsy();
        const out = RenderExperienceOutput.parse(res.structuredContent);

        // The render's own input file names its own template.
        const config = JSON.parse(
          readFileSync(path.join(path.dirname(out.outDir), 'input', 'render-config.json'), 'utf8'),
        );
        expect(config.templateId).toBe('quarter');

        // ...and the BUNDLE carries its own fill and not the cockpit render's.
        // The marker strings are pulled from the real fills so they cannot drift.
        const js = listRenderFiles(out.renderId)!
          .filter((f) => f.path.endsWith('.js'))
          .map((f) => readRenderFile(out.renderId, f.path)!.toString('utf8'))
          .join('\n');
        const cockpitMarker = fillMarker(cockpitFill);
        const quarterMarker = fillMarker(quarterFill);
        expect(cockpitMarker).not.toBe(quarterMarker);
        expect(js).toContain(quarterMarker);
        expect(js).not.toContain(cockpitMarker);
      },
      240_000,
    );
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
