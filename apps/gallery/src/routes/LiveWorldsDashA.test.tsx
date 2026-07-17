// @vitest-environment jsdom
/**
 * Dashboard batch A — the first three of the nine remaining dashboard worlds:
 * the Morning Brief (risk command centre), the Departures Board (delivery
 * control tower), and the Registry (regulatory control hub). One
 * parameterised contract: renders its root, locks its mood, shows the
 * synthetic-data provenance notice and a distinctive fixture, and passes axe.
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
  /** A fixture only this world renders — proof the right craft mounted. */
  fixture: RegExp;
}

const DASH_WORLDS: readonly DashWorld[] = [
  {
    id: 'db-ai-risk-command-centre',
    rootTestId: 'live-morning-brief',
    mood: 'light',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /The posture ledger/i,
  },
  {
    id: 'db-delivery-control-tower',
    rootTestId: 'live-departures-board',
    mood: 'dark',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /Ground stops/i,
  },
  {
    id: 'db-regulatory-control-hub',
    rootTestId: 'live-registry',
    mood: 'light',
    noticePattern: /SYNTHETIC DEMONSTRATION DATA/i,
    fixture: /The filing index/i,
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

describe('the Morning Brief posture ledger', () => {
  it('selecting a domain loads its evidence reading', async () => {
    renderLive('/live/db-ai-risk-command-centre');
    await screen.findByTestId('live-morning-brief', {}, { timeout: 15000 });

    // GenAI is selected on entry (the elevated domain).
    const genai = screen.getByRole('button', { name: /GenAI applications/i });
    expect(genai).toHaveAttribute('aria-expanded', 'true');

    const credit = screen.getByRole('button', { name: /Credit decisioning/i });
    credit.click();
    await screen.findByText(/CREDIT DECISIONING · THE READING/i);
    expect(credit).toHaveAttribute('aria-expanded', 'true');
    expect(genai).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('the Registry filing index', () => {
  it('opening a drawer loads its control table', async () => {
    renderLive('/live/db-regulatory-control-hub');
    await screen.findByTestId('live-registry', {}, { timeout: 15000 });

    // Model governance is open on entry (carries an exception).
    expect(screen.getByText(/CF-03 · MODEL GOVERNANCE/i)).toBeInTheDocument();

    const access = screen.getByRole('button', { name: /CF-01/i });
    access.click();
    await screen.findByText(/CF-01 · ACCESS & IDENTITY/i);
    expect(screen.getByText('AC-114')).toBeInTheDocument();
  });
});
