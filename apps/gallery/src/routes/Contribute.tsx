import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card } from '@enterprise-design/primitives';
import { TEMPLATE_COUNT, components, grammars } from '../data/registry.js';
import { LIVE_EXPERIENCE_IDS } from '../data/live.js';
import { grammarAccent } from '../data/labels.js';
import { Page, Section } from '../components/Page.js';
import { ArrowRightIcon } from '../components/icons.js';

/** A short definition row for the doctrine glossary. */
function Term({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-border-subtle py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="font-heading text-md font-semibold tracking-tight text-text-primary">{term}</dt>
      <dd className="m-0 text-sm leading-relaxed text-text-secondary">{children}</dd>
    </div>
  );
}

export default function Contribute() {
  return (
    <Page
      eyebrow="Contribute"
      title="How the gallery is built."
      description="The machinery behind the templates — the doctrine that keeps them composable, the components and grammars they draw on, and what it takes to add a world of your own."
    >
      <div className="flex flex-col gap-14">
        <Section title="The doctrine">
          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            Every live template is a <em className="font-medium not-italic text-text-primary">world</em>:
            a self-contained page with locked art direction. The split that makes AI composition
            safe is absolute — <em className="font-medium not-italic text-text-primary">the template
            carries the craft, the fill carries the content</em>. Composing a new design never edits
            a template; it only supplies new content through a typed fill schema.
          </p>
          <dl className="m-0 mt-2 max-w-3xl">
            <Term term="World template">
              The page that owns layout, typography, motion, and mood. Ships with a fill schema —
              the exact slots content may occupy — and a section map, kept in lockstep by tests.
            </Term>
            <Term term="Fill">
              Pure content conforming to the schema: your numbers, names, and narrative. The
              shipped original is just one fill; yours is another.
            </Term>
            <Term term="Certifier">
              Every composed result passes the same gates as the originals: schema lockstep, the
              shipped fill parses, every slot resolves, craft holds (no layout drift), no template
              content leaks into fills, and provenance is marked.
            </Term>
            <Term term="Part IDs">
              Notable parts inside live worlds carry stable <code className="font-mono text-xs">data-part-id</code>{' '}
              anchors — a public contract locked by tests. The <span aria-hidden className="font-mono">⌖</span>{' '}
              inspector on any live page reveals them, and the open-design skill can slice
              exactly that part into another design without touching its source.
            </Term>
          </dl>
        </Section>

        <Section title={`The live components (${components.length})`}>
          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            Real, production components the templates share — each with a live preview, its
            states, and guidance on when to use it.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((comp) => (
              <Card
                key={comp.id}
                href={`/components/${comp.id}`}
                className="group flex h-full flex-col gap-3 no-underline"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-md font-semibold text-text-primary">{comp.name}</h3>
                  <span className="shrink-0 rounded-sm border border-border-subtle px-1.5 py-0.5 text-xs font-medium capitalize text-text-muted">
                    {comp.category}
                  </span>
                </div>
                <p className="line-clamp-3 text-sm leading-normal text-text-secondary">
                  {comp.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent">
                  View component <ArrowRightIcon />
                </span>
              </Card>
            ))}
          </div>
        </Section>

        <Section title={`The design grammars (${grammars.length})`}>
          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            The rulebooks that hold every template to a standard — each a coherent set of layout,
            type, motion, and accessibility rules for a particular kind of pressure.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grammars.map((grammar) => (
              <Card
                key={grammar.id}
                href={`/grammars/${grammar.id}`}
                className="group relative flex h-full flex-col gap-3 overflow-hidden !pl-6 no-underline"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ backgroundColor: grammarAccent(grammar.id) }}
                />
                <h3 className="font-heading text-md font-semibold text-text-primary">{grammar.name}</h3>
                <p className="line-clamp-4 text-sm leading-normal text-text-secondary">{grammar.intent}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent">
                  Explore grammar <ArrowRightIcon />
                </span>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Add a world">
          <div className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            <p>
              The catalogue holds {TEMPLATE_COUNT} template specifications, {LIVE_EXPERIENCE_IDS.length}{' '}
              of them built as live worlds. A new world is welcome when it brings a genuinely new
              register — not a re-skin. The path, in brief:
            </p>
            <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5">
              <li>
                Build the template page with its own locked mood, motion tokens, reduced-motion
                behaviour, and light/dark handling where the world supports it.
              </li>
              <li>
                Extract its fill schema + section map, ship the original content as the first
                fill, and add the world-template manifest so the registry and MCP server can
                compose it.
              </li>
              <li>
                Add <code className="font-mono text-xs">data-part-id</code> anchors on its notable
                parts, then hold everything to the gates: certifier, contract suites, parity
                oracles, e2e.
              </li>
            </ol>
            <p className="mt-3">
              The working standard lives in <code className="font-mono text-xs">GUIDANCE.md</code>{' '}
              at the repository root, and the feature docs under{' '}
              <code className="font-mono text-xs">docs/</code> — start with{' '}
              <code className="font-mono text-xs">docs/borrow-a-part.md</code> and the redesign
              specs in <code className="font-mono text-xs">docs/superpowers/specs/</code>.
            </p>
          </div>
        </Section>

        <Section title="Vocabulary">
          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            A <strong className="font-medium text-text-primary">Template</strong> is the reusable,
            catalogued shape of an{' '}
            <strong className="font-medium text-text-primary">Experience</strong> — the concrete
            surface a team ships. The gallery browses templates as metadata plus, for live worlds,
            the running page itself. Nothing here reaches a production surface;{' '}
            <RouterLink to="/showcase" className="text-accent no-underline hover:underline">
              the Showcase
            </RouterLink>{' '}
            holds what the composition pipeline has produced.
          </p>
        </Section>
      </div>
    </Page>
  );
}
