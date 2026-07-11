import { z } from 'zod';

export const SurfaceType = z.enum([
  'dashboard',
  'project-page',
  'slide-deck',
  'personal-page',
  'technical-explainer',
]);
export type SurfaceType = z.infer<typeof SurfaceType>;

export const Audience = z.enum([
  'executive',
  'business',
  'risk-and-governance',
  'technical',
  'mixed',
  'personal-internal',
]);
export type Audience = z.infer<typeof Audience>;

export const ContentDensity = z.enum(['low', 'medium', 'high', 'adaptive']);
export type ContentDensity = z.infer<typeof ContentDensity>;

export const MotionLevel = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
export type MotionLevel = z.infer<typeof MotionLevel>;

export const ThemeMode = z.enum(['light', 'dark', 'adaptive']);
export type ThemeMode = z.infer<typeof ThemeMode>;

export const ApprovalState = z.enum(['experimental', 'reviewed', 'approved', 'deprecated']);
export type ApprovalState = z.infer<typeof ApprovalState>;

export const CorporateSuitability = z.enum(['restricted', 'standard', 'expressive']);
export type CorporateSuitability = z.infer<typeof CorporateSuitability>;

export const ComponentCategory = z.enum([
  'shell',
  'navigation',
  'layout',
  'content',
  'status',
  'chart',
  'diagram',
  'table',
  'interaction',
  'motion',
  'presentation',
  'utility',
]);
export type ComponentCategory = z.infer<typeof ComponentCategory>;

export const CompositionRole = z.enum([
  'shell',
  'navigation',
  'hero',
  'summary',
  'primary-visual',
  'secondary-visual',
  'detail',
  'evidence',
  'decision',
  'footer',
  'transition',
]);
export type CompositionRole = z.infer<typeof CompositionRole>;

export const EntityType = z.enum(['component', 'experience', 'grammar', 'motion']);
export type EntityType = z.infer<typeof EntityType>;
