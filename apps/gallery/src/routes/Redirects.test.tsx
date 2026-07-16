// @vitest-environment jsdom
/**
 * The legacy-IA redirects (2026-07-17 Gallery Ink redesign): old URLs must
 * land on their new homes with nothing lost — these paths shipped in links.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import '../test/jest-dom-setup.js';
import { App } from '../App.js';

// Lazy routes + the 60-card landing exceed the 5s default on slow machines.
vi.setConfig({ testTimeout: 30_000 });

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

function renderAt(path: string) {
  window.localStorage.clear();
  // Pin reduced motion so MotionProvider never consults the OS media query.
  window.localStorage.setItem('gallery.motion', 'reduced');
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('legacy route redirects', () => {
  it('/browse redirects to the gallery home, preserving the query', async () => {
    renderAt('/browse?q=risk&mode=components');
    await screen.findByRole('heading', { level: 1, name: /every template here is/i });
    expect(screen.getByTestId('location')).toHaveTextContent('/?q=risk&mode=components');
  });

  it('/guide lands on Contribute', async () => {
    renderAt('/guide');
    await screen.findByRole('heading', { level: 1, name: /how the gallery is built/i });
    expect(screen.getByTestId('location')).toHaveTextContent('/contribute');
  });

  it('/components (index) lands on Contribute', async () => {
    renderAt('/components');
    await screen.findByRole('heading', { level: 1, name: /how the gallery is built/i });
    expect(screen.getByTestId('location')).toHaveTextContent('/contribute');
  });

  it('/grammars (index) lands on Contribute', async () => {
    renderAt('/grammars');
    await screen.findByRole('heading', { level: 1, name: /how the gallery is built/i });
    expect(screen.getByTestId('location')).toHaveTextContent('/contribute');
  });

  it('/blueprint-lab lands on Make your design', async () => {
    renderAt('/blueprint-lab');
    await screen.findByRole('heading', { level: 1, name: /hand it your content/i });
    expect(screen.getByTestId('location')).toHaveTextContent('/make');
  });

  it('detail routes are NOT redirected (component detail stays)', async () => {
    renderAt('/components/comp.trend-chart');
    // The component detail lazy-loads the ECharts preview — allow a slow import.
    await screen.findByRole(
      'heading',
      { level: 1, name: /trend chart/i },
      { timeout: 20_000 },
    );
    expect(screen.getByTestId('location')).toHaveTextContent('/components/comp.trend-chart');
  });
});
