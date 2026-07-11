import { z } from 'zod';
import { Audience, ContentDensity, CorporateSuitability, MotionLevel, SurfaceType, ThemeMode } from './enums.js';

export const ContentInventory = z.object({
  headings: z.array(z.string()),
  narrativeSections: z.number(),
  kpis: z.number(),
  tables: z.number(),
  timeSeries: z.number(),
  categories: z.number(),
  processes: z.number(),
  entities: z.number(),
  decisions: z.number(),
  risks: z.number(),
  milestones: z.number(),
  codeBlocks: z.number(),
  citations: z.number(),
  mediaAssets: z.number(),
});
export type ContentInventory = z.infer<typeof ContentInventory>;

export const TechnicalConstraints = z.object({
  framework: z.literal('react'),
  buildTool: z.literal('vite'),
  styling: z.literal('tailwind'),
  externalRuntimeNetworkAllowed: z.boolean(),
  approvedDependencies: z.array(z.string()),
  prohibitedDependencies: z.array(z.string()),
  targetBrowsers: z.array(z.string()),
  ssrRequired: z.boolean(),
  staticExportRequired: z.boolean(),
});
export type TechnicalConstraints = z.infer<typeof TechnicalConstraints>;

export const AccessibilityRequirements = z.object({
  target: z.literal('WCAG-2.2-AA'),
  reducedMotionRequired: z.literal(true),
  keyboardRequired: z.literal(true),
  screenReaderRequired: z.literal(true),
  highContrastRequired: z.boolean(),
});
export type AccessibilityRequirements = z.infer<typeof AccessibilityRequirements>;

export const DesignContext = z.object({
  requestId: z.string(),
  surface: SurfaceType,
  businessIntent: z.array(z.string()),
  audience: z.array(Audience),
  contentSummary: z.string(),
  availableContent: ContentInventory,
  desiredTone: z.array(z.string()),
  density: ContentDensity,
  motionPreference: MotionLevel,
  themeMode: ThemeMode,
  corporateSuitability: CorporateSuitability,
  technicalConstraints: TechnicalConstraints,
  accessibilityRequirements: AccessibilityRequirements,
  requiredCapabilities: z.array(z.string()),
  prohibitedCapabilities: z.array(z.string()),
});
export type DesignContext = z.infer<typeof DesignContext>;
