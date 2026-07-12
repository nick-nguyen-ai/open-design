/**
 * `/live/:experienceId` — full-bleed live anchor experiences (task 12).
 *
 * No gallery header/nav: each experience page owns the viewport and carries
 * its own discreet "◄ GALLERY" instrument-chrome affordance. Live pages are
 * single-mood art-directed: while mounted, the document theme is LOCKED to
 * the experience's canonical mood (and restored on unmount) so the shared,
 * token-consuming components inside render in that mood regardless of the
 * gallery's theme toggle.
 */
import { Suspense, lazy, useLayoutEffect, type ComponentType } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { isLiveExperience, type LiveExperienceId } from '../data/live.js';

const CockpitPage = lazy(
  () => import('../../../../experiences/dashboards/db-model-monitoring-cockpit/CockpitPage.js'),
);
const DrawingOfficePage = lazy(
  () => import('../../../../experiences/explainers/exp-system-architecture/DrawingOfficePage.js'),
);

const LIVE_PAGES: Record<LiveExperienceId, { mood: 'light' | 'dark'; Component: ComponentType }> = {
  'db-model-monitoring-cockpit': { mood: 'dark', Component: CockpitPage },
  'exp-system-architecture': { mood: 'light', Component: DrawingOfficePage },
};

/**
 * Locks `data-theme` to the experience's mood for the mount's lifetime.
 * Token-consuming shared components re-style instantly via CSS; the pages'
 * bespoke charts pass explicit experience-local colours, so nothing needs to
 * re-read CSS variables after the flip.
 */
function useLockedTheme(mood: 'light' | 'dark'): void {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', mood);
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, [mood]);
}

function LivePage({ mood, Component }: { mood: 'light' | 'dark'; Component: ComponentType }) {
  useLockedTheme(mood);
  return (
    <Suspense fallback={<div aria-busy="true" style={{ minHeight: '100svh' }} />}>
      <Component />
    </Suspense>
  );
}

export default function LiveExperience() {
  const { experienceId = '' } = useParams();

  if (!isLiveExperience(experienceId)) {
    return (
      <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-start justify-center gap-4 px-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          No live experience here
        </h1>
        <p className="text-text-secondary">
          “{experienceId}” has no live rendering yet. The two live anchors are the Model
          Monitoring Cockpit and the System Architecture explainer.
        </p>
        <RouterLink to="/browse" className="text-accent hover:underline">
          ◄ Back to the gallery
        </RouterLink>
      </main>
    );
  }

  const page = LIVE_PAGES[experienceId];
  return <LivePage key={experienceId} mood={page.mood} Component={page.Component} />;
}
