// @vitest-environment jsdom
/**
 * Explainer batch B — the Signal Box (agent workflow), the Assembly Line
 * (algorithm explanation), and the River Atlas (data lineage map). One
 * parameterised contract: renders its root, locks its mood, shows the
 * provenance notice and a distinctive fixture, and passes axe.
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
    id: 'exp-agent-workflow',
    rootTestId: 'live-signal-box',
    mood: 'dark',
    noticePattern: /SYNTHETIC WORKFLOW/i,
    fixture: /The lever frame/i,
  },
  {
    id: 'exp-algorithm-explanation',
    rootTestId: 'live-assembly-line',
    mood: 'light',
    noticePattern: /SYNTHETIC WALKTHROUGH/i,
    fixture: /Why the trick works/i,
  },
  {
    id: 'exp-data-lineage-map',
    rootTestId: 'live-river-atlas',
    mood: 'light',
    noticePattern: /SYNTHETIC SURVEY/i,
    fixture: /The gazetteer/i,
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

describe('the Signal Box interlocking', () => {
  it('draws nine track blocks including both sidings; reduced motion parks the token', async () => {
    const { container } = renderLive('/live/exp-agent-workflow');
    await screen.findByTestId('live-signal-box', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.sb-block')).toHaveLength(9);
    expect(container.querySelectorAll('.sb-block[data-kind="siding"]')).toHaveLength(2);
    // MotionProvider is reducedMotion in this harness: the animated token never mounts.
    expect(container.querySelector('.sb-token')).toBeNull();
  });
});

describe('the Assembly Line stations', () => {
  it('runs the work-piece through six stations from goods-in to verdict', async () => {
    const { container } = renderLive('/live/exp-algorithm-explanation');
    await screen.findByTestId('live-assembly-line', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.al-station')).toHaveLength(6);
    expect(screen.getByText(/NEAR-DUPLICATE · SAME CASE FILE/i)).toBeInTheDocument();
  });
});
