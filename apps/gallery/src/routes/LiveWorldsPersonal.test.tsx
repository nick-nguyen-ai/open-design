// @vitest-environment jsdom
/**
 * Task 18 — the three live personal-page worlds beyond the Studio: the Annual
 * Letter, the Bench Journal, and the Greenhouse. Each renders from its typed
 * content pack, carries its anomaly and its accessible mirror, honours reduced
 * motion, locks its mood, and passes axe.
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

describe('LiveExperience — The Annual Letter (home-technical-leadership-portfolio)', () => {
  it('renders the letter with the required correction section and the sunset system', async () => {
    renderLive('/live/home-technical-leadership-portfolio');
    await screen.findByTestId('live-letter', {}, { timeout: 15000 });

    // The masthead name is the h1; mood locks light.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Balakrishnan');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(screen.getByTestId('synthetic-mark')).toHaveTextContent('ILLUSTRATIVE PROFILE');

    // The required credibility section — the anomaly — is present.
    expect(screen.getByRole('heading', { name: /What I got wrong in FY26/ })).toBeInTheDocument();

    // The record table mirror carries every system and flags the sunset one.
    const table = screen.getByTestId('record-table');
    const sunsetRow = within(table).getByText('Cost Governor').closest('tr');
    expect(sunsetRow).toHaveAttribute('data-sunset', 'true');
    expect(within(sunsetRow as HTMLElement).getByText('SUNSET BY DESIGN')).toBeInTheDocument();
  });

  it('reduced motion renders the LedgerReveal reduced variant', async () => {
    const { container } = renderLive('/live/home-technical-leadership-portfolio');
    await screen.findByTestId('live-letter', {}, { timeout: 15000 });
    const reveal = container.querySelector('[data-motion-sequence="ledger-reveal"]');
    expect(reveal).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-technical-leadership-portfolio');
    await screen.findByTestId('live-letter', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Bench Journal (home-ai-experiment-notebook)', () => {
  it('renders the entry run with the struck-through entry corrected in the open', async () => {
    const { container } = renderLive('/live/home-ai-experiment-notebook');
    await screen.findByTestId('live-journal', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sana Okonkwo');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Entry 38 is struck through but fully legible, with a margin note pointing
    // to the re-run that corrected it — the anomaly.
    const struck = container.querySelector('.bj-entry-struck');
    expect(struck).not.toBeNull();
    expect(within(struck as HTMLElement).getByText(/WRONG CONTROL GROUP — SEE ENTRY 41/)).toBeInTheDocument();

    // Every verdict stamp vocabulary is present.
    expect(screen.getAllByText('CONFIRMED').length).toBeGreaterThan(0);
    expect(screen.getByText('REFUTED')).toBeInTheDocument();
    expect(screen.getByText('INCONCLUSIVE — RERUNNING')).toBeInTheDocument();

    // The index card is the accessible table of contents.
    expect(screen.getByTestId('index-card')).toBeInTheDocument();
  });

  it('reduced motion renders the LedgerReveal reduced variant', async () => {
    const { container } = renderLive('/live/home-ai-experiment-notebook');
    await screen.findByTestId('live-journal', {}, { timeout: 15000 });
    const reveal = container.querySelector('[data-motion-sequence="ledger-reveal"]');
    expect(reveal).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-ai-experiment-notebook');
    await screen.findByTestId('live-journal', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Greenhouse (home-internal-ai-tool-laboratory)', () => {
  it('renders the bench with the wilting deprecation candidate and the propagation mirror', async () => {
    renderLive('/live/home-internal-ai-tool-laboratory');
    await screen.findByTestId('live-greenhouse', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Elior Ashworth');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // The wilting specimen is honestly labelled — the anomaly.
    expect(screen.getByTestId('deprecation-flag')).toHaveTextContent(
      'DEPRECATION CANDIDATE · SUCCESSOR: review-copilot',
    );

    // The propagation log is the accessible mirror of the growth traces.
    const log = screen.getByTestId('propagation-log');
    expect(within(log).getByText('Knowledge & Search')).toBeInTheDocument();
  });

  it('reduced motion renders the DataInkDraw reduced variant and stills the field', async () => {
    const { container } = renderLive('/live/home-internal-ai-tool-laboratory');
    await screen.findByTestId('live-greenhouse', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-greenhouse')).toHaveAttribute('data-reduced', 'true');
    const draw = container.querySelector('[data-motion-sequence="data-ink-draw"]');
    expect(draw).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-internal-ai-tool-laboratory');
    await screen.findByTestId('live-greenhouse', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
