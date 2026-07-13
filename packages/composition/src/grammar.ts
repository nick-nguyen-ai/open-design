import type {
  ComponentManifest,
  DesignContext,
  DesignGrammar,
  RecommendationEvidence,
} from '@enterprise-design/contracts';
import type { CompositionRegistry } from './types.js';
import { surfaceMotionCap } from './surface-rules.js';

export interface GrammarChoice {
  grammar: DesignGrammar;
  score: number;
  evidence: RecommendationEvidence;
}

/**
 * `recommendGrammars`-style scoring. Grammar manifests carry no structured
 * surface/density/corporate fields, so a grammar's affinity is derived from
 * the facets of its `preferredComponents` (real manifest fields): surface fit,
 * density fit, corporate fit, plus a motion-cap check. Deterministic: the top
 * score wins; ties break by grammar id ascending.
 */
export function selectGrammar(context: DesignContext, registry: CompositionRegistry): GrammarChoice {
  const byId = new Map(registry.components.map((c) => [c.id, c]));

  const ranked = registry.grammars
    .map((grammar) => scoreGrammar(grammar, context, byId))
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.grammar.id < b.grammar.id ? -1 : 1));

  // Guaranteed non-empty: the registry ships 10 grammars.
  return ranked[0] as GrammarChoice;
}

function scoreGrammar(
  grammar: DesignGrammar,
  context: DesignContext,
  byId: Map<string, ComponentManifest>,
): GrammarChoice {
  const preferred = grammar.preferredComponents
    .map((id) => byId.get(id))
    .filter((c): c is ComponentManifest => c !== undefined);

  const total = Math.max(preferred.length, 1);
  const surfaceHits = preferred.filter((c) => c.compatibleSurfaces.includes(context.surface)).length;
  const densityHits = preferred.filter(
    (c) => c.density.includes(context.density) || c.density.includes('adaptive'),
  ).length;
  const corpHits = preferred.filter((c) =>
    c.corporateSuitability.includes(context.corporateSuitability),
  ).length;
  const audienceHit = preferred.some((c) => c.audiences.some((a) => context.audience.includes(a)));
  const grammarMotionCap = preferred.reduce((m, c) => Math.max(m, c.motionLevel), 0);
  const motionOk = context.motionPreference <= Math.min(grammarMotionCap, surfaceMotionCap(context.surface));

  const surfaceScore = (surfaceHits / total) * 3;
  const densityScore = densityHits / total;
  const corpScore = (corpHits / total) * 2;
  const audienceScore = audienceHit ? 1 : 0;
  const motionScore = motionOk ? 1 : 0;
  const score =
    Math.round((surfaceScore + densityScore + corpScore + audienceScore + motionScore) * 1000) / 1000;

  const matchedConstraints: string[] = [];
  if (surfaceHits > 0) matchedConstraints.push(`surface:${context.surface}`);
  if (densityHits > 0) matchedConstraints.push(`density:${context.density}`);
  if (corpHits > 0) matchedConstraints.push(`corporate:${context.corporateSuitability}`);
  if (motionOk) matchedConstraints.push(`motion<=${surfaceMotionCap(context.surface)}`);

  return {
    grammar,
    score,
    evidence: {
      componentId: grammar.id,
      matchedIntents: context.businessIntent,
      matchedConstraints,
      score,
      explanation:
        `Grammar ${grammar.id} scored ${score} — ${surfaceHits}/${total} preferred components fit ${context.surface}, ` +
        `${corpHits}/${total} fit corporate level ${context.corporateSuitability}` +
        (audienceHit ? ', audience overlap present' : '') +
        (motionOk ? '.' : '; motion preference exceeds cap.'),
    },
  };
}
