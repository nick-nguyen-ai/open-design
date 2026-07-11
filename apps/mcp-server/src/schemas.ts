/**
 * Tool input/output schemas — adapter-independent.
 *
 * Two layers, deliberately:
 *  - The ADVERTISED input shapes (passed to the SDK's `registerTool`) describe
 *    every field with `.describe()` and pin its type, so the model sees a tight,
 *    self-documenting schema in `tools/list`.
 *  - The DOMAIN input schemas add the semantic rules (non-empty id, `limit`
 *    bounds, defaults). Handlers validate against these so a rule violation is
 *    returned as a structured `INVALID_INPUT` {@link McpError} tool result
 *    rather than surfacing as an opaque transport-level rejection.
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

/** Advertised input shape for `get_component` (SDK `registerTool`). */
export const getComponentInputShape = {
  componentId: z.string().describe("Exact component id, e.g. 'comp.trend-chart'."),
};

/** Domain schema: an id must be a non-empty string. */
export const GetComponentInput = z.object({
  componentId: z.string().min(1),
});
export type GetComponentInput = z.infer<typeof GetComponentInput>;

// ---- search_components ------------------------------------------------------

/** Advertised input shape for `search_components` (SDK `registerTool`). */
export const searchComponentsInputShape = {
  query: z
    .string()
    .describe("Natural-language intent or keywords, e.g. 'time series line chart'. Empty returns the catalogue in browse order."),
  filters: FacetFilterSchema.optional().describe(
    'Optional hard facet filters (surface, audiences, category, density, corporateSuitability, motionLevel, approval, renderingCost, themeModes, usesCanvas, usesWebGL). A component must satisfy every provided facet to appear.',
  ),
  entityTypes: z
    .array(EntityType)
    .optional()
    .describe('Entity types to search. Defaults to components; may include experience, grammar, or motion.'),
  limit: z.number().int().optional().describe('Maximum results to return, 1-50. Defaults to 10.'),
};

/** Domain schema: bounds + defaults the advertised shape leaves to the handler. */
export const SearchComponentsInput = z.object({
  query: z.string(),
  filters: FacetFilterSchema.optional(),
  entityTypes: z.array(EntityType).default(['component']),
  limit: z.number().int().min(1).max(50).default(10),
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
