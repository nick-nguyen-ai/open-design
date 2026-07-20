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

// open-design skill COMPOSE output — the internal OpenDesign system intro,
// composed via compose_slide_deck → deck-dgm-circuit, rendered content-only
// through CircuitDeckTemplate. Not a catalogue template.
const OpenDesignIntroDemo = lazy(
  () => import('../../../experiences/slide-decks/sample-opendesign-intro/OpenDesignIntroPage.js'),
);

// Same compose run, isolated copy (this session's authored fill kept apart from
// the parallel session working in sample-opendesign-intro). Not a catalogue template.
const OpenDesignIntroFableDemo = lazy(
  () => import('../../../experiences/slide-decks/sample-opendesign-intro-fable/OpenDesignIntroFablePage.js'),
);

// Same compose run, isolated copy (this session's authored fill kept apart from
// the concurrent sessions working in sample-opendesign-intro and
// sample-opendesign-intro-fable). Not a catalogue template.
const OpenDesignIntroSonnetDemo = lazy(
  () => import('../../../experiences/slide-decks/sample-opendesign-intro-sonnet/OpenDesignIntroSonnetPage.js'),
);

// Same compose run, durable Opus-owned copy (kept apart from the concurrent
// sessions rewriting sample-opendesign-intro / -fable / -sonnet). Not a
// catalogue template.
const OpenDesignIntroOpusDemo = lazy(
  () => import('../../../experiences/slide-decks/sample-opendesign-intro-opus/OpenDesignIntroOpusPage.js'),
);

// design skill run EVIDENCE — the Cutover swimlanes part
// (deck-cloud-migration/waves/swimlanes) borrowed into a standalone page.
// Not a catalogue template.
const BorrowPilotDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-borrow-pilot/BorrowPilotPage.js'),
);

// Diagram-collections goal-test OUTPUTS (five grammar-tour samples, one per
// family), composed via compose_slide_deck + validate_fill and rendered
// content-only through the deck-dgm-* world-templates. Not catalogue templates.
const HttpsHandshakeDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-dgm-https-handshake/HttpsHandshakePage.js'),
);
const PaymentRailsDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-dgm-payment-rails/PaymentRailsPage.js'),
);
const MillionUsersDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-dgm-million-users/MillionUsersPage.js'),
);
const KubernetesAnatomyDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-dgm-kubernetes-anatomy/KubernetesAnatomyPage.js'),
);
const CachingFieldGuideDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-dgm-caching-field-guide/CachingFieldGuidePage.js'),
);
const HarnessEngineeringDemo = lazy(
  () => import('../../../experiences/slide-decks/demo-harness-engineering/HarnessEngineeringPage.js'),
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
          <Route path="demo/opendesign-intro" element={suspended(<OpenDesignIntroDemo />)} />
          <Route path="demo/opendesign-intro-fable" element={suspended(<OpenDesignIntroFableDemo />)} />
          <Route path="demo/opendesign-intro-sonnet" element={suspended(<OpenDesignIntroSonnetDemo />)} />
          <Route path="demo/opendesign-intro-opus" element={suspended(<OpenDesignIntroOpusDemo />)} />
          <Route path="demo/borrow-pilot" element={suspended(<BorrowPilotDemo />)} />
          <Route path="demo/gitlab-qbr" element={suspended(<GitlabQbrDemo />)} />
          <Route path="demo/openmodel-cockpit" element={suspended(<OpenmodelCockpitDemo />)} />
          <Route path="demo/moderation-stack" element={suspended(<ModerationStackDemo />)} />
          <Route path="demo/agent-evals" element={suspended(<AgentEvalsDemo />)} />
          <Route path="demo/ml-career" element={suspended(<MlCareerDemo />)} />
          <Route path="demo/https-handshake" element={suspended(<HttpsHandshakeDemo />)} />
          <Route path="demo/payment-rails" element={suspended(<PaymentRailsDemo />)} />
          <Route path="demo/million-users" element={suspended(<MillionUsersDemo />)} />
          <Route path="demo/kubernetes-anatomy" element={suspended(<KubernetesAnatomyDemo />)} />
          <Route path="demo/caching-field-guide" element={suspended(<CachingFieldGuideDemo />)} />
          <Route path="demo/harness-engineering" element={suspended(<HarnessEngineeringDemo />)} />
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
