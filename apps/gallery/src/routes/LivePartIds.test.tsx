// @vitest-environment jsdom
/**
 * Rendered part-id CONTRACT for the pilot worlds. The expected arrays below
 * are the public borrow contract: the gallery's part inspector surfaces these
 * IDs and the design-borrow skill resolves them, so removing or renaming one
 * is a deliberate, reviewed change — update the world AND this list together.
 *
 * Future worlds join by adding one PART_ID_WORLDS entry.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import '../test/jest-dom-setup.js';
import LiveExperience from './LiveExperience.js';
import { PartInspector } from '../components/PartInspector.js';

vi.setConfig({ testTimeout: 30_000 });

interface PartIdWorld {
  id: string;
  rootTestId: string;
  expectedParts: readonly string[];
}

const PART_ID_WORLDS: readonly PartIdWorld[] = [
  {
    id: 'deck-cloud-migration',
    rootTestId: 'live-cutover',
    expectedParts: [
      'deck-cloud-migration/closing',
      'deck-cloud-migration/current',
      'deck-cloud-migration/current/estate-diagram',
      'deck-cloud-migration/cutover',
      'deck-cloud-migration/cutover/flow-frame',
      'deck-cloud-migration/delta',
      'deck-cloud-migration/risk',
      'deck-cloud-migration/rollback',
      'deck-cloud-migration/rollback/rollback-tree',
      'deck-cloud-migration/sync',
      'deck-cloud-migration/target',
      'deck-cloud-migration/target/estate-diagram',
      'deck-cloud-migration/title',
      'deck-cloud-migration/waves',
      'deck-cloud-migration/waves/swimlanes',
    ],
  },
  {
    id: 'db-model-monitoring-cockpit',
    rootTestId: 'live-cockpit',
    expectedParts: [
      'db-model-monitoring-cockpit/dossier',
      'db-model-monitoring-cockpit/dossier/trend-panel',
      'db-model-monitoring-cockpit/fleet',
      'db-model-monitoring-cockpit/fleet/table',
      'db-model-monitoring-cockpit/instruments',
      'db-model-monitoring-cockpit/log',
      'db-model-monitoring-cockpit/scope',
      'db-model-monitoring-cockpit/statement',
      'db-model-monitoring-cockpit/watch',
      'db-model-monitoring-cockpit/watch/clock',
    ],
  },
  {
    id: 'home-data-scientist-studio',
    rootTestId: 'live-studio',
    expectedParts: [
      'home-data-scientist-studio/bench',
      'home-data-scientist-studio/bench/drift-chart',
      'home-data-scientist-studio/bench/now-card',
      'home-data-scientist-studio/chrome',
      'home-data-scientist-studio/constellation',
      'home-data-scientist-studio/constellation/skill-map',
      'home-data-scientist-studio/hero',
      'home-data-scientist-studio/log',
      'home-data-scientist-studio/notes',
      'home-data-scientist-studio/shelf',
      'home-data-scientist-studio/shelf/cards',
    ],
  },
];

const WELL_FORMED = /^[a-z0-9-]+\/[a-z0-9-]+(\/[a-z0-9-]+)?$/;

function renderLive(path: string) {
  return render(
    <MotionProvider reducedMotion>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="live/:experienceId" element={<LiveExperience />} />
        </Routes>
        <PartInspector />
      </MemoryRouter>
    </MotionProvider>,
  );
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe.each(PART_ID_WORLDS)('part-id contract — $id', ({ id, rootTestId, expectedParts }) => {
  it('renders exactly the contracted part IDs, well-formed and unique', async () => {
    const { container } = renderLive(`/live/${id}`);
    await screen.findByTestId(rootTestId, {}, { timeout: 15000 });

    const rendered = Array.from(container.querySelectorAll('[data-part-id]')).map(
      (el) => el.getAttribute('data-part-id') ?? '',
    );

    for (const partId of rendered) {
      expect(partId).toMatch(WELL_FORMED);
      expect(partId.startsWith(`${id}/`)).toBe(true);
    }
    expect(new Set(rendered).size).toBe(rendered.length);
    expect(rendered.length).toBeGreaterThanOrEqual(5);
    expect(rendered.length).toBeLessThanOrEqual(15);
    expect([...rendered].sort()).toEqual([...expectedParts]);
  });
});

describe('part inspector on a real world', () => {
  it('?inspect=1 arms the inspector and a click reveals the slide part ID', async () => {
    renderLive('/live/deck-cloud-migration?inspect=1');
    await screen.findByTestId('live-cutover', {}, { timeout: 15000 });

    expect(
      screen.getByRole('button', { name: 'Inspect parts (borrow a part)' }),
    ).toHaveAttribute('aria-pressed', 'true');

    // The title slide is active on entry; clicking inside it selects the
    // nearest anchor — the slide's section root.
    const title = document.querySelector('[data-part-id="deck-cloud-migration/title"]');
    expect(title).not.toBeNull();
    fireEvent.click(title as Element);
    expect(screen.getByTestId('part-inspector-id')).toHaveTextContent(
      'deck-cloud-migration/title',
    );
  });
});
