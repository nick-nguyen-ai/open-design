import type { ReactNode } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { experienceById } from '../data/registry.js';
import { SURFACE_LABEL } from '../data/labels.js';
import { SHOWCASE_SAMPLES, sampleRoute } from '../data/samples.js';
import { Page } from '../components/Page.js';
import { CopyButton } from '../components/CopyButton.js';
import { PreviewImage } from '../components/PreviewImage.js';
import { ArrowRightIcon } from '../components/icons.js';

const MCP_ADD_COMMAND = 'claude mcp add open-design -- corepack pnpm --filter mcp-server start';

/** A numbered step, set like a museum plaque. */
function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[3rem_1fr] gap-x-5 gap-y-2 border-t border-border-subtle py-7 first:border-t-0 sm:grid-cols-[4rem_1fr]">
      <span aria-hidden className="font-display text-2xl font-bold italic text-accent">
        {n}
      </span>
      <div className="flex flex-col gap-2.5">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </li>
  );
}

/** A paste-ready snippet with its copy affordance. */
function Snippet({ text, caption }: { text: string; caption: string }) {
  return (
    <figure className="m-0 flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-3 rounded-md border border-border-subtle bg-surface-sunken px-3.5 py-3">
        <code className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-text-primary">
          {text}
        </code>
        <CopyButton text={text} />
      </div>
      <figcaption className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function Make() {
  const [params] = useSearchParams();
  // A ?template=<id> handoff (from the gallery drawer) pre-fills the prompts.
  const requested = params.get('template');
  const chosen = (requested && experienceById.get(requested)) || undefined;
  const templateId = chosen?.id ?? 'deck-cloud-migration';
  const surfaceWord = (chosen?.surface ? SURFACE_LABEL[chosen.surface] : 'Slide Deck').toLowerCase();

  const composePrompt = `Compose a ${surfaceWord} about <your content> into the ${templateId} world using the experience-composer skill.`;
  const borrowPrompt = 'Borrow part deck-cloud-migration/waves/swimlanes using the design-borrow skill.';

  const proof = SHOWCASE_SAMPLES.slice(0, 3);

  return (
    <Page
      eyebrow="Make your design"
      title="Hand it your content. Keep the craft."
      description="Every template in this gallery is a working world an AI can compose around your material — your numbers, your story, your launch — without touching the design itself. Here is the whole loop."
    >
      <div className="flex flex-col gap-12">
        {chosen && (
          <p className="border-l-2 border-accent bg-surface-raised px-4 py-3 text-sm text-text-secondary">
            Prompts below are pre-filled for{' '}
            <RouterLink to={`/templates/${chosen.id}`} className="text-accent no-underline hover:underline">
              {chosen.title}
            </RouterLink>
            .
          </p>
        )}

        <ol className="m-0 list-none p-0">
          <Step n="01" title="Pick a template">
            <p>
              Browse the{' '}
              <RouterLink to="/" className="text-accent no-underline hover:underline">
                Gallery
              </RouterLink>{' '}
              and open anything marked <span className="font-mono text-xs font-medium uppercase tracking-wider text-accent">● live</span> —
              those are working worlds, not mock-ups. The design you see is exactly the design
              your content will inherit: layout, motion, typography, all of it locked.
            </p>
          </Step>

          <Step n="02" title="Open the repo in your AI agent">
            <p>
              Clone the repository and open it in Claude Code (or any agent that speaks MCP). One
              command registers the design server and its compose tools:
            </p>
            <Snippet text={MCP_ADD_COMMAND} caption="Run once, from the repository root" />
          </Step>

          <Step n="03" title="Say what you want">
            <p>
              Describe your content and name the template. The skills do the rest — no design
              vocabulary required:
            </p>
            <Snippet text={composePrompt} caption="Compose a whole design from your brief" />
            <p>
              Or take just one part you love — click the{' '}
              <span aria-hidden className="font-mono">⌖</span> inspector on any live page to get a
              part’s ID, then:
            </p>
            <Snippet text={borrowPrompt} caption="Borrow a single component or animation" />
          </Step>

          <Step n="04" title="It composes, certifies, ships">
            <p>
              The skill drafts your content into the template’s fill schema, the MCP server
              composes and validates it, and a certifier holds the result to the same gates as the
              originals — theme parity, motion discipline, accessibility, zero template edits.
              Your design lands on its own page, ready to present.{' '}
              <RouterLink to="/contribute" className="text-accent no-underline hover:underline">
                How that works under the hood →
              </RouterLink>
            </p>
          </Step>
        </ol>

        <section aria-labelledby="proof-heading" className="flex flex-col gap-4 border-t border-border-subtle pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="proof-heading" className="font-heading text-lg font-semibold tracking-tight text-text-primary">
              Proof it works
            </h2>
            <RouterLink
              to="/showcase"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent no-underline hover:underline"
            >
              All {SHOWCASE_SAMPLES.length} samples <ArrowRightIcon aria-hidden />
            </RouterLink>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {proof.map((sample) => (
              <RouterLink
                key={sample.slug}
                to={sampleRoute(sample)}
                className="group flex flex-col gap-2 border border-border-subtle bg-surface-raised p-2 no-underline shadow-sm transition-[transform,box-shadow] duration-structure ease-settle hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[16/10] overflow-hidden border border-border-subtle bg-surface-sunken">
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-text-muted">
                    {sample.surface}
                  </div>
                  <PreviewImage
                    id={sample.previewId}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </div>
                <span className="px-1 pb-1 text-sm font-medium leading-snug text-text-primary group-hover:text-accent">
                  {sample.title}
                </span>
              </RouterLink>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
