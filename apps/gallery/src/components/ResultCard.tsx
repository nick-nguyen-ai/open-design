import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { ApprovalState } from '@enterprise-design/contracts';
import type { SearchResult } from '@enterprise-design/search';
import { useMotionPreference } from '@enterprise-design/motion';
import { Badge, Card, type BadgeTone } from '@enterprise-design/primitives';
import { componentById, experienceById } from '../data/registry.js';
import { liveRoute } from '../data/live.js';
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
import { PreviewImage } from './PreviewImage.js';

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
        <span className="font-medium">{componentCount} components</span>
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
        {result.facets.category && <span className="font-medium capitalize">{result.facets.category}</span>}
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
      <span className="font-medium">Design grammar</span>
    </div>
  );
}

/**
 * The typographic plate shown inside the preview frame when there is no
 * screenshot (catalogue specifications, components, grammars) — and beneath
 * the image while it loads.
 */
function PreviewPlate({
  result,
  accent,
  live,
}: {
  result: SearchResult;
  accent: string;
  live: boolean;
}) {
  const line =
    result.entityType === 'experience'
      ? result.facets.surface
        ? SURFACE_LABEL[result.facets.surface]
        : 'Template'
      : ENTITY_LABEL[result.entityType];
  const sub =
    result.entityType === 'experience'
      ? live
        ? 'Live world'
        : 'Catalogue specification'
      : result.entityType === 'component'
        ? 'Live component'
        : 'The rulebook';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
      <span aria-hidden className="h-1.5 w-8" style={{ backgroundColor: accent }} />
      <span className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.2em] text-text-secondary">
        {line}
      </span>
      <span className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-text-muted">
        {sub}
      </span>
    </div>
  );
}

/** The design width the live world renders at before being scaled into the frame. */
const LIVE_FRAME_WIDTH = 1280;
const LIVE_FRAME_HEIGHT = 800;
/** Hover dwell before the static preview upgrades to the running world. */
const LIVE_HOVER_DELAY_MS = 600;

/**
 * The running world, scaled into the preview frame. Decorative only
 * (`aria-hidden`, no pointer events) — the LIVE link is the real way in.
 */
function LiveHoverFrame({ href }: { href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const width = ref.current?.getBoundingClientRect().width ?? 0;
    if (width > 0) setScale(width / LIVE_FRAME_WIDTH);
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {scale !== null && (
        <iframe
          src={href}
          title=""
          tabIndex={-1}
          style={{
            width: LIVE_FRAME_WIDTH,
            height: LIVE_FRAME_HEIGHT,
            border: 0,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
}

export interface ResultCardProps {
  result: SearchResult;
  onOpen: (result: SearchResult) => void;
}

/**
 * A single browse result, framed like a print in the Gallery Ink chrome: the
 * live-world screenshot (or a typographic plate) above a captioned mat.
 * Clicking opens the quick-preview drawer (the card is a real `<button>`,
 * keyboard-operable); the LIVE tag is a separate link straight into the world.
 */
export function ResultCard({ result, onOpen }: ResultCardProps) {
  const { facets } = result;
  const accent = grammarAccent(facets.grammarId);
  const primaryAudience = facets.audiences?.[0];
  const density = facets.density?.[0];
  const liveHref = result.entityType === 'experience' ? liveRoute(result.id) : null;

  // Screenshots-plus-live-hover: after a short dwell with a mouse, the static
  // preview upgrades to the running world. Skipped for touch (no hover) and
  // reduced motion (worlds animate on entry).
  const { reduced } = useMotionPreference();
  const [liveHover, setLiveHover] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const armLiveHover = (event: PointerEvent) => {
    if (!liveHref || reduced || event.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setLiveHover(true), LIVE_HOVER_DELAY_MS);
  };
  const disarmLiveHover = () => {
    window.clearTimeout(hoverTimer.current);
    setLiveHover(false);
  };

  return (
    <div
      className="group relative h-full"
      onPointerEnter={armLiveHover}
      onPointerLeave={disarmLiveHover}
    >
      <Card
        onClick={() => onOpen(result)}
        aria-label={`${ENTITY_LABEL[result.entityType]}: ${result.title}. Open quick preview.`}
        className="relative h-full overflow-hidden !p-2.5 text-left shadow-sm transition-[transform,box-shadow] duration-structure ease-settle group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      >
        <div className="flex h-full flex-col gap-3">
          <div className="relative aspect-[16/10] shrink-0 overflow-hidden border border-border-subtle bg-surface-sunken">
            <PreviewPlate result={result} accent={accent} live={liveHref !== null} />
            {liveHref && (
              <PreviewImage
                id={result.id}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}
            {liveHref && liveHover && <LiveHoverFrame href={liveHref} />}
          </div>

          <div className="flex flex-1 flex-col gap-2.5 px-1.5 pb-1 pt-0.5">
            <div className={`flex items-start justify-between gap-3 ${liveHref ? 'pr-14' : ''}`}>
              <h3 className="font-heading text-md font-semibold leading-snug tracking-tight text-text-primary">
                {result.title}
              </h3>
              {!liveHref && (
                <span className="shrink-0 rounded-sm border border-border-subtle px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide text-text-muted">
                  {ENTITY_LABEL[result.entityType]}
                </span>
              )}
            </div>

            <p className="line-clamp-2 text-sm leading-normal text-text-secondary">{result.summary}</p>

            <div className="mt-auto flex flex-col gap-2.5 pt-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {facets.grammarId && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                    <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
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
        </div>
      </Card>
      {liveHref && (
        <RouterLink
          to={liveHref}
          aria-label={`Open live template: ${result.title}`}
          className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 border border-accent/40 bg-surface-raised/90 px-1.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wide text-accent no-underline backdrop-blur-sm transition-colors duration-feedback ease-settle hover:bg-accent hover:text-text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <span aria-hidden className="text-[0.6rem] leading-none">●</span> Live
        </RouterLink>
      )}
    </div>
  );
}
