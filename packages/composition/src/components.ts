import type {
  ComponentManifest,
  CompositionRole,
  DesignContext,
  RecommendationEvidence,
} from '@enterprise-design/contracts';
import type { CompositionRegistry } from './types.js';

export interface Candidate {
  component: ComponentManifest;
  score: number;
  evidence: RecommendationEvidence;
}

/** A component is "costly" (PERF/§16.2) when its render cost is high or its gzip bundle is heavy. */
export const COSTLY_BUNDLE_KB = 40;
export function isCostly(component: ComponentManifest): boolean {
  return component.performance.renderingCost === 'high' || component.performance.bundleCostKbGzip >= COSTLY_BUNDLE_KB;
}

/**
 * Rank the components that can fill `role` for `context`, hard-filtering on
 * role membership, surface compatibility and corporate suitability (restricted
 * contexts never see expressive-only components — this keeps CORP-001 clean).
 * Deterministic: sort by score desc, then component id asc.
 */
export function rankCandidates(
  role: CompositionRole,
  context: DesignContext,
  registry: CompositionRegistry,
  pool?: ReadonlySet<string>,
): { ranked: Candidate[]; rejected: string[] } {
  const rejected: string[] = [];
  const ranked: Candidate[] = [];

  for (const component of registry.components) {
    if (pool && !pool.has(component.id)) continue;
    if (!component.compatibility.compositionRoles.includes(role)) continue;

    if (!component.compatibleSurfaces.includes(context.surface)) {
      rejected.push(`${component.id}: incompatible with surface ${context.surface}`);
      continue;
    }
    if (!component.corporateSuitability.includes(context.corporateSuitability)) {
      rejected.push(`${component.id}: not suitable at corporate level ${context.corporateSuitability}`);
      continue;
    }

    ranked.push(scoreComponent(component, role, context));
  }

  ranked.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.component.id < b.component.id ? -1 : 1,
  );
  return { ranked, rejected };
}

function scoreComponent(
  component: ComponentManifest,
  role: CompositionRole,
  context: DesignContext,
): Candidate {
  const matchedIntents = component.businessIntents.filter((i) => context.businessIntent.includes(i));
  const audienceOverlap = component.audiences.filter((a) => context.audience.includes(a));
  const densityFit = component.density.includes(context.density) || component.density.includes('adaptive');

  let score = 1; // base for a role- and surface-eligible component
  score += matchedIntents.length;
  score += audienceOverlap.length * 0.5;
  if (densityFit) score += 0.5;
  score = Math.round(score * 1000) / 1000;

  const matchedConstraints = [`role:${role}`, `surface:${context.surface}`];
  if (densityFit) matchedConstraints.push(`density:${context.density}`);

  return {
    component,
    score,
    evidence: {
      componentId: component.id,
      matchedIntents,
      matchedConstraints,
      score,
      explanation:
        `${component.id} fills the ${role} role on ${context.surface}` +
        (matchedIntents.length ? `, matching intents ${matchedIntents.join(', ')}` : '') +
        (audienceOverlap.length ? `, audience ${audienceOverlap.join(', ')}` : '') +
        '.',
    },
  };
}

/**
 * Incremental compatibility gate (§16.1 stage 6). Given the components already
 * placed, decide whether `candidate` may join: reject on an explicit
 * `conflictsWith` edge in either direction.
 */
export function conflictsWithPlaced(
  candidate: ComponentManifest,
  placed: ReadonlyArray<ComponentManifest>,
): string | undefined {
  for (const p of placed) {
    if (candidate.compatibility.conflictsWith.includes(p.id)) return p.id;
    if (p.compatibility.conflictsWith.includes(candidate.id)) return p.id;
  }
  return undefined;
}

/** Companion satisfied when the placed set intersects the candidate's `requiresOneOf` (empty = no requirement). */
export function companionSatisfied(
  candidate: ComponentManifest,
  placed: ReadonlyArray<ComponentManifest>,
): boolean {
  const req = candidate.compatibility.requiresOneOf;
  if (req.length === 0) return true;
  return placed.some((p) => req.includes(p.id));
}
