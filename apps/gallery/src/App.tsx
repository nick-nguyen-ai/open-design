import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import { PartInspector } from './components/PartInspector.js';
import { RootLayout } from './components/RootLayout.js';
import { RouteFallback } from './components/RouteFallback.js';
import { Landing } from './routes/Landing.js';
import { usePreferences } from './state/usePreferences.js';
import { PreferencesProvider } from './state/PreferencesContext.js';

// Route-split the heavier detail views (and the ECharts-backed component
// previews) so the landing bundle stays lean.
const TemplateDetail = lazy(() => import('./routes/TemplateDetail.js'));
const Components = lazy(() => import('./routes/Components.js'));
const ComponentDetail = lazy(() => import('./routes/ComponentDetail.js'));
const Grammars = lazy(() => import('./routes/Grammars.js'));
const GrammarDetail = lazy(() => import('./routes/GrammarDetail.js'));
const BlueprintLab = lazy(() => import('./routes/BlueprintLab.js'));
const Guide = lazy(() => import('./routes/Guide.js'));
const NotFound = lazy(() => import('./routes/NotFound.js'));
// Full-bleed live anchor experiences — rendered OUTSIDE RootLayout so the
// page owns the viewport (no gallery header/nav; task 12).
const LiveExperience = lazy(() => import('./routes/LiveExperience.js'));
// MCP demo deck — not a catalogue template; proves what a compose_design
// blueprint looks like once rendered with real registered components.
const DeepAgentsDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-langchain-deepagents/DeepAgentsPage.js'),
);
// MCP-generated SAMPLE deck (Phase B quality loop) — the payments retry pipeline
// composed via compose_slide_deck → deck-cloud-migration, rendered content-only
// through CutoverTemplate. Not a catalogue template.
const McpSampleDemo = lazy(
  () => import('../../../experiences/slide-decks/sample-payments-retry/SamplePage.js'),
);

// Deck-composer skill OUTPUT (ledger T33) — introducing LangChain OpenWiki,
// composed via compose_slide_deck → deck-product-launch, rendered content-only
// through TMinusTemplate. Not a catalogue template.
const OpenWikiDemo = lazy(
  () => import('../../../experiences/slide-decks/sample-openwiki/OpenWikiPage.js'),
);

// design-borrow skill run EVIDENCE — the Cutover swimlanes part
// (deck-cloud-migration/waves/swimlanes) borrowed into a standalone page.
// Not a catalogue template.
const BorrowPilotDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-borrow-pilot/BorrowPilotPage.js'),
);

// Experience-composer goal-test OUTPUTS (five-surface sample run, ledger Task 12).
// Each is a fill composed via its surface's compose tool, rendered content-only
// through the shipped world-template. Not catalogue templates.
const GitlabQbrDemo = lazy(
  () => import('../../../experiences/slide-decks/sample-gitlab-qbr/GitlabQbrPage.js'),
);
const OpenmodelCockpitDemo = lazy(
  () => import('../../../experiences/dashboards/sample-openmodel-cockpit/OpenmodelCockpitPage.js'),
);
const ModerationStackDemo = lazy(
  () => import('../../../experiences/explainers/sample-moderation-stack/ModerationStackPage.js'),
);
const AgentEvalsDemo = lazy(
  () => import('../../../experiences/project-pages/sample-agent-evals/AgentEvalsPage.js'),
);
const MlCareerDemo = lazy(
  () => import('../../../experiences/personal-pages/sample-ml-career/MlCareerPage.js'),
);

export function App() {
  const preferences = usePreferences();

  return (
    <MotionProvider reducedMotion={preferences.reducedMotion}>
      <PreferencesProvider value={preferences}>
        <Routes>
          <Route
            path="live/:experienceId"
            element={
              <Suspense fallback={<RouteFallback />}>
                <LiveExperience />
              </Suspense>
            }
          />
          <Route
            path="demo/deepagents"
            element={
              <Suspense fallback={<RouteFallback />}>
                <DeepAgentsDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/mcp-sample"
            element={
              <Suspense fallback={<RouteFallback />}>
                <McpSampleDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/openwiki"
            element={
              <Suspense fallback={<RouteFallback />}>
                <OpenWikiDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/borrow-pilot"
            element={
              <Suspense fallback={<RouteFallback />}>
                <BorrowPilotDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/gitlab-qbr"
            element={
              <Suspense fallback={<RouteFallback />}>
                <GitlabQbrDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/openmodel-cockpit"
            element={
              <Suspense fallback={<RouteFallback />}>
                <OpenmodelCockpitDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/moderation-stack"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ModerationStackDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/agent-evals"
            element={
              <Suspense fallback={<RouteFallback />}>
                <AgentEvalsDemo />
              </Suspense>
            }
          />
          <Route
            path="demo/ml-career"
            element={
              <Suspense fallback={<RouteFallback />}>
                <MlCareerDemo />
              </Suspense>
            }
          />
          <Route element={<RootLayout />}>
            <Route index element={<Landing />} />
            <Route path="browse" element={<Landing />} />
            <Route
              path="templates/:experienceId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <TemplateDetail />
                </Suspense>
              }
            />
            <Route
              path="components"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Components />
                </Suspense>
              }
            />
            <Route
              path="components/:componentId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ComponentDetail />
                </Suspense>
              }
            />
            <Route
              path="grammars"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Grammars />
                </Suspense>
              }
            />
            <Route
              path="grammars/:grammarId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <GrammarDetail />
                </Suspense>
              }
            />
            <Route
              path="blueprint-lab"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <BlueprintLab />
                </Suspense>
              }
            />
            <Route
              path="guide"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Guide />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
        </Routes>
        {/* Self-gated to /live/* and /demo/* — renders nothing elsewhere. */}
        <PartInspector />
      </PreferencesProvider>
    </MotionProvider>
  );
}
