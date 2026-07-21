import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { componentById, experienceById, grammarById, grammars } from '../data/registry.js';
import { detailRoute } from '../data/routes.js';
import { grammarAccent, SURFACE_LABEL } from '../data/labels.js';
import { Page, Section } from '../components/Page.js';
import { GrammarSpecimen } from '../components/GrammarSpecimen.js';
import { PreviewImage } from '../components/PreviewImage.js';
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
      <div className="mb-10 overflow-hidden border border-border-subtle bg-surface-sunken">
        <GrammarSpecimen
          grammarId={grammar.id}
          alt={`The specimen design rendered in ${grammar.name}`}
          className="block aspect-[16/10] w-full object-cover object-top"
        />
      </div>
      <div className="flex flex-col gap-10">
        <Section title="The same design in other grammars">
          <ul
            aria-label="The same design in other grammars"
            className="flex gap-4 overflow-x-auto pb-2"
          >
            {grammars
              .filter((g) => g.id !== grammar.id)
              .map((g) => (
                <li key={g.id} className="w-44 shrink-0">
                  <RouterLink
                    to={detailRoute('grammar', g.id)}
                    className="group block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden border border-border-subtle bg-surface-sunken">
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 z-[1] h-0.5"
                        style={{ backgroundColor: grammarAccent(g.id) }}
                      />
                      <GrammarSpecimen
                        grammarId={g.id}
                        alt=""
                        className="block h-full w-full object-cover object-top"
                      />
                    </span>
                    <span className="mt-1.5 block text-xs font-medium text-text-primary group-hover:underline">
                      {g.name}
                    </span>
                  </RouterLink>
                </li>
              ))}
          </ul>
        </Section>

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
            <ul
              aria-label="Example templates"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {examples.map((exp) => (
                <li key={exp.id}>
                  <RouterLink
                    to={detailRoute('experience', exp.id)}
                    className="group block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <span className="block aspect-[16/10] overflow-hidden border border-border-subtle bg-surface-sunken">
                      <PreviewImage
                        id={exp.id}
                        alt=""
                        className="block h-full w-full object-cover object-top"
                      />
                    </span>
                    <span className="mt-2 block text-sm font-medium text-text-primary group-hover:underline">
                      {exp.title}
                    </span>
                    <span className="block text-xs text-text-muted">
                      {SURFACE_LABEL[exp.surface]}
                    </span>
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
