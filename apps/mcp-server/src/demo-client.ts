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
import {
  ComponentManifest,
  DesignBlueprint,
  McpError,
  ValidationResult,
  type ComponentPlacement,
  type DesignContext,
} from '@enterprise-design/contracts';
import { ComposeSlideDeckOutput, ValidateFillOutput } from './schemas.js';
import { quarterFill } from '../../../experiences/slide-decks/deck-quarterly-business-review/content.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.join(here, 'index.ts');

/** A realistic DesignContext, constructed directly by the client (the server never invents one). */
function makeContext(overrides: Partial<DesignContext> = {}): DesignContext {
  return {
    requestId: 'demo-compose',
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
    desiredTone: ['calm', 'authoritative'],
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

/** All component placements across a blueprint's routes/sections. */
function placementsOf(bp: DesignBlueprint): ComponentPlacement[] {
  return bp.routes.flatMap((r) => r.sections.flatMap((s) => s.componentPlacements));
}

/** Count of sections carrying a (signature) motion sequence — the compose invariant is exactly one. */
function signatureCount(bp: DesignBlueprint): number {
  return bp.routes.flatMap((r) => r.sections).filter((s) => s.motionSequence).length;
}

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

    // 2c. A wrong-typed argument (SDK rejects it before our handler) must STILL
    // return a parseable, structured INVALID_INPUT — not a bare string.
    const typeViolation = (await client.callTool({ name: 'get_component', arguments: { componentId: 123 } })) as CallToolResult;
    const typeErr = McpError.safeParse(textPayload(typeViolation));
    check('get_component(wrong-typed id) structured INVALID_INPUT', typeViolation.isError === true && typeErr.success && typeErr.data.code === 'INVALID_INPUT', typeErr.success ? typeErr.data.code : String(typeErr.error?.message));

    // 2d. An out-of-range bound (rejected by the advertised schema) → structured INVALID_INPUT.
    const boundViolation = (await client.callTool({ name: 'search_components', arguments: { query: 'chart', limit: 0 } })) as CallToolResult;
    const boundErr = McpError.safeParse(textPayload(boundViolation));
    check('search_components(limit=0) structured INVALID_INPUT', boundViolation.isError === true && boundErr.success && boundErr.data.code === 'INVALID_INPUT', boundErr.success ? boundErr.data.code : String(boundErr.error?.message));

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
    const limited = (await client.callTool({ name: 'search_components', arguments: { query: 'time series line chart', limit: 2 } })) as CallToolResult;
    const limitedOut = limited.structuredContent as { results: unknown[]; totalMatched: number; note?: string } | undefined;
    check('search(limit=2) truncates to 2 with true total', (limitedOut?.results.length ?? 0) === 2 && (limitedOut?.totalMatched ?? 0) > 2 && !!limitedOut?.note?.includes('Showing 2 of'), JSON.stringify({ n: limitedOut?.results.length, total: limitedOut?.totalMatched, note: limitedOut?.note }));

    // === Compose → validate loop (Task 22) ===
    const dashboardTools = ['compose_design', 'validate_composition'];
    check('compose + validate tools advertised', dashboardTools.every((n) => byName.has(n)), tools.map((t) => t.name).join(', '));
    for (const name of dashboardTools) {
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

    // 5a. Compose a dashboard blueprint for an executive model-monitoring context.
    const composed = (await client.callTool({
      name: 'compose_design',
      arguments: { context: makeContext(), alternativeMode: 'recommended' },
    })) as CallToolResult;
    check('compose_design(dashboard) not isError', composed.isError !== true);
    const composedParsed = DesignBlueprint.safeParse((composed.structuredContent as { blueprint?: unknown } | undefined)?.blueprint);
    check('compose_design returns a schema-valid DesignBlueprint', composedParsed.success, composedParsed.success ? composedParsed.data.blueprintId : composedParsed.error.message);

    let dashboardBlueprint: DesignBlueprint | undefined;
    if (composedParsed.success) {
      dashboardBlueprint = composedParsed.data;
      const placements = placementsOf(dashboardBlueprint);
      check('compose_design placed at least one component', placements.length > 0, `${placements.length} placements`);
      // Real component ids: every placed id resolves through get_component without error.
      const uniqueIds = [...new Set(placements.map((p) => p.componentId))];
      const resolved = await Promise.all(
        uniqueIds.map(async (id) => {
          const r = (await client.callTool({ name: 'get_component', arguments: { componentId: id } })) as CallToolResult;
          return r.isError !== true && ComponentManifest.safeParse(r.structuredContent).success;
        }),
      );
      check('compose_design placed only real registry component ids', resolved.every(Boolean), uniqueIds.join(', '));
      check('compose_design emits exactly one signature motion sequence', signatureCount(dashboardBlueprint) === 1, `${signatureCount(dashboardBlueprint)} signature sections`);
      check('compose_design evidence is non-empty', dashboardBlueprint.evidence.length > 0, `${dashboardBlueprint.evidence.length} evidence entries`);
    } else {
      check('compose_design placed at least one component', false, 'blueprint did not parse');
    }

    // 5b. Validate the composed blueprint at corporate → valid true.
    if (dashboardBlueprint) {
      const validated = (await client.callTool({
        name: 'validate_composition',
        arguments: { blueprint: dashboardBlueprint, validationProfile: 'corporate' },
      })) as CallToolResult;
      check('validate_composition(corporate) not isError', validated.isError !== true);
      const validRes = ValidationResult.safeParse((validated.structuredContent as { result?: unknown } | undefined)?.result);
      check('validate_composition(clean blueprint) valid=true', validRes.success && validRes.data.valid === true, validRes.success ? `score ${validRes.data.score}, ${validRes.data.findings.length} findings` : validRes.error.message);
    }

    // 5c. Tamper the blueprint (raw hex colour + unknown component id) → findings incl. THEME-001 & REG-001, valid false.
    if (dashboardBlueprint) {
      const tampered = structuredClone(dashboardBlueprint);
      tampered.tokens.colour = { '--surface-raised': '#ff0000' };
      const firstPlacement = tampered.routes[0]?.sections[0]?.componentPlacements[0];
      if (firstPlacement) firstPlacement.componentId = 'comp.__does_not_exist__';
      const tamperedResult = (await client.callTool({
        name: 'validate_composition',
        arguments: { blueprint: tampered, validationProfile: 'corporate' },
      })) as CallToolResult;
      check('validate_composition(tampered) is a successful call, not isError', tamperedResult.isError !== true);
      const tamperedRes = ValidationResult.safeParse((tamperedResult.structuredContent as { result?: unknown } | undefined)?.result);
      const ruleIds = new Set(tamperedRes.success ? tamperedRes.data.findings.map((f) => f.ruleId) : []);
      check('validate_composition(tampered) reports THEME-001 and REG-001', ruleIds.has('THEME-001') && ruleIds.has('REG-001'), [...ruleIds].join(', '));
      check('validate_composition(tampered) valid=false', tamperedRes.success && tamperedRes.data.valid === false);
    }

    // 5d. Compose slide-deck expressive vs conservative → structurally different.
    const expressive = (await client.callTool({
      name: 'compose_design',
      arguments: { context: makeContext({ surface: 'slide-deck', motionPreference: 3 }), alternativeMode: 'expressive' },
    })) as CallToolResult;
    const conservative = (await client.callTool({
      name: 'compose_design',
      arguments: { context: makeContext({ surface: 'slide-deck', motionPreference: 3 }), alternativeMode: 'conservative' },
    })) as CallToolResult;
    const exprBp = DesignBlueprint.safeParse((expressive.structuredContent as { blueprint?: unknown } | undefined)?.blueprint);
    const consBp = DesignBlueprint.safeParse((conservative.structuredContent as { blueprint?: unknown } | undefined)?.blueprint);
    if (exprBp.success && consBp.success) {
      const distinctIds = exprBp.data.blueprintId !== consBp.data.blueprintId;
      const higherMotion = exprBp.data.motionLevel >= consBp.data.motionLevel;
      // differenceSummary of the non-recommended alternatives is non-trivial (structural, not a bare theme swap).
      const nonTrivial = exprBp.data.alternatives
        .filter((a) => a.mode !== 'recommended')
        .every((a) => a.differenceSummary.length > 0 && !a.differenceSummary.join(' ').toLowerCase().includes('theme'));
      check('compose_design(slide-deck) expressive vs conservative are structurally different', distinctIds && higherMotion && nonTrivial, JSON.stringify({ distinctIds, higherMotion, nonTrivial, exprMotion: exprBp.data.motionLevel, consMotion: consBp.data.motionLevel }));
    } else {
      check('compose_design(slide-deck) expressive vs conservative are structurally different', false, 'slide-deck blueprints did not parse');
    }

    // 5e. Schema-garbage context → structured INVALID_INPUT McpError.
    const garbage = (await client.callTool({ name: 'compose_design', arguments: { context: { nonsense: true } } })) as CallToolResult;
    const garbageErr = McpError.safeParse(textPayload(garbage));
    check('compose_design(garbage context) structured INVALID_INPUT', garbage.isError === true && garbageErr.success && garbageErr.data.code === 'INVALID_INPUT', garbageErr.success ? garbageErr.data.code : String(garbageErr.error?.message));

    // 5f. Unknown selectedComponentIds → structured UNKNOWN_COMPONENT McpError.
    const unknownSel = (await client.callTool({ name: 'compose_design', arguments: { context: makeContext(), selectedComponentIds: ['comp.__ghost__'] } })) as CallToolResult;
    const unknownSelErr = McpError.safeParse(textPayload(unknownSel));
    check('compose_design(unknown selectedComponentIds) structured UNKNOWN_COMPONENT', unknownSel.isError === true && unknownSelErr.success && unknownSelErr.data.code === 'UNKNOWN_COMPONENT', unknownSelErr.success ? unknownSelErr.data.code : String(unknownSelErr.error?.message));

    // === compose_slide_deck → validate_fill: the world-template loop (Task 29) ===
    const deckTools = ['compose_slide_deck', 'validate_fill'];
    check('compose_slide_deck + validate_fill advertised', deckTools.every((n) => byName.has(n)), tools.map((t) => t.name).join(', '));
    for (const name of deckTools) {
      const ann = byName.get(name)?.annotations;
      check(
        `${name} read-only annotations`,
        ann?.readOnlyHint === true && ann?.destructiveHint === false && ann?.idempotentHint === true && ann?.openWorldHint === false && typeof ann?.title === 'string',
        JSON.stringify(ann),
      );
    }

    // 6a. A technical migration brief selects deck-cloud-migration (The Cutover).
    const cutover = (await client.callTool({
      name: 'compose_slide_deck',
      arguments: {
        context: { surface: 'slide-deck', audience: ['technical', 'risk-and-governance'], businessIntent: ['plan-cloud-migration'], corporateSuitability: 'standard', motionPreference: 2 },
        contentBrief: 'Explain the estate migration and the cutover-night sequence for platform engineering.',
      },
    })) as CallToolResult;
    const cutoverOut = ComposeSlideDeckOutput.safeParse(cutover.structuredContent);
    check('compose_slide_deck(technical brief) → deck-cloud-migration', cutoverOut.success && cutoverOut.data.experienceId === 'deck-cloud-migration' && cutoverOut.data.worldTemplateId === 'cutover', cutoverOut.success ? cutoverOut.data.experienceId : cutoverOut.error.message);
    check('compose_slide_deck fill skeleton carries slide kinds + craft guarantees + examples', cutoverOut.success && cutoverOut.data.fillSkeleton.slideKinds.length > 0 && cutoverOut.data.fillSkeleton.craftGuarantees.length > 0 && cutoverOut.data.fillSkeleton.slideKinds.every((k) => k.slots.every((s) => s.example.length > 0)), cutoverOut.success ? `${cutoverOut.data.fillSkeleton.slideKinds.length} kinds` : '');

    // 6b. A conventional business brief selects deck-quarterly-business-review (The Quarter).
    const quarter = (await client.callTool({
      name: 'compose_slide_deck',
      arguments: {
        context: { surface: 'slide-deck', audience: ['executive', 'business'], businessIntent: ['review-quarterly-performance'], corporateSuitability: 'restricted', motionPreference: 1 },
        contentBrief: 'Quarterly business review of revenue, pipeline, and next-quarter priorities for the board.',
      },
    })) as CallToolResult;
    const quarterOut = ComposeSlideDeckOutput.safeParse(quarter.structuredContent);
    check('compose_slide_deck(business brief) → deck-quarterly-business-review', quarterOut.success && quarterOut.data.experienceId === 'deck-quarterly-business-review' && quarterOut.data.worldTemplateId === 'quarter', quarterOut.success ? quarterOut.data.experienceId : quarterOut.error.message);

    // 6c. The shipped Quarter instance fill validates clean against the descriptor contract.
    const validShipped = (await client.callTool({ name: 'validate_fill', arguments: { worldTemplateId: 'quarter', fill: quarterFill } })) as CallToolResult;
    const validShippedOut = ValidateFillOutput.safeParse(validShipped.structuredContent);
    check('validate_fill(shipped Quarter fill) valid=true, no findings', validShippedOut.success && validShippedOut.data.valid === true && validShippedOut.data.findings.length === 0, validShippedOut.success ? `${validShippedOut.data.findings.length} findings` : validShippedOut.error.message);

    // 6d. A tampered fill (anomaly removed + oversize headline) is invalid with precise findings.
    const tampered = structuredClone(quarterFill) as typeof quarterFill;
    tampered.kpis = tampered.kpis.map((k) => ({ ...k, status: 'on-track' as const }));
    tampered.summary.lead = 'x'.repeat(200);
    const invalid = (await client.callTool({ name: 'validate_fill', arguments: { worldTemplateId: 'quarter', fill: tampered } })) as CallToolResult;
    const invalidOut = ValidateFillOutput.safeParse(invalid.structuredContent);
    const hasCraft = invalidOut.success && invalidOut.data.findings.some((f) => f.rule === 'craft' && f.path === 'kpis');
    const hasOversize = invalidOut.success && invalidOut.data.findings.some((f) => f.rule === 'maxChars' && f.path === 'summary.lead');
    check('validate_fill(tampered) is a successful call, not isError', invalid.isError !== true);
    check('validate_fill(tampered) valid=false with anomaly + oversize findings', invalidOut.success && invalidOut.data.valid === false && hasCraft && hasOversize, invalidOut.success ? invalidOut.data.findings.map((f) => `${f.path}:${f.rule}`).join(', ') : invalidOut.error.message);

    // 6e. An unknown template id is a structured UNKNOWN_TEMPLATE error.
    const unknownTpl = (await client.callTool({ name: 'validate_fill', arguments: { worldTemplateId: 'no-such-template', fill: {} } })) as CallToolResult;
    const unknownTplErr = McpError.safeParse(textPayload(unknownTpl));
    check('validate_fill(unknown template) structured UNKNOWN_TEMPLATE', unknownTpl.isError === true && unknownTplErr.success && unknownTplErr.data.code === 'UNKNOWN_TEMPLATE', unknownTplErr.success ? unknownTplErr.data.code : String(unknownTplErr.error?.message));

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
