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
vi.setConfig({ testTimeout: 30_000 });

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

    await screen.findByTestId('live-cockpit', {}, { timeout: 20_000 });

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
    await screen.findByTestId('live-cockpit', {}, { timeout: 20_000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('reduced motion renders a HELD scope: no sweep, static clock', async () => {
    renderLive('db-model-monitoring-cockpit');
    const scope = await screen.findByTestId('drift-scope', {}, { timeout: 20_000 });
    expect(scope).toHaveAttribute('data-scope-variant', 'held');
    expect(scope.querySelector('.ck-anim-sweep')).toBeNull();
    expect(screen.getByTestId('watch-clock')).toHaveTextContent('02:47:12 AEST');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('db-model-monitoring-cockpit');
    await screen.findByTestId('live-cockpit', {}, { timeout: 20_000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Drawing Office', () => {
  it('renders the signed drawing: title block + schedule-of-parts outline', async () => {
    renderLive('exp-system-architecture');

    await screen.findByTestId('live-architecture', {}, { timeout: 20_000 });

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
    await screen.findByTestId('live-architecture', {}, { timeout: 20_000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('exp-system-architecture');
    await screen.findByTestId('live-architecture', {}, { timeout: 20_000 });
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

describe('LiveExperience — The River (deck)', () => {
  it('deep-links to the narrows: the capacity constraint (anomaly), the route mirror, reduced motion', async () => {
    const { container } = renderLive('deck-transformation-roadmap?slide=5');
    const root = await screen.findByTestId('live-river', {}, { timeout: 12000 });

    // ?slide= deep link lands on the narrows (slide 5 of 9).
    expect(screen.getByTestId('river-counter')).toHaveTextContent('05 / 09');
    expect(screen.getByTestId('river-counter')).toHaveTextContent('THE NARROWS');

    // The narrows slide names the contested resource — the deliberate anomaly.
    const points = screen.getByTestId('narrows-points');
    expect(within(points).getByText(/CONTESTED RESOURCE/)).toBeInTheDocument();
    expect(within(points).getByText(/Platform engineering/)).toBeInTheDocument();

    // The route ledger (an ordered list — the accessible mirror) carries the
    // at-risk station S5 flagged as the narrows.
    const ledger = screen.getByTestId('route-ledger');
    const s5 = within(ledger).getByText('Validation automation').closest('li') as HTMLElement;
    expect(s5).toHaveAttribute('data-narrows', 'true');

    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC DEMONSTRATION DATA/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('locks the document theme to dark while mounted and restores on unmount', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    const { unmount } = renderLive('deck-transformation-roadmap?slide=1');
    await screen.findByTestId('live-river', {}, { timeout: 12000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

describe('LiveExperience — The Readout (deck)', () => {
  it('deep-links to the withheld reading (anomaly), the board mirror, reduced motion', async () => {
    const { container } = renderLive('deck-experiment-results?slide=5');
    const root = await screen.findByTestId('live-readout', {}, { timeout: 12000 });

    // ?slide= deep link lands on Reading 03 — the withheld reading (slide 5 of 8).
    expect(screen.getByTestId('reading-counter')).toHaveTextContent('05 / 08');
    expect(screen.getByTestId('reading-counter')).toHaveTextContent('WITHHELD');

    // Scope to the active reading (all readings are in the DOM, parked).
    const activeReading = container.querySelector('.rd-slide[data-state="active"]') as HTMLElement;
    // The verdict plate is shape-and-word coded WITHHELD.
    expect(within(activeReading).getByTestId('verdict-plate')).toHaveTextContent('WITHHELD');

    // Under reduced motion the result numeral holds at its final value.
    expect(within(activeReading).getByTestId('result-numeral')).toHaveTextContent('−11.0%');

    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getAllByText(/SYNTHETIC RESULTS/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('the board slide is the verdict-coded mirror carrying the withheld row', async () => {
    renderLive('deck-experiment-results?slide=6');
    await screen.findByTestId('live-readout', {}, { timeout: 12000 });
    const board = screen.getByTestId('readings-board');
    const withheldRow = within(board)
      .getByText(/lower fraud-hold threshold/)
      .closest('tr') as HTMLElement;
    expect(withheldRow).toHaveAttribute('data-anomaly', 'true');
    expect(within(withheldRow).getByText(/WITHHELD/)).toBeInTheDocument();
  });
});

describe('LiveExperience — The Gallery Floor (deck)', () => {
  it('deep-links to the retired exhibit (anomaly), the catalogue mirror, reduced motion', async () => {
    const { container } = renderLive('deck-innovation-showcase?slide=6');
    const root = await screen.findByTestId('live-gallery-floor', {}, { timeout: 12000 });

    // ?slide= deep link lands on exhibit 04 — the retired piece (slide 6 of 9).
    expect(screen.getByTestId('floor-counter')).toHaveTextContent('06 / 09');
    expect(screen.getByTestId('floor-counter')).toHaveTextContent('POSITION 04');

    // The retired exhibit's placard carries the RETIRED status band — the anomaly.
    const placard = screen.getByTestId('retired-placard');
    expect(within(placard).getByText('The Adaptive Queue')).toBeInTheDocument();
    expect(within(placard).getByText(/RETIRED/)).toBeInTheDocument();

    // The floor catalogue (an ordered list — the accessible mirror) lists the
    // retired exhibit with its status.
    const catalogue = screen.getByTestId('floor-catalogue');
    const retiredRow = within(catalogue)
      .getByText('The Adaptive Queue')
      .closest('li') as HTMLElement;
    expect(retiredRow).toHaveAttribute('data-status', 'retired');

    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getAllByText(/INTERNAL SHOWCASE · SYNTHETIC PORTFOLIO/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Manifesto (deck)', () => {
  it('deep-links to the indictment poster (anomaly), the index mirror, reduced motion', async () => {
    const { container } = renderLive('deck-product-vision?slide=2');
    const root = await screen.findByTestId('live-manifesto', {}, { timeout: 12000 });

    // ?slide= deep link lands on the indictment (poster 2 of 9).
    expect(screen.getByTestId('poster-counter')).toHaveTextContent('02 / 09');

    // The indictment poster — the poster that indicts our own product.
    const indictment = screen.getByTestId('indictment');
    expect(within(indictment).getByText('fourteen')).toBeInTheDocument();
    expect(within(indictment).getByText(/14 SEPARATE IDENTITY ASKS/)).toBeInTheDocument();

    // The folio microtype carries the manifesto wording from the brief.
    expect(screen.getByTestId('manifesto-folio')).toHaveTextContent(
      'MANIFESTO · 02/09 · SYNTHETIC PRODUCT VISION',
    );

    // Reduced motion renders letter-settle posters already set (no kinetic
    // delays), and the deck is stamped reduced.
    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('the index is the accessible mirror and flags the indictment row', async () => {
    renderLive('deck-product-vision?slide=1');
    await screen.findByTestId('live-manifesto', {}, { timeout: 12000 });
    const index = screen.getByTestId('manifesto-index');
    const row = within(index)
      .getByText(/Our own systems ask her fourteen times/)
      .closest('li') as HTMLElement;
    expect(row).toHaveAttribute('data-anomaly', 'true');
  });

  it('locks the document theme to light while mounted and restores on unmount', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { unmount } = renderLive('deck-product-vision?slide=1');
    await screen.findByTestId('live-manifesto', {}, { timeout: 12000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('LiveExperience — The Sectional (deck)', () => {
  it('deep-links to SHT A-301: the red-pencilled storey (anomaly), the parts mirror, reduced motion', async () => {
    const { container } = renderLive('deck-technical-architecture-explanation?slide=5');
    const root = await screen.findByTestId('live-sectional', {}, { timeout: 12000 });

    // ?slide= deep link lands on the section (sheet 5 of 8).
    expect(screen.getByTestId('sheet-counter')).toHaveTextContent('05 / 08');
    expect(screen.getByTestId('sheet-counter')).toHaveTextContent('SHT A-301');

    // The schedule of parts (the sheet's accessible mirror) carries the
    // over-budget feature-store storey with its RFI.
    const parts = screen.getByTestId('parts-section');
    const overRow = within(parts).getByText('FEATURE STORE').closest('li') as HTMLElement;
    expect(overRow).toHaveAttribute('data-over', 'true');
    expect(within(overRow).getByText(/OVER BUDGET — RFI-114/)).toBeInTheDocument();

    // Every sheet's title block cross-references the Drawing Office set.
    const titleBlock = screen.getByTestId('titleblock-section');
    expect(within(titleBlock).getByText(/EDI-ARCH-004/)).toBeInTheDocument();

    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getAllByText(/SYNTHETIC DEMO/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('locks the document theme to dark while mounted and restores on unmount', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    const { unmount } = renderLive('deck-technical-architecture-explanation?slide=1');
    await screen.findByTestId('live-sectional', {}, { timeout: 12000 });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

describe('LiveExperience — The Field Manual (deck)', () => {
  it('deep-links to PROC 3.2: the revised step (anomaly), the warning label, reduced motion', async () => {
    const { container } = renderLive('deck-technical-training?slide=4');
    const root = await screen.findByTestId('live-field-manual', {}, { timeout: 12000 });

    // ?slide= deep link lands on PROC 3.2 (page 4 of 9).
    expect(screen.getByTestId('page-counter')).toHaveTextContent('04 / 09');
    expect(screen.getByTestId('page-counter')).toHaveTextContent('PROC 3.2');

    // The revised step — the manual visibly learns (the anomaly).
    const revised = screen.getByTestId('revised-step');
    expect(within(revised).getByText(/REVISED AFTER INCIDENT IR-2214/)).toBeInTheDocument();
    expect(
      within(revised).getByText(/The pin moved from checklist to build gate/),
    ).toBeInTheDocument();
    // The step enforces a Control Frame control id.
    expect(screen.getByText(/ENFORCES CTRL-AI-021/)).toBeInTheDocument();

    // The machinery-label warning (safety orange, warnings only).
    expect(screen.getByTestId('warning-proc-3-2')).toHaveTextContent(
      /NEVER RETRAIN ON PRODUCTION LABELS/,
    );

    expect(root).toHaveAttribute('data-reduced', 'true');
    expect(screen.getAllByText(/TRAINING MATERIAL · SYNTHETIC/i).length).toBeGreaterThan(0);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('the contents register is the accessible mirror and flags the revised procedure', async () => {
    renderLive('deck-technical-training?slide=2');
    await screen.findByTestId('live-field-manual', {}, { timeout: 12000 });
    const register = screen.getByTestId('procedure-register');
    const row = within(register)
      .getByText(/PROC 3.2 — Deploying a model to staging/)
      .closest('li') as HTMLElement;
    expect(row).toHaveAttribute('data-anomaly', 'true');
  });
});

describe('LiveExperience — unknown id', () => {
  it('offers a way back to the gallery', () => {
    renderLive('does-not-exist');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('No live experience here');
    expect(screen.getByRole('link', { name: /back to the gallery/i })).toBeInTheDocument();
  });
});
