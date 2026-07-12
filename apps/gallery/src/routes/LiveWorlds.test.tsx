// @vitest-environment jsdom
/**
 * Task 13 — the three live worlds beyond the anchors: the board deck, the
 * programme ledger, and the studio. Each renders from its typed content
 * pack, honours reduced motion, locks its mood, and passes axe.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import LiveExperience from './LiveExperience.js';

// The live pages lazy-load heavy chart modules; under a full-suite run the
// first import can exceed the default 5 s test timeout.
vi.setConfig({ testTimeout: 20_000 });

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

describe('LiveExperience — The Morning Board Pack (deck-ai-strategy)', () => {
  it('renders all twelve slides and lands on the title slide by default', async () => {
    const { container } = renderLive('/live/deck-ai-strategy');
    await screen.findByTestId('live-deck', {}, { timeout: 8000 });

    expect(container.querySelectorAll('.bd-slide')).toHaveLength(12);
    expect(screen.getByTestId('slide-counter')).toHaveTextContent(
      '01 / 12 · AI STRATEGY · BOARD OF DIRECTORS · FY27',
    );

    const active = container.querySelector('.bd-slide[data-state="active"]');
    expect(active).not.toBeNull();
    expect(active).toHaveAttribute('data-slide-id', 'title');
    expect(within(active as HTMLElement).getByText('models we can prove.')).toBeInTheDocument();

    // Deck chrome: return affordance + synthetic notice + theme locked dark.
    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC BOARD PAPER/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('deep-links mid-deck via ?slide= (the envelope slide by number)', async () => {
    const { container } = renderLive('/live/deck-ai-strategy?slide=9');
    await screen.findByTestId('live-deck', {}, { timeout: 8000 });

    expect(screen.getByTestId('slide-counter')).toHaveTextContent('09 / 12');
    const active = container.querySelector('.bd-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'envelope');
    expect(within(active as HTMLElement).getByText('$285M')).toBeInTheDocument();
    expect(screen.getByTestId('deck-section')).toHaveTextContent('III · THE ASK');
  });

  it('arrow keys, Home and End drive the deck; reduced motion is a stepped turn', async () => {
    const { container } = renderLive('/live/deck-ai-strategy');
    await screen.findByTestId('live-deck', {}, { timeout: 8000 });
    expect(screen.getByTestId('live-deck')).toHaveAttribute('data-reduced', 'true');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('02 / 12');
    // Reduced motion: no leaving pass — the previous slide parks immediately.
    expect(container.querySelector('.bd-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('12 / 12');
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('11 / 12');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('01 / 12');
  });

  it('the agenda index lists every slide as the deck’s textual mirror', async () => {
    renderLive('/live/deck-ai-strategy');
    await screen.findByTestId('live-deck', {}, { timeout: 8000 });

    fireEvent.click(screen.getByRole('button', { name: 'AGENDA' }));
    const agenda = screen.getByRole('navigation', { name: 'All slides' });
    expect(within(agenda).getAllByRole('button')).toHaveLength(12);
    expect(
      within(agenda).getByRole('button', { name: /Resolution 2026\/14/ }),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/deck-ai-strategy');
    await screen.findByTestId('live-deck', {}, { timeout: 8000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Validation Ledger (proj-ai-model-validation-hub)', () => {
  it('renders the ledger from its content pack with the stalled item flagged', async () => {
    renderLive('/live/proj-ai-model-validation-hub');
    await screen.findByTestId('live-programme', {}, { timeout: 8000 });

    // The table mirror carries all nine entries and flags the stalled one.
    const table = screen.getByTestId('ledger-table');
    expect(within(table).getAllByRole('row')).toHaveLength(10); // header + 9
    const stalledRow = within(table).getByText('wholesale-credit-pd').closest('tr');
    expect(stalledRow).toHaveAttribute('data-stalled', 'true');
    expect(within(stalledRow as HTMLElement).getByText(/STALLED — Validator awaiting/)).toBeInTheDocument();

    // Chrome: RAG posture is letter-coded, never colour alone.
    expect(screen.getByTestId('rag-posture')).toHaveTextContent('RAG AMBER');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Editorial hero statement is the page's h1.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'until the ledger says otherwise.',
    );
    expect(screen.getAllByText(/SYNTHETIC DEMONSTRATION DATA/i).length).toBeGreaterThan(0);
  });

  it('reduced motion renders the full ledger (LedgerReveal reduced variant)', async () => {
    const { container } = renderLive('/live/proj-ai-model-validation-hub');
    await screen.findByTestId('live-programme', {}, { timeout: 8000 });
    const reveal = container.querySelector('[data-motion-sequence="ledger-reveal"]');
    expect(reveal).not.toBeNull();
    expect(reveal).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/proj-ai-model-validation-hub');
    await screen.findByTestId('live-programme', {}, { timeout: 8000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Studio (home-data-scientist-studio)', () => {
  it('renders the experiment shelf with the kept failure, and the synthetic mark', async () => {
    renderLive('/live/home-data-scientist-studio');
    await screen.findByTestId('live-studio', {}, { timeout: 8000 });

    const shelf = screen.getByTestId('experiment-shelf');
    expect(within(shelf).getAllByRole('listitem')).toHaveLength(4);
    expect(within(shelf).getByText('FAILED · KEPT')).toBeInTheDocument();
    expect(within(shelf).getByText(/nobody pays 40 milliseconds for it twice/)).toBeInTheDocument();

    // The synthetic-profile mark is explicit chrome, not a footnote.
    expect(screen.getByTestId('synthetic-mark')).toHaveTextContent(
      'ILLUSTRATIVE PROFILE · SYNTHETIC',
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('measured in public.');
  });

  it('reduced motion renders the sweep’s reduced variant and a full page', async () => {
    const { container } = renderLive('/live/home-data-scientist-studio');
    await screen.findByTestId('live-studio', {}, { timeout: 8000 });
    const sweep = container.querySelector('[data-motion-sequence="horizon-sweep"]');
    expect(sweep).toHaveAttribute('data-motion-variant', 'reduced');
    expect(screen.getByTestId('skills-constellation')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-data-scientist-studio');
    await screen.findByTestId('live-studio', {}, { timeout: 8000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
