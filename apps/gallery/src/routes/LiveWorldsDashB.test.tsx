// @vitest-environment jsdom
/**
 * Dashboard batch B — the Water Works (data-quality operations), the
 * Interchange (dependency network explorer), and the Lab Bench (experiment
 * analysis workspace). One parameterised contract: renders its root, locks
 * its mood, shows the provenance notice and a distinctive fixture, and
 * passes axe.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
    id: 'db-data-quality-operations',
    rootTestId: 'live-water-works',
    mood: 'light',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /The as-built sheet/i,
  },
  {
    id: 'db-dependency-network-explorer',
    rootTestId: 'live-interchange',
    mood: 'dark',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /Station index/i,
  },
  {
    id: 'db-experiment-analysis-workspace',
    rootTestId: 'live-lab-bench',
    mood: 'light',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /The run ledger/i,
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

describe('the Interchange station dossier', () => {
  it('selecting a station loads its dossier with blast radius', async () => {
    renderLive('/live/db-dependency-network-explorer');
    await screen.findByTestId('live-interchange', {}, { timeout: 15000 });

    // Auth Gateway is selected on entry (the busiest interchange).
    expect(screen.getByTestId('ic-dossier-name')).toHaveTextContent('Auth Gateway');
    expect(screen.getByText(/Payments authorisation/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Ledger Core — open station dossier/i }));
    expect(screen.getByTestId('ic-dossier-name')).toHaveTextContent('Ledger Core');
    expect(await screen.findByText(/Overnight analytics feeds/i)).toBeInTheDocument();
  });
});
