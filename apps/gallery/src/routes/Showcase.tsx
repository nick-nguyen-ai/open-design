import { Link as RouterLink } from 'react-router-dom';
import { experienceById } from '../data/registry.js';
import { SHOWCASE_SAMPLES, sampleRoute, type ShowcaseSample } from '../data/samples.js';
import { Page } from '../components/Page.js';
import { PreviewImage } from '../components/PreviewImage.js';
import { ArrowRightIcon } from '../components/icons.js';

/** One framed sample: preview, provenance caption, live link. */
function SampleCard({ sample }: { sample: ShowcaseSample }) {
  const source = sample.sourceExperienceId
    ? experienceById.get(sample.sourceExperienceId)
    : undefined;

  return (
    <article className="group relative flex h-full flex-col border border-border-subtle bg-surface-raised p-2.5 shadow-sm transition-[transform,box-shadow] duration-structure ease-settle hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <RouterLink
        to={sampleRoute(sample)}
        className="absolute inset-0 z-10 rounded-sm no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        aria-label={`Open live sample: ${sample.title}`}
      />
      <div className="relative aspect-[16/10] overflow-hidden border border-border-subtle bg-surface-sunken">
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-text-muted">
          {sample.surface}
        </div>
        <PreviewImage
          id={sample.previewId}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <span className="absolute right-2 top-2 inline-flex items-center gap-1.5 border border-accent/40 bg-surface-raised/90 px-1.5 py-0.5 font-mono text-[0.58rem] font-medium uppercase tracking-wider text-accent opacity-0 transition-opacity duration-feedback ease-settle group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:opacity-100">
          Open live <ArrowRightIcon aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1.5 pb-1.5 pt-3">
        <h2 className="font-heading text-md font-semibold leading-snug tracking-tight text-text-primary">
          {sample.title}
        </h2>
        <p className="text-sm leading-normal text-text-secondary">{sample.description}</p>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-border-subtle pt-2.5">
          <span className="font-mono text-[0.6rem] font-medium uppercase tracking-wider text-accent">
            {sample.tool}
          </span>
          {source ? (
            <RouterLink
              to={`/templates/${source.id}`}
              className="relative z-20 text-xs text-text-muted no-underline hover:text-text-primary hover:underline"
            >
              from {sample.sourceName ?? source.title}
            </RouterLink>
          ) : (
            <span className="text-xs text-text-muted">{sample.surface}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Showcase() {
  return (
    <Page
      eyebrow="Showcase"
      title="Made with this gallery."
      description={
        <>
          Every piece below was composed by an AI — a brief in, a finished design out — through
          the MCP server and skills, using the templates in this gallery. None of it was designed
          by hand.{' '}
          <RouterLink to="/make" className="text-accent no-underline hover:underline">
            Make yours →
          </RouterLink>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        <p className="border-y border-border-subtle py-3 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-text-muted">
          {SHOWCASE_SAMPLES.length} samples · 5 surfaces · content only — the craft stays in the
          template
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE_SAMPLES.map((sample) => (
            <SampleCard key={sample.slug} sample={sample} />
          ))}
        </div>
      </div>
    </Page>
  );
}
