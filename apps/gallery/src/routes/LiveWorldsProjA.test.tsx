// @vitest-environment jsdom
/**
 * Project pages batch A — the Annual Report (enterprise transformation),
 * the Charter (operating-model redesign), and the Undertakings Register
 * (regulatory remediation). Three deliberately simple, light, document-like
 * worlds for executive and old-school readers. One parameterised contract:
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

interface ProjectWorld {
  id: string;
  rootTestId: string;
  mood: 'light' | 'dark';
  noticePattern: RegExp;
  fixture: RegExp;
}

const PROJECT_WORLDS: readonly ProjectWorld[] = [
  {
    id: 'proj-enterprise-transformation-programme',
    rootTestId: 'live-annual-report',
    mood: 'light',
    noticePattern: /SYNTHETIC REPORT/i,
    fixture: /Notes to the accounts/i,
  },
  {
    id: 'proj-operating-model-redesign',
    rootTestId: 'live-charter',
    mood: 'light',
    noticePattern: /SYNTHETIC CHARTER/i,
    fixture: /Custodians of the charter/i,
  },
  {
    id: 'proj-regulatory-remediation-programme',
    rootTestId: 'live-undertakings-register',
    mood: 'light',
    noticePattern: /SYNTHETIC REGISTER/i,
    fixture: /How to read this register/i,
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

describe('the Annual Report statement', () => {
  it('reports six outcome lines — four ahead, one on plan, one honestly behind', async () => {
    const { container } = renderLive('/live/proj-enterprise-transformation-programme');
    await screen.findByTestId('live-annual-report', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.ar-line')).toHaveLength(6);
    expect(container.querySelectorAll('.ar-line[data-tone="ahead"]')).toHaveLength(4);
    expect(container.querySelectorAll('.ar-line[data-tone="on"]')).toHaveLength(1);
    expect(container.querySelectorAll('.ar-line[data-tone="behind"]')).toHaveLength(1);
  });
});

describe('the Charter articles', () => {
  it('seals seven articles — five in force, two transitioning', async () => {
    const { container } = renderLive('/live/proj-operating-model-redesign');
    await screen.findByTestId('live-charter', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.chr-article')).toHaveLength(7);
    expect(container.querySelectorAll('.chr-seal[data-seal="in-force"]')).toHaveLength(5);
    expect(container.querySelectorAll('.chr-seal[data-seal="transitioning"]')).toHaveLength(2);
  });
});

describe('the Undertakings Register lozenges', () => {
  it('registers ten undertakings — four discharged, five on track, one at risk', async () => {
    const { container } = renderLive('/live/proj-regulatory-remediation-programme');
    await screen.findByTestId('live-undertakings-register', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.ur-row')).toHaveLength(10);
    expect(container.querySelectorAll('.ur-lozenge[data-status="discharged"]')).toHaveLength(4);
    expect(container.querySelectorAll('.ur-lozenge[data-status="on-track"]')).toHaveLength(5);
    expect(container.querySelectorAll('.ur-lozenge[data-status="at-risk"]')).toHaveLength(1);
  });
});
