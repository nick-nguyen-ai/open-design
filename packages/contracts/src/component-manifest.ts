import { z } from 'zod';
import {
  Audience,
  ComponentCategory,
  CompositionRole,
  ContentDensity,
  CorporateSuitability,
  MotionLevel,
  SurfaceType,
  ThemeMode,
  ApprovalState,
} from './enums.js';

export const ContentRequirements = z.object({
  requiredFields: z.array(z.string()),
  optionalFields: z.array(z.string()),
  minItems: z.number().optional(),
  maxItems: z.number().optional(),
  recommendedNarrativeLength: z.string().optional(),
  acceptedDataShapes: z.array(z.string()),
  emptyStateSupported: z.boolean(),
  loadingStateSupported: z.boolean(),
  errorStateSupported: z.boolean(),
});
export type ContentRequirements = z.infer<typeof ContentRequirements>;

export const DependencyManifest = z.object({
  packageName: z.string(),
  purpose: z.string(),
  optional: z.boolean(),
  adapter: z.string(),
});
export type DependencyManifest = z.infer<typeof DependencyManifest>;

export const CompatibilityManifest = z.object({
  worksWellWith: z.array(z.string()),
  conflictsWith: z.array(z.string()),
  requiresOneOf: z.array(z.string()),
  maxInstancesPerViewport: z.number().optional(),
  layoutRequirements: z.array(z.string()),
  compositionRoles: z.array(CompositionRole),
});
export type CompatibilityManifest = z.infer<typeof CompatibilityManifest>;

export const AccessibilityManifest = z.object({
  keyboardAccessible: z.boolean(),
  screenReaderLabels: z.boolean(),
  nonColourEncoding: z.boolean(),
  reducedMotion: z.boolean(),
  focusVisible: z.boolean(),
  contrastTested: z.boolean(),
  knownLimitations: z.array(z.string()),
});
export type AccessibilityManifest = z.infer<typeof AccessibilityManifest>;

export const PerformanceManifest = z.object({
  renderingCost: z.enum(['low', 'medium', 'high']),
  bundleCostKbGzip: z.number(),
  usesCanvas: z.boolean(),
  usesWebGL: z.boolean(),
  supportsLazyLoad: z.boolean(),
  recommendedDataLimit: z.number().optional(),
  fallbackComponentId: z.string().optional(),
});
export type PerformanceManifest = z.infer<typeof PerformanceManifest>;

export const AssetSource = z.object({
  path: z.string(),
  origin: z.enum(['original', 'generated', 'licensed', 'internal-approved']),
  licence: z.string(),
  attributionRequired: z.boolean(),
});
export type AssetSource = z.infer<typeof AssetSource>;

export const ProvenanceManifest = z.object({
  author: z.string(),
  assetSources: z.array(AssetSource),
  licenceReviewed: z.boolean(),
  generatedAssets: z.boolean(),
  generatedAssetMethod: z.string().optional(),
  reviewRecord: z.string(),
});
export type ProvenanceManifest = z.infer<typeof ProvenanceManifest>;

export const ApprovalManifest = z.object({
  state: ApprovalState,
  reviewer: z.string(),
  reviewedAt: z.string(),
  qualityScore: z.number(),
  notes: z.array(z.string()),
});
export type ApprovalManifest = z.infer<typeof ApprovalManifest>;

export const ComponentManifest = z.object({
  schemaVersion: z.literal('1.0'),
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  category: ComponentCategory,
  subcategory: z.string(),
  sourcePath: z.string(),
  exportName: z.string(),
  previewRoute: z.string(),
  designGrammars: z.array(z.string()),
  compatibleSurfaces: z.array(SurfaceType),
  businessIntents: z.array(z.string()),
  audiences: z.array(Audience),
  density: z.array(ContentDensity),
  motionLevel: MotionLevel,
  corporateSuitability: z.array(CorporateSuitability),
  themeModes: z.array(ThemeMode),
  contentRequirements: ContentRequirements,
  dependencies: z.array(DependencyManifest),
  compatibility: CompatibilityManifest,
  accessibility: AccessibilityManifest,
  performance: PerformanceManifest,
  provenance: ProvenanceManifest,
  approval: ApprovalManifest,
  tags: z.array(z.string()),
  searchText: z.string().min(1),
});
export type ComponentManifest = z.infer<typeof ComponentManifest>;
