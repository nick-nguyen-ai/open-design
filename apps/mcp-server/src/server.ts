/**
 * SDK adapter — the ONLY module that imports `@modelcontextprotocol/sdk`.
 *
 * It owns transport/registration concerns: creating the `McpServer`,
 * registering the tools with their tight advertised schemas + annotations,
 * registering the `opendesign://` resources that serve reference source, and
 * translating a domain {@link ToolOutcome} into an MCP `CallToolResult`
 * (structured content + a JSON text fallback, or an `isError` result carrying
 * the structured `McpError`). Domain logic lives in adapter-independent
 * modules; an SDK major upgrade should touch this file (plus the transport
 * import in `index.ts`) and nothing else.
 *
 * Filesystem posture: the registry JSON is read once at startup
 * (`registry-data.ts`); read-only experience source is served exclusively
 * through resources (`resources.ts`, backed by `reference-files.ts`) - tools
 * never return file content, only `opendesign://` pointers and byte sizes.
 * Writes (arriving in a later task) are confined to a dedicated `render-out/`
 * directory outside the experience source tree.
 *
 * Error-contract invariant: EVERY `isError: true` result — whether produced by
 * our domain handlers or by the SDK's own pre-handler argument validation —
 * carries a JSON-serialized contracts {@link McpError} in `content[0].text`.
 * The SDK, left alone, returns its argument-validation failures as a plain
 * string; {@link installStructuredErrorWrapper} intercepts that single choke
 * point so a client can always `JSON.parse(result.content[0].text)` into an
 * `McpError`. Resource reads signal failure by throwing instead - the SDK
 * surfaces that as a `resources/read` protocol error, not an `isError` tool
 * result, since resources are not tools.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import { ComponentManifest } from '@enterprise-design/contracts';
import type { McpErrorCode } from '@enterprise-design/contracts';
import type { RegistryData } from './registry-data.js';
import type { Logger } from './logger.js';
import { makeError, newRequestId, type ToolOutcome } from './errors.js';
import {
  ComposeDashboardInput,
  ComposeDesignInput,
  ComposeDesignOutput,
  ComposeExplainerInput,
  ComposePersonalPageInput,
  ComposeProjectPageInput,
  ComposeSlideDeckInput,
  ComposeSlideDeckOutput,
  GetComponentInput,
  GetPartReferenceInput,
  GetPartReferenceOutput,
  RenderExperienceInput,
  RenderExperienceOutput,
  SearchComponentsInput,
  SearchComponentsOutput,
  ValidateCompositionInput,
  ValidateCompositionOutput,
  ValidateFillInput,
  ValidateFillOutput,
} from './schemas.js';
import { getComponent } from './tools/get-component.js';
import { searchComponents } from './tools/search-components.js';
import { composeDesignTool } from './tools/compose-design.js';
import { validateCompositionTool } from './tools/validate-composition.js';
import { composeSlideDeckTool } from './tools/compose-slide-deck.js';
import {
  composeDashboardTool,
  composeExplainerTool,
  composePersonalPageTool,
  composeProjectPageTool,
} from './tools/compose-surface.js';
import { validateFillTool } from './tools/validate-fill.js';
import { getPartReferenceTool } from './tools/get-part-reference.js';
import { renderExperienceTool } from './tools/render-experience.js';
import { registerReferenceResources } from './resources.js';

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
    { capabilities: { tools: {}, resources: {} } },
  );
  installStructuredErrorWrapper(server);
  registerReferenceResources(server, registry);

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

  server.registerTool(
    'compose_slide_deck',
    {
      title: 'Compose slide deck',
      description:
        'Deterministically selects ONE parameterized world-template for a slide-deck brief and returns its fill skeleton: the template\'s slide kinds with per-slot guidance and a descriptor-drawn example, plus the craft guarantees the template makes (the flagged anomaly, the required synthetic notice, the balanced grids). Selection scores audience overlap, business-intent keywords, and corporate fit, with an optional styleHint hard-filter and a stable tie-break. It never invents content — the caller authors the fill against the returned skeleton, then checks it with validate_fill. Returns the chosen worldTemplateId (and experienceId), a rationale, the scoring evidence, and the fillSkeleton.',
      inputSchema: ComposeSlideDeckInput.shape,
      outputSchema: ComposeSlideDeckOutput.shape,
      annotations: { title: 'Compose slide deck', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = composeSlideDeckTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'compose_slide_deck', status: 'ok', durationMs, count: outcome.data.fillSkeleton.sections.length });
      } else {
        logger.audit({ tool: 'compose_slide_deck', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'compose_dashboard',
    {
      title: 'Compose dashboard',
      description:
        'Deterministically selects ONE parameterized world-template for a DASHBOARD brief and returns its fill skeleton. A dashboard is a single monitoring surface laid out as page REGIONS — a KPI/stat row, one or more trend or breakdown panels, and a status/risk area — populated with live-feeling data and exactly ONE flagged anomaly the viewer is meant to notice. The skeleton returns each region\'s slots with per-slot guidance and a descriptor-drawn example, plus the craft guarantees the template makes (the single flagged anomaly, the required synthetic-data notice, the balanced region grid). Selection scores audience overlap, business-intent keywords, and corporate fit, with an optional styleHint hard-filter and a stable tie-break. It never invents content — author the fill against the returned skeleton, then check it with validate_fill. Returns the chosen worldTemplateId (and experienceId), a rationale, the scoring evidence, and the fillSkeleton.',
      inputSchema: ComposeDashboardInput.shape,
      outputSchema: ComposeSlideDeckOutput.shape,
      annotations: { title: 'Compose dashboard', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = composeDashboardTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'compose_dashboard', status: 'ok', durationMs, count: outcome.data.fillSkeleton.sections.length });
      } else {
        logger.audit({ tool: 'compose_dashboard', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'compose_project_page',
    {
      title: 'Compose project page',
      description:
        'Deterministically selects ONE parameterized world-template for a PROJECT-PAGE brief and returns its fill skeleton. A project page is a scroll of SECTIONS that build ONE narrative about a piece of work — context/problem, approach, the work itself, outcomes, and what is next — each section handing the reader to the next so the whole page reads as a single story, not a list of tiles. The skeleton returns each section\'s slots with per-slot guidance and a descriptor-drawn example, plus the craft guarantees the template makes. Selection scores audience overlap, business-intent keywords, and corporate fit, with an optional styleHint hard-filter and a stable tie-break. It never invents content — author the fill against the returned skeleton, then check it with validate_fill. Returns the chosen worldTemplateId (and experienceId), a rationale, the scoring evidence, and the fillSkeleton.',
      inputSchema: ComposeProjectPageInput.shape,
      outputSchema: ComposeSlideDeckOutput.shape,
      annotations: { title: 'Compose project page', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = composeProjectPageTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'compose_project_page', status: 'ok', durationMs, count: outcome.data.fillSkeleton.sections.length });
      } else {
        logger.audit({ tool: 'compose_project_page', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'compose_personal_page',
    {
      title: 'Compose personal page',
      description:
        'Deterministically selects ONE parameterized world-template for a PERSONAL-PAGE brief and returns its fill skeleton. A personal page (a profile, bio, or portfolio landing) is a scroll of SECTIONS that build ONE story about a person — who they are, what they do, selected work or highlights, and how to reach them — each section leading into the next so the page reads as a single arc rather than disconnected blocks. The skeleton returns each section\'s slots with per-slot guidance and a descriptor-drawn example, plus the craft guarantees the template makes. Selection scores audience overlap, business-intent keywords, and corporate fit, with an optional styleHint hard-filter and a stable tie-break. It never invents content — author the fill against the returned skeleton, then check it with validate_fill. Returns the chosen worldTemplateId (and experienceId), a rationale, the scoring evidence, and the fillSkeleton.',
      inputSchema: ComposePersonalPageInput.shape,
      outputSchema: ComposeSlideDeckOutput.shape,
      annotations: { title: 'Compose personal page', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = composePersonalPageTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'compose_personal_page', status: 'ok', durationMs, count: outcome.data.fillSkeleton.sections.length });
      } else {
        logger.audit({ tool: 'compose_personal_page', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'compose_explainer',
    {
      title: 'Compose technical explainer',
      description:
        'Deterministically selects ONE parameterized world-template for a TECHNICAL-EXPLAINER brief and returns its fill skeleton. An explainer is built around ONE central DRAWING — a diagram, schematic, or annotated figure of the system or concept — supported by its LEGEND and ANNOTATION sections that name the parts, walk the flow step by step, and call out the details that matter. The skeleton returns the drawing\'s slots and each legend/annotation section\'s slots with per-slot guidance and a descriptor-drawn example, plus the craft guarantees the template makes. Selection scores audience overlap, business-intent keywords, and corporate fit, with an optional styleHint hard-filter and a stable tie-break. It never invents content — author the fill against the returned skeleton, then check it with validate_fill. Returns the chosen worldTemplateId (and experienceId), a rationale, the scoring evidence, and the fillSkeleton.',
      inputSchema: ComposeExplainerInput.shape,
      outputSchema: ComposeSlideDeckOutput.shape,
      annotations: { title: 'Compose technical explainer', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = composeExplainerTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'compose_explainer', status: 'ok', durationMs, count: outcome.data.fillSkeleton.sections.length });
      } else {
        logger.audit({ tool: 'compose_explainer', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'validate_fill',
    {
      title: 'Validate slide-deck fill',
      description:
        'Validates a candidate fill against a world-template\'s DESCRIPTOR contract: required slots present, per-slot char caps and item counts respected, and the declared craft rules satisfied (exactly one flagged anomaly, a required synthetic notice). A fill that violates the contract is a SUCCESSFUL call returning valid=false with precise findings (slot path + limit violated + guidance echoed); only malformed arguments (INVALID_INPUT) or an unknown worldTemplateId (UNKNOWN_TEMPLATE) are errors. NOTE: this enforces the descriptor envelope, not the world-specific Zod fill schema — full Zod validation (refinements, enums, cross-field rules) remains a client-side step the fill author performs by importing the world\'s *Fill schema.',
      inputSchema: ValidateFillInput.shape,
      outputSchema: ValidateFillOutput.shape,
      annotations: { title: 'Validate slide-deck fill', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = validateFillTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'validate_fill', status: 'ok', durationMs, count: outcome.data.findings.length });
      } else {
        logger.audit({ tool: 'validate_fill', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'get_part_reference',
    {
      title: 'Get part source reference',
      description:
        "Resolve a data-part-id ('<experienceId>/<section>[/<part>]', from the gallery part inspector) to the source files implementing it, as opendesign://parts/ resource URIs with byte sizes. Content is fetched via resources/read, never inline.",
      inputSchema: GetPartReferenceInput.shape,
      outputSchema: GetPartReferenceOutput.shape,
      annotations: { title: 'Get part source reference', ...READ_ONLY_ANNOTATIONS },
    },
    (args) => {
      const startedAt = performance.now();
      const outcome = getPartReferenceTool(args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'get_part_reference', status: 'ok', durationMs, count: outcome.data.files.length });
      } else {
        logger.audit({ tool: 'get_part_reference', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  server.registerTool(
    'render_experience',
    {
      title: 'Render experience bundle',
      description:
        'Build a standalone static bundle (Vite) for a world template + validated fill. Returns render resource URIs + sizes - fetch content via resources/read. Builds are serialized; the 5 most recent renders are kept.',
      inputSchema: RenderExperienceInput.shape,
      outputSchema: RenderExperienceOutput.shape,
      annotations: {
        title: 'Render experience bundle',
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (args) => {
      const startedAt = performance.now();
      const outcome = await renderExperienceTool(registry, args);
      const durationMs = Math.round(performance.now() - startedAt);
      if (outcome.ok) {
        logger.audit({ tool: 'render_experience', status: 'ok', durationMs, count: outcome.data.files.length });
      } else {
        logger.audit({ tool: 'render_experience', status: 'error', durationMs, code: outcome.error.code });
      }
      return toCallToolResult(outcome);
    },
  );

  return server;
}
