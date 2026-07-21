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
import { BUILD_TIMEOUT_MS, listRenderFiles, runRender } from '../render-store.js';

/** The bundle's entry document - always present in `files`, whatever the cap. */
const ENTRY_FILE = 'index.html';

/**
 * Cap on the `files` pointer list.
 *
 * 50 covers a current bundle's ENTIRE non-font asset graph (1 html + 20 js +
 * 19 css = 40 today) with headroom for a template or two more, so the truncated
 * tail is fonts - the part of the artifact a caller never addresses
 * individually. That keeps the result around 5 kB of JSON instead of 13 kB,
 * and any caller that wants the complete artifact copies `outDir`.
 */
const MAX_LISTED_FILES = 50;

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

  // `runRender` is total (it converts its own throws into `ok: false`), but the
  // await is guarded anyway: an unstructured rejection here would reach the SDK
  // as a bare Error.message, breaking the invariant that EVERY isError result
  // carries a JSON-serialized McpError.
  let built;
  try {
    built = await runRender(worldTemplateId, fill);
  } catch (err) {
    return {
      ok: false,
      error: makeError('INTERNAL_ERROR', 'Render failed; no bundle was kept.', {
        requestId,
        details: [err instanceof Error ? err.message : String(err)],
        remediation: ['Retry the render; if it persists, inspect apps/mcp-server/render-out/ for a stuck bundle.'],
      }),
    };
  }
  if (!built.ok) {
    // A timeout and a build failure need DIFFERENT remediation: telling a
    // caller whose cold build ran long to go look for a template-map gap sends
    // them after a bug that is not there.
    return {
      ok: false,
      error: makeError(
        'INTERNAL_ERROR',
        built.timedOut ? 'Render timed out; no bundle was kept.' : 'Render failed; no bundle was kept.',
        {
          requestId,
          details: [built.logTail],
          remediation: built.timedOut
            ? [
                `The build exceeded ${BUILD_TIMEOUT_MS}ms and was killed - nothing in the log tail need be wrong.`,
                'A cold build (fresh install, cold Vite cache, Windows) is far slower than a warm ~2s one; retry, since the second build reuses the cache.',
                'If it keeps timing out, raise the ceiling with OPENDESIGN_RENDER_BUILD_TIMEOUT_MS (milliseconds) on the server process.',
              ]
            : [
                'Inspect the build log tail; a template map gap in render-host/src/templates.ts is the most common cause.',
              ],
        },
      ),
    };
  }

  // A just-built render that is already gone means the store is inconsistent
  // (e.g. a second server process evicted it concurrently). Reporting an empty
  // file list plus an entryUri that will 404 would be a silent lie.
  const files = listRenderFiles(built.renderId);
  if (!files) {
    return {
      ok: false,
      error: makeError('INTERNAL_ERROR', `Render ${built.renderId} vanished from the store right after building.`, {
        requestId,
        details: ['listRenderFiles returned nothing for a render that had just been built.'],
        remediation: [
          'Re-run render_experience; concurrent eviction by a second server process is the usual cause.',
        ],
      }),
    };
  }
  // Cap the pointer list. A bundle is ~117 files today (12 lazy template
  // chunks + 19 css + 77 fonts), and the design's own constraint is "pointers
  // + small metadata" - an uncapped list scales with the font set, not with
  // anything the caller can act on. The entry is pinned first so it survives
  // any cap, and `fileCount` / `filesTruncated` make the truncation visible
  // rather than silent. The whole artifact is still retrievable: that is what
  // `outDir` is for.
  const ranked = [...files].sort((a, b) => {
    if (a.path === ENTRY_FILE) return -1;
    if (b.path === ENTRY_FILE) return 1;
    return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
  });
  return {
    ok: true,
    data: {
      renderId: built.renderId,
      entryUri: `opendesign://renders/${built.renderId}/${ENTRY_FILE}`,
      outDir: built.outDir,
      files: ranked.slice(0, MAX_LISTED_FILES).map((f) => ({
        uri: `opendesign://renders/${built.renderId}/${f.path}`,
        path: f.path,
        bytes: f.bytes,
      })),
      fileCount: files.length,
      filesTruncated: files.length > MAX_LISTED_FILES,
      totalBytes: files.reduce((n, f) => n + f.bytes, 0),
      buildMs: built.buildMs,
    },
  };
}
