import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
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
      </PreferencesProvider>
    </MotionProvider>
  );
}
