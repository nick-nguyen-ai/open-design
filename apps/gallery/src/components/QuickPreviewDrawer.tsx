import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { SearchResult } from '@enterprise-design/search';
import { Badge, Drawer } from '@enterprise-design/primitives';
import { componentById, experienceById, grammarById } from '../data/registry.js';
import { detailRoute } from '../data/routes.js';
import { liveRoute } from '../data/live.js';
import {
  APPROVAL_LABEL,
  AUDIENCE_LABEL,
  DENSITY_LABEL,
  ENTITY_LABEL,
  grammarAccent,
  grammarName,
  motionLevelLabel,
  SURFACE_LABEL,
  SUITABILITY_LABEL,
} from '../data/labels.js';
import { useRecentlyViewed } from '../state/useRecentlyViewed.js';
import { ArrowRightIcon } from './icons.js';
import { PreviewImage } from './PreviewImage.js';
import { GrammarSpecimen } from './GrammarSpecimen.js';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3 py-2 text-sm">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-text-primary">{children}</dd>
    </div>
  );
}

/** Extra, entity-specific metadata rows drawn from the full manifest. */
function DetailRows({ result }: { result: SearchResult }) {
  if (result.entityType === 'experience') {
    const exp = experienceById.get(result.id);
    if (!exp) return null;
    return (
      <>
        <Row label="Design thesis">{exp.designThesis}</Row>
        <Row label="Components">{exp.componentsUsed?.join(', ') || '—'}</Row>
        <Row label="Routes">{exp.routes?.length ?? 0}</Row>
      </>
    );
  }
  if (result.entityType === 'component') {
    const comp = componentById.get(result.id);
    if (!comp) return null;
    return (
      <>
        <Row label="Description">{comp.description}</Row>
        <Row label="Surfaces">{comp.compatibleSurfaces?.join(', ') || '—'}</Row>
        <Row label="Data shapes">{comp.contentRequirements?.acceptedDataShapes?.join(', ') || '—'}</Row>
      </>
    );
  }
  const grammar = grammarById.get(result.id);
  if (!grammar) return null;
  return <Row label="Intent">{grammar.intent}</Row>;
}

export interface QuickPreviewDrawerProps {
  result: SearchResult | null;
  onClose: () => void;
}

/**
 * The quick-preview drawer. The primitives `Drawer` provides the focus trap,
 * Escape-to-close, and focus restoration; we add a live-world preview image,
 * the item metadata, and links to the full detail page, the live route, and —
 * for templates — the Make-your-design handoff. Opening records the item in
 * recently-viewed.
 */
export function QuickPreviewDrawer({ result, onClose }: QuickPreviewDrawerProps) {
  const { record } = useRecentlyViewed();

  useEffect(() => {
    if (!result) return;
    record({
      id: result.id,
      entityType: result.entityType,
      title: result.title,
      route: detailRoute(result.entityType, result.id),
    });
  }, [result, record]);

  const accent = result ? grammarAccent(result.facets.grammarId) : undefined;

  return (
    <Drawer open={result !== null} onClose={onClose} side="right" title={result?.title ?? 'Preview'}>
      {result && (
        <div className="flex flex-col gap-4">
          {result.entityType === 'experience' && liveRoute(result.id) && (
            <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-sunken">
              <PreviewImage
                id={result.id}
                alt={`Preview of ${result.title}`}
                className="block aspect-[16/10] w-full object-cover object-top"
              />
            </div>
          )}
          {result.entityType === 'grammar' && (
            <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-sunken">
              <GrammarSpecimen
                grammarId={result.id}
                alt={`Specimen design rendered in ${result.title}`}
                className="block aspect-[16/10] w-full object-cover object-top"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-border-subtle px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-text-secondary">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
              {ENTITY_LABEL[result.entityType]}
            </span>
            {result.facets.approval && <Badge tone="info">{APPROVAL_LABEL[result.facets.approval]}</Badge>}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-lg text-text-muted transition-colors duration-feedback ease-settle hover:bg-surface-sunken hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              aria-label="Close preview"
            >
              ×
            </button>
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">{result.summary}</p>

          <dl className="divide-y divide-border-subtle border-y border-border-subtle">
            {result.facets.grammarId && (
              <Row label="Grammar">
                <RouterLink
                  to={`/grammars/${result.facets.grammarId}`}
                  className="text-accent underline-offset-2 hover:underline"
                  onClick={onClose}
                >
                  {grammarName(result.facets.grammarId)}
                </RouterLink>
              </Row>
            )}
            {result.facets.surface && <Row label="Surface">{SURFACE_LABEL[result.facets.surface]}</Row>}
            {result.facets.audiences && result.facets.audiences.length > 0 && (
              <Row label="Audiences">{result.facets.audiences.map((a) => AUDIENCE_LABEL[a]).join(', ')}</Row>
            )}
            {result.facets.density && result.facets.density.length > 0 && (
              <Row label="Density">{result.facets.density.map((d) => DENSITY_LABEL[d]).join(', ')}</Row>
            )}
            {result.facets.motionLevel !== undefined && (
              <Row label="Motion">{motionLevelLabel(result.facets.motionLevel)}</Row>
            )}
            {result.facets.corporateSuitability && result.facets.corporateSuitability.length > 0 && (
              <Row label="Suitability">
                {result.facets.corporateSuitability.map((s) => SUITABILITY_LABEL[s]).join(', ')}
              </Row>
            )}
            <DetailRows result={result} />
          </dl>

          <div className="mt-2 flex flex-col gap-2">
            {result.entityType === 'experience' && liveRoute(result.id) && (
              <RouterLink
                to={liveRoute(result.id) ?? '#'}
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-md font-medium text-text-on-accent no-underline transition-colors duration-feedback ease-settle hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                Open live template <ArrowRightIcon />
              </RouterLink>
            )}
            <RouterLink
              to={detailRoute(result.entityType, result.id)}
              onClick={onClose}
              className={
                result.entityType === 'experience' && liveRoute(result.id)
                  ? 'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface-raised px-4 text-md font-medium text-text-primary no-underline transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring'
                  : 'inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-md font-medium text-text-on-accent no-underline transition-colors duration-feedback ease-settle hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring'
              }
            >
              View full detail <ArrowRightIcon />
            </RouterLink>
            {result.entityType === 'experience' && (
              <RouterLink
                to={`/make?template=${encodeURIComponent(result.id)}`}
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border-strong bg-surface-raised px-4 text-md font-medium text-text-primary no-underline transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                Make your design with it
              </RouterLink>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
