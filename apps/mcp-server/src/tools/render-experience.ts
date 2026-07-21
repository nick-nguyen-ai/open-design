// apps/mcp-server/src/tools/render-experience.ts
/**
 * `render_experience` - validate a fill, then vite-build the template + fill
 * into a standalone static bundle and return POINTERS (renders resource URIs
 * + sizes). The heavy artifact never enters the tool result.
 */
import { RenderExperienceInput, type RenderExperienceOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';
import { validateFillTool } from './validate-fill.js';
import { listRenderFiles, runRender } from '../render-store.js';

export async function renderExperienceTool(
  registry: RegistryData,
  rawInput: unknown,
): Promise<ToolOutcome<RenderExperienceOutput>> {
  const requestId = newRequestId();
  const parsed = RenderExperienceInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for render_experience.', {
        requestId,
        details: parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
        remediation: ['Pass { worldTemplateId, fill } - fill must satisfy validate_fill first.'],
      }),
    };
  }
  const { worldTemplateId, fill } = parsed.data;

  // Strict: only the CANONICAL world-template id is buildable. The id is
  // written into render-host/generated/render-config.json and looked up in the
  // host's TEMPLATES map, which is keyed by canonical id alone - so
  // `worldTemplateById` (keyed by BOTH id and experienceId, for validate_fill's
  // more forgiving contract) is deliberately NOT used here. An experienceId
  // would pass validation and then fail inside the build with an opaque
  // "unknown templateId"; rejecting it up front is the honest answer.
  const descriptor = registry.worldTemplates.find((template) => template.id === worldTemplateId);
  if (!descriptor) {
    return {
      ok: false,
      error: makeError('UNKNOWN_TEMPLATE', `Unknown world-template "${worldTemplateId}".`, {
        requestId,
        details: [`Renderable templates: ${[...new Set(registry.worldTemplates.map((t) => t.id))].join(', ')}.`],
        remediation: [
          'Use the canonical worldTemplateId from a compose_* result (its `id`, not its `experienceId`).',
        ],
      }),
    };
  }

  const validation = validateFillTool(registry, { worldTemplateId, fill });
  if (!validation.ok) return validation;
  if (!validation.data.valid) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', `Fill fails validation for '${worldTemplateId}' - not building.`, {
        requestId,
        details: validation.data.findings.map((f) => `${f.path}: ${f.message}`).slice(0, 20),
        remediation: ['Fix the fill via validate_fill until valid, then re-run render_experience.'],
      }),
    };
  }

  const built = await runRender(worldTemplateId, fill);
  if (!built.ok) {
    return {
      ok: false,
      error: makeError('INTERNAL_ERROR', 'Vite build failed; no bundle was kept.', {
        requestId,
        details: [built.logTail],
        remediation: [
          'Inspect the build log tail; a template map gap in render-host/src/templates.ts is the most common cause.',
        ],
      }),
    };
  }

  const files = listRenderFiles(built.renderId) ?? [];
  return {
    ok: true,
    data: {
      renderId: built.renderId,
      entryUri: `opendesign://renders/${built.renderId}/index.html`,
      files: files.map((f) => ({
        uri: `opendesign://renders/${built.renderId}/${f.path}`,
        path: f.path,
        bytes: f.bytes,
      })),
      totalBytes: files.reduce((n, f) => n + f.bytes, 0),
      buildMs: built.buildMs,
    },
  };
}
