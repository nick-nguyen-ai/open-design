// @vitest-environment jsdom
/**
 * Project pages batch B — the Slipway (cloud migration as a shipyard board),
 * the Town Plan (data modernisation as an urban masterplan), and the Marquee
 * (platform launch as opening night). One parameterised contract: renders
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

interface ProjectWorld {
  id: string;
  rootTestId: string;
  mood: 'light' | 'dark';
  noticePattern: RegExp;
  fixture: RegExp;
}

const PROJECT_WORLDS: readonly ProjectWorld[] = [
  {
    id: 'proj-cloud-migration-programme',
    rootTestId: 'live-slipway',
    mood: 'dark',
    noticePattern: /SYNTHETIC YARD BOARD/i,
    fixture: /The rigging rules/i,
  },
  {
    id: 'proj-data-modernisation-programme',
    rootTestId: 'live-town-plan',
    mood: 'light',
    noticePattern: /SYNTHETIC MASTERPLAN/i,
    fixture: /Planning covenants/i,
  },
  {
    id: 'proj-platform-product-launch',
    rootTestId: 'live-marquee',
    mood: 'dark',
    noticePattern: /SYNTHETIC SHOWBILL/i,
    fixture: /The house checklist/i,
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

describe('the Slipway yard', () => {
  it('holds nine hulls across the three zones and rigs twelve ropes, five still fast', async () => {
    const { container } = renderLive('/live/proj-cloud-migration-programme');
    await screen.findByTestId('live-slipway', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.sw-vessel')).toHaveLength(9);
    expect(container.querySelectorAll('.sw-vessel[data-zone="dry-dock"]')).toHaveLength(4);
    expect(container.querySelectorAll('.sw-vessel[data-zone="slipway"]')).toHaveLength(2);
    expect(container.querySelectorAll('.sw-vessel[data-zone="open-water"]')).toHaveLength(3);
    expect(container.querySelectorAll('.sw-rope')).toHaveLength(12);
    expect(container.querySelectorAll('.sw-rope[data-state="fast"]')).toHaveLength(5);
  });
});

describe('the Town Plan districts', () => {
  it('plots eight districts — three occupied, three under construction, two zoned', async () => {
    const { container } = renderLive('/live/proj-data-modernisation-programme');
    await screen.findByTestId('live-town-plan', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.tp-district')).toHaveLength(8);
    expect(container.querySelectorAll('.tp-district[data-status="occupied"]')).toHaveLength(3);
    expect(container.querySelectorAll('.tp-district[data-status="under-construction"]')).toHaveLength(3);
    expect(container.querySelectorAll('.tp-district[data-status="zoned"]')).toHaveLength(2);
    expect(container.querySelectorAll('.tp-ledger-row')).toHaveLength(8);
  });
});

describe('the Marquee house', () => {
  it('bills three acts and lights six of eight house lamps', async () => {
    const { container } = renderLive('/live/proj-platform-product-launch');
    await screen.findByTestId('live-marquee', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.mq-act')).toHaveLength(3);
    expect(container.querySelectorAll('.mq-lamp-row[data-lit="true"]')).toHaveLength(6);
    expect(container.querySelectorAll('.mq-lamp-row[data-lit="false"]')).toHaveLength(2);
    expect(container.querySelectorAll('.mq-crew[data-status="attention"]')).toHaveLength(1);
  });
});
