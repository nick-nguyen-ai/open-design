import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { componentById, experienceById, grammarById } from '../data/registry.js';
import { detailRoute } from '../data/routes.js';
import { grammarAccent } from '../data/labels.js';
import { Page, Section } from '../components/Page.js';
import { useRecentlyViewed } from '../state/useRecentlyViewed.js';

function RuleList({ title, rules }: { title: string; rules?: readonly string[] }) {
  if (!rules || rules.length === 0) return null;
  return (
    <Section title={title}>
      <ul className="flex flex-col gap-2 text-sm leading-relaxed text-text-secondary">
        {rules.map((rule, i) => (
          <li key={i} className="border-l-2 border-border-subtle pl-3">
            {rule}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default function GrammarDetail() {
  const { grammarId = '' } = useParams();
  const grammar = grammarById.get(grammarId);
  const { record } = useRecentlyViewed();

  useEffect(() => {
    if (grammar) {
      record({ id: grammar.id, entityType: 'grammar', title: grammar.name, route: detailRoute('grammar', grammar.id) });
    }
  }, [grammar, record]);

  if (!grammar) {
    return (
      <Page title="Grammar not found" backTo="/contribute" backLabel="Back to Contribute">
        <p className="text-text-secondary">No grammar exists with id “{grammarId}”.</p>
      </Page>
    );
  }

  const examples = grammar.exampleExperienceIds
    .map((id) => experienceById.get(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <Page eyebrow="Design grammar" title={grammar.name} description={grammar.intent} backTo="/contribute" backLabel="Back to Contribute">
      <span
        aria-hidden
        className="mb-8 block h-1 w-24 rounded-full"
        style={{ backgroundColor: grammarAccent(grammar.id) }}
      />
      <div className="flex flex-col gap-10">
        <RuleList title="Layout" rules={grammar.layoutRules} />
        <RuleList title="Typography" rules={grammar.typographyRules} />
        <RuleList title="Surfaces" rules={grammar.surfaceRules} />
        <RuleList title="Navigation" rules={grammar.navigationRules} />
        <RuleList title="Charts" rules={grammar.chartRules} />
        <RuleList title="Diagrams" rules={grammar.diagramRules} />
        <RuleList title="Motion" rules={grammar.motionRules} />
        <RuleList title="Prohibited patterns" rules={grammar.prohibitedPatterns} />
        <RuleList title="Accessibility" rules={grammar.accessibilityNotes} />

        {grammar.preferredComponents.length > 0 && (
          <Section title="Preferred components">
            <ul className="flex flex-wrap gap-2">
              {grammar.preferredComponents.map((id) => {
                const comp = componentById.get(id);
                return (
                  <li key={id}>
                    <RouterLink
                      to={detailRoute('component', id)}
                      className="inline-flex items-center rounded-md border border-border-subtle bg-surface-raised px-3 py-2 text-sm text-text-primary no-underline transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      {comp?.name ?? id}
                    </RouterLink>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {examples.length > 0 && (
          <Section title="Example templates">
            <ul className="flex flex-wrap gap-2">
              {examples.map((exp) => (
                <li key={exp.id}>
                  <RouterLink
                    to={detailRoute('experience', exp.id)}
                    className="inline-flex items-center rounded-md border border-border-subtle bg-surface-raised px-3 py-2 text-sm text-text-primary no-underline transition-colors duration-feedback ease-settle hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {exp.title}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Page>
  );
}
