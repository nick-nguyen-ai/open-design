/**
 * The four non-deck `compose_<surface>` tools — thin surface wrappers.
 *
 * Each mirrors {@link composeSlideDeckTool}: it owns only its tight input
 * contract, parsing its `Compose<Surface>Input` — rejecting a malformed or
 * wrong-surface context as a structured `INVALID_INPUT` — then delegating to the
 * shared {@link composeForSurface} core with its fixed surface literal. Selection
 * scoring, the styleHint hard filter, `NO_MATCH`/`NO_TEMPLATE_FIT`, and the fill
 * skeleton all live in the core; these wrappers add no selection logic.
 */
import type { z } from 'zod';
import type { SurfaceType } from '@enterprise-design/contracts';
import {
  ComposeDashboardInput,
  ComposeExplainerInput,
  ComposePersonalPageInput,
  ComposeProjectPageInput,
  type ComposeSlideDeckOutput,
  type TemplateFidelity,
} from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';
import { type ComposeContext, composeForSurface } from './compose-core.js';

/**
 * Shared parse-then-delegate step. Each surface input's `context` is structurally
 * a {@link ComposeContext} plus its fixed `surface` literal, so a successful parse
 * hands straight to the core (which re-derives the surface-neutral context).
 */
function delegate<T extends { context: ComposeContext; contentBrief: string; templateFidelity?: TemplateFidelity }>(
  registry: RegistryData,
  surface: SurfaceType,
  toolName: string,
  parsed: { success: true; data: T } | { success: false; error: z.ZodError },
): ToolOutcome<ComposeSlideDeckOutput> {
  const requestId = newRequestId();
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', `Invalid arguments for ${toolName}.`, {
        requestId,
        details: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: [
          `Provide a ${surface} context (surface '${surface}', audience, businessIntent, corporateSuitability, motionPreference) and a contentBrief (see tools/list).`,
        ],
      }),
    };
  }
  const { context, contentBrief, templateFidelity } = parsed.data;
  return composeForSurface(registry, surface, context, contentBrief, toolName, templateFidelity ?? 'strict');
}

export function composeDashboardTool(registry: RegistryData, rawInput: unknown): ToolOutcome<ComposeSlideDeckOutput> {
  return delegate(registry, 'dashboard', 'compose_dashboard', ComposeDashboardInput.safeParse(rawInput));
}

export function composeProjectPageTool(registry: RegistryData, rawInput: unknown): ToolOutcome<ComposeSlideDeckOutput> {
  return delegate(registry, 'project-page', 'compose_project_page', ComposeProjectPageInput.safeParse(rawInput));
}

export function composePersonalPageTool(registry: RegistryData, rawInput: unknown): ToolOutcome<ComposeSlideDeckOutput> {
  return delegate(registry, 'personal-page', 'compose_personal_page', ComposePersonalPageInput.safeParse(rawInput));
}

export function composeExplainerTool(registry: RegistryData, rawInput: unknown): ToolOutcome<ComposeSlideDeckOutput> {
  return delegate(registry, 'technical-explainer', 'compose_explainer', ComposeExplainerInput.safeParse(rawInput));
}
