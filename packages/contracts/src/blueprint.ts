import { z } from 'zod';
import { ContentDensity, CompositionRole, MotionLevel, SurfaceType, Audience } from './enums.js';
import { MotionSequence } from './motion.js';
import { RecommendationEvidence } from './recommendation.js';

/**
 * Plan §7.6 TokenOverrides. Only *semantic* token names may appear as keys and
 * values; raw colour literals (hex/rgb/hsl) are rejected downstream by the
 * validator rule THEME-001, not by this schema — the schema keeps the shape
 * permissive so a violating override can be constructed, validated, and
 * rejected with a precise finding.
 */
export const TokenOverrides = z.object({
  colour: z.record(z.string(), z.string()).optional(),
  typography: z.record(z.string(), z.string()).optional(),
  density: z.enum(['compact', 'default', 'spacious']).optional(),
});
export type TokenOverrides = z.infer<typeof TokenOverrides>;

/** Plan §7.6 ResponsiveStrategy. */
export const ResponsiveStrategy = z.object({
  breakpoints: z.array(z.enum(['sm', 'md', 'lg', 'xl'])),
  reflowRules: z.array(z.string()),
  densityReduction: z.array(z.string()),
  touchAdjustments: z.array(z.string()),
});
export type ResponsiveStrategy = z.infer<typeof ResponsiveStrategy>;

/** Plan §7.6 AccessibilityStrategy. `chartEquivalents` maps a chart placement id to its textual-equivalent plan. */
export const AccessibilityStrategy = z.object({
  landmarkPlan: z.array(z.string()),
  headingOutline: z.array(z.string()),
  focusOrderNotes: z.array(z.string()),
  liveRegions: z.array(z.string()),
  chartEquivalents: z.record(z.string(), z.string()),
});
export type AccessibilityStrategy = z.infer<typeof AccessibilityStrategy>;

/** Plan §7.6 BlueprintAlternative. `differenceSummary` must record structural differences, never a bare theme swap. */
export const BlueprintAlternative = z.object({
  mode: z.enum(['conservative', 'recommended', 'expressive']),
  blueprintId: z.string(),
  differenceSummary: z.array(z.string()),
});
export type BlueprintAlternative = z.infer<typeof BlueprintAlternative>;

/** Plan §7.4 ComponentPlacement. */
export const ComponentPlacement = z.object({
  componentId: z.string(),
  variant: z.string(),
  role: CompositionRole,
  region: z.string(),
  priority: z.number(),
  propsMapping: z.record(z.string(), z.string()),
  responsiveRules: z.array(z.string()),
  fallbackComponentId: z.string().optional(),
});
export type ComponentPlacement = z.infer<typeof ComponentPlacement>;

/** Plan §7.4 SectionBlueprint. */
export const SectionBlueprint = z.object({
  id: z.string(),
  purpose: z.string(),
  order: z.number(),
  componentPlacements: z.array(ComponentPlacement),
  contentMapping: z.record(z.string(), z.string()),
  motionSequence: MotionSequence.optional(),
});
export type SectionBlueprint = z.infer<typeof SectionBlueprint>;

/** Plan §7.4 RouteBlueprint. */
export const RouteBlueprint = z.object({
  path: z.string(),
  title: z.string(),
  purpose: z.string(),
  layoutComponentId: z.string(),
  navigationComponentId: z.string().optional(),
  sections: z.array(SectionBlueprint),
});
export type RouteBlueprint = z.infer<typeof RouteBlueprint>;

/** Plan §7.4 DesignBlueprint — the full deterministic composition output. */
export const DesignBlueprint = z.object({
  schemaVersion: z.literal('1.0'),
  blueprintId: z.string(),
  title: z.string(),
  rationale: z.string(),
  surface: SurfaceType,
  audience: z.array(Audience),
  grammarId: z.string(),
  themeId: z.string(),
  motionLevel: MotionLevel,
  density: ContentDensity,
  routes: z.array(RouteBlueprint),
  globalComponents: z.array(ComponentPlacement),
  tokens: TokenOverrides,
  responsiveStrategy: ResponsiveStrategy,
  accessibilityStrategy: AccessibilityStrategy,
  implementationNotes: z.array(z.string()),
  alternatives: z.array(BlueprintAlternative),
  evidence: z.array(RecommendationEvidence),
});
export type DesignBlueprint = z.infer<typeof DesignBlueprint>;
