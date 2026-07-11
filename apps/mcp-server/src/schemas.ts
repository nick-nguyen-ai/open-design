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
  EntityType,
  MotionLevel,
  SearchFacets,
  SurfaceType,
  ThemeMode,
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
