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
  {
    id: 'deck-dgm-sketchnote',
    rootTestId: 'live-dgm-sketchnote',
    expectedParts: [
      'deck-dgm-sketchnote/cells-slide',
      'deck-dgm-sketchnote/close',
      'deck-dgm-sketchnote/compare-slide',
      'deck-dgm-sketchnote/cover',
      'deck-dgm-sketchnote/cycle-slide',
      'deck-dgm-sketchnote/flow-slide',
      'deck-dgm-sketchnote/layers-slide',
      'deck-dgm-sketchnote/sequence-slide',
      'deck-dgm-sketchnote/timeline-slide',
      'deck-dgm-sketchnote/zones-slide',
    ],
  },
  {
    id: 'deck-dgm-blueprint',
    rootTestId: 'live-dgm-blueprint',
    expectedParts: [
      'deck-dgm-blueprint/cells-slide',
      'deck-dgm-blueprint/close',
      'deck-dgm-blueprint/compare-slide',
      'deck-dgm-blueprint/cover',
      'deck-dgm-blueprint/cycle-slide',
      'deck-dgm-blueprint/flow-slide',
      'deck-dgm-blueprint/layers-slide',
      'deck-dgm-blueprint/sequence-slide',
      'deck-dgm-blueprint/timeline-slide',
      'deck-dgm-blueprint/zones-slide',
    ],
  },
  {
    id: 'deck-dgm-circuit',
    rootTestId: 'live-dgm-circuit',
    expectedParts: [
      'deck-dgm-circuit/cells-slide',
      'deck-dgm-circuit/close',
      'deck-dgm-circuit/compare-slide',
      'deck-dgm-circuit/cover',
      'deck-dgm-circuit/cycle-slide',
      'deck-dgm-circuit/flow-slide',
      'deck-dgm-circuit/layers-slide',
      'deck-dgm-circuit/sequence-slide',
      'deck-dgm-circuit/timeline-slide',
      'deck-dgm-circuit/zones-slide',
    ],
  },
  {
    id: 'deck-dgm-isometric',
    rootTestId: 'live-dgm-isometric',
    expectedParts: [
      'deck-dgm-isometric/cells-slide',
      'deck-dgm-isometric/close',
      'deck-dgm-isometric/compare-slide',
      'deck-dgm-isometric/cover',
      'deck-dgm-isometric/cycle-slide',
      'deck-dgm-isometric/flow-slide',
      'deck-dgm-isometric/layers-slide',
      'deck-dgm-isometric/sequence-slide',
      'deck-dgm-isometric/timeline-slide',
      'deck-dgm-isometric/zones-slide',
    ],
  },
  {
    id: 'deck-dgm-gazette',
    rootTestId: 'live-dgm-gazette',
    expectedParts: [
      'deck-dgm-gazette/cells-slide',
      'deck-dgm-gazette/close',
      'deck-dgm-gazette/compare-slide',
      'deck-dgm-gazette/cover',
      'deck-dgm-gazette/cycle-slide',
      'deck-dgm-gazette/flow-slide',
      'deck-dgm-gazette/layers-slide',
      'deck-dgm-gazette/sequence-slide',
      'deck-dgm-gazette/timeline-slide',
      'deck-dgm-gazette/zones-slide',
    ],
  },
  {
    id: 'db-ai-risk-command-centre',
    rootTestId: 'live-morning-brief',
    expectedParts: [
      'db-ai-risk-command-centre/actions',
      'db-ai-risk-command-centre/brief',
      'db-ai-risk-command-centre/brief/figures',
      'db-ai-risk-command-centre/brief/posture-statement',
      'db-ai-risk-command-centre/chrome',
      'db-ai-risk-command-centre/evidence',
      'db-ai-risk-command-centre/evidence/register',
      'db-ai-risk-command-centre/evidence/trend-chart',
      'db-ai-risk-command-centre/ledger',
    ],
  },
  {
    id: 'db-delivery-control-tower',
    rootTestId: 'live-departures-board',
    expectedParts: [
      'db-delivery-control-tower/board',
      'db-delivery-control-tower/chrome',
      'db-delivery-control-tower/confidence',
      'db-delivery-control-tower/confidence/meters',
      'db-delivery-control-tower/connections',
      'db-delivery-control-tower/horizon',
      'db-delivery-control-tower/horizon/figures',
      'db-delivery-control-tower/stops',
    ],
  },
  {
    id: 'db-regulatory-control-hub',
    rootTestId: 'live-registry',
    expectedParts: [
      'db-regulatory-control-hub/chrome',
      'db-regulatory-control-hub/coverage',
      'db-regulatory-control-hub/coverage/family-chart',
      'db-regulatory-control-hub/evidence',
      'db-regulatory-control-hub/evidence/control-table',
      'db-regulatory-control-hub/exceptions',
      'db-regulatory-control-hub/index',
      'db-regulatory-control-hub/posture',
      'db-regulatory-control-hub/posture/headline-figure',
      'db-regulatory-control-hub/requests',
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
