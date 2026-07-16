import { Link as RouterLink, Outlet } from 'react-router-dom';
import { SkipLink } from '@enterprise-design/primitives';
import { TEMPLATE_COUNT, components, grammars } from '../data/registry.js';
import { LIVE_EXPERIENCE_IDS } from '../data/live.js';
import { Header } from './Header.js';

/** App shell shared by every route: skip link, header, main landmark, footer. */
export function RootLayout() {
  return (
    <div className="flex min-h-full flex-col bg-surface-base">
      <SkipLink targetId="main-content" />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex w-full max-w-[80rem] flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 py-8">
          <div className="flex flex-col gap-1">
            <p className="font-display text-md font-bold tracking-tight text-text-primary">
              Open<em className="italic text-accent">Design</em>
            </p>
            <p className="font-mono text-[0.56rem] font-medium uppercase tracking-[0.18em] text-text-muted">
              A gallery of living templates
            </p>
          </div>
          <p className="text-sm text-text-muted">
            {LIVE_EXPERIENCE_IDS.length} live worlds · {TEMPLATE_COUNT} templates ·{' '}
            {components.length} components · {grammars.length} grammars —{' '}
            <RouterLink to="/make" className="text-accent no-underline hover:underline">
              composed by AI on demand
            </RouterLink>
          </p>
        </div>
      </footer>
    </div>
  );
}
