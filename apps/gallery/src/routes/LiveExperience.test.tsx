// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import LiveExperience from './LiveExperience.js';

// The live pages lazy-load heavy chart modules; under a full-suite run the
// first import can exceed the default 5 s test timeout.
vi.setConfig({ testTimeout: 20_000 });

function renderLive(experienceId: string) {
  return render(
    <MotionProvider reducedMotion>
      <MemoryRouter initialEntries={[`/live/${experienceId}`]}>
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

describe('LiveExperience — Model Risk Control Room (flagship)', () => {
  it('renders the world from its content pack: breaching model + threshold', async () => {
    renderLive('db-model-monitoring-cockpit');

    await screen.findByTestId('live-cockpit', {}, { timeout: 8000 });

    // The watchlist table (the scope's accessible mirror) carries the
    // breaching model and the breach threshold.
    const watchlist = screen.getByTestId('fleet-watchlist');
    expect(within(watchlist).getByText('card-fraud-v4')).toBeInTheDocument();
    expect(within(watchlist).getAllByText('0.250').length).toBeGreaterThan(0);
    expect(within(watchlist).getByText(/⊕/)).toBeInTheDocument(); // breach glyph, not colour alone

    // Narrative display statement is the page's h1.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'The twelfth is why this room is lit.',
    );

    // Instrument chrome: return affordance + synthetic-data notice.
    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC DEMONSTRATION DATA/i).length).toBeGreaterThan(0);
  });

  it('locks the document theme to dark while mounted and restores on unmount', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    const { unmount } = renderLive('db-model-monitoring-cockpit');
    await screen.findByTestId('live-cockpit', {}, { timeout: 8000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('reduced motion renders a HELD scope: no sweep, static clock', async () => {
    renderLive('db-model-monitoring-cockpit');
    const scope = await screen.findByTestId('drift-scope', {}, { timeout: 8000 });
    expect(scope).toHaveAttribute('data-scope-variant', 'held');
    expect(scope.querySelector('.ck-anim-sweep')).toBeNull();
    expect(screen.getByTestId('watch-clock')).toHaveTextContent('02:47:12 AEST');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('db-model-monitoring-cockpit');
    await screen.findByTestId('live-cockpit', {}, { timeout: 8000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Drawing Office', () => {
  it('renders the signed drawing: title block + schedule-of-parts outline', async () => {
    renderLive('exp-system-architecture');

    await screen.findByTestId('live-architecture', {}, { timeout: 8000 });

    // Title block: drawing number, revision table, sign-offs.
    const titleBlock = screen.getByTestId('title-block');
    expect(within(titleBlock).getByText(/EDI-ARCH-004/)).toBeInTheDocument();
    expect(within(titleBlock).getByText('ISSUED AS BUILT')).toBeInTheDocument();
    expect(within(titleBlock).getByText('PLATFORM REVIEW BOARD')).toBeInTheDocument();

    // The diagram's textual outline, styled as the SCHEDULE OF PARTS.
    const schedule = screen.getByTestId('schedule-of-parts');
    expect(within(schedule).getByText('CHANNEL EDGE GATEWAY')).toBeInTheDocument();
    expect(
      within(schedule).getByText(/DECISION LOG → DRIFT & MONITORING: nightly windows/),
    ).toBeInTheDocument();

    // The deliberate anomaly is flagged in the notes.
    expect(screen.getByText(/78% OF RATED THROUGHPUT/)).toBeInTheDocument();
  });

  it('locks the document theme to light while mounted', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { unmount } = renderLive('exp-system-architecture');
    await screen.findByTestId('live-architecture', {}, { timeout: 8000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('exp-system-architecture');
    await screen.findByTestId('live-architecture', {}, { timeout: 8000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Committee Paper (deck)', () => {
  it('deep-links to clause 3: the struck Option 4 (anomaly), the mirror, reduced motion', async () => {
    const { container } = renderLive('deck-executive-decision-proposal?slide=4');
    const root = await screen.findByTestId('live-committee-paper', {}, { timeout: 12000 });

    // ?slide= deep link lands on clause 3 (sheet 4 of 10).
    expect(screen.getByTestId('clause-counter')).toHaveTextContent('04 / 10');
    expect(screen.getByTestId('clause-counter')).toHaveTextContent('CLAUSE 3 OF 9');

    // The options table (a real table — the accessible mirror) carries the
    // struck option: the committee's own preference, declined by Model Risk.
    const options = screen.getByTestId('options-table');
    const struck = within(options).getByText(/Defer decision to FY28/);
    expect(struck.closest('tr')).toHaveAttribute('data-struck', 'true');
    expect(within(options).getByText('RECOMMENDED')).toBeInTheDocument();

    // Reduced-motion path + instrument chrome + synthetic-data notice.
    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC DEMONSTRATION PAPER/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Lab Report (deck)', () => {
  it('deep-links to plate 5: the open CRITICAL finding (anomaly), the register mirror, reduced motion', async () => {
    const { container } = renderLive('deck-genai-model-validation-report?slide=6');
    const root = await screen.findByTestId('live-lab-report', {}, { timeout: 12000 });

    expect(screen.getByTestId('plate-counter')).toHaveTextContent('06 / 08');
    expect(screen.getByTestId('plate-counter')).toHaveTextContent('PLATE 05 OF 7');
    // Cross-references the Validation Ledger world by programme code.
    expect(screen.getByTestId('plate-counter')).toHaveTextContent('llm-doc-triage-v2');

    // The findings register (a real table — the accessible mirror) carries the
    // one open CRITICAL finding.
    const register = screen.getByTestId('findings-register');
    const criticalRow = within(register).getByText('VF-07').closest('tr') as HTMLElement;
    expect(criticalRow).toHaveAttribute('data-open', 'true');
    // Scope to the row: "CRITICAL" also appears in the table caption.
    expect(within(criticalRow).getByText(/CRITICAL/)).toBeInTheDocument();

    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getAllByText(/SYNTHETIC RESULTS/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Control Frame (deck)', () => {
  it('deep-links to the matrix: the acknowledged GAP (anomaly), the table mirror, reduced motion', async () => {
    const { container } = renderLive('deck-ai-governance-and-controls?slide=3');
    const root = await screen.findByTestId('live-control-frame', {}, { timeout: 12000 });

    expect(screen.getByTestId('frame-counter')).toHaveTextContent('03 / 08');
    expect(screen.getByTestId('frame-counter')).toHaveTextContent('1 GAP');

    // The matrix is a real table (the commanding visual AND accessible mirror):
    // it carries certified control ids and the single dashed GAP cell.
    const matrix = screen.getByTestId('control-matrix');
    expect(within(matrix).getByText('CTRL-AI-001')).toBeInTheDocument();
    const gapName = within(matrix).getByText('Fairness monitoring in production');
    expect(gapName.closest('td')).toHaveAttribute('data-gap', 'true');

    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getAllByText(/POLICY FRAMEWORK · SYNTHETIC/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('locks the document theme to dark while mounted and restores on unmount', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    const { unmount } = renderLive('deck-ai-governance-and-controls?slide=1');
    await screen.findByTestId('live-control-frame', {}, { timeout: 12000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

describe('LiveExperience — unknown id', () => {
  it('offers a way back to the gallery', () => {
    renderLive('does-not-exist');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('No live experience here');
    expect(screen.getByRole('link', { name: /back to the gallery/i })).toBeInTheDocument();
  });
});
