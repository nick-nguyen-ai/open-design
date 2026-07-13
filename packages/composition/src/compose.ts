import type {
  ComponentManifest,
  ComponentPlacement,
  ContentDensity,
  DesignBlueprint,
  DesignContext,
  MotionLevel,
  MotionSequence,
  RecommendationEvidence,
  SectionBlueprint,
  SurfaceType,
  BlueprintAlternative,
} from '@enterprise-design/contracts';
import type { AlternativeMode, ComposeOptions, CompositionRegistry } from './types.js';
import { selectGrammar } from './grammar.js';
import {
  companionSatisfied,
  conflictsWithPlaced,
  rankCandidates,
  type Candidate,
} from './components.js';
import { routePathFor, surfaceMotionCap } from './surface-rules.js';
import { blueprintIdFrom } from './hash.js';
import type { CompositionRole } from '@enterprise-design/contracts';

const ALL_MODES: AlternativeMode[] = ['conservative', 'recommended', 'expressive'];

/** An intent to place one component in one section, resolved from the content inventory. */
interface SectionSpec {
  id: string;
  purpose: string;
  role: CompositionRole;
  candidate: Candidate;
  region: string;
  contentPath: string;
  visual: boolean;
}

/**
 * Deterministically compose a {@link DesignBlueprint} from a
 * {@link DesignContext} and compiled registry data, following the plan §16.1
 * stages. Pure and side-effect-free: identical inputs yield a byte-identical
 * blueprint (ids come from FNV-1a hashes of structural content, never randomness).
 */
export function composeDesign(
  context: DesignContext,
  registry: CompositionRegistry,
  options: ComposeOptions = {},
): DesignBlueprint {
  const selectedMode = options.alternativeMode ?? 'recommended';
  const pool = options.selectedComponentIds ? new Set(options.selectedComponentIds) : undefined;

  // Stage 1 — grammar + theme.
  const grammarChoice = selectGrammar(context, registry);
  const grammar = grammarChoice.grammar;
  const themeId = context.themeMode === 'dark' ? 'enterprise-neutral-dark' : 'enterprise-neutral-light';

  // Stages 3–6 — build the ordered baseline section specs from the inventory,
  // selecting a compatible component per role incrementally.
  const { specs: baseSpecs, rejected } = buildSpecs(context, registry, pool);

  // Stage 8 — the one signature motion sequence for this surface+grammar.
  const signature = pickSignature(grammar.signatureSequences, registry);

  const cap = surfaceMotionCap(context.surface);
  const recommendedMotion = Math.min(context.motionPreference, cap) as MotionLevel;

  // Materialise every alternative so we can (a) emit the selected one and
  // (b) summarise the structural deltas of all three.
  const variants = new Map<AlternativeMode, ReturnType<typeof materialiseVariant>>();
  for (const mode of ALL_MODES) {
    variants.set(mode, materialiseVariant(mode, baseSpecs, recommendedMotion, cap, context, signature));
  }
  const chosen = variants.get(selectedMode);
  if (!chosen) throw new Error(`unknown alternative mode: ${selectedMode}`);

  const alternatives: BlueprintAlternative[] = ALL_MODES.map((mode) => {
    const v = variants.get(mode);
    if (!v) throw new Error(`missing variant: ${mode}`);
    return {
      mode,
      blueprintId: v.blueprintId,
      differenceSummary: differenceSummary(mode, variants.get('recommended')!, v),
    };
  });

  // Stage 10 — evidence (grammar first, then one entry per placed component, deduped).
  const evidence = collectEvidence(grammarChoice.evidence, chosen.sections);

  const notes = implementationNotes(context, rejected, grammar.id);

  return {
    schemaVersion: '1.0',
    blueprintId: chosen.blueprintId,
    title: titleFor(context),
    rationale:
      `Composed for a ${context.surface} addressing ${context.audience.join(', ')}. ` +
      `Grammar ${grammar.id} selected (${grammarChoice.evidence.explanation})`,
    surface: context.surface,
    audience: context.audience,
    grammarId: grammar.id,
    themeId,
    motionLevel: chosen.motionLevel,
    density: context.density,
    routes: [
      {
        path: routePathFor(context.surface),
        title: titleFor(context),
        purpose: context.contentSummary || `${context.surface} experience`,
        layoutComponentId: layoutFor(context.surface),
        sections: chosen.sections,
      },
    ],
    globalComponents: [],
    tokens: { density: densityToken(context.density) },
    responsiveStrategy: responsiveStrategy(context.density),
    accessibilityStrategy: accessibilityStrategy(context, chosen.sections),
    implementationNotes: notes,
    alternatives,
    evidence,
  };
}

/** Ordered content→role→component intents derived from the inventory (§16.1 stages 4–6). */
function buildSpecs(
  context: DesignContext,
  registry: CompositionRegistry,
  pool: Set<string> | undefined,
): { specs: SectionSpec[]; rejected: string[] } {
  const inv = context.availableContent;
  const specs: SectionSpec[] = [];
  const rejected: string[] = [];
  const placed: ComponentManifest[] = [];

  // Each candidate section: [predicate, id, purpose, role, contentPath, visual]
  const plan: Array<{
    when: boolean;
    id: string;
    purpose: string;
    role: CompositionRole;
    contentPath: string;
    visual: boolean;
    prefer: string;
  }> = [
    { when: inv.kpis > 0, id: 'summary', purpose: 'Headline metrics', role: 'summary', contentPath: 'availableContent.kpis', visual: false, prefer: 'comp.kpi-tile' },
    { when: inv.timeSeries > 0, id: 'trend', purpose: 'Trend over time', role: 'primary-visual', contentPath: 'availableContent.timeSeries', visual: true, prefer: 'comp.trend-chart' },
    { when: inv.categories > 0, id: 'breakdown', purpose: 'Category breakdown', role: 'secondary-visual', contentPath: 'availableContent.categories', visual: true, prefer: 'comp.category-bar-chart' },
    { when: inv.processes > 0, id: 'process', purpose: 'Process / flow', role: 'detail', contentPath: 'availableContent.processes', visual: true, prefer: 'comp.flow-diagram' },
    { when: inv.risks + inv.decisions + inv.entities > 0, id: 'status', purpose: 'Status and evidence', role: 'detail', contentPath: 'availableContent.risks', visual: false, prefer: 'comp.status-list' },
  ];

  for (const item of plan) {
    if (!item.when) continue;
    const { ranked, rejected: rej } = rankCandidates(item.role, context, registry, pool);
    rejected.push(...rej.map((r) => `${item.id}: ${r}`));

    const eligible = (c: Candidate) =>
      !conflictsWithPlaced(c.component, placed) && companionSatisfied(c.component, placed);
    // Content-type preference: land the natural component for this content
    // (e.g. a trend chart for a time series) when it is eligible; otherwise take
    // the top-ranked compatible candidate.
    const pick =
      ranked.find((c) => c.component.id === item.prefer && eligible(c)) ?? ranked.find(eligible);
    if (!pick) {
      rejected.push(`${item.id}: no compatible component for role ${item.role}`);
      continue;
    }
    placed.push(pick.component);
    specs.push({
      id: item.id,
      purpose: item.purpose,
      role: item.role,
      candidate: pick,
      region: `${item.id}-region`,
      contentPath: item.contentPath,
      visual: item.visual,
    });
  }

  return { specs, rejected };
}

interface Variant {
  blueprintId: string;
  motionLevel: MotionLevel;
  sections: SectionBlueprint[];
}

function materialiseVariant(
  mode: AlternativeMode,
  baseSpecs: SectionSpec[],
  recommendedMotion: MotionLevel,
  cap: MotionLevel,
  context: DesignContext,
  signature: MotionSequence | undefined,
): Variant {
  let specs = [...baseSpecs];
  let motionLevel: MotionLevel = recommendedMotion;

  if (mode === 'conservative') {
    // Simpler structure: drop secondary visuals; calmer motion.
    specs = specs.filter((s) => s.role !== 'secondary-visual');
    motionLevel = Math.max(0, recommendedMotion - 1) as MotionLevel;
  } else if (mode === 'expressive') {
    // Higher intensity: lead with a primary visual, raise motion within cap.
    const firstVisual = specs.findIndex((s) => s.role === 'primary-visual');
    if (firstVisual > 0) {
      const [v] = specs.splice(firstVisual, 1);
      if (v) specs.unshift(v);
    }
    motionLevel = Math.min(cap, recommendedMotion + 1) as MotionLevel;
  }

  const sections =
    specs.length > 0
      ? specs.map((spec, index) => toSection(spec, index, index === 0 ? signature : undefined))
      : [fallbackSection(signature)];

  const blueprintId = blueprintIdFrom({
    surface: context.surface,
    mode,
    motionLevel,
    order: specs.map((s) => s.id),
    components: specs.map((s) => s.candidate.component.id),
  });

  return { blueprintId, motionLevel, sections };
}

function toSection(
  spec: SectionSpec,
  order: number,
  signature: MotionSequence | undefined,
): SectionBlueprint {
  const component = spec.candidate.component;
  const placement: ComponentPlacement = {
    componentId: component.id,
    variant: 'default',
    role: spec.role,
    region: spec.region,
    priority: order + 1,
    propsMapping: { data: spec.contentPath },
    responsiveRules: [`${component.id} reflows to stacked below md`],
    fallbackComponentId: component.performance.fallbackComponentId,
  };
  const section: SectionBlueprint = {
    id: spec.id,
    purpose: spec.purpose,
    order,
    componentPlacements: [placement],
    contentMapping: { [spec.id]: spec.contentPath },
  };
  if (signature) section.motionSequence = signature;
  return section;
}

/**
 * A component-free lead section, used only when no registry component fits the
 * surface (e.g. `personal-page`, which no current component targets). It still
 * carries the signature motion and narrative content mapping so the blueprint
 * has a valid IA and exactly one signature moment.
 */
function fallbackSection(signature: MotionSequence | undefined): SectionBlueprint {
  const section: SectionBlueprint = {
    id: 'overview',
    purpose: 'Narrative overview',
    order: 0,
    componentPlacements: [],
    contentMapping: { overview: 'availableContent.headings' },
  };
  if (signature) section.motionSequence = signature;
  return section;
}

function pickSignature(
  signatureSequences: string[],
  registry: CompositionRegistry,
): MotionSequence | undefined {
  const id = signatureSequences[0];
  if (!id) return undefined;
  return registry.motionSequences.find((m) => m.sequenceId === id);
}

/** Structural deltas vs the recommended variant (never a theme swap). */
function differenceSummary(mode: AlternativeMode, recommended: Variant, v: Variant): string[] {
  if (mode === 'recommended') return ['Baseline recommended composition — best balance of structure and motion.'];
  const out: string[] = [];
  out.push(`Motion level ${recommended.motionLevel} → ${v.motionLevel}.`);
  const recIds = recommended.sections.map((s) => s.id);
  const vIds = v.sections.map((s) => s.id);
  if (recIds.length !== vIds.length) out.push(`Section count ${recIds.length} → ${vIds.length}.`);
  if (recIds.join(',') !== vIds.join(',')) out.push(`Section order ${recIds.join(' > ')} → ${vIds.join(' > ')}.`);
  const dropped = recIds.filter((id) => !vIds.includes(id));
  if (dropped.length) out.push(`Removed sections: ${dropped.join(', ')}.`);
  if (out.length === 1) out.push(mode === 'conservative' ? 'Simplified structure.' : 'Heightened visual emphasis.');
  return out;
}

function collectEvidence(
  grammarEvidence: RecommendationEvidence,
  sections: SectionBlueprint[],
): RecommendationEvidence[] {
  const out: RecommendationEvidence[] = [grammarEvidence];
  const seen = new Set<string>();
  for (const section of sections) {
    for (const placement of section.componentPlacements) {
      if (seen.has(placement.componentId)) continue;
      seen.add(placement.componentId);
      out.push({
        componentId: placement.componentId,
        matchedIntents: [],
        matchedConstraints: [`role:${placement.role}`, `region:${placement.region}`],
        score: placement.priority,
        explanation: `${placement.componentId} placed in ${placement.region} as ${placement.role}.`,
      });
    }
  }
  return out;
}

function implementationNotes(context: DesignContext, rejected: string[], grammarId: string): string[] {
  const notes: string[] = [`corporate-mode:${context.corporateSuitability}`, `grammar:${grammarId}`];
  if (context.availableContent.processes > 0 && context.corporateSuitability === 'restricted') {
    notes.push(
      'Process content present but no restricted-safe diagram component exists; supply an approved textual/structured alternative.',
    );
  }
  if (rejected.length) notes.push(`Rejected candidates: ${rejected.join('; ')}`);
  return notes;
}

function titleFor(context: DesignContext): string {
  const label = context.surface
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return context.businessIntent[0] ? `${label}: ${context.businessIntent[0]}` : label;
}

function layoutFor(surface: SurfaceType): string {
  switch (surface) {
    case 'dashboard':
      return 'layout.dashboard-grid';
    case 'slide-deck':
      return 'layout.deck-slides';
    case 'project-page':
      return 'layout.project-article';
    case 'personal-page':
      return 'layout.personal-landing';
    case 'technical-explainer':
      return 'layout.explainer-reading-flow';
  }
}

function densityToken(density: ContentDensity): 'compact' | 'default' | 'spacious' {
  if (density === 'low') return 'compact';
  if (density === 'high') return 'spacious';
  return 'default';
}

function responsiveStrategy(density: ContentDensity): DesignBlueprint['responsiveStrategy'] {
  return {
    breakpoints: ['sm', 'md', 'lg', 'xl'],
    reflowRules: ['Multi-column zones collapse to a single stacked column below md.'],
    densityReduction:
      density === 'high'
        ? ['Secondary metrics summarised into a single roll-up below md.']
        : ['Non-essential captions hidden below sm.'],
    touchAdjustments: ['Tap targets enlarged to 44px minimum on coarse pointers.'],
  };
}

function accessibilityStrategy(
  context: DesignContext,
  sections: SectionBlueprint[],
): DesignBlueprint['accessibilityStrategy'] {
  const chartEquivalents: Record<string, string> = {};
  const liveRegions: string[] = [];
  for (const section of sections) {
    for (const placement of section.componentPlacements) {
      if (placement.role === 'primary-visual' || placement.role === 'secondary-visual') {
        chartEquivalents[placement.region] =
          `Data table / prose summary of ${placement.componentId} at ${placement.region}.`;
      }
      if (placement.role === 'detail' || placement.role === 'evidence') {
        liveRegions.push(`${placement.region} announces status changes politely.`);
      }
    }
  }
  const headingOutline =
    context.availableContent.headings.length > 0
      ? context.availableContent.headings.map((h, i) => `${i === 0 ? 'h1' : 'h2'} ${h}`)
      : sections.map((s, i) => `${i === 0 ? 'h1' : 'h2'} ${s.purpose}`);

  return {
    landmarkPlan: ['banner', 'main', 'contentinfo'],
    headingOutline,
    focusOrderNotes: ['Focus enters at the first section and follows document order through each region.'],
    liveRegions,
    chartEquivalents,
  };
}
