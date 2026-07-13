import type { MotionLevel, SurfaceType } from '@enterprise-design/contracts';

/**
 * Surface motion caps, derived from the compiled catalogue (the maximum
 * `motionLevel` observed across the 50 experiences per surface). The validator
 * (MOTION-001) enforces the identical table, so any blueprint the composer
 * clamps to this cap validates clean. Grammar manifests carry no structured
 * motion-cap field, so this catalogue-derived table is the source of truth.
 */
export const SURFACE_MOTION_CAP: Record<SurfaceType, MotionLevel> = {
  dashboard: 2,
  'project-page': 2,
  'slide-deck': 3,
  'personal-page': 3,
  'technical-explainer': 3,
};

export function surfaceMotionCap(surface: SurfaceType): MotionLevel {
  return SURFACE_MOTION_CAP[surface];
}

/** The route path the composer emits per surface (depth kept ≤ 2 so IA-001 stays clean). */
export function routePathFor(surface: SurfaceType): string {
  switch (surface) {
    case 'dashboard':
      return '/dashboard';
    case 'slide-deck':
      return '/deck';
    case 'project-page':
      return '/project';
    case 'personal-page':
      return '/';
    case 'technical-explainer':
      return '/explainer';
  }
}
