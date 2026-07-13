/**
 * `compose_slide_deck` domain logic — adapter-independent (no SDK import).
 *
 * Deterministically selects ONE world-template for a slide-deck brief and returns
 * its fill skeleton — the descriptor's slide kinds with per-slot guidance and a
 * descriptor-drawn example, plus the craft guarantees the template makes. The
 * tool never invents content: every example is extracted from the descriptor
 * (an `e.g.` in the slot guidance, or a bound hint derived from the slot's
 * type + limits).
 *
 * Selection scoring (mirrors `selectGrammar`'s deterministic posture):
 *   score = audienceOverlap×2 + intentKeywordMatch + corporateFit,
 * with `styleHint` as a HARD pre-filter and a stable tie-break by template id.
 *
 * Returns a structured {@link ToolOutcome}: the selection on success, a contracts
 * `INVALID_INPUT` for a malformed context, or `NO_MATCH` when a styleHint filters
 * every template out. Never throws for expected failures.
 */
import type { CorporateSuitability, SlotSpec, WorldTemplateDescriptor } from '@enterprise-design/contracts';
import {
  ComposeSlideDeckInput,
  type ComposeSlideDeckOutput,
  type FillSkeleton,
  type FillSkeletonSlideKind,
  type FillSkeletonSlot,
  type SlideDeckContext,
} from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';

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

function scoreTemplate(descriptor: WorldTemplateDescriptor, context: SlideDeckContext, contentBrief: string): Scored {
  const sharedAudiences = descriptor.audiences.filter((audience) => context.audience.includes(audience));
  const audienceOverlap = sharedAudiences.length;

  // Intent tokens the query carries: business intents + brief + audience labels.
  const queryTokens = new Set(tokenize([...context.businessIntent, contentBrief, ...context.audience].join(' ')));
  // Intent tokens the template advertises: its business intents.
  const descriptorTokens = [...new Set(tokenize(descriptor.businessIntents.join(' ')))];
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

function buildFillSkeleton(descriptor: WorldTemplateDescriptor): FillSkeleton {
  const slideKinds: FillSkeletonSlideKind[] = descriptor.slideKinds.map((slideKind) => ({
    kind: slideKind.kind,
    purpose: slideKind.purpose,
    ...(slideKind.repeats ? { repeats: slideKind.repeats } : {}),
    slots: slideKind.slots.map(
      (slot): FillSkeletonSlot => ({ spec: slot, guidance: slot.guidance, example: slotExample(slot) }),
    ),
  }));
  return { slideKinds, craftGuarantees: descriptor.guidance };
}

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

  const { context, contentBrief } = parsed.data;

  // `worldTemplates` is the de-duplicated descriptor list (the by-id map holds
  // each twice — id + experienceId — so we select over the array, not the map).
  const templates = registry.worldTemplates;
  const candidates = context.styleHint
    ? templates.filter((template) => template.style === context.styleHint)
    : [...templates];

  if (candidates.length === 0) {
    return {
      ok: false,
      error: makeError('NO_MATCH', `No world-template matches styleHint "${context.styleHint}".`, {
        requestId,
        details: [`Available styles: ${[...new Set(templates.map((t) => t.style))].join(', ')}.`],
        remediation: ['Drop styleHint or set it to an available style.'],
      }),
    };
  }

  const scored = candidates
    .map((descriptor) => scoreTemplate(descriptor, context, contentBrief))
    // Sort by score desc, then id asc — a fully deterministic ranking + tie-break.
    .sort((a, b) => (b.score - a.score) || (a.descriptor.id < b.descriptor.id ? -1 : a.descriptor.id > b.descriptor.id ? 1 : 0));

  const winner = scored[0]!;
  const descriptor = winner.descriptor;

  const evidence = scored.map(
    (entry) =>
      `${entry.descriptor.id} (${entry.descriptor.experienceId}): audienceOverlap ${entry.audienceOverlap}×2=${entry.audienceOverlap * 2}` +
      ` + intentMatch ${entry.intentMatch} + corporateFit ${entry.corporateFit} = ${entry.score}`,
  );

  const rationaleParts = [
    `Selected '${descriptor.id}' (${descriptor.experienceId}, ${descriptor.style} style)`,
    winner.sharedAudiences.length > 0
      ? `shares audience(s) [${winner.sharedAudiences.join(', ')}]`
      : 'no audience overlap',
    winner.matchedIntentTokens.length > 0
      ? `matched intent keyword(s) [${winner.matchedIntentTokens.join(', ')}]`
      : 'no intent-keyword overlap',
    `${descriptor.style} style fits ${context.corporateSuitability} corporate suitability`,
    `motion preference ${context.motionPreference} noted (the template locks its own motion)`,
  ];
  const rationale = `${rationaleParts.join('; ')}.`;

  return {
    ok: true,
    data: {
      worldTemplateId: descriptor.id,
      experienceId: descriptor.experienceId,
      rationale,
      evidence,
      fillSkeleton: buildFillSkeleton(descriptor),
    },
  };
}
