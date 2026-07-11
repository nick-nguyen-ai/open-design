/**
 * Human-readable labels and presentation metadata for enum values coming from
 * the registry. Kept in one place so cards, filters, and detail pages read the
 * catalogue consistently.
 */
import type {
  ApprovalState,
  Audience,
  ContentDensity,
  CorporateSuitability,
  EntityType,
  MotionLevel,
  SurfaceType,
} from '@enterprise-design/contracts';
import { grammars } from './registry.js';

export const SURFACE_LABEL: Record<SurfaceType, string> = {
  dashboard: 'Dashboard',
  'project-page': 'Project Page',
  'slide-deck': 'Slide Deck',
  'personal-page': 'Personal Page',
  'technical-explainer': 'Technical Explainer',
};

/** One-line use case per surface, for the template-type shortcut cards. */
export const SURFACE_USE_CASE: Record<SurfaceType, string> = {
  dashboard: 'Live posture and metrics, watched under stress.',
  'project-page': 'Programme narratives with status and milestones.',
  'slide-deck': 'Board-ready decks that argue a single thesis.',
  'personal-page': 'Individual hubs, profiles, and mentoring spaces.',
  'technical-explainer': 'Architecture and system walk-throughs.',
};

export const AUDIENCE_LABEL: Record<Audience, string> = {
  executive: 'Executive',
  business: 'Business',
  'risk-and-governance': 'Risk & Governance',
  technical: 'Technical',
  mixed: 'Mixed',
  'personal-internal': 'Personal / Internal',
};

export const DENSITY_LABEL: Record<ContentDensity, string> = {
  low: 'Low density',
  medium: 'Medium density',
  high: 'High density',
  adaptive: 'Adaptive density',
};

export const APPROVAL_LABEL: Record<ApprovalState, string> = {
  experimental: 'Experimental',
  reviewed: 'Reviewed',
  approved: 'Approved',
  deprecated: 'Deprecated',
};

export const SUITABILITY_LABEL: Record<CorporateSuitability, string> = {
  restricted: 'Restricted',
  standard: 'Standard',
  expressive: 'Expressive',
};

export const COST_LABEL: Record<'low' | 'medium' | 'high', string> = {
  low: 'Low cost',
  medium: 'Medium cost',
  high: 'High cost',
};

export const ENTITY_LABEL: Record<EntityType, string> = {
  experience: 'Template',
  component: 'Component',
  grammar: 'Grammar',
  motion: 'Motion',
};

export function motionLevelLabel(level: MotionLevel): string {
  return `Motion L${level}`;
}

export function grammarName(grammarId: string | undefined): string {
  if (!grammarId) return '';
  return grammars.find((g) => g.id === grammarId)?.name ?? grammarId;
}

/**
 * A stable accent per grammar, expressed as one of the themed categorical
 * chart tokens (`--chart-cat-1..8`). Using tokens rather than static HSL means
 * the accents adapt between light and dark themes and stay on-palette; cards
 * tint a thin hairline rail with it so each grammar family is recognisable at a
 * glance without a decorative wash. Decorative use only (rails/bars) — never
 * relied on as a text colour, so no per-token contrast obligation.
 */
const GRAMMAR_ACCENT_CAT: Record<string, number> = {
  'calm-command': 1,
  'technical-blueprint': 2,
  'signal-glass': 3,
  'spatial-canvas': 4,
  'research-notebook': 5,
  'living-system': 6,
  'precision-grid': 7,
  'executive-editorial': 8,
  'kinetic-intelligence': 3,
  'monumental-type': 6,
};

/** Distinct themed accent per surface, so the 5 shortcut cards read apart. */
const SURFACE_ACCENT_CAT: Record<SurfaceType, number> = {
  dashboard: 1,
  'project-page': 2,
  'slide-deck': 3,
  'personal-page': 4,
  'technical-explainer': 5,
};

function catVar(index: number): string {
  return `var(--chart-cat-${index})`;
}

export function grammarAccent(grammarId: string | undefined): string {
  const index = grammarId ? GRAMMAR_ACCENT_CAT[grammarId] : undefined;
  return catVar(index ?? 1);
}

export function surfaceAccent(surface: SurfaceType): string {
  return catVar(SURFACE_ACCENT_CAT[surface]);
}
