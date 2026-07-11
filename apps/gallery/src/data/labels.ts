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
 * A stable accent hue per grammar, expressed as an HSL hue angle. Cards tint a
 * hairline rail with `hsl(<hue> 45% 45%)` so each grammar family is
 * recognisable at a glance without inventing off-palette fills — the accent is
 * a thin, disciplined edge, not a decorative wash.
 */
const GRAMMAR_HUE: Record<string, number> = {
  'calm-command': 210,
  'technical-blueprint': 200,
  'signal-glass': 260,
  'spatial-canvas': 175,
  'research-notebook': 40,
  'living-system': 150,
  'precision-grid': 220,
  'executive-editorial': 25,
  'kinetic-intelligence': 285,
  'monumental-type': 350,
};

export function grammarAccent(grammarId: string | undefined): string {
  const hue = (grammarId && GRAMMAR_HUE[grammarId]) ?? 215;
  return `hsl(${hue} 42% 46%)`;
}
