/**
 * The anchor experiences that exist as LIVE full-bleed pages (task 12).
 * Everything that renders a "Live" affordance consults this single list.
 */
export const LIVE_EXPERIENCE_IDS = ['db-model-monitoring-cockpit', 'exp-system-architecture'] as const;

export type LiveExperienceId = (typeof LIVE_EXPERIENCE_IDS)[number];

export function isLiveExperience(id: string): id is LiveExperienceId {
  return (LIVE_EXPERIENCE_IDS as readonly string[]).includes(id);
}

/** Route to the live rendering, or null when the experience has none. */
export function liveRoute(id: string): string | null {
  return isLiveExperience(id) ? `/live/${id}` : null;
}
