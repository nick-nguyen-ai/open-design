// @vitest-environment jsdom
/**
 * Batch-2 decks D — three new art-directed slide-deck worlds: The Planning
 * Wall (deck-project-kickoff), The Preprint (deck-research-discussion), and The
 * Campaign Room (deck-marketing-campaign). Each renders from its typed content
 * pack, deep-links to its anomaly slide, drives by keyboard, locks its mood,
 * exposes an accessible mirror, and passes axe.
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

/* ------------------------------------------------------------------ */
/* The Planning Wall                                                   */
/* ------------------------------------------------------------------ */

describe('LiveExperience — The Planning Wall (deck-project-kickoff)', () => {
  it('renders ten slides, lands on the title slide, locks light, shows the synthetic notice', async () => {
    const { container } = renderLive('/live/deck-project-kickoff');
    await screen.findByTestId('live-planning-wall', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.pw-slide')).toHaveLength(10);
    expect(screen.getByTestId('wall-counter')).toHaveTextContent('01 / 10');

    const active = container.querySelector('.pw-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');
    expect(within(active as HTMLElement).getByText('point at.')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC PROGRAMME — DEMONSTRATION ONLY/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deep-links to the milestone route and shows the red-circled dependency anomaly', async () => {
    const { container } = renderLive('/live/deck-project-kickoff?slide=4');
    await screen.findByTestId('live-planning-wall', {}, { timeout: 15000 });

    expect(screen.getByTestId('wall-counter')).toHaveTextContent('04 / 10');
    const active = container.querySelector('.pw-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'route');
    expect(
      within(active as HTMLElement).getByText(/DEPENDENCY UNCONFIRMED — DATA PLATFORM SIGN-OFF/),
    ).toBeInTheDocument();
  });

  it('arrow keys, End and Home drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-project-kickoff');
    await screen.findByTestId('live-planning-wall', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-planning-wall')).toHaveAttribute('data-reduced', 'true');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('wall-counter')).toHaveTextContent('02 / 10');
    expect(container.querySelector('.pw-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('wall-counter')).toHaveTextContent('10 / 10');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('wall-counter')).toHaveTextContent('01 / 10');
  });

  it('exposes the route + RACI accessible mirror', async () => {
    renderLive('/live/deck-project-kickoff');
    await screen.findByTestId('live-planning-wall', {}, { timeout: 15000 });
    expect(
      screen.getByRole('heading', { name: /Milestone route, in order/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('raci-grid')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/deck-project-kickoff');
    await screen.findByTestId('live-planning-wall', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ------------------------------------------------------------------ */
/* The Preprint                                                        */
/* ------------------------------------------------------------------ */

describe('LiveExperience — The Preprint (deck-research-discussion)', () => {
  it('renders ten pages, lands on the title page, locks light, shows the synthetic notice', async () => {
    const { container } = renderLive('/live/deck-research-discussion');
    await screen.findByTestId('live-preprint', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.pp-slide')).toHaveLength(10);
    expect(screen.getByTestId('paper-counter')).toHaveTextContent('01 / 10');

    const active = container.querySelector('.pp-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');

    expect(screen.getAllByText(/SYNTHETIC STUDY — NO REAL SUBJECTS/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deep-links to the replication page and shows the DOES NOT REPLICATE anomaly', async () => {
    const { container } = renderLive('/live/deck-research-discussion?slide=7');
    await screen.findByTestId('live-preprint', {}, { timeout: 15000 });

    expect(screen.getByTestId('paper-counter')).toHaveTextContent('07 / 10');
    const active = container.querySelector('.pp-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'replication');
    expect(within(active as HTMLElement).getByTestId('replication-stamp')).toHaveTextContent(
      'DOES NOT REPLICATE (n=12)',
    );
  });

  it('arrow keys, End and Home drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-research-discussion');
    await screen.findByTestId('live-preprint', {}, { timeout: 15000 });

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('paper-counter')).toHaveTextContent('02 / 10');
    expect(container.querySelector('.pp-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('paper-counter')).toHaveTextContent('10 / 10');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('paper-counter')).toHaveTextContent('01 / 10');
  });

  it('exposes the confidence-interval plate as an accessible data table', async () => {
    renderLive('/live/deck-research-discussion');
    await screen.findByTestId('live-preprint', {}, { timeout: 15000 });
    const table = screen.getByRole('table', { name: /Standardised effect, lower and upper/i });
    expect(within(table).getByText(/DOES NOT REPLICATE/)).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/deck-research-discussion');
    await screen.findByTestId('live-preprint', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ------------------------------------------------------------------ */
/* The Campaign Room                                                   */
/* ------------------------------------------------------------------ */

describe('LiveExperience — The Campaign Room (deck-marketing-campaign)', () => {
  it('renders nine slides, lands on the title slide, locks dark, shows the synthetic notice', async () => {
    const { container } = renderLive('/live/deck-marketing-campaign');
    await screen.findByTestId('live-campaign-room', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.cr-slide')).toHaveLength(9);
    expect(screen.getByTestId('campaign-counter')).toHaveTextContent('01 / 09');

    const active = container.querySelector('.cr-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');

    expect(screen.getAllByText(/SYNTHETIC CAMPAIGN — DEMONSTRATION ONLY/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('deep-links to the funnel and shows the struck-through PAID SOCIAL anomaly', async () => {
    const { container } = renderLive('/live/deck-marketing-campaign?slide=4');
    await screen.findByTestId('live-campaign-room', {}, { timeout: 15000 });

    expect(screen.getByTestId('campaign-counter')).toHaveTextContent('04 / 09');
    const active = container.querySelector('.cr-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'funnel');
    expect(
      within(active as HTMLElement).getByText(/PAID SOCIAL — CUT · CAC 4\.1× TARGET/),
    ).toBeInTheDocument();
  });

  it('arrow keys, End and Home drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-marketing-campaign');
    await screen.findByTestId('live-campaign-room', {}, { timeout: 15000 });

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('campaign-counter')).toHaveTextContent('02 / 09');
    expect(container.querySelector('.cr-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('campaign-counter')).toHaveTextContent('09 / 09');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('campaign-counter')).toHaveTextContent('01 / 09');
  });

  it('the interactive channel segment is focusable and updates the aria-live readout', async () => {
    renderLive('/live/deck-marketing-campaign?slide=5');
    await screen.findByTestId('live-campaign-room', {}, { timeout: 15000 });

    const partner = screen.getByTestId('channel-seg-partner');
    const live = screen.getByTestId('channel-live');
    expect(live).toHaveAttribute('aria-live', 'polite');

    // Hovering a segment lifts it, makes it the single tab stop, and updates the readout.
    fireEvent.mouseEnter(partner);
    expect(live).toHaveTextContent(/Partnerships/);
    expect(partner).toHaveAttribute('data-active', 'true');
    expect(partner).toHaveAttribute('tabindex', '0');
    partner.focus();
    expect(partner).toHaveFocus();

    // Arrow keys move focus along the bar and mirror to the readout.
    fireEvent.keyDown(partner, { key: 'ArrowDown' });
    expect(live).toHaveTextContent(/Content & PR/);
    expect(screen.getByTestId('channel-seg-content')).toHaveFocus();
  });

  it('exposes the funnel + channel-mix accessible tables', async () => {
    renderLive('/live/deck-marketing-campaign');
    await screen.findByTestId('live-campaign-room', {}, { timeout: 15000 });
    expect(screen.getByRole('columnheader', { name: 'Conversion to next' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Budget share' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/deck-marketing-campaign');
    await screen.findByTestId('live-campaign-room', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
