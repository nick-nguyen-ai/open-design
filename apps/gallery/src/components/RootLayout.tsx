import { Outlet } from 'react-router-dom';
import { SkipLink } from '@enterprise-design/primitives';
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
        <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-1 px-6 py-8 text-sm text-text-muted">
          <p className="font-weight-medium text-text-secondary">Enterprise Design Intelligence</p>
          <p>
            A catalogue of bank-credible experience templates, live components, and design grammars.
            Metadata is compiled from the design registry — no experience rendering leaves this
            gallery.
          </p>
        </div>
      </footer>
    </div>
  );
}
