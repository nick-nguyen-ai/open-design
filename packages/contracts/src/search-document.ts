import { z } from 'zod';
import {
  Audience,
  ComponentCategory,
  ContentDensity,
  CorporateSuitability,
  EntityType,
  MotionLevel,
  SurfaceType,
  ThemeMode,
  ApprovalState,
} from './enums.js';

export const SearchFacets = z.object({
  surface: SurfaceType.optional(),
  audiences: z.array(Audience).optional(),
  grammarId: z.string().optional(),
  category: ComponentCategory.optional(),
  density: z.array(ContentDensity).optional(),
  motionLevel: MotionLevel.optional(),
  corporateSuitability: z.array(CorporateSuitability).optional(),
  approval: ApprovalState.optional(),
  renderingCost: z.enum(['low', 'medium', 'high']).optional(),
  themeModes: z.array(ThemeMode).optional(),
  usesCanvas: z.boolean().optional(),
  usesWebGL: z.boolean().optional(),
});
export type SearchFacets = z.infer<typeof SearchFacets>;

export const SearchDocument = z.object({
  id: z.string(),
  entityType: EntityType,
  title: z.string(),
  summary: z.string(),
  text: z.string().min(1),
  tags: z.array(z.string()),
  facets: SearchFacets,
  route: z.string().optional(),
});
export type SearchDocument = z.infer<typeof SearchDocument>;
