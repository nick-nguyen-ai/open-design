// @vitest-environment jsdom
/**
 * Batch-2 decks F — the PowerPoint-familiar three: The Quarter (QBR), The
 * Straight Pitch (sales), and The Allocation (budget). Deliberately conventional
 * slide anatomy, executed flawlessly. Each renders from its typed content pack,
 * honours reduced motion, locks its (light) mood, surfaces its verbatim anomaly,
 * carries its accessible mirror, and passes axe.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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

/* ================================================================== */
/* The Quarter — deck-quarterly-business-review                        */
/* ================================================================== */

describe('LiveExperience — The Quarter (deck-quarterly-business-review)', () => {
  it('renders eleven conventional slides, lands on the title, locks light, marks synthetic', async () => {
    const { container } = renderLive('/live/deck-quarterly-business-review');
    await screen.findByTestId('live-quarter', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.q-slide')).toHaveLength(11);
    expect(screen.getByTestId('quarter-counter')).toHaveTextContent('01 / 11');

    const active = container.querySelector('.q-slide[data-state="active"]');
    expect(active).not.toBeNull();
    expect(active).toHaveAttribute('data-slide-id', 'title');

    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC RESULTS — DEMONSTRATION ONLY/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deep-links to the KPI slide where NRR is flagged below the floor', async () => {
    const { container } = renderLive('/live/deck-quarterly-business-review?slide=4');
    await screen.findByTestId('live-quarter', {}, { timeout: 15000 });

    expect(screen.getByTestId('quarter-counter')).toHaveTextContent('04 / 11');
    const active = container.querySelector('.q-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'kpi');
    expect(screen.getByTestId('kpi-anomaly')).toHaveTextContent('NRR 96% — BELOW 100% FLOOR');
  });

  it('echoes the anomaly in the executive summary', async () => {
    renderLive('/live/deck-quarterly-business-review?slide=3');
    await screen.findByTestId('live-quarter', {}, { timeout: 15000 });
    expect(screen.getByTestId('summary-anomaly')).toHaveTextContent('NRR 96% — BELOW 100% FLOOR');
  });

  it('arrow keys, Home and End drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-quarterly-business-review');
    await screen.findByTestId('live-quarter', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-quarter')).toHaveAttribute('data-reduced', 'true');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('quarter-counter')).toHaveTextContent('02 / 11');
    expect(container.querySelector('.q-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('quarter-counter')).toHaveTextContent('11 / 11');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('quarter-counter')).toHaveTextContent('01 / 11');
  });

  it('has no axe violations on the KPI slide', async () => {
    const { container } = renderLive('/live/deck-quarterly-business-review?slide=4');
    await screen.findByTestId('live-quarter', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ================================================================== */
/* The Straight Pitch — deck-sales-pitch                               */
/* ================================================================== */

describe('LiveExperience — The Straight Pitch (deck-sales-pitch)', () => {
  it('renders ten conventional slides, lands on the title, locks light, marks synthetic', async () => {
    const { container } = renderLive('/live/deck-sales-pitch');
    await screen.findByTestId('live-straight-pitch', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.sp-slide')).toHaveLength(10);
    expect(screen.getByTestId('pitch-counter')).toHaveTextContent('01 / 10');

    const active = container.querySelector('.sp-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');

    expect(screen.getAllByText(/SYNTHETIC PITCH — NO REAL CLIENT/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deep-links to the honest slide with the verbatim heading and three bullets', async () => {
    const { container } = renderLive('/live/deck-sales-pitch?slide=8');
    await screen.findByTestId('live-straight-pitch', {}, { timeout: 15000 });

    expect(screen.getByTestId('pitch-counter')).toHaveTextContent('08 / 10');
    const active = container.querySelector('.sp-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'not-a-fit');
    expect(screen.getByText('WHERE WE ARE NOT A FIT')).toBeInTheDocument();
    const list = within(active as HTMLElement).getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('deep-links to the proof slide (comp.kpi-tile customer outcomes)', async () => {
    const { container } = renderLive('/live/deck-sales-pitch?slide=6');
    await screen.findByTestId('live-straight-pitch', {}, { timeout: 15000 });
    const active = container.querySelector('.sp-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'proof');
    expect(screen.getByTestId('pitch-proof')).toBeInTheDocument();
  });

  it('arrow keys and End drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-sales-pitch');
    await screen.findByTestId('live-straight-pitch', {}, { timeout: 15000 });

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('pitch-counter')).toHaveTextContent('02 / 10');
    expect(container.querySelector('.sp-slide[data-state="leaving"]')).toBeNull();
    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('pitch-counter')).toHaveTextContent('10 / 10');
  });

  it('has no axe violations on the honest slide', async () => {
    const { container } = renderLive('/live/deck-sales-pitch?slide=8');
    await screen.findByTestId('live-straight-pitch', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ================================================================== */
/* The Allocation — deck-budget-planning                               */
/* ================================================================== */

describe('LiveExperience — The Allocation (deck-budget-planning)', () => {
  it('renders ten conventional slides, lands on the title, locks light, marks synthetic', async () => {
    const { container } = renderLive('/live/deck-budget-planning');
    await screen.findByTestId('live-allocation', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.al-slide')).toHaveLength(10);
    expect(screen.getByTestId('allocation-counter')).toHaveTextContent('01 / 10');

    const active = container.querySelector('.al-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');

    expect(screen.getAllByText(/SYNTHETIC BUDGET — DEMONSTRATION ONLY/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deep-links to the waterfall where cloud egress is flagged unresolved', async () => {
    const { container } = renderLive('/live/deck-budget-planning?slide=3');
    await screen.findByTestId('live-allocation', {}, { timeout: 15000 });

    expect(screen.getByTestId('allocation-counter')).toHaveTextContent('03 / 10');
    const active = container.querySelector('.al-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'waterfall');
    expect(screen.getByTestId('allocation-waterfall')).toBeInTheDocument();
    // The flagged bar carries the verbatim anomaly as its accessible label.
    const flaggedBar = container.querySelector('[data-testid="waterfall-bar"][data-step="egress"]');
    expect(flaggedBar).toHaveAttribute('aria-label', expect.stringContaining('Cloud egress'));
    // The verbatim flag shows in the pinned readout (and echoes on later slides).
    expect(screen.getAllByText('CLOUD EGRESS +38% YOY — UNRESOLVED').length).toBeGreaterThan(0);
    // The default pinned readout is the flagged egress step.
    expect(screen.getByTestId('waterfall-readout')).toHaveTextContent('Cloud egress');
  });

  it('waterfall bars are focusable and pinning one updates the mono readout', async () => {
    const { container } = renderLive('/live/deck-budget-planning?slide=3');
    await screen.findByTestId('live-allocation', {}, { timeout: 15000 });

    const bars = container.querySelectorAll<HTMLElement>('[data-testid="waterfall-bar"]');
    expect(bars.length).toBe(8);
    bars.forEach((bar) => {
      expect(bar).toHaveAttribute('tabindex', '0');
      expect(bar).toHaveAttribute('role', 'button');
    });

    const readout = screen.getByTestId('waterfall-readout');
    // Default pins the flagged egress step.
    expect(readout).toHaveTextContent('Cloud egress');

    // Pinning the opening bar updates the readout to the baseline figure.
    const opening = container.querySelector<HTMLElement>('[data-testid="waterfall-bar"][data-step="opening"]')!;
    fireEvent.focus(opening);
    expect(readout).toHaveTextContent('FY26 baseline');
    expect(readout).toHaveTextContent('$61.4M');

    // Hover pins a different step too.
    const efficiency = container.querySelector<HTMLElement>('[data-testid="waterfall-bar"][data-step="efficiency"]')!;
    fireEvent.mouseEnter(efficiency);
    expect(readout).toHaveTextContent('Efficiency programme');
  });

  it('exposes the waterfall as a visually-hidden step/delta/running-total table', async () => {
    renderLive('/live/deck-budget-planning?slide=3');
    await screen.findByTestId('live-allocation', {}, { timeout: 15000 });
    const mirror = screen.getByTestId('waterfall-mirror');
    // header row + eight steps
    expect(within(mirror).getAllByRole('row')).toHaveLength(9);
    expect(within(mirror).getByText(/Cloud egress — CLOUD EGRESS \+38% YOY — UNRESOLVED/)).toBeInTheDocument();
  });

  it('has no axe violations on the waterfall slide', async () => {
    const { container } = renderLive('/live/deck-budget-planning?slide=3');
    await screen.findByTestId('live-allocation', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
