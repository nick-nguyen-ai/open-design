// @vitest-environment jsdom
/**
 * Dashboard batch C — the Triage Bay (incident remediation), the Long Read
 * (portfolio performance), and the Wind Tunnel (scenario stress simulator).
 * With this batch all ten dashboards are live. One parameterised contract:
 * renders its root, locks its mood, shows the provenance notice and a
 * distinctive fixture, and passes axe.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import LiveExperience from './LiveExperience.js';

vi.setConfig({ testTimeout: 30_000 });

function renderLive(path: string) {
  return render(
    <MotionProvider reducedMotion>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="live/:experienceId" element={<LiveExperience />} />
        </Routes>
      </MemoryRouter>
    </MotionProvider>,
  );
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

interface DashWorld {
  id: string;
  rootTestId: string;
  mood: 'light' | 'dark';
  noticePattern: RegExp;
  fixture: RegExp;
}

const DASH_WORLDS: readonly DashWorld[] = [
  {
    id: 'db-incident-remediation-centre',
    rootTestId: 'live-triage-bay',
    mood: 'dark',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /Discharge protocol/i,
  },
  {
    id: 'db-portfolio-performance-explorer',
    rootTestId: 'live-long-read',
    mood: 'light',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /The numbers, plainly/i,
  },
  {
    id: 'db-scenario-stress-simulator',
    rootTestId: 'live-wind-tunnel',
    mood: 'dark',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /The test rigs/i,
  },
];

describe.each(DASH_WORLDS)(
  'LiveExperience — dashboard $id',
  ({ id, rootTestId, mood, noticePattern, fixture }) => {
    it('renders, locks its mood, shows the provenance notice and its fixture; passes axe', async () => {
      const { container } = renderLive(`/live/${id}`);
      await screen.findByTestId(rootTestId, {}, { timeout: 15000 });

      expect(document.documentElement.getAttribute('data-theme')).toBe(mood);
      expect(screen.getAllByText(noticePattern).length).toBeGreaterThan(0);
      expect(screen.getAllByText(fixture).length).toBeGreaterThan(0);

      expect(await axe(container)).toHaveNoViolations();
    });
  },
);

describe('the Triage Bay ward board', () => {
  it('shows four lanes and exactly one critical chart with its ECG', async () => {
    const { container } = renderLive('/live/db-incident-remediation-centre');
    await screen.findByTestId('live-triage-bay', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.tb-lane')).toHaveLength(4);
    const critical = container.querySelectorAll('.tb-chart[data-severity="critical"]');
    expect(critical).toHaveLength(1);
    expect(critical[0]!.querySelector('.tb-ecg')).not.toBeNull();
  });
});

describe('the Wind Tunnel rigs', () => {
  it('reads three gauges with exactly one binding verdict', async () => {
    const { container } = renderLive('/live/db-scenario-stress-simulator');
    await screen.findByTestId('live-wind-tunnel', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.wt-rig')).toHaveLength(3);
    expect(screen.getAllByText('BINDING')).toHaveLength(1);
  });
});
