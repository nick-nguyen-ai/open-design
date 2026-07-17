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

const AnnualLetterPage = lazy(
  () =>
    import(
      '../../../../experiences/personal-pages/home-technical-leadership-portfolio/AnnualLetterPage.js'
    ),
);
const BenchJournalPage = lazy(
  () =>
    import('../../../../experiences/personal-pages/home-ai-experiment-notebook/BenchJournalPage.js'),
);
const GreenhousePage = lazy(
  () =>
    import(
      '../../../../experiences/personal-pages/home-internal-ai-tool-laboratory/GreenhousePage.js'
    ),
);

const TheLinePage = lazy(
  () => import('../../../../experiences/personal-pages/home-career-project-timeline/TheLinePage.js'),
);
const DawnWallPage = lazy(
  () =>
    import(
      '../../../../experiences/personal-pages/home-team-contribution-impact-page/DawnWallPage.js'
    ),
);
const ReadingRoomPage = lazy(
  () =>
    import('../../../../experiences/personal-pages/home-mentoring-tutorial-hub/ReadingRoomPage.js'),
);

const AtlasPage = lazy(
  () => import('../../../../experiences/personal-pages/home-knowledge-atlas/AtlasPage.js'),
);
const SpecimenBookPage = lazy(
  () =>
    import(
      '../../../../experiences/personal-pages/home-research-publication-portfolio/SpecimenBookPage.js'
    ),
);
const PlaybillPage = lazy(
  () =>
    import('../../../../experiences/personal-pages/home-talks-presentation-archive/PlaybillPage.js'),
);

const PlanningWallPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-project-kickoff/PlanningWallPage.js'),
);
const PreprintPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-research-discussion/PreprintPage.js'),
);
const CampaignRoomPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-marketing-campaign/CampaignRoomPage.js'),
);

const TMinusPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-product-launch/TMinusPage.js'),
);
const WhiteboardPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-team-retrospective/WhiteboardPage.js'),
);
const CutoverPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-cloud-migration/CutoverPage.js'),
);

const QuarterPage = lazy(
  () =>
    import('../../../../experiences/slide-decks/deck-quarterly-business-review/QuarterPage.js'),
);
const StraightPitchPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-sales-pitch/StraightPitchPage.js'),
);
const AllocationPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-budget-planning/AllocationPage.js'),
);
const LongSignalPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-analytics-deep-dive/LongSignalPage.js'),
);

const SketchnoteDeckPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-dgm-sketchnote/SketchnoteDeckPage.js'),
);
const BlueprintDeckPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-dgm-blueprint/BlueprintDeckPage.js'),
);
const CircuitDeckPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-dgm-circuit/CircuitDeckPage.js'),
);
const IsometricDeckPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-dgm-isometric/IsometricDeckPage.js'),
);
const GazetteDeckPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-dgm-gazette/GazetteDeckPage.js'),
);

const MorningBriefPage = lazy(
  () =>
    import('../../../../experiences/dashboards/db-ai-risk-command-centre/MorningBriefPage.js'),
);
const DeparturesBoardPage = lazy(
  () =>
    import('../../../../experiences/dashboards/db-delivery-control-tower/DeparturesBoardPage.js'),
);
const RegistryPage = lazy(
  () => import('../../../../experiences/dashboards/db-regulatory-control-hub/RegistryPage.js'),
);
const WaterWorksPage = lazy(
  () => import('../../../../experiences/dashboards/db-data-quality-operations/WaterWorksPage.js'),
);
const InterchangePage = lazy(
  () =>
    import('../../../../experiences/dashboards/db-dependency-network-explorer/InterchangePage.js'),
);
const LabBenchPage = lazy(
  () =>
    import('../../../../experiences/dashboards/db-experiment-analysis-workspace/LabBenchPage.js'),
);
const TriageBayPage = lazy(
  () =>
    import('../../../../experiences/dashboards/db-incident-remediation-centre/TriageBayPage.js'),
);
const LongReadPage = lazy(
  () =>
    import('../../../../experiences/dashboards/db-portfolio-performance-explorer/LongReadPage.js'),
);
const WindTunnelPage = lazy(
  () =>
    import('../../../../experiences/dashboards/db-scenario-stress-simulator/WindTunnelPage.js'),
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
  'home-technical-leadership-portfolio': { mood: 'light', Component: AnnualLetterPage },
  'home-ai-experiment-notebook': { mood: 'light', Component: BenchJournalPage },
  'home-internal-ai-tool-laboratory': { mood: 'dark', Component: GreenhousePage },
  'home-career-project-timeline': { mood: 'dark', Component: TheLinePage },
  'home-team-contribution-impact-page': { mood: 'dark', Component: DawnWallPage },
  'home-mentoring-tutorial-hub': { mood: 'light', Component: ReadingRoomPage },
  'home-knowledge-atlas': { mood: 'dark', Component: AtlasPage },
  'home-research-publication-portfolio': { mood: 'light', Component: SpecimenBookPage },
  'home-talks-presentation-archive': { mood: 'dark', Component: PlaybillPage },
  'deck-project-kickoff': { mood: 'light', Component: PlanningWallPage },
  'deck-research-discussion': { mood: 'light', Component: PreprintPage },
  'deck-marketing-campaign': { mood: 'dark', Component: CampaignRoomPage },
  'deck-product-launch': { mood: 'dark', Component: TMinusPage },
  'deck-team-retrospective': { mood: 'light', Component: WhiteboardPage },
  'deck-cloud-migration': { mood: 'light', Component: CutoverPage },
  'deck-quarterly-business-review': { mood: 'light', Component: QuarterPage },
  'deck-sales-pitch': { mood: 'light', Component: StraightPitchPage },
  'deck-budget-planning': { mood: 'light', Component: AllocationPage },
  'deck-analytics-deep-dive': { mood: 'dark', Component: LongSignalPage },
  'deck-dgm-sketchnote': { mood: 'light', Component: SketchnoteDeckPage },
  'deck-dgm-blueprint': { mood: 'dark', Component: BlueprintDeckPage },
  'deck-dgm-circuit': { mood: 'dark', Component: CircuitDeckPage },
  'deck-dgm-isometric': { mood: 'light', Component: IsometricDeckPage },
  'deck-dgm-gazette': { mood: 'light', Component: GazetteDeckPage },
  'db-ai-risk-command-centre': { mood: 'light', Component: MorningBriefPage },
  'db-delivery-control-tower': { mood: 'dark', Component: DeparturesBoardPage },
  'db-regulatory-control-hub': { mood: 'light', Component: RegistryPage },
  'db-data-quality-operations': { mood: 'light', Component: WaterWorksPage },
  'db-dependency-network-explorer': { mood: 'dark', Component: InterchangePage },
  'db-experiment-analysis-workspace': { mood: 'light', Component: LabBenchPage },
  'db-incident-remediation-centre': { mood: 'dark', Component: TriageBayPage },
  'db-portfolio-performance-explorer': { mood: 'light', Component: LongReadPage },
  'db-scenario-stress-simulator': { mood: 'dark', Component: WindTunnelPage },
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
          “{experienceId}” has no live rendering yet. Thirty-three worlds are live: the Model
          Monitoring Cockpit, the System Architecture explainer, the AI Strategy board deck, the
          Model Validation Hub, the Data Scientist Studio, nineteen deck worlds — the Committee
          Paper, the Lab Report, the Control Frame, the River, the Readout, the Gallery Floor,
          the Manifesto, the Sectional, the Field Manual, the Planning Wall, the Preprint, the
          Campaign Room, T-Minus, the Whiteboard, the Cutover, the Quarter, the Straight Pitch,
          the Allocation, and the Long Signal — and nine personal pages: the Annual Letter, the Bench Journal, the
          Greenhouse, the Line, the Dawn Wall, the Reading Room, the Atlas, the Specimen Book, and
          the Playbill.
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
