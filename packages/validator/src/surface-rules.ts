import type { ComponentManifest, MotionLevel, SurfaceType } from '@enterprise-design/contracts';

/**
 * Surface motion caps — identical to the table the composition engine clamps
 * to, derived from the compiled catalogue (max `motionLevel` per surface).
 * Kept as an independent copy so the validator has no runtime dependency on the
 * composition package.
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

export const COSTLY_BUNDLE_KB = 40;

/** A component is high render cost when its rendering cost is high or its gzip bundle is heavy. */
export function isCostly(component: ComponentManifest): boolean {
  return (
    component.performance.renderingCost === 'high' ||
    component.performance.bundleCostKbGzip >= COSTLY_BUNDLE_KB
  );
}
