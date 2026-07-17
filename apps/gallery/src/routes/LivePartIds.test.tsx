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
  {
    id: 'db-data-quality-operations',
    rootTestId: 'live-water-works',
    expectedParts: [
      'db-data-quality-operations/checks',
      'db-data-quality-operations/checks/suite-chart',
      'db-data-quality-operations/chrome',
      'db-data-quality-operations/dockets',
      'db-data-quality-operations/run-log',
      'db-data-quality-operations/sheet',
      'db-data-quality-operations/sheet/schematic',
      'db-data-quality-operations/works',
      'db-data-quality-operations/works/figures',
    ],
  },
  {
    id: 'db-dependency-network-explorer',
    rootTestId: 'live-interchange',
    expectedParts: [
      'db-dependency-network-explorer/chrome',
      'db-dependency-network-explorer/dossier',
      'db-dependency-network-explorer/dossier/blast-list',
      'db-dependency-network-explorer/index',
      'db-dependency-network-explorer/map',
      'db-dependency-network-explorer/map/metro-map',
      'db-dependency-network-explorer/network',
      'db-dependency-network-explorer/network/figures',
    ],
  },
  {
    id: 'db-experiment-analysis-workspace',
    rootTestId: 'live-lab-bench',
    expectedParts: [
      'db-experiment-analysis-workspace/bench',
      'db-experiment-analysis-workspace/bench/figures',
      'db-experiment-analysis-workspace/chrome',
      'db-experiment-analysis-workspace/decisions',
      'db-experiment-analysis-workspace/evidence',
      'db-experiment-analysis-workspace/evidence/uplift-chart',
      'db-experiment-analysis-workspace/hypotheses',
      'db-experiment-analysis-workspace/hypotheses/cards',
      'db-experiment-analysis-workspace/runs',
      'db-experiment-analysis-workspace/runs/ledger',
    ],
  },
  {
    id: 'db-incident-remediation-centre',
    rootTestId: 'live-triage-bay',
    expectedParts: [
      'db-incident-remediation-centre/bay',
      'db-incident-remediation-centre/bay/lanes',
      'db-incident-remediation-centre/case',
      'db-incident-remediation-centre/case/interventions',
      'db-incident-remediation-centre/case/vitals-chart',
      'db-incident-remediation-centre/chrome',
      'db-incident-remediation-centre/protocol',
      'db-incident-remediation-centre/triage',
      'db-incident-remediation-centre/triage/figures',
    ],
  },
  {
    id: 'db-portfolio-performance-explorer',
    rootTestId: 'live-long-read',
    expectedParts: [
      'db-portfolio-performance-explorer/chrome',
      'db-portfolio-performance-explorer/numbers',
      'db-portfolio-performance-explorer/numbers/table',
      'db-portfolio-performance-explorer/story',
      'db-portfolio-performance-explorer/story/attribution-chart',
      'db-portfolio-performance-explorer/story/pull-quote',
      'db-portfolio-performance-explorer/story/return-chart',
      'db-portfolio-performance-explorer/title',
      'db-portfolio-performance-explorer/title/headline',
    ],
  },
  {
    id: 'db-scenario-stress-simulator',
    rootTestId: 'live-wind-tunnel',
    expectedParts: [
      'db-scenario-stress-simulator/chrome',
      'db-scenario-stress-simulator/drivers',
      'db-scenario-stress-simulator/drivers/tornado-chart',
      'db-scenario-stress-simulator/reading',
      'db-scenario-stress-simulator/rigs',
      'db-scenario-stress-simulator/rigs/gauge-cluster',
      'db-scenario-stress-simulator/trace-table',
      'db-scenario-stress-simulator/tunnel',
      'db-scenario-stress-simulator/tunnel/figures',
    ],
  },
  {
    id: 'exp-api-integration-contract',
    rootTestId: 'live-counterparty',
    expectedParts: [
      'exp-api-integration-contract/amendments',
      'exp-api-integration-contract/chrome',
      'exp-api-integration-contract/cover',
      'exp-api-integration-contract/definitions',
      'exp-api-integration-contract/exhibit',
      'exp-api-integration-contract/exhibit/wire-samples',
      'exp-api-integration-contract/recitals',
      'exp-api-integration-contract/remedies',
      'exp-api-integration-contract/remedies/failure-table',
      'exp-api-integration-contract/schedule',
      'exp-api-integration-contract/schedule/endpoint-table',
      'exp-api-integration-contract/signatures',
    ],
  },
  {
    id: 'exp-architecture-decision-record',
    rootTestId: 'live-minute-book',
    expectedParts: [
      'exp-architecture-decision-record/chrome',
      'exp-architecture-decision-record/closing',
      'exp-architecture-decision-record/consequences',
      'exp-architecture-decision-record/context',
      'exp-architecture-decision-record/dissent',
      'exp-architecture-decision-record/options',
      'exp-architecture-decision-record/options/option-cards',
      'exp-architecture-decision-record/resolution',
      'exp-architecture-decision-record/resolution/text',
      'exp-architecture-decision-record/sitting',
    ],
  },
  {
    id: 'exp-coding-agent-implementation-plan',
    rootTestId: 'live-work-order',
    expectedParts: [
      'exp-coding-agent-implementation-plan/chrome',
      'exp-coding-agent-implementation-plan/job',
      'exp-coding-agent-implementation-plan/job/facts',
      'exp-coding-agent-implementation-plan/routing',
      'exp-coding-agent-implementation-plan/signoff',
      'exp-coding-agent-implementation-plan/tolerances',
      'exp-coding-agent-implementation-plan/traveler',
      'exp-coding-agent-implementation-plan/traveler/operations',
    ],
  },
  {
    id: 'exp-agent-workflow',
    rootTestId: 'live-signal-box',
    expectedParts: [
      'exp-agent-workflow/box',
      'exp-agent-workflow/box/figures',
      'exp-agent-workflow/chrome',
      'exp-agent-workflow/diagram',
      'exp-agent-workflow/diagram/interlocking',
      'exp-agent-workflow/levers',
      'exp-agent-workflow/levers/frame-table',
      'exp-agent-workflow/run-log',
      'exp-agent-workflow/sidings',
    ],
  },
  {
    id: 'exp-algorithm-explanation',
    rootTestId: 'live-assembly-line',
    expectedParts: [
      'exp-algorithm-explanation/belt',
      'exp-algorithm-explanation/belt/stations',
      'exp-algorithm-explanation/chrome',
      'exp-algorithm-explanation/line',
      'exp-algorithm-explanation/line/figures',
      'exp-algorithm-explanation/shop-notes',
      'exp-algorithm-explanation/works',
      'exp-algorithm-explanation/works/points',
    ],
  },
  {
    id: 'exp-data-lineage-map',
    rootTestId: 'live-river-atlas',
    expectedParts: [
      'exp-data-lineage-map/atlas',
      'exp-data-lineage-map/atlas/figures',
      'exp-data-lineage-map/chrome',
      'exp-data-lineage-map/gazetteer',
      'exp-data-lineage-map/gazetteer/table',
      'exp-data-lineage-map/plate',
      'exp-data-lineage-map/plate/watershed',
      'exp-data-lineage-map/trace',
      'exp-data-lineage-map/trace/steps',
    ],
  },
  {
    id: 'exp-incident-postmortem',
    rootTestId: 'live-inquiry',
    expectedParts: [
      'exp-incident-postmortem/actions',
      'exp-incident-postmortem/actions/register',
      'exp-incident-postmortem/chain',
      'exp-incident-postmortem/chrome',
      'exp-incident-postmortem/cover',
      'exp-incident-postmortem/cover/facts',
      'exp-incident-postmortem/findings',
      'exp-incident-postmortem/findings/list',
      'exp-incident-postmortem/recorder',
      'exp-incident-postmortem/recorder/trace',
      'exp-incident-postmortem/timeline',
    ],
  },
  {
    id: 'exp-migration-plan',
    rootTestId: 'live-lock-sequence',
    expectedParts: [
      'exp-migration-plan/chambers',
      'exp-migration-plan/chambers/schedule',
      'exp-migration-plan/chrome',
      'exp-migration-plan/doctrine',
      'exp-migration-plan/passage',
      'exp-migration-plan/passage-log',
      'exp-migration-plan/passage/figures',
      'exp-migration-plan/section',
      'exp-migration-plan/section/lock-stairs',
    ],
  },
  {
    id: 'exp-testing-validation-strategy',
    rootTestId: 'live-test-stand',
    expectedParts: [
      'exp-testing-validation-strategy/chrome',
      'exp-testing-validation-strategy/dark-lamps',
      'exp-testing-validation-strategy/doctrine',
      'exp-testing-validation-strategy/panes',
      'exp-testing-validation-strategy/panes/glass-stack',
      'exp-testing-validation-strategy/stand',
      'exp-testing-validation-strategy/stand/figures',
    ],
  },
  {
    id: 'proj-enterprise-transformation-programme',
    rootTestId: 'live-annual-report',
    expectedParts: [
      'proj-enterprise-transformation-programme/chrome',
      'proj-enterprise-transformation-programme/cover',
      'proj-enterprise-transformation-programme/cover/figures',
      'proj-enterprise-transformation-programme/letter',
      'proj-enterprise-transformation-programme/notes',
      'proj-enterprise-transformation-programme/notes/note-entries',
      'proj-enterprise-transformation-programme/signatures',
      'proj-enterprise-transformation-programme/statement',
      'proj-enterprise-transformation-programme/statement/outcome-lines',
    ],
  },
  {
    id: 'proj-operating-model-redesign',
    rootTestId: 'live-charter',
    expectedParts: [
      'proj-operating-model-redesign/articles',
      'proj-operating-model-redesign/articles/article-entries',
      'proj-operating-model-redesign/chrome',
      'proj-operating-model-redesign/cover',
      'proj-operating-model-redesign/cover/figures',
      'proj-operating-model-redesign/custodians',
      'proj-operating-model-redesign/preamble',
      'proj-operating-model-redesign/transition',
      'proj-operating-model-redesign/transition/schedule',
    ],
  },
  {
    id: 'proj-regulatory-remediation-programme',
    rootTestId: 'live-undertakings-register',
    expectedParts: [
      'proj-regulatory-remediation-programme/attestation',
      'proj-regulatory-remediation-programme/chrome',
      'proj-regulatory-remediation-programme/cover',
      'proj-regulatory-remediation-programme/cover/figures',
      'proj-regulatory-remediation-programme/reading',
      'proj-regulatory-remediation-programme/record',
      'proj-regulatory-remediation-programme/record/on-time-chart',
      'proj-regulatory-remediation-programme/register',
      'proj-regulatory-remediation-programme/register/undertaking-rows',
    ],
  },
  {
    id: 'proj-cloud-migration-programme',
    rootTestId: 'live-slipway',
    expectedParts: [
      'proj-cloud-migration-programme/chrome',
      'proj-cloud-migration-programme/harbour-log',
      'proj-cloud-migration-programme/launch',
      'proj-cloud-migration-programme/launch/figures',
      'proj-cloud-migration-programme/manifest',
      'proj-cloud-migration-programme/manifest/vessel-cards',
      'proj-cloud-migration-programme/rigging',
      'proj-cloud-migration-programme/yard',
      'proj-cloud-migration-programme/yard/yard-board',
    ],
  },
  {
    id: 'proj-data-modernisation-programme',
    rootTestId: 'live-town-plan',
    expectedParts: [
      'proj-data-modernisation-programme/chrome',
      'proj-data-modernisation-programme/covenants',
      'proj-data-modernisation-programme/occupancy',
      'proj-data-modernisation-programme/occupancy/district-ledger',
      'proj-data-modernisation-programme/phasing',
      'proj-data-modernisation-programme/phasing/phase-cards',
      'proj-data-modernisation-programme/plan',
      'proj-data-modernisation-programme/plan/masterplan',
      'proj-data-modernisation-programme/proclamation',
      'proj-data-modernisation-programme/proclamation/figures',
    ],
  },
  {
    id: 'proj-platform-product-launch',
    rootTestId: 'live-marquee',
    expectedParts: [
      'proj-platform-product-launch/acts',
      'proj-platform-product-launch/acts/act-cards',
      'proj-platform-product-launch/call-sheet',
      'proj-platform-product-launch/call-sheet/crew-lines',
      'proj-platform-product-launch/checklist',
      'proj-platform-product-launch/checklist/house-lamps',
      'proj-platform-product-launch/chrome',
      'proj-platform-product-launch/marquee',
      'proj-platform-product-launch/marquee/bulb-frame',
      'proj-platform-product-launch/marquee/showbill-figures',
      'proj-platform-product-launch/notices',
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
