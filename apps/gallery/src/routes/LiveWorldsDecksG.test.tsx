// @vitest-environment jsdom
/**
 * Batch-2 deck G — The Long Signal (deck-analytics-deep-dive): the interactive-
 * instrument hero of the batch. ONE 52-week checkout-conversion series threads
 * every slide as a persistent band; the hero slide is a keyboard-operable
 * instrument. Renders from its typed content pack, honours reduced motion,
 * locks its (dark) mood, surfaces the verbatim week-37 regime-change anomaly,
 * carries its accessible mirror (a hidden 52-row data table), and passes axe.
 *
 * The instrument contract is unit-tested: focusing the hero chart and pressing
 * ArrowRight walks the readout week (the aria-live text changes) WITHOUT turning
 * the slide; `B` toggles the baseline overlay node into the DOM.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

describe('LiveExperience — The Long Signal (deck-analytics-deep-dive)', () => {
  it('renders ten observatory slides, lands on the title, locks dark, marks synthetic', async () => {
    const { container } = renderLive('/live/deck-analytics-deep-dive');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.ls-slide')).toHaveLength(10);
    expect(screen.getByTestId('signal-counter')).toHaveTextContent('01 / 10');

    const active = container.querySelector('.ls-slide[data-state="active"]');
    expect(active).not.toBeNull();
    expect(active).toHaveAttribute('data-slide-id', 'title');

    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC SERIES — DEMONSTRATION ONLY/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('deep-links to the instrument slide, the interactive hero of the deck', async () => {
    const { container } = renderLive('/live/deck-analytics-deep-dive?slide=4');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });

    expect(screen.getByTestId('signal-counter')).toHaveTextContent('04 / 10');
    const active = container.querySelector('.ls-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'instrument');
    expect(screen.getByTestId('instrument')).toBeInTheDocument();
    expect(screen.getByTestId('instrument')).toHaveAttribute('role', 'application');
  });

  it('instrument: focusing the chart and pressing ArrowRight walks the readout week (aria-live changes) without turning the slide', async () => {
    renderLive('/live/deck-analytics-deep-dive?slide=4');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });

    const instrument = screen.getByTestId('instrument');
    const live = screen.getByTestId('instrument-readout');
    // The instrument opens on the anomaly week (37).
    expect(live).toHaveTextContent('Week 37');
    const before = live.textContent;

    instrument.focus();
    fireEvent.keyDown(instrument, { key: 'ArrowRight' });

    expect(live.textContent).not.toBe(before);
    expect(live).toHaveTextContent('Week 38');
    // Week-walking is scoped to the focused SVG — the slide did NOT turn.
    expect(screen.getByTestId('signal-counter')).toHaveTextContent('04 / 10');

    // ArrowLeft walks back.
    fireEvent.keyDown(instrument, { key: 'ArrowLeft' });
    expect(live).toHaveTextContent('Week 37');
  });

  it('instrument: B toggles the baseline overlay node in and out of the DOM', async () => {
    renderLive('/live/deck-analytics-deep-dive?slide=4');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });

    const instrument = screen.getByTestId('instrument');
    expect(screen.queryByTestId('baseline-overlay')).toBeNull();

    instrument.focus();
    fireEvent.keyDown(instrument, { key: 'B' });
    expect(screen.getByTestId('baseline-overlay')).toBeInTheDocument();

    fireEvent.keyDown(instrument, { key: 'B' });
    expect(screen.queryByTestId('baseline-overlay')).toBeNull();
  });

  it('instrument: Enter pins a comparison marker and the readout reports the delta', async () => {
    renderLive('/live/deck-analytics-deep-dive?slide=4');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });

    const instrument = screen.getByTestId('instrument');
    instrument.focus();
    fireEvent.keyDown(instrument, { key: 'Enter' }); // pin week 37
    fireEvent.keyDown(instrument, { key: 'ArrowRight' }); // move to 38

    expect(screen.getByTestId('instrument-pin')).toBeInTheDocument();
    expect(screen.getByTestId('instrument-readout')).toHaveTextContent('vs week 37');
  });

  it('exposes the series as a visually-hidden 52-row data table', async () => {
    const { container } = renderLive('/live/deck-analytics-deep-dive?slide=4');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });

    const rows = container.querySelectorAll('[data-testid="signal-table"] tbody tr');
    expect(rows).toHaveLength(52);
  });

  it('deep-links to the anomaly slide with the verbatim week-37 regime-change flag', async () => {
    const { container } = renderLive('/live/deck-analytics-deep-dive?slide=6');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });

    expect(screen.getByTestId('signal-counter')).toHaveTextContent('06 / 10');
    const active = container.querySelector('.ls-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'anomaly');
    expect(screen.getByTestId('anomaly-flag')).toHaveTextContent(
      'WEEK 37 REGIME CHANGE — FLAGGED, NOT SMOOTHED',
    );
  });

  it('renders the cohort comparison via comp.trend-chart and the effect-size KPI row', async () => {
    const { container: cohortContainer } = renderLive('/live/deck-analytics-deep-dive?slide=7');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });
    expect(screen.getByTestId('cohort-chart')).toBeInTheDocument();
    // ChartFigure renders its accessible data-table mirror.
    expect(cohortContainer.querySelector('[data-testid="chart-mount"]')).not.toBeNull();
  });

  it('arrow keys, Home and End drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-analytics-deep-dive');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-long-signal')).toHaveAttribute('data-reduced', 'true');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('signal-counter')).toHaveTextContent('02 / 10');
    expect(container.querySelector('.ls-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('signal-counter')).toHaveTextContent('10 / 10');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('signal-counter')).toHaveTextContent('01 / 10');
  });

  it('has no axe violations on the instrument slide', async () => {
    const { container } = renderLive('/live/deck-analytics-deep-dive?slide=4');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations on the anomaly slide', async () => {
    const { container } = renderLive('/live/deck-analytics-deep-dive?slide=6');
    await screen.findByTestId('live-long-signal', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
