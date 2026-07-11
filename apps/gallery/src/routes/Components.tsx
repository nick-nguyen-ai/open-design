import { Card } from '@enterprise-design/primitives';
import { components } from '../data/registry.js';
import { Page } from '../components/Page.js';
import { ArrowRightIcon } from '../components/icons.js';

export default function Components() {
  return (
    <Page
      eyebrow="Explorer"
      title="Components"
      description="The real, production components behind the templates — each with a live preview, its states, and guidance on when to use it."
      backTo="/"
      backLabel="Back to gallery"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((comp) => (
          <Card key={comp.id} href={`/components/${comp.id}`} className="group flex h-full flex-col gap-3 no-underline">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-heading text-md font-semibold text-text-primary">{comp.name}</h2>
              <span className="shrink-0 rounded-sm border border-border-subtle px-1.5 py-0.5 text-xs font-medium capitalize text-text-muted">
                {comp.category}
              </span>
            </div>
            <p className="line-clamp-3 text-sm leading-normal text-text-secondary">{comp.description}</p>
            <div className="mt-auto flex items-center gap-x-2 text-xs text-text-muted">
              <span>{comp.compatibleSurfaces.length} surfaces</span>
              <span aria-hidden>·</span>
              <span>{comp.performance.renderingCost} cost</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
              View component <ArrowRightIcon />
            </span>
          </Card>
        ))}
      </div>
    </Page>
  );
}
