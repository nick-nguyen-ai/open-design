import type { ReactNode } from 'react';
import type { ApprovalState } from '@enterprise-design/contracts';
import type { SearchResult } from '@enterprise-design/search';
import { Badge, Card, type BadgeTone } from '@enterprise-design/primitives';
import { componentById, experienceById } from '../data/registry.js';
import {
  APPROVAL_LABEL,
  AUDIENCE_LABEL,
  COST_LABEL,
  DENSITY_LABEL,
  ENTITY_LABEL,
  grammarAccent,
  grammarName,
  motionLevelLabel,
  SURFACE_LABEL,
} from '../data/labels.js';

const APPROVAL_TONE: Record<ApprovalState, BadgeTone> = {
  approved: 'success',
  reviewed: 'info',
  experimental: 'warning',
  deprecated: 'danger',
};

function MetaTag({ children }: { children: ReactNode }) {
  return <span className="text-xs text-text-muted">{children}</span>;
}

function Dot() {
  return (
    <span aria-hidden className="text-text-muted/50">
      ·
    </span>
  );
}

/** The type-specific footer line: what most distinguishes a Template from a Component. */
function CardFooter({ result }: { result: SearchResult }) {
  if (result.entityType === 'experience') {
    const exp = experienceById.get(result.id);
    const componentCount = exp?.componentsUsed?.length ?? 0;
    const routeCount = exp?.routes?.length ?? 0;
    const surface = result.facets.surface;
    const isDeck = surface === 'slide-deck';
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
        <span className="font-weight-medium">{componentCount} components</span>
        <Dot />
        <span>
          {routeCount} {isDeck ? (routeCount === 1 ? 'section' : 'sections') : routeCount === 1 ? 'route' : 'routes'}
        </span>
      </div>
    );
  }

  if (result.entityType === 'component') {
    const comp = componentById.get(result.id);
    const surfaces = comp?.compatibleSurfaces?.length ?? 0;
    const shapes = comp?.contentRequirements?.acceptedDataShapes ?? [];
    const cost = result.facets.renderingCost;
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
        {result.facets.category && <span className="font-weight-medium capitalize">{result.facets.category}</span>}
        <Dot />
        <span>{surfaces} surfaces</span>
        {shapes.length > 0 && (
          <>
            <Dot />
            <span>{shapes.join(', ')}</span>
          </>
        )}
        {cost && (
          <>
            <Dot />
            <span>{COST_LABEL[cost]}</span>
          </>
        )}
      </div>
    );
  }

  // grammar
  return (
    <div className="text-xs text-text-secondary">
      <span className="font-weight-medium">Design grammar</span>
    </div>
  );
}

export interface ResultCardProps {
  result: SearchResult;
  onOpen: (result: SearchResult) => void;
}

/**
 * A single browse result. Clicking opens the quick-preview drawer (the card is
 * a real `<button>`, keyboard-operable). A hairline left rail is tinted by the
 * item's design grammar so each family is recognisable without ornament.
 */
export function ResultCard({ result, onOpen }: ResultCardProps) {
  const { facets } = result;
  const accent = grammarAccent(facets.grammarId);
  const primaryAudience = facets.audiences?.[0];
  const density = facets.density?.[0];

  return (
    <Card
      onClick={() => onOpen(result)}
      aria-label={`${ENTITY_LABEL[result.entityType]}: ${result.title}. Open quick preview.`}
      className="group relative h-full overflow-hidden !p-0 text-left"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: accent }}
      />
      <div className="flex h-full flex-col gap-3 p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-md font-weight-semibold leading-snug tracking-tight text-text-primary">
            {result.title}
          </h3>
          <span className="shrink-0 rounded-sm border border-border-subtle px-1.5 py-0.5 text-xs font-weight-medium uppercase tracking-wide text-text-muted">
            {ENTITY_LABEL[result.entityType]}
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-normal text-text-secondary">{result.summary}</p>

        <div className="mt-auto flex flex-col gap-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {facets.grammarId && (
              <span className="text-xs font-weight-medium" style={{ color: accent }}>
                {grammarName(facets.grammarId)}
              </span>
            )}
            {facets.surface && (
              <>
                <Dot />
                <MetaTag>{SURFACE_LABEL[facets.surface]}</MetaTag>
              </>
            )}
            {primaryAudience && (
              <>
                <Dot />
                <MetaTag>{AUDIENCE_LABEL[primaryAudience]}</MetaTag>
              </>
            )}
            {density && (
              <>
                <Dot />
                <MetaTag>{DENSITY_LABEL[density]}</MetaTag>
              </>
            )}
            {facets.motionLevel !== undefined && (
              <>
                <Dot />
                <MetaTag>{motionLevelLabel(facets.motionLevel)}</MetaTag>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-2.5">
            <CardFooter result={result} />
            {facets.approval && (
              <Badge tone={APPROVAL_TONE[facets.approval]}>{APPROVAL_LABEL[facets.approval]}</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
