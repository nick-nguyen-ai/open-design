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

const BoardDeckPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-ai-strategy/BoardDeckPage.js'),
);
const LedgerPage = lazy(
  () => import('../../../../experiences/project-pages/proj-ai-model-validation-hub/LedgerPage.js'),
);
const StudioPage = lazy(
  () => import('../../../../experiences/personal-pages/home-data-scientist-studio/StudioPage.js'),
);

const CommitteePaperPage = lazy(
  () =>
    import(
      '../../../../experiences/slide-decks/deck-executive-decision-proposal/CommitteePaperPage.js'
    ),
);
const LabReportPage = lazy(
  () =>
    import(
      '../../../../experiences/slide-decks/deck-genai-model-validation-report/LabReportPage.js'
    ),
);
const ControlFramePage = lazy(
  () =>
    import('../../../../experiences/slide-decks/deck-ai-governance-and-controls/ControlFramePage.js'),
);

const RiverDeckPage = lazy(
  () =>
    import('../../../../experiences/slide-decks/deck-transformation-roadmap/RiverDeckPage.js'),
);
const ReadoutDeckPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-experiment-results/ReadoutDeckPage.js'),
);
const GalleryFloorPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-innovation-showcase/GalleryFloorPage.js'),
);

const ManifestoPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-product-vision/ManifestoPage.js'),
);
const SectionalPage = lazy(
  () =>
    import(
      '../../../../experiences/slide-decks/deck-technical-architecture-explanation/SectionalPage.js'
    ),
);
const FieldManualPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-technical-training/FieldManualPage.js'),
);

const LIVE_PAGES: Record<LiveExperienceId, { mood: 'light' | 'dark'; Component: ComponentType }> = {
  'db-model-monitoring-cockpit': { mood: 'dark', Component: CockpitPage },
  'exp-system-architecture': { mood: 'light', Component: DrawingOfficePage },
  'deck-ai-strategy': { mood: 'dark', Component: BoardDeckPage },
  'proj-ai-model-validation-hub': { mood: 'light', Component: LedgerPage },
  'home-data-scientist-studio': { mood: 'dark', Component: StudioPage },
  'deck-executive-decision-proposal': { mood: 'light', Component: CommitteePaperPage },
  'deck-genai-model-validation-report': { mood: 'light', Component: LabReportPage },
  'deck-ai-governance-and-controls': { mood: 'dark', Component: ControlFramePage },
  'deck-transformation-roadmap': { mood: 'dark', Component: RiverDeckPage },
  'deck-experiment-results': { mood: 'dark', Component: ReadoutDeckPage },
  'deck-innovation-showcase': { mood: 'dark', Component: GalleryFloorPage },
  'deck-product-vision': { mood: 'light', Component: ManifestoPage },
  'deck-technical-architecture-explanation': { mood: 'dark', Component: SectionalPage },
  'deck-technical-training': { mood: 'light', Component: FieldManualPage },
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
          “{experienceId}” has no live rendering yet. Fourteen worlds are live: the Model
          Monitoring Cockpit, the System Architecture explainer, the AI Strategy board deck, the
          Model Validation Hub, the Data Scientist Studio, and nine deck worlds — the Committee
          Paper, the Lab Report, the Control Frame, the River, the Readout, the Gallery Floor,
          the Manifesto, the Sectional, and the Field Manual.
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
