// @vitest-environment jsdom
/**
 * Project pages batch C — the Foundry (model lifecycle as a foundry floor),
 * the Bet Book (research bets as a betting book), and the Weighing Room
 * (vendor assessment as acetate lenses over one table). With this batch all
 * ten project pages — and all 65 worlds — are live. One parameterised
 * contract: renders its root, locks its mood, shows the provenance notice
 * and a distinctive fixture, and passes axe.
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

interface ProjectWorld {
  id: string;
  rootTestId: string;
  mood: 'light' | 'dark';
  noticePattern: RegExp;
  fixture: RegExp;
}

const PROJECT_WORLDS: readonly ProjectWorld[] = [
  {
    id: 'proj-model-lifecycle-workspace',
    rootTestId: 'live-foundry',
    mood: 'dark',
    noticePattern: /SYNTHETIC FOUNDRY RECORD/i,
    fixture: /Foundry doctrine/i,
  },
  {
    id: 'proj-research-innovation-initiative',
    rootTestId: 'live-bet-book',
    mood: 'light',
    noticePattern: /SYNTHETIC BET BOOK/i,
    fixture: /House rules/i,
  },
  {
    id: 'proj-vendor-assessment',
    rootTestId: 'live-weighing-room',
    mood: 'light',
    noticePattern: /SYNTHETIC ASSESSMENT/i,
    fixture: /Weighing-room protocol/i,
  },
];

describe.each(PROJECT_WORLDS)(
  'LiveExperience — project page $id',
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

describe('the Foundry halls', () => {
  it('holds fourteen castings across the four halls', async () => {
    const { container } = renderLive('/live/proj-model-lifecycle-workspace');
    await screen.findByTestId('live-foundry', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.fd-casting')).toHaveLength(14);
    expect(container.querySelectorAll('.fd-casting[data-hall="pattern-shop"]')).toHaveLength(4);
    expect(container.querySelectorAll('.fd-casting[data-hall="proof-house"]')).toHaveLength(3);
    expect(container.querySelectorAll('.fd-casting[data-hall="production"]')).toHaveLength(5);
    expect(container.querySelectorAll('.fd-casting[data-hall="archive"]')).toHaveLength(2);
    expect(container.querySelectorAll('.fd-stamp')).toHaveLength(5);
  });
});

describe('the Bet Book spreads', () => {
  it('keeps six bets — three open, one paying out, one won, one lost', async () => {
    const { container } = renderLive('/live/proj-research-innovation-initiative');
    await screen.findByTestId('live-bet-book', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.bb-bet')).toHaveLength(6);
    expect(container.querySelectorAll('.bb-bet[data-status="open"]')).toHaveLength(3);
    expect(container.querySelectorAll('.bb-bet[data-status="paying-out"]')).toHaveLength(1);
    expect(container.querySelectorAll('.bb-bet[data-status="won"]')).toHaveLength(1);
    expect(container.querySelectorAll('.bb-bet[data-status="lost"]')).toHaveLength(1);
  });
});

describe('the Weighing Room acetates', () => {
  it('lays all twelve criteria by default and filters to one lens sheet on demand', async () => {
    const { container } = renderLive('/live/proj-vendor-assessment');
    await screen.findByTestId('live-weighing-room', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.wr-row')).toHaveLength(12);
    expect(container.querySelectorAll('.wr-scale')).toHaveLength(4);

    fireEvent.click(screen.getByRole('button', { name: /RISK LENS/i }));
    expect(container.querySelectorAll('.wr-row')).toHaveLength(4);
    expect(container.querySelectorAll('.wr-row[data-lens="risk"]')).toHaveLength(4);

    fireEvent.click(screen.getByRole('button', { name: /ALL SHEETS/i }));
    expect(container.querySelectorAll('.wr-row')).toHaveLength(12);
  });
});
