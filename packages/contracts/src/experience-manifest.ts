import { z } from 'zod';
import { Audience, ContentDensity, CorporateSuitability, MotionLevel, SurfaceType, ThemeMode } from './enums.js';
import { ApprovalManifest } from './component-manifest.js';

export const ExperienceRoute = z.object({
  path: z.string(),
  title: z.string(),
  purpose: z.string(),
});
export type ExperienceRoute = z.infer<typeof ExperienceRoute>;

export const ExperienceManifest = z.object({
  schemaVersion: z.literal('1.0'),
  id: z.string(),
  surface: SurfaceType,
  title: z.string(),
  designThesis: z.string(),
  grammarId: z.string(),
  audiences: z.array(Audience),
  businessIntents: z.array(z.string()),
  density: ContentDensity,
  motionLevel: MotionLevel,
  signatureSequence: z.string(),
  corporateSuitability: CorporateSuitability,
  themeModes: z.array(ThemeMode),
  componentsUsed: z.array(z.string()),
  routes: z.array(ExperienceRoute),
  contentPackId: z.string().optional(),
  previewRoute: z.string().optional(),
  posterAsset: z.string().optional(),
  approval: ApprovalManifest,
  tags: z.array(z.string()),
  searchText: z.string().min(1),
});
export type ExperienceManifest = z.infer<typeof ExperienceManifest>;
