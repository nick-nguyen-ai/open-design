import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Badge } from '@enterprise-design/primitives';
import { componentById, experienceById } from '../data/registry.js';
import { detailRoute } from '../data/routes.js';
import {
  APPROVAL_LABEL,
  AUDIENCE_LABEL,
  DENSITY_LABEL,
  grammarName,
  motionLevelLabel,
  SUITABILITY_LABEL,
  SURFACE_LABEL,
} from '../data/labels.js';
import { MetaGrid, Page, Section } from '../components/Page.js';
import { useRecentlyViewed } from '../state/useRecentlyViewed.js';

export default function TemplateDetail() {
  const { experienceId = '' } = useParams();
  const exp = experienceById.get(experienceId);
  const { record } = useRecentlyViewed();

  useEffect(() => {
    if (exp) {
      record({ id: exp.id, entityType: 'experience', title: exp.title, route: detailRoute('experience', exp.id) });
    }
  }, [exp, record]);

  if (!exp) {
    return (
      <Page title="Template not found" backTo="/browse" backLabel="Back to browse">
        <p className="text-text-secondary">No template exists with id “{experienceId}”.</p>
      </Page>
    );
  }

  return (
    <Page
      eyebrow={grammarName(exp.grammarId)}
      title={exp.title}
      description={exp.designThesis}
      backTo="/browse?mode=templates"
      backLabel="Back to templates"
      actions={<Badge tone="info">{APPROVAL_LABEL[exp.approval.state]}</Badge>}
    >
      <div className="flex flex-col gap-10">
        <MetaGrid
          rows={[
            { label: 'Surface', value: exp.surface ? SURFACE_LABEL[exp.surface] : '—' },
            {
              label: 'Grammar',
              value: (
                <RouterLink to={`/grammars/${exp.grammarId}`} className="text-accent hover:underline">
                  {grammarName(exp.grammarId)}
                </RouterLink>
              ),
            },
            { label: 'Audiences', value: exp.audiences.map((a) => AUDIENCE_LABEL[a]).join(', ') },
            { label: 'Density', value: DENSITY_LABEL[exp.density] },
            { label: 'Motion level', value: motionLevelLabel(exp.motionLevel) },
            { label: 'Corporate suitability', value: SUITABILITY_LABEL[exp.corporateSuitability] },
            { label: 'Theme modes', value: exp.themeModes.join(', ') },
            {
              label: 'Approval',
              value: `${APPROVAL_LABEL[exp.approval.state]} · quality ${exp.approval.qualityScore}/100`,
            },
          ]}
        />

        <Section title="Routes">
          <ul className="flex flex-col gap-2">
            {exp.routes.map((route) => (
              <li
                key={route.path}
                className="flex flex-col gap-0.5 rounded-md border border-border-subtle bg-surface-raised p-3"
              >
                <span className="font-medium text-text-primary">{route.title}</span>
                <span className="font-mono text-xs text-text-muted">{route.path}</span>
                <span className="text-sm text-text-secondary">{route.purpose}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Components used">
          <ul className="flex flex-wrap gap-2">
            {exp.componentsUsed.map((id) => {
              const comp = componentById.get(id);
              return (
                <li key={id}>
                  <RouterLink
                    to={detailRoute('component', id)}
                    className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface-raised px-3 py-2 text-sm no-underline transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <span className="text-text-primary">{comp?.name ?? id}</span>
                    {comp && <span className="text-xs capitalize text-text-muted">{comp.category}</span>}
                  </RouterLink>
                </li>
              );
            })}
          </ul>
        </Section>

        {exp.businessIntents.length > 0 && (
          <Section title="Business intents">
            <div className="flex flex-wrap gap-2">
              {exp.businessIntents.map((intent) => (
                <Badge key={intent} tone="neutral">
                  {intent.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {exp.approval.notes && exp.approval.notes.length > 0 && (
          <Section title="Approval notes">
            <ul className="list-disc pl-5 text-sm text-text-secondary">
              {exp.approval.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Page>
  );
}
