/**
 * The experiences that exist as LIVE full-bleed pages (tasks 12–13).
 * Everything that renders a "Live" affordance consults this single list.
 */
import type { SurfaceType } from '@enterprise-design/contracts';

export const LIVE_EXPERIENCE_IDS = [
  'db-model-monitoring-cockpit',
  'exp-system-architecture',
  'deck-ai-strategy',
  'proj-ai-model-validation-hub',
  'home-data-scientist-studio',
  'deck-executive-decision-proposal',
  'deck-genai-model-validation-report',
  'deck-ai-governance-and-controls',
  'deck-transformation-roadmap',
  'deck-experiment-results',
  'deck-innovation-showcase',
  'deck-product-vision',
  'deck-technical-architecture-explanation',
  'deck-technical-training',
  'home-technical-leadership-portfolio',
  'home-ai-experiment-notebook',
  'home-internal-ai-tool-laboratory',
  'home-career-project-timeline',
  'home-team-contribution-impact-page',
  'home-mentoring-tutorial-hub',
  'home-knowledge-atlas',
  'home-research-publication-portfolio',
  'home-talks-presentation-archive',
  'deck-project-kickoff',
  'deck-research-discussion',
  'deck-marketing-campaign',
  'deck-product-launch',
  'deck-team-retrospective',
  'deck-cloud-migration',
  'deck-quarterly-business-review',
  'deck-sales-pitch',
  'deck-budget-planning',
  'deck-analytics-deep-dive',
  'deck-dgm-sketchnote',
  'deck-dgm-blueprint',
  'deck-dgm-circuit',
  'deck-dgm-isometric',
  'deck-dgm-gazette',
  'db-ai-risk-command-centre',
  'db-delivery-control-tower',
  'db-regulatory-control-hub',
  'db-data-quality-operations',
  'db-dependency-network-explorer',
  'db-experiment-analysis-workspace',
  'db-incident-remediation-centre',
  'db-portfolio-performance-explorer',
  'db-scenario-stress-simulator',
  'exp-api-integration-contract',
  'exp-architecture-decision-record',
  'exp-coding-agent-implementation-plan',
  'exp-agent-workflow',
  'exp-algorithm-explanation',
  'exp-data-lineage-map',
  'exp-incident-postmortem',
  'exp-migration-plan',
  'exp-testing-validation-strategy',
] as const;

export type LiveExperienceId = (typeof LIVE_EXPERIENCE_IDS)[number];

export function isLiveExperience(id: string): id is LiveExperienceId {
  return (LIVE_EXPERIENCE_IDS as readonly string[]).includes(id);
}

/** Route to the live rendering, or null when the experience has none. */
export function liveRoute(id: string): string | null {
  return isLiveExperience(id) ? `/live/${id}` : null;
}

/**
 * With one live world per surface (task 13), the "nearest live template"
 * for any catalogue specification is its own surface's world.
 */
export const LIVE_BY_SURFACE: Record<SurfaceType, LiveExperienceId> = {
  dashboard: 'db-model-monitoring-cockpit',
  'technical-explainer': 'exp-system-architecture',
  'slide-deck': 'deck-ai-strategy',
  'project-page': 'proj-ai-model-validation-hub',
  'personal-page': 'home-data-scientist-studio',
};

export interface NearestLive {
  id: LiveExperienceId;
  route: string;
}

/** The nearest live world for a surface (null only for unknown surfaces). */
export function nearestLiveForSurface(surface: string | undefined): NearestLive | null {
  if (!surface || !(surface in LIVE_BY_SURFACE)) return null;
  const id = LIVE_BY_SURFACE[surface as SurfaceType];
  return { id, route: `/live/${id}` };
}
