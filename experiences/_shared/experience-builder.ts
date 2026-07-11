import type {
  Audience,
  ContentDensity,
  CorporateSuitability,
  ExperienceManifest,
  ExperienceRoute,
  MotionLevel,
  SurfaceType,
  ThemeMode,
} from '@enterprise-design/contracts';

/**
 * Authoring helper for the 50 catalogue experience manifests (task 8). NOT
 * itself discovered as a manifest (no `.experience.manifest.ts` suffix) —
 * every real experience file imports this, supplies its own full set of
 * content, and `export default`s the resulting typed `ExperienceManifest`,
 * which is what `packages/registry`'s discovery glob actually loads.
 *
 * Two responsibilities kept deliberately mechanical here so every experience
 * file only has to state real content once: deriving `previewRoute` from
 * `id`, and assembling `searchText` from title + thesis + intents + audience
 * + a "when to use" sentence (per the task-8 brief).
 */

export interface ExperienceInput {
  id: string;
  surface: SurfaceType;
  title: string;
  designThesis: string;
  grammarId: string;
  audiences: Audience[];
  businessIntents: string[];
  density: ContentDensity;
  motionLevel: MotionLevel;
  signatureSequence: string;
  corporateSuitability: CorporateSuitability;
  themeModes?: ThemeMode[];
  componentsUsed: string[];
  routes: ExperienceRoute[];
  tags: string[];
  /** One sentence: when a designer/agent should reach for this experience. Folded into searchText. */
  whenToUse: string;
  approval: {
    state: 'experimental' | 'reviewed' | 'approved' | 'deprecated';
    reviewer?: string;
    reviewedAt: string;
    qualityScore: number;
    notes?: string[];
  };
}

export function buildExperience(input: ExperienceInput): ExperienceManifest {
  const themeModes = input.themeModes ?? ['light', 'dark'];
  const searchText = [
    input.title,
    input.designThesis,
    `Intents: ${input.businessIntents.join(', ')}.`,
    `Audience: ${input.audiences.join(', ')}.`,
    `When to use: ${input.whenToUse}`,
  ].join(' ');

  return {
    schemaVersion: '1.0',
    id: input.id,
    surface: input.surface,
    title: input.title,
    designThesis: input.designThesis,
    grammarId: input.grammarId,
    audiences: input.audiences,
    businessIntents: input.businessIntents,
    density: input.density,
    motionLevel: input.motionLevel,
    signatureSequence: input.signatureSequence,
    corporateSuitability: input.corporateSuitability,
    themeModes,
    componentsUsed: input.componentsUsed,
    routes: input.routes,
    previewRoute: `/preview/${input.id}`,
    approval: {
      state: input.approval.state,
      reviewer: input.approval.reviewer ?? 'design-lead',
      reviewedAt: input.approval.reviewedAt,
      qualityScore: input.approval.qualityScore,
      notes: input.approval.notes ?? [],
    },
    tags: input.tags,
    searchText,
  };
}
