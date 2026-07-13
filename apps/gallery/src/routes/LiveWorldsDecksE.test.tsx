// @vitest-environment jsdom
/**
 * Batch-2 decks E — three new art-directed slide-deck worlds: T-Minus
 * (deck-product-launch), The Whiteboard (deck-team-retrospective), and The
 * Cutover (deck-cloud-migration). Each renders from its typed content pack,
 * deep-links to its anomaly slide, drives by keyboard, locks its mood, exposes
 * an accessible mirror, and passes axe.
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
/* T-Minus                                                            */
/* ------------------------------------------------------------------ */

describe('LiveExperience — T-Minus (deck-product-launch)', () => {
  it('renders ten slides, lands on the title slide, locks dark, shows the synthetic notice', async () => {
    const { container } = renderLive('/live/deck-product-launch');
    await screen.findByTestId('live-t-minus', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.tm-slide')).toHaveLength(10);
    expect(screen.getByTestId('launch-counter')).toHaveTextContent('01 / 10');

    const active = container.querySelector('.tm-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');
    expect(within(active as HTMLElement).getByText('countdown, not a date.')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: '◄ GALLERY' })).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC LAUNCH PLAN — DEMONSTRATION ONLY/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('deep-links to the readiness board and shows the amber security-gate anomaly', async () => {
    const { container } = renderLive('/live/deck-product-launch?slide=4');
    await screen.findByTestId('live-t-minus', {}, { timeout: 15000 });

    expect(screen.getByTestId('launch-counter')).toHaveTextContent('04 / 10');
    const active = container.querySelector('.tm-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'readiness');
    expect(within(active as HTMLElement).getByTestId('readiness-anomaly')).toHaveTextContent(
      /SECURITY REVIEW PENDING — BLOCKS T-7/,
    );
  });

  it('arrow keys, End and Home drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-product-launch');
    await screen.findByTestId('live-t-minus', {}, { timeout: 15000 });
    expect(screen.getByTestId('live-t-minus')).toHaveAttribute('data-reduced', 'true');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('launch-counter')).toHaveTextContent('02 / 10');
    expect(container.querySelector('.tm-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('launch-counter')).toHaveTextContent('10 / 10');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('launch-counter')).toHaveTextContent('01 / 10');
  });

  it('exposes the day-0 runbook accessible mirror', async () => {
    renderLive('/live/deck-product-launch');
    await screen.findByTestId('live-t-minus', {}, { timeout: 15000 });
    expect(
      screen.getByRole('heading', { name: /Day-0 launch runbook, in order/i }),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/deck-product-launch');
    await screen.findByTestId('live-t-minus', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ------------------------------------------------------------------ */
/* The Whiteboard                                                     */
/* ------------------------------------------------------------------ */

describe('LiveExperience — The Whiteboard (deck-team-retrospective)', () => {
  it('renders nine slides, lands on the title slide, locks light, shows the synthetic notice', async () => {
    const { container } = renderLive('/live/deck-team-retrospective');
    await screen.findByTestId('live-whiteboard', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.wb-slide')).toHaveLength(9);
    expect(screen.getByTestId('board-counter')).toHaveTextContent('01 / 09');

    const active = container.querySelector('.wb-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');

    expect(screen.getAllByText(/SYNTHETIC RETROSPECTIVE — NO REAL TEAM/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deep-links to the actions board and shows the red-circled carried-action anomaly', async () => {
    const { container } = renderLive('/live/deck-team-retrospective?slide=6');
    await screen.findByTestId('live-whiteboard', {}, { timeout: 15000 });

    expect(screen.getByTestId('board-counter')).toHaveTextContent('06 / 09');
    const active = container.querySelector('.wb-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'actions');
    expect(within(active as HTMLElement).getByTestId('actions-anomaly')).toHaveTextContent(
      /CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP/,
    );
  });

  it('arrow keys, End and Home drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-team-retrospective');
    await screen.findByTestId('live-whiteboard', {}, { timeout: 15000 });

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('board-counter')).toHaveTextContent('02 / 09');
    expect(container.querySelector('.wb-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('board-counter')).toHaveTextContent('09 / 09');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('board-counter')).toHaveTextContent('01 / 09');
  });

  it('exposes the sticky-wall and actions accessible mirrors per column', async () => {
    renderLive('/live/deck-team-retrospective');
    await screen.findByTestId('live-whiteboard', {}, { timeout: 15000 });
    expect(screen.getByRole('heading', { name: 'Actions and owners' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What didn’t go well' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/deck-team-retrospective');
    await screen.findByTestId('live-whiteboard', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ------------------------------------------------------------------ */
/* The Cutover                                                        */
/* ------------------------------------------------------------------ */

describe('LiveExperience — The Cutover (deck-cloud-migration)', () => {
  it('renders ten slides, lands on the title slide, locks light, shows the synthetic notice', async () => {
    const { container } = renderLive('/live/deck-cloud-migration');
    await screen.findByTestId('live-cutover', {}, { timeout: 15000 });

    expect(container.querySelectorAll('.cu-slide')).toHaveLength(10);
    expect(screen.getByTestId('cutover-counter')).toHaveTextContent('01 / 10');

    const active = container.querySelector('.cu-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'title');
    expect(within(active as HTMLElement).getByText('Except one box.')).toBeInTheDocument();

    expect(screen.getAllByText(/SYNTHETIC ESTATE — DEMONSTRATION ONLY/i).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deep-links to the current estate and shows the on-prem mainframe-ledger anomaly', async () => {
    const { container } = renderLive('/live/deck-cloud-migration?slide=2');
    await screen.findByTestId('live-cutover', {}, { timeout: 15000 });

    expect(screen.getByTestId('cutover-counter')).toHaveTextContent('02 / 10');
    const active = container.querySelector('.cu-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'current');
    expect(within(active as HTMLElement).getByTestId('current-estate-flag')).toHaveTextContent(
      /MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms/,
    );
  });

  it('renders the ledger anomaly on the target estate too', async () => {
    const { container } = renderLive('/live/deck-cloud-migration?slide=3');
    await screen.findByTestId('live-cutover', {}, { timeout: 15000 });
    const active = container.querySelector('.cu-slide[data-state="active"]');
    expect(active).toHaveAttribute('data-slide-id', 'target');
    expect(within(active as HTMLElement).getByTestId('target-estate-flag')).toHaveTextContent(
      /MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms/,
    );
  });

  it('arrow keys, End and Home drive the deck; reduced motion has no leaving pass', async () => {
    const { container } = renderLive('/live/deck-cloud-migration');
    await screen.findByTestId('live-cutover', {}, { timeout: 15000 });

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('cutover-counter')).toHaveTextContent('02 / 10');
    expect(container.querySelector('.cu-slide[data-state="leaving"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByTestId('cutover-counter')).toHaveTextContent('10 / 10');
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByTestId('cutover-counter')).toHaveTextContent('01 / 10');
  });

  it('exposes both estate diagrams as TRUE zone-grouped mirrors that differ exactly as the diagrams do', async () => {
    renderLive('/live/deck-cloud-migration');
    await screen.findByTestId('live-cutover', {}, { timeout: 15000 });

    expect(
      screen.getByRole('heading', { name: /Current estate, system by system/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Target estate, system by system/i }),
    ).toBeInTheDocument();

    const current = screen.getByTestId('current-estate-mirror');
    const target = screen.getByTestId('target-estate-mirror');

    // The two mirrors are NOT identical (the old bug: same flat NODES list twice).
    expect(current.textContent).not.toEqual(target.textContent);

    // Zone level is present. The current estate is entirely on-prem — no cloud zone yet.
    const currentOnprem = within(current).getByText('On-prem data centre').closest('li')!;
    expect(within(current).queryByText('Cloud landing zone')).toBeNull();

    // The target estate splits into an on-prem zone and a cloud landing zone.
    const targetOnprem = within(target).getByText('On-prem data centre').closest('li')!;
    const targetCloud = within(target).getByText('Cloud landing zone').closest('li')!;

    // A system the CURRENT mirror lists on-prem, the TARGET mirror places in the cloud.
    expect(within(currentOnprem).getByText(/Customer portal/i)).toBeInTheDocument();
    expect(within(targetCloud).getByText(/Customer portal/i)).toBeInTheDocument();
    expect(within(targetOnprem).queryByText(/Customer portal/i)).toBeNull();

    // The padlocked mainframe ledger appears on-prem in BOTH mirrors.
    expect(within(currentOnprem).getByText(/Mainframe ledger/i)).toHaveTextContent(
      /MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms/,
    );
    expect(within(targetOnprem).getByText(/Mainframe ledger/i)).toHaveTextContent(
      /MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms/,
    );
  });

  it('has no axe violations', async () => {
    const { container } = renderLive('/live/deck-cloud-migration');
    await screen.findByTestId('live-cutover', {}, { timeout: 15000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
