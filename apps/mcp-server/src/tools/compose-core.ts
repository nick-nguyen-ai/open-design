/**
 * Surface-aware compose core — adapter-independent (no SDK import).
 *
 * The selection engine every `compose_<surface>` tool shares. Given a target
 * surface and a `ComposeContext`, it deterministically selects ONE live
 * world-template for that surface and returns its fill skeleton — the
 * descriptor's sections with per-slot guidance and a descriptor-drawn example,
 * plus the craft guarantees the template makes. The core never invents content:
 * every example is extracted from the descriptor (an `e.g.` in the slot
 * guidance, or a bound hint derived from the slot's type + limits).
 *
 * Pipeline:
 *   1. Pre-filter the catalogue to templates whose `surface` matches (an empty
 *      pool is a `NO_TEMPLATE_FIT`, never a cross-surface leak).
 *   2. Apply the optional `styleHint` HARD filter (empties within a non-empty
 *      surface pool are the existing `NO_MATCH`).
 *   3. Score each candidate:
 *        score = audienceOverlap×2 + intentKeywordMatch + corporateFit,
 *      where intent tokens now draw on the descriptor's `businessIntents` AND
 *      its `briefKeywords`. Rank by score desc, then id asc (stable tie-break).
 *   4. A winning score of 0 is a `NO_TEMPLATE_FIT` (nothing genuinely fits).
 *
 * Returns a structured {@link ToolOutcome}: the selection on success, an
 * `INVALID_INPUT` for a malformed context, `NO_MATCH` when a styleHint filters
 * every (surface) template out, or `NO_TEMPLATE_FIT` when no live template on
 * the surface fits. Never throws for expected failures.
 */
import { z } from 'zod';
import type { CorporateSuitability, SlotSpec, SurfaceType, WorldTemplateDescriptor } from '@enterprise-design/contracts';
import {
  type ComposeAlternative,
  type ComposeSlideDeckOutput,
  type FillSkeleton,
  type FillSkeletonSection,
  type FillSkeletonSlot,
  SlideDeckContext,
  type TemplateFidelity,
  type TemplateReference,
} from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';
import { isDesignBearingFile, listExperienceFiles, templateSourceUri } from '../reference-files.js';

/**
 * The selection-driving facets, surface-neutral: everything a `compose_<surface>`
 * tool needs to select a template, minus the surface itself (passed separately).
 * A `ComposeSlideDeckInput`'s `context` is structurally this shape plus its fixed
 * `surface` literal, so the deck wrapper hands its parsed context straight in.
 */
export const ComposeContext = SlideDeckContext.omit({ surface: true });
export type ComposeContext = z.infer<typeof ComposeContext>;

/** The core's output shape is reused verbatim from `compose_slide_deck`. */
export type ComposeOutput = ComposeSlideDeckOutput;

/** Lowercased alphanumeric tokens of length ≥ 3 — the lexical unit for intent matching. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3);
}

/**
 * How well a template's `style` fits the requested corporate register. Conventional
 * anatomy suits a restricted register; an art-directed world suits an expressive
 * one; `standard` sits comfortably with either.
 */
function corporateFit(style: WorldTemplateDescriptor['style'], suitability: CorporateSuitability): number {
  if (style === 'conventional') {
    return suitability === 'restricted' ? 2 : suitability === 'standard' ? 1 : 0;
  }
  return suitability === 'expressive' ? 2 : suitability === 'standard' ? 1 : 0;
}

interface Scored {
  descriptor: WorldTemplateDescriptor;
  audienceOverlap: number;
  intentMatch: number;
  corporateFit: number;
  score: number;
  sharedAudiences: string[];
  matchedIntentTokens: string[];
}

function scoreTemplate(descriptor: WorldTemplateDescriptor, context: ComposeContext, contentBrief: string): Scored {
  const sharedAudiences = descriptor.audiences.filter((audience) => context.audience.includes(audience));
  const audienceOverlap = sharedAudiences.length;

  // Intent tokens the query carries: business intents + brief + audience labels.
  const queryTokens = new Set(tokenize([...context.businessIntent, contentBrief, ...context.audience].join(' ')));
  // Intent tokens the template advertises: its business intents AND its briefKeywords.
  const descriptorTokens = [
    ...new Set(tokenize([...descriptor.businessIntents, ...descriptor.briefKeywords].join(' '))),
  ];
  const matchedIntentTokens = descriptorTokens.filter((token) => queryTokens.has(token));

  const fit = corporateFit(descriptor.style, context.corporateSuitability);
  const score = audienceOverlap * 2 + matchedIntentTokens.length + fit;

  return {
    descriptor,
    audienceOverlap,
    intentMatch: matchedIntentTokens.length,
    corporateFit: fit,
    score,
    sharedAudiences,
    matchedIntentTokens,
  };
}

/** Extract a descriptor-drawn example for a slot: an `e.g. "…"` in the guidance, else a bound hint. */
function slotExample(slot: SlotSpec): string {
  const match = slot.guidance.match(/e\.g\.\s*["“']([^"”']+)["”']/i);
  if (match?.[1]) return match[1];

  const { maxChars, minItems, maxItems } = slot.limits;
  switch (slot.type) {
    case 'text':
    case 'longtext':
      return maxChars ? `<${slot.type}, ≤${maxChars} chars>` : `<${slot.type}>`;
    case 'number':
      return '<number>';
    default: {
      const lo = minItems ?? 0;
      const hi = maxItems ?? lo;
      return `<${lo}–${hi} ${slot.type}>`;
    }
  }
}

/** Maximum candidates surfaced in `alternatives` (winner included). */
const MAX_ALTERNATIVES = 3;

/** The evidence-format score line for one scored candidate. */
function scoreBreakdown(entry: Scored): string {
  return (
    `${entry.descriptor.id} (${entry.descriptor.experienceId}): audienceOverlap ${entry.audienceOverlap}×2=${entry.audienceOverlap * 2}` +
    ` + intentMatch ${entry.intentMatch} + corporateFit ${entry.corporateFit} = ${entry.score}`
  );
}

/** Map a scored candidate to the client-facing alternative shape. */
function toAlternative(entry: Scored): ComposeAlternative {
  const { descriptor } = entry;
  return {
    worldTemplateId: descriptor.id,
    experienceId: descriptor.experienceId,
    score: entry.score,
    scoreBreakdown: scoreBreakdown(entry),
    style: descriptor.style,
    mood: descriptor.mood,
    grammarId: descriptor.grammarId,
    guidance: descriptor.guidance,
  };
}

function buildFillSkeleton(descriptor: WorldTemplateDescriptor): FillSkeleton {
  const sections: FillSkeletonSection[] = descriptor.sections.map((section) => ({
    kind: section.kind,
    purpose: section.purpose,
    ...(section.repeats ? { repeats: section.repeats } : {}),
    slots: section.slots.map(
      (slot): FillSkeletonSlot => ({ spec: slot, guidance: slot.guidance, example: slotExample(slot) }),
    ),
  }));
  return { sections, craftGuarantees: descriptor.guidance };
}

/**
 * Build the strict-fidelity reference manifest: source-file URIs + byte sizes, never content.
 *
 * DESIGN-BEARING files only (the same `isDesignBearingFile` rule
 * `get_part_reference` applies). Listing the experience's `content.ts` under a
 * note that says "port this design faithfully" told the porter to reproduce
 * shipped editorial copy, which contradicts the BORROW invariant. The fill
 * module stays IN: it is the schema and section specs the template's types
 * come from, not copy.
 */
function buildReference(descriptor: WorldTemplateDescriptor): TemplateReference | undefined {
  const files = listExperienceFiles(descriptor.experienceId)?.filter((f) => isDesignBearingFile(f.path));
  if (!files) return undefined;
  return {
    templateId: descriptor.id,
    sourceFiles: files.map((f) => ({ uri: templateSourceUri(descriptor.id, f.path), path: f.path, bytes: f.bytes })),
    note:
      "Strict fidelity: port this design faithfully - its structure, layout, motion and treatment. These are the design-bearing files only; the experience's own content.ts (its shipped editorial copy) and its registry manifests are deliberately withheld, so write your own copy rather than reproducing theirs. Fetch files individually via resources/read; do NOT load them into the orchestrating agent context (dispatch a subagent to read and port).",
  };
}

/** Build the `NO_TEMPLATE_FIT` outcome (empty surface pool or a zero-score winner). */
function noTemplateFit(
  surface: SurfaceType,
  requestId: string,
  candidates: Scored[],
  evidence: string[],
): ToolOutcome<ComposeOutput> {
  return {
    ok: false,
    error: makeError('NO_TEMPLATE_FIT', `No live ${surface} template fits this brief.`, {
      requestId,
      details: [
        `Live ${surface} templates: ${candidates.map((c) => `${c.descriptor.id} (${c.descriptor.experienceId})`).join(', ') || '(none)'}.`,
        ...evidence.slice(0, 5),
      ],
      remediation: [
        'Adjust audience/businessIntent to match a live template, or request this world be templatized.',
      ],
    }),
  };
}

/**
 * Select ONE live template for `surface` and return its fill skeleton. The single
 * entrypoint every `compose_<surface>` tool delegates to; the deck wrapper passes
 * `surface: 'slide-deck'`.
 */
export function composeForSurface(
  registry: RegistryData,
  surface: SurfaceType,
  context: ComposeContext,
  contentBrief: string,
  toolName: string,
  fidelity: TemplateFidelity,
): ToolOutcome<ComposeOutput> {
  const requestId = newRequestId();

  // Defence-in-depth: each surface wrapper parses its own tight input, but the
  // core re-validates the surface-neutral context so a direct/mis-wired caller
  // still gets a structured INVALID_INPUT rather than a scoring crash.
  const parsedContext = ComposeContext.safeParse(context);
  if (!parsedContext.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', `Invalid compose context for ${toolName}.`, {
        requestId,
        details: parsedContext.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: [`Provide a valid ${toolName} context (audience, businessIntent, corporateSuitability, motionPreference).`],
      }),
    };
  }
  const ctx = parsedContext.data;

  // 1. Surface pre-filter: only templates published for this surface are eligible.
  const surfaceTemplates = registry.worldTemplates.filter((template) => template.surface === surface);
  // 2. Optional styleHint HARD filter, applied within the surface pool.
  const candidates = ctx.styleHint
    ? surfaceTemplates.filter((template) => template.style === ctx.styleHint)
    : [...surfaceTemplates];

  if (candidates.length === 0) {
    // A styleHint that empties a NON-empty surface pool keeps NO_MATCH's meaning;
    // an empty surface pool (nothing published for the surface) is NO_TEMPLATE_FIT.
    if (ctx.styleHint && surfaceTemplates.length > 0) {
      return {
        ok: false,
        error: makeError('NO_MATCH', `No ${surface} template matches styleHint "${ctx.styleHint}".`, {
          requestId,
          details: [`Available ${surface} styles: ${[...new Set(surfaceTemplates.map((t) => t.style))].join(', ')}.`],
          remediation: ['Drop styleHint or set it to an available style.'],
        }),
      };
    }
    return noTemplateFit(surface, requestId, [], []);
  }

  // 3. Optional explicit pin: an id/experienceId from a previous call's
  //    alternatives short-circuits scoring entirely (an explicit pick is never
  //    NO_TEMPLATE_FIT and overrides the styleHint filter). Resolution is
  //    scoped to THIS surface's pool so a cross-surface pin cannot leak.
  if (ctx.pinTemplateId !== undefined) {
    const pin = ctx.pinTemplateId;
    const pinned = surfaceTemplates.find((t) => t.id === pin || t.experienceId === pin);
    if (!pinned) {
      return {
        ok: false,
        error: makeError('UNKNOWN_TEMPLATE', `pinTemplateId "${pin}" is not a live ${surface} template.`, {
          requestId,
          details: [
            `Live ${surface} templates: ${surfaceTemplates.map((t) => `${t.id} (${t.experienceId})`).join(', ') || '(none)'}.`,
          ],
          remediation: [
            "Pin one of this surface's template ids/experienceIds (typically from a previous call's alternatives), or drop pinTemplateId to let scoring decide.",
          ],
        }),
      };
    }
    const pinnedScored = scoreTemplate(pinned, ctx, contentBrief);
    return {
      ok: true,
      data: {
        worldTemplateId: pinned.id,
        experienceId: pinned.experienceId,
        rationale: `Pinned '${pinned.id}' (${pinned.experienceId}, ${pinned.style} style) by explicit pinTemplateId — scoring bypassed; score shown for transparency.`,
        evidence: [scoreBreakdown(pinnedScored)],
        alternatives: [toAlternative(pinnedScored)],
        fillSkeleton: buildFillSkeleton(pinned),
        ...(fidelity === 'strict' ? { reference: buildReference(pinned) } : {}),
      },
    };
  }

  const scored = candidates
    .map((descriptor) => scoreTemplate(descriptor, ctx, contentBrief))
    // Sort by score desc, then id asc — a fully deterministic ranking + tie-break.
    .sort((a, b) => (b.score - a.score) || (a.descriptor.id < b.descriptor.id ? -1 : a.descriptor.id > b.descriptor.id ? 1 : 0));

  const evidence = scored.map(scoreBreakdown);

  const winner = scored[0]!;
  if (winner.score === 0) {
    return noTemplateFit(surface, requestId, scored, evidence);
  }

  // Top-ranked candidates for the client's pick-list: winner first, zero-score
  // excluded (a zero-score "alternative" is not a genuine fit), capped at 3.
  const alternatives = scored
    .filter((entry) => entry.score > 0)
    .slice(0, MAX_ALTERNATIVES)
    .map(toAlternative);

  const descriptor = winner.descriptor;
  const rationaleParts = [
    `Selected '${descriptor.id}' (${descriptor.experienceId}, ${descriptor.style} style)`,
    winner.sharedAudiences.length > 0
      ? `shares audience(s) [${winner.sharedAudiences.join(', ')}]`
      : 'no audience overlap',
    winner.matchedIntentTokens.length > 0
      ? `matched intent keyword(s) [${winner.matchedIntentTokens.join(', ')}]`
      : 'no intent-keyword overlap',
    `${descriptor.style} style fits ${ctx.corporateSuitability} corporate suitability`,
    `motion preference ${ctx.motionPreference} noted (the template locks its own motion)`,
  ];
  const rationale = `${rationaleParts.join('; ')}.`;

  return {
    ok: true,
    data: {
      worldTemplateId: descriptor.id,
      experienceId: descriptor.experienceId,
      rationale,
      evidence,
      alternatives,
      fillSkeleton: buildFillSkeleton(descriptor),
      ...(fidelity === 'strict' ? { reference: buildReference(descriptor) } : {}),
    },
  };
}
