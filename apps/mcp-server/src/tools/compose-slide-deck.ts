/**
 * `compose_slide_deck` domain logic — a thin surface wrapper.
 *
 * The selection engine now lives in {@link composeForSurface} (surface-aware,
 * shared by every `compose_<surface>` tool). This wrapper owns only the deck's
 * tight input contract: it parses `ComposeSlideDeckInput` — rejecting a
 * malformed context as a structured `INVALID_INPUT` — then delegates to the core
 * with the fixed `slide-deck` surface. Selection scoring, the styleHint hard
 * filter, `NO_MATCH`/`NO_TEMPLATE_FIT`, and the fill skeleton are all the core's.
 */
import { ComposeSlideDeckInput, type ComposeSlideDeckOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';
import { composeForSurface } from './compose-core.js';

export function composeSlideDeckTool(registry: RegistryData, rawInput: unknown): ToolOutcome<ComposeSlideDeckOutput> {
  const requestId = newRequestId();

  const parsed = ComposeSlideDeckInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for compose_slide_deck.', {
        requestId,
        details: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: ['Provide a slide-deck context (audience, businessIntent, corporateSuitability, motionPreference) and a contentBrief (see tools/list).'],
      }),
    };
  }

  const { context, contentBrief, templateFidelity } = parsed.data;
  return composeForSurface(registry, 'slide-deck', context, contentBrief, 'compose_slide_deck', templateFidelity ?? 'strict');
}
