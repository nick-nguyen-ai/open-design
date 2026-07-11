import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface PageProps {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Shared detail/explorer page scaffold: back link, single `<h1>`, lede, body. */
export function Page({ title, eyebrow, description, backTo, backLabel, actions, children }: PageProps) {
  return (
    <div className="mx-auto w-full max-w-[72rem] px-6 py-12">
      {backTo && (
        <RouterLink
          to={backTo}
          className="mb-6 inline-flex items-center gap-1 text-sm font-weight-medium text-text-secondary no-underline transition-colors duration-feedback ease-settle hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <span aria-hidden>←</span> {backLabel ?? 'Back'}
        </RouterLink>
      )}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-2 text-sm font-weight-medium uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl font-weight-semibold leading-tight tracking-tight text-text-primary">
            {title}
          </h1>
          {description && (
            <div className="mt-3 text-lg leading-relaxed text-text-secondary">{description}</div>
          )}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

/** A titled metadata section used across detail pages. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-weight-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

/** A key/value grid row for metadata dictionaries. */
export function MetaGrid({ rows }: { rows: Array<{ label: string; value: ReactNode }> }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-0.5 border-t border-border-subtle pt-2">
          <dt className="text-xs font-weight-medium uppercase tracking-wide text-text-muted">
            {row.label}
          </dt>
          <dd className="text-sm text-text-primary">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
