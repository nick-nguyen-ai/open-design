// @vitest-environment jsdom
/**
 * Explainer batch A — the Counterparty Agreement (API integration contract),
 * the Minute Book (architecture decision record), and the Work Order
 * (coding-agent implementation plan). One parameterised contract: renders
 * its root, locks its mood, shows the provenance notice and a distinctive
 * fixture, and passes axe.
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

interface ExplainerWorld {
  id: string;
  rootTestId: string;
  mood: 'light' | 'dark';
  noticePattern: RegExp;
  fixture: RegExp;
}

const EXPLAINER_WORLDS: readonly ExplainerWorld[] = [
  {
    id: 'exp-api-integration-contract',
    rootTestId: 'live-counterparty',
    mood: 'light',
    noticePattern: /SYNTHETIC SPECIFICATION/i,
    fixture: /CLAUSE 3 · FAILURES AND REMEDIES/i,
  },
  {
    id: 'exp-architecture-decision-record',
    rootTestId: 'live-minute-book',
    mood: 'light',
    noticePattern: /SYNTHETIC RECORD/i,
    fixture: /MINUTE 5 · DISSENT RECORDED/i,
  },
  {
    id: 'exp-coding-agent-implementation-plan',
    rootTestId: 'live-work-order',
    mood: 'light',
    noticePattern: /SYNTHETIC PLAN/i,
    fixture: /Materials & tolerances/i,
  },
];

describe.each(EXPLAINER_WORLDS)(
  'LiveExperience — explainer $id',
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

describe('the Minute Book options', () => {
  it('records one carried option and two not carried, all legible', async () => {
    const { container } = renderLive('/live/exp-architecture-decision-record');
    await screen.findByTestId('live-minute-book', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.mk-option[data-outcome="carried"]')).toHaveLength(1);
    expect(container.querySelectorAll('.mk-option[data-outcome="not-carried"]')).toHaveLength(2);
    // Rejected options stay in the record — struck through but present.
    expect(screen.getByText(/Self-hosted NATS JetStream/i)).toBeInTheDocument();
  });
});

describe('the Work Order traveler', () => {
  it('routes seven operations with exactly one in progress and three stamped', async () => {
    const { container } = renderLive('/live/exp-coding-agent-implementation-plan');
    await screen.findByTestId('live-work-order', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.wo-operation')).toHaveLength(7);
    expect(container.querySelectorAll('.wo-operation[data-state="in-progress"]')).toHaveLength(1);
    expect(container.querySelectorAll('.wo-operation .wo-stamp')).toHaveLength(3);
  });
});
