import { Link as RouterLink } from 'react-router-dom';
import { TEMPLATE_COUNT, components, grammars } from '../data/registry.js';
import { MetaGrid, Page, Section } from '../components/Page.js';

export default function Guide() {
  return (
    <Page
      eyebrow="Guide"
      title="How to browse"
      description="A short map of the vocabulary and the ways into the catalogue."
      backTo="/"
      backLabel="Back to gallery"
    >
      <div className="flex flex-col gap-10">
        <Section title="Template vs. Experience">
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            A <strong className="font-weight-medium text-text-primary">Template</strong> is the
            reusable, catalogued shape of an{' '}
            <strong className="font-weight-medium text-text-primary">Experience</strong> — the
            concrete surface a team ships. In this gallery you browse templates as metadata: their
            thesis, grammar, audiences, and the components they use. The experiences themselves are
            rendered elsewhere; nothing here reaches a live product surface.
          </p>
        </Section>

        <Section title="The catalogue">
          <MetaGrid
            rows={[
              { label: 'Templates', value: `${TEMPLATE_COUNT} experience templates across five surfaces` },
              { label: 'Components', value: `${components.length} live, production components` },
              { label: 'Grammars', value: `${grammars.length} design grammars` },
            ]}
          />
        </Section>

        <Section title="Ways in">
          <ul className="flex flex-col gap-3 text-sm leading-relaxed text-text-secondary">
            <li>
              <RouterLink to="/browse" className="text-accent hover:underline">
                Browse
              </RouterLink>{' '}
              — search in natural language or by exact name, then narrow with facet filters
              (surface, grammar, audience, density, motion, suitability, approval).
            </li>
            <li>
              <RouterLink to="/components" className="text-accent hover:underline">
                Components
              </RouterLink>{' '}
              — see each real component render live with sample data.
            </li>
            <li>
              <RouterLink to="/grammars" className="text-accent hover:underline">
                Grammars
              </RouterLink>{' '}
              — read the rules a template is held to.
            </li>
          </ul>
        </Section>
      </div>
    </Page>
  );
}
