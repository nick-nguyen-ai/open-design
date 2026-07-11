import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@enterprise-design/primitives';
import { componentById } from '../data/registry.js';
import { detailRoute } from '../data/routes.js';
import { AUDIENCE_LABEL, motionLevelLabel } from '../data/labels.js';
import { MetaGrid, Page, Section } from '../components/Page.js';
import { ComponentLivePreview, hasLivePreview } from './previews/componentFixtures.js';
import { useRecentlyViewed } from '../state/useRecentlyViewed.js';

export default function ComponentDetail() {
  const { componentId = '' } = useParams();
  const comp = componentById.get(componentId);
  const { record } = useRecentlyViewed();

  useEffect(() => {
    if (comp) {
      record({ id: comp.id, entityType: 'component', title: comp.name, route: detailRoute('component', comp.id) });
    }
  }, [comp, record]);

  if (!comp) {
    return (
      <Page title="Component not found" backTo="/components" backLabel="Back to components">
        <p className="text-text-secondary">No component exists with id “{componentId}”.</p>
      </Page>
    );
  }

  const cr = comp.contentRequirements;
  const supportedStates = [
    'default',
    cr.loadingStateSupported && 'loading',
    cr.emptyStateSupported && 'empty',
    cr.errorStateSupported && 'error',
  ].filter(Boolean) as string[];

  return (
    <Page
      eyebrow={comp.category}
      title={comp.name}
      description={comp.description}
      backTo="/components"
      backLabel="Back to components"
      actions={<Badge tone="success">{comp.approval.state}</Badge>}
    >
      <div className="flex flex-col gap-10">
        <Section title="Live preview">
          {hasLivePreview(comp.id) ? (
            <div data-testid="live-preview" className="rounded-lg border border-border-subtle bg-surface-base p-6">
              <ComponentLivePreview componentId={comp.id} />
            </div>
          ) : (
            <p className="text-sm text-text-secondary">No interactive preview is wired for this component.</p>
          )}
          <p className="text-xs text-text-muted">
            Rendered live with frozen sample data. Supported states:{' '}
            <span className="font-weight-medium text-text-secondary">{supportedStates.join(', ')}</span>.
          </p>
        </Section>

        <Section title="At a glance">
          <MetaGrid
            rows={[
              { label: 'Category', value: <span className="capitalize">{comp.category}</span> },
              { label: 'Subcategory', value: comp.subcategory ?? '—' },
              { label: 'Surfaces', value: comp.compatibleSurfaces.join(', ') },
              { label: 'Accepted data shapes', value: cr.acceptedDataShapes.join(', ') },
              { label: 'Rendering cost', value: comp.performance.renderingCost },
              { label: 'Bundle cost', value: `${comp.performance.bundleCostKbGzip} KB gzip` },
              { label: 'Recommended data limit', value: `${comp.performance.recommendedDataLimit} items` },
              { label: 'Motion level', value: motionLevelLabel(comp.motionLevel) },
            ]}
          />
        </Section>

        <Section title="When to use">
          <div className="flex flex-col gap-3 text-sm text-text-secondary">
            <p>
              Designed for{' '}
              <span className="text-text-primary">
                {comp.audiences.map((a) => AUDIENCE_LABEL[a]).join(', ')}
              </span>{' '}
              audiences on {comp.compatibleSurfaces.join(', ')} surfaces.
            </p>
            {comp.compatibility.worksWellWith.length > 0 && (
              <p>
                Works well with{' '}
                <span className="text-text-primary">{comp.compatibility.worksWellWith.join(', ')}</span>.
              </p>
            )}
            {comp.compatibility.compositionRoles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {comp.compatibility.compositionRoles.map((role) => (
                  <Badge key={role} tone="neutral">
                    {role.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Section>

        {comp.accessibility.knownLimitations && comp.accessibility.knownLimitations.length > 0 && (
          <Section title="Accessibility notes">
            <ul className="list-disc pl-5 text-sm text-text-secondary">
              {comp.accessibility.knownLimitations.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Page>
  );
}
