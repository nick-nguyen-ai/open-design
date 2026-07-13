// @vitest-environment jsdom
/**
 * Task 20 — the three live personal-page worlds of batch C that complete all
 * ten personal pages: The Atlas, The Specimen Book, and The Playbill. Each
 * renders from its typed content pack, carries its anomaly and its accessible
 * mirror, honours reduced motion, locks its mood, and passes axe.
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

describe('LiveExperience — The Atlas (home-knowledge-atlas)', () => {
  it('draws the chart, admits the uncharted gap, and mirrors territories in a table', async () => {
    renderLive('/live/home-knowledge-atlas');
    await screen.findByTestId('live-atlas', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('edges and all');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByTestId('synthetic-mark')).toHaveTextContent('ILLUSTRATIVE PROFILE');

    // The uncharted region — the anomaly — is drawn and named.
    expect(screen.getByTestId('uncharted')).toHaveTextContent('HERE BE GAPS');

    // The gazetteer table is the accessible mirror; it names the uncharted gap too.
    const table = screen.getByTestId('gazetteer-table');
    expect(within(table).getByText('Payments')).toBeInTheDocument();
    expect(within(table).getByText(/left blank on purpose/i)).toBeInTheDocument();
  });

  it('territories are keyboard-focusable and raise their gazetteer entry', async () => {
    renderLive('/live/home-knowledge-atlas');
    await screen.findByTestId('live-atlas', {}, { timeout: 15000 });

    const territories = screen.getAllByRole('button');
    expect(territories.length).toBeGreaterThanOrEqual(6);
    // Each carries a proper accessible name and is keyboard-focusable.
    expect(territories[0]).toHaveAttribute('tabindex', '0');
    expect(territories[0]).toHaveAttribute('aria-label');

    // Focusing a later territory raises its entry into the gazetteer panel.
    const panel = screen.getByTestId('gazetteer-panel');
    const distSys = territories.find((t) => /Distributed Systems/.test(t.getAttribute('aria-label') ?? ''));
    expect(distSys).toBeDefined();
    fireEvent.focus(distSys!);
    expect(panel).toHaveTextContent('Distributed Systems');
  });

  it('reduced motion renders the HorizonSweep reduced variant and a static chart', async () => {
    const { container } = renderLive('/live/home-knowledge-atlas');
    await screen.findByTestId('live-atlas', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-atlas')).toHaveAttribute('data-reduced', 'true');
    const sweep = container.querySelector('[data-motion-sequence="horizon-sweep"]');
    expect(sweep).toHaveAttribute('data-motion-variant', 'reduced');
    expect(screen.getByTestId('the-chart')).toHaveAttribute('data-reduced', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-knowledge-atlas');
    await screen.findByTestId('live-atlas', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Specimen Book (home-research-publication-portfolio)', () => {
  it('sets each paper as a specimen and keeps the retraction with the same care', async () => {
    renderLive('/live/home-research-publication-portfolio');
    await screen.findByTestId('live-specimen-book', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('earns its size');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Seven specimens are set.
    expect(screen.getAllByTestId('specimen').length).toBeGreaterThanOrEqual(6);

    // The retracted specimen — the anomaly — is present and set plainly with its erratum.
    const retracted = screen.getByTestId('retracted-specimen');
    expect(within(retracted).getByTestId('erratum')).toHaveTextContent(/RETRACTED FY24/);
    expect(within(retracted).getByTestId('erratum')).toHaveTextContent(/counter-example/i);

    // The service register is a real table — accessible structure is the design.
    expect(within(screen.getByTestId('service-table')).getByText('VLDB')).toBeInTheDocument();
  });

  it('reduced motion renders the LedgerReveal reduced variant', async () => {
    const { container } = renderLive('/live/home-research-publication-portfolio');
    await screen.findByTestId('live-specimen-book', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-specimen-book')).toHaveAttribute('data-reduced', 'true');
    const reveal = container.querySelector('[data-motion-sequence="ledger-reveal"]');
    expect(reveal).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-research-publication-portfolio');
    await screen.findByTestId('live-specimen-book', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('LiveExperience — The Playbill (home-talks-presentation-archive)', () => {
  it('bills the seasons, marquees the next talk, and keeps the cancelled bill', async () => {
    renderLive('/live/home-talks-presentation-archive');
    await screen.findByTestId('live-playbill', {}, { timeout: 15000 });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('to hold');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // NOW SHOWING marquees the next scheduled talk.
    expect(screen.getByTestId('now-showing')).toHaveTextContent('NOW SHOWING');
    expect(screen.getByTestId('now-showing')).toHaveTextContent('The Reliability of Small Promises');

    // The cancelled engagement — the anomaly — is kept honestly on the bill.
    const cancelled = screen.getByTestId('cancelled-bill');
    expect(within(cancelled).getByTestId('cancelled-mark')).toHaveTextContent(/CANCELLED — SPEAKER ILLNESS/);

    // The engagement table is the accessible mirror and marks the cancellation.
    const table = screen.getByTestId('engagement-table');
    expect(within(table).getByText(/cancelled, rescheduled/)).toBeInTheDocument();
  });

  it('reduced motion renders the LedgerReveal reduced variant', async () => {
    const { container } = renderLive('/live/home-talks-presentation-archive');
    await screen.findByTestId('live-playbill', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-playbill')).toHaveAttribute('data-reduced', 'true');
    const reveal = container.querySelector('[data-motion-sequence="ledger-reveal"]');
    expect(reveal).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/home-talks-presentation-archive');
    await screen.findByTestId('live-playbill', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
