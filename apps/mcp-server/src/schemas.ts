/**
 * Tool input/output schemas — adapter-independent.
 *
 * Each tool has ONE tight input schema, used for BOTH the advertised
 * `tools/list` JSON Schema (bounds + defaults + per-field `.describe()`) AND
 * validation. The SDK validates arguments against it and applies defaults;
 * the domain handlers re-validate against the same schema so they stay
 * correct when called directly. Any validation failure becomes a structured
 * `INVALID_INPUT` {@link McpError} — by the domain handler when it owns the
 * parse, and by the adapter's error wrapper when the SDK rejects arguments
 * before the handler runs (see `server.ts`).
 *
 * Outputs reuse the contracts schemas directly, so a tool response is checked
 * against the same shape the rest of the system trusts.
 */
import { z } from 'zod';
import {
  ApprovalState,
  Audience,
  ComponentCategory,
  ContentDensity,
  CorporateSuitability,
  DesignBlueprint,
  DesignContext,
  EntityType,
  MotionLevel,
  SearchFacets,
  SurfaceType,
  ThemeMode,
  ValidationResult,
} from '@enterprise-design/contracts';
import type { FacetFilter } from '@enterprise-design/search';

/** Hard facet filters, mirroring the search package's {@link FacetFilter}: array-valued facets match on ANY intersection, scalars on equality. */
export const FacetFilterSchema = z.object({
  surface: SurfaceType.optional(),
  audiences: z.union([Audience, z.array(Audience)]).optional(),
  grammarId: z.string().optional(),
  category: ComponentCategory.optional(),
  density: z.union([ContentDensity, z.array(ContentDensity)]).optional(),
  corporateSuitability: z.union([CorporateSuitability, z.array(CorporateSuitability)]).optional(),
  motionLevel: MotionLevel.optional(),
  approval: ApprovalState.optional(),
  renderingCost: z.enum(['low', 'medium', 'high']).optional(),
  themeModes: z.union([ThemeMode, z.array(ThemeMode)]).optional(),
  usesCanvas: z.boolean().optional(),
  usesWebGL: z.boolean().optional(),
});

// A compile-time check that the schema stays in lockstep with the package interface.
type _FacetFilterMatches = z.infer<typeof FacetFilterSchema> extends FacetFilter
  ? FacetFilter extends z.infer<typeof FacetFilterSchema>
    ? true
    : false
  : false;
const _facetFilterMatches: _FacetFilterMatches = true;
void _facetFilterMatches;

// ---- get_component ---------------------------------------------------------

/** Tight input schema for `get_component` (advertised AND validated). */
export const GetComponentInput = z.object({
  componentId: z.string().min(1).describe("Exact component id, e.g. 'comp.trend-chart'."),
});
export type GetComponentInput = z.infer<typeof GetComponentInput>;

// ---- search_components ------------------------------------------------------

/** Tight input schema for `search_components` (advertised AND validated); defaults are applied by the SDK and re-applied by the handler. */
export const SearchComponentsInput = z.object({
  query: z
    .string()
    .min(1)
    .describe("Natural-language intent or keywords, e.g. 'time series line chart'."),
  filters: FacetFilterSchema.optional().describe(
    'Optional hard facet filters (surface, audiences, category, density, corporateSuitability, motionLevel, approval, renderingCost, themeModes, usesCanvas, usesWebGL). A component must satisfy every provided facet to appear.',
  ),
  entityTypes: z
    .array(EntityType)
    .default(['component'])
    .describe('Entity types to search. Defaults to components; may include experience, grammar, or motion.'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe('Maximum results to return, between 1 and 50. Defaults to 10.'),
});
export type SearchComponentsInput = z.infer<typeof SearchComponentsInput>;

/** One ranked hit: enough to render a card AND to follow up with `get_component` (the `id`). */
export const SearchComponentResult = z.object({
  id: z.string(),
  entityType: EntityType,
  title: z.string(),
  summary: z.string(),
  score: z.number(),
  matchedTerms: z.array(z.string()),
  facets: SearchFacets,
});
export type SearchComponentResult = z.infer<typeof SearchComponentResult>;

/** `search_components` structured output: the truncated page plus the true total and a human note. */
export const SearchComponentsOutput = z.object({
  results: z.array(SearchComponentResult),
  totalMatched: z.number().int(),
  note: z.string().optional(),
});
export type SearchComponentsOutput = z.infer<typeof SearchComponentsOutput>;

// ---- compose_design ---------------------------------------------------------

/** Which structural variant `compose_design` promotes to the returned blueprint (plan §18.3). */
export const AlternativeMode = z.enum(['conservative', 'recommended', 'expressive']);
export type AlternativeMode = z.infer<typeof AlternativeMode>;

/**
 * Tight input schema for `compose_design` (advertised AND validated). The full
 * `context` is the contracts `DesignContext`, so a malformed context is rejected
 * as a structured `INVALID_INPUT` before composition runs.
 */
export const ComposeDesignInput = z.object({
  context: DesignContext.describe(
    'The full DesignContext: surface, audience, business intent, available content inventory, density, motion preference, theme, corporate suitability, and technical/accessibility constraints.',
  ),
  selectedComponentIds: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Optional allow-list of component ids to compose from (still filtered by role/surface/corporate compatibility). Every id must exist; omit to consider the whole catalogue.',
    ),
  alternativeMode: AlternativeMode.default('recommended').describe(
    "Structural variant to return: 'conservative' (simpler, calmer), 'recommended' (balanced, the default), or 'expressive' (higher visual emphasis and motion).",
  ),
});
export type ComposeDesignInput = z.infer<typeof ComposeDesignInput>;

/** `compose_design` structured output: the deterministic blueprint. */
export const ComposeDesignOutput = z.object({
  blueprint: DesignBlueprint,
});
export type ComposeDesignOutput = z.infer<typeof ComposeDesignOutput>;

// ---- validate_composition ---------------------------------------------------

/** Validation strictness (plan §17.3); later profiles escalate warnings to errors. */
export const ValidationProfile = z.enum(['draft', 'corporate', 'release']);
export type ValidationProfile = z.infer<typeof ValidationProfile>;

/**
 * Tight input schema for `validate_composition` (advertised AND validated). The
 * `blueprint` is the contracts `DesignBlueprint`, so a structurally malformed
 * blueprint is rejected as `INVALID_INPUT`; a blueprint that is well-formed but
 * fails design rules is a SUCCESSFUL call returning findings.
 */
export const ValidateCompositionInput = z.object({
  blueprint: DesignBlueprint.describe('A DesignBlueprint (typically produced by compose_design) to validate.'),
  validationProfile: ValidationProfile.default('corporate').describe(
    "Strictness profile: 'draft' (only natural errors block), 'corporate' (accessibility + corporate warnings become errors, the default), or 'release' (every warning blocks).",
  ),
});
export type ValidateCompositionInput = z.infer<typeof ValidateCompositionInput>;

/** `validate_composition` structured output: the full validation result (valid flag, score, findings, per-domain metrics). */
export const ValidateCompositionOutput = z.object({
  result: ValidationResult,
});
export type ValidateCompositionOutput = z.infer<typeof ValidateCompositionOutput>;
