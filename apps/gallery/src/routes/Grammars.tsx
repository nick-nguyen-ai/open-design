import { Card } from '@enterprise-design/primitives';
import { grammars } from '../data/registry.js';
import { grammarAccent } from '../data/labels.js';
import { Page } from '../components/Page.js';
import { ArrowRightIcon } from '../components/icons.js';

export default function Grammars() {
  return (
    <Page
      eyebrow="Explorer"
      title="Design grammars"
      description="The ten grammars that hold every template to a standard — each a coherent set of rules for layout, type, motion, and accessibility under a particular kind of pressure."
      backTo="/"
      backLabel="Back to gallery"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <h2 className="font-heading text-md font-weight-semibold text-text-primary">{grammar.name}</h2>
            <p className="line-clamp-4 text-sm leading-normal text-text-secondary">{grammar.intent}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-weight-medium text-accent">
              Explore grammar <ArrowRightIcon />
            </span>
          </Card>
        ))}
      </div>
    </Page>
  );
}
