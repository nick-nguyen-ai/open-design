// @vitest-environment jsdom
/**
 * Explainer batch C — the Inquiry (incident postmortem), the Lock Sequence
 * (migration plan), and the Test Stand (testing & validation strategy).
 * With this batch all ten technical explainers are live. One parameterised
 * contract: renders its root, locks its mood, shows the provenance notice
 * and a distinctive fixture, and passes axe.
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
    id: 'exp-incident-postmortem',
    rootTestId: 'live-inquiry',
    mood: 'light',
    noticePattern: /SYNTHETIC DOSSIER/i,
    fixture: /the causal chain/i,
  },
  {
    id: 'exp-migration-plan',
    rootTestId: 'live-lock-sequence',
    mood: 'dark',
    noticePattern: /SYNTHETIC PLAN/i,
    fixture: /The drain-gate doctrine/i,
  },
  {
    id: 'exp-testing-validation-strategy',
    rootTestId: 'live-test-stand',
    mood: 'dark',
    noticePattern: /SYNTHETIC STRATEGY/i,
    fixture: /The two dark lamps/i,
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

describe('the Inquiry findings', () => {
  it('numbers one root cause, two contributing, one mitigating', async () => {
    const { container } = renderLive('/live/exp-incident-postmortem');
    await screen.findByTestId('live-inquiry', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.iq-finding[data-kind="root-cause"]')).toHaveLength(1);
    expect(container.querySelectorAll('.iq-finding[data-kind="contributing"]')).toHaveLength(2);
    expect(container.querySelectorAll('.iq-finding[data-kind="mitigating"]')).toHaveLength(1);
  });
});

describe('the Lock Sequence chambers', () => {
  it('stages five chambers with the vessel in exactly one', async () => {
    const { container } = renderLive('/live/exp-migration-plan');
    await screen.findByTestId('live-lock-sequence', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.ls-chamber-card')).toHaveLength(5);
    expect(container.querySelectorAll('.ls-chamber-card[data-state="in-chamber"]')).toHaveLength(1);
    expect(container.querySelector('.ls-vessel')).not.toBeNull();
  });
});

describe('the Test Stand lamps', () => {
  it('lights ten of twelve lamps and leaves two honestly dark', async () => {
    const { container } = renderLive('/live/exp-testing-validation-strategy');
    await screen.findByTestId('live-test-stand', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.ts-lamp[data-lit="true"]')).toHaveLength(10);
    expect(container.querySelectorAll('.ts-lamp[data-lit="false"]')).toHaveLength(2);
  });
});
