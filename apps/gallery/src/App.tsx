import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
const ComponentDetail = lazy(() => import('./routes/ComponentDetail.js'));
const GrammarDetail = lazy(() => import('./routes/GrammarDetail.js'));
const Make = lazy(() => import('./routes/Make.js'));
const Showcase = lazy(() => import('./routes/Showcase.js'));
const Contribute = lazy(() => import('./routes/Contribute.js'));
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

// Experience-composer skill OUTPUTS — one sample per surface (all-surfaces
// Phase 1), each a content-only fill through its world template.
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

/** One route element: a lazy page inside the shared suspense fallback. */
function suspended(node: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>;
}

/** `/browse` lives on as the catalogue home — preserve any query it carried. */
function BrowseRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/${search}`} replace />;
}

export function App() {
  const preferences = usePreferences();

  return (
    <MotionProvider reducedMotion={preferences.reducedMotion}>
      <PreferencesProvider value={preferences}>
        <Routes>
          <Route path="live/:experienceId" element={suspended(<LiveExperience />)} />
          <Route path="demo/deepagents" element={suspended(<DeepAgentsDemo />)} />
          <Route path="demo/mcp-sample" element={suspended(<McpSampleDemo />)} />
          <Route path="demo/openwiki" element={suspended(<OpenWikiDemo />)} />
          <Route path="demo/borrow-pilot" element={suspended(<BorrowPilotDemo />)} />
          <Route path="demo/gitlab-qbr" element={suspended(<GitlabQbrDemo />)} />
          <Route path="demo/openmodel-cockpit" element={suspended(<OpenmodelCockpitDemo />)} />
          <Route path="demo/moderation-stack" element={suspended(<ModerationStackDemo />)} />
          <Route path="demo/agent-evals" element={suspended(<AgentEvalsDemo />)} />
          <Route path="demo/ml-career" element={suspended(<MlCareerDemo />)} />
          <Route element={<RootLayout />}>
            <Route index element={<Landing />} />
            <Route path="browse" element={<BrowseRedirect />} />
            <Route path="make" element={suspended(<Make />)} />
            <Route path="showcase" element={suspended(<Showcase />)} />
            <Route path="contribute" element={suspended(<Contribute />)} />
            <Route path="templates/:experienceId" element={suspended(<TemplateDetail />)} />
            {/* Legacy IA (pre-2026-07-17): the Components/Grammars/Guide index
                pages folded into Contribute and the Blueprint Lab stub into
                Make; their detail routes remain first-class. */}
            <Route path="components" element={<Navigate to="/contribute" replace />} />
            <Route path="components/:componentId" element={suspended(<ComponentDetail />)} />
            <Route path="grammars" element={<Navigate to="/contribute" replace />} />
            <Route path="grammars/:grammarId" element={suspended(<GrammarDetail />)} />
            <Route path="guide" element={<Navigate to="/contribute" replace />} />
            <Route path="blueprint-lab" element={<Navigate to="/make" replace />} />
            <Route path="*" element={suspended(<NotFound />)} />
          </Route>
        </Routes>
        {/* Self-gated to /live/* and /demo/* — renders nothing elsewhere. */}
        <PartInspector />
      </PreferencesProvider>
    </MotionProvider>
  );
}
