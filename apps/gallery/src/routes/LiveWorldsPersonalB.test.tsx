// @vitest-environment jsdom
/**
 * Task 19 — the three live personal-page worlds of batch B: The Line, The Dawn
 * Wall, and The Reading Room. Each renders from its typed content pack, carries
 * its anomaly and its accessible mirror, honours reduced motion, locks its
 * mood, and passes axe.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
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

describe('LiveExperience — The Line (home-career-project-timeline)', () => {
  it('renders the line with the switchback anomaly and the dated station mirror', async () => {
    renderLive('/live/home-career-project-timeline');
    await screen.findByTestId('live-the-line', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('twelve years');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByTestId('synthetic-mark')).toHaveTextContent('ILLUSTRATIVE PROFILE');

    // The switchback — the anomaly — is drawn and labelled with what it taught.
    const switchback = screen.getByTestId('switchback');
    expect(switchback).toHaveTextContent('REVERSED OUT');
    expect(switchback).toHaveTextContent(/rollback plan/i);

    // The terminus states intent, not a promise.
    expect(screen.getByTestId('terminus')).toHaveTextContent('Causal decisioning');

    // The station table is the accessible mirror of the drawn line.
    const table = screen.getByTestId('station-table');
    expect(within(table).getByText(/switchback, reversed out/)).toBeInTheDocument();
    expect(within(table).getByText(/branch, rejoined/)).toBeInTheDocument();
  });

  it('reduced motion renders the DataInkDraw reduced variant', async () => {
    const { container } = renderLive('/live/home-career-project-timeline');
    await screen.findByTestId('live-the-line', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-the-line')).toHaveAttribute('data-reduced', 'true');
    const draw = container.querySelector('[data-motion-sequence="data-ink-draw"]');
    expect(draw).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-career-project-timeline');
    await screen.findByTestId('live-the-line', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Dawn Wall (home-team-contribution-impact-page)', () => {
  it('renders the confluence, credits the departed teammate, and mirrors it in a table', async () => {
    renderLive('/live/home-team-contribution-impact-page');
    await screen.findByTestId('live-dawn-wall', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('confluence');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // The lead's card frames the page as about the team.
    expect(screen.getByTestId('lead-card')).toHaveTextContent('measures the team, not me');

    // The confluence is present.
    expect(screen.getByTestId('the-confluence')).toBeInTheDocument();

    // The departed teammate stays credited — the anomaly — in the mirror table.
    const table = screen.getByTestId('contributions-table');
    const weiRow = table.querySelector('tr[data-departed="true"]');
    expect(weiRow).not.toBeNull();
    expect(weiRow).toHaveTextContent('Wei Zhang');
    expect(weiRow).toHaveTextContent(/Data contracts/);
  });

  it('reduced motion renders the HorizonSweep reduced variant and a static wall', async () => {
    const { container } = renderLive('/live/home-team-contribution-impact-page');
    await screen.findByTestId('live-dawn-wall', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-dawn-wall')).toHaveAttribute('data-reduced', 'true');
    const sweep = container.querySelector('[data-motion-sequence="horizon-sweep"]');
    expect(sweep).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-team-contribution-impact-page');
    await screen.findByTestId('live-dawn-wall', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Reading Room (home-mentoring-tutorial-hub)', () => {
  it('renders the shelf, opens volumes natively, and retires one honestly', async () => {
    renderLive('/live/home-mentoring-tutorial-hub');
    await screen.findByTestId('live-reading-room', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('read');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // The retired volume — the anomaly — is present and honestly labelled.
    const retired = screen.getByTestId('retired-volume');
    expect(retired.tagName.toLowerCase()).toBe('details');
    expect(within(retired).getByTestId('retired-note')).toHaveTextContent(
      /superseded by/i,
    );

    // The register is a real table — accessible structure is the design.
    const register = screen.getByTestId('register-table');
    expect(within(register).getByText('Nadia Osei')).toBeInTheDocument();
  });

  it('reduced motion renders the LedgerReveal reduced variant (settle-only, level 1)', async () => {
    const { container } = renderLive('/live/home-mentoring-tutorial-hub');
    await screen.findByTestId('live-reading-room', {}, { timeout: 15000 });
    const reveal = container.querySelector('[data-motion-sequence="ledger-reveal"]');
    expect(reveal).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-mentoring-tutorial-hub');
    await screen.findByTestId('live-reading-room', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
