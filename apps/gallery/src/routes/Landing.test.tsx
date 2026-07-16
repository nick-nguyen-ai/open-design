// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { Landing } from './Landing.js';

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-search">{location.search}</div>;
}

function renderLanding(entries: string[] = ['/']) {
  window.localStorage.clear();
  return render(
    <MotionProvider reducedMotion>
      <MemoryRouter initialEntries={entries}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Landing />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </MotionProvider>,
  );
}

function templateCards() {
  return screen.getAllByRole('button', { name: /^Template:/ });
}

afterEach(cleanup);

describe('Landing', () => {
  it('shows all 65 templates in the default All mode', () => {
    renderLanding();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Every template here is');
    expect(templateCards()).toHaveLength(65);
  });

  it('switches modes and preserves the query', async () => {
    const user = userEvent.setup();
    renderLanding();

    const search = screen.getByRole('searchbox', {
      name: /search templates, components, and grammars/i,
    });
    await user.type(search, 'risk');

    await user.click(screen.getByRole('radio', { name: /^Components/ }));

    // Query survives the mode switch (input + URL both retain it).
    await waitFor(() => expect(search).toHaveValue('risk'));
    await waitFor(() => expect(screen.getByTestId('location-search')).toHaveTextContent('mode=components'));
    expect(screen.getByTestId('location-search')).toHaveTextContent('q=risk');
  });

  // 60-card re-renders under jsdom exceed the 5s default on slow machines.
  it('narrows results as the query is typed', { timeout: 30_000 }, async () => {
    const user = userEvent.setup();
    renderLanding();
    expect(templateCards()).toHaveLength(65);

    await user.type(
      screen.getByRole('searchbox', { name: /search templates, components, and grammars/i }),
      'model risk',
    );

    await waitFor(
      () => {
        const count = templateCards().length;
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThan(60);
      },
      { timeout: 10_000 },
    );
  });

  it('narrows results with a facet filter and reflects it in the URL', async () => {
    const user = userEvent.setup();
    renderLanding();
    const before = templateCards().length;

    const sidebar = screen.getByRole('region', { name: 'Filters' });
    await user.click(within(sidebar).getByRole('button', { name: 'Dashboard' }));

    await waitFor(() => expect(templateCards().length).toBeLessThan(before));
    await waitFor(() =>
      expect(screen.getByTestId('location-search')).toHaveTextContent('surface=dashboard'),
    );
  });

  it('rehydrates browse state from the URL', () => {
    renderLanding(['/browse?mode=components']);
    // Components mode ⇒ no template cards, but all 45 component cards render
    // (5 originals + the 40 diagram-collection components).
    expect(screen.queryAllByRole('button', { name: /^Template:/ })).toHaveLength(0);
    expect(screen.getAllByRole('button', { name: /^Component:/ })).toHaveLength(45);
  });

  it('applies a sort, reflects it in the URL, and rehydrates it', async () => {
    const user = userEvent.setup();
    const { unmount } = renderLanding();

    await user.selectOptions(screen.getByLabelText('Sort'), 'name');
    await waitFor(() => expect(screen.getByTestId('location-search')).toHaveTextContent('sort=name'));

    // Name (A–Z): the first template card is alphabetically first.
    const titles = templateCards().map((c) => c.querySelector('h3')?.textContent ?? '');
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);

    unmount();

    // Rehydrate from the URL.
    renderLanding(['/browse?sort=name']);
    expect(screen.getByLabelText('Sort')).toHaveValue('name');
  });

  it('opens a quick preview, then closes on Escape and restores focus', async () => {
    const user = userEvent.setup();
    renderLanding();

    const card = templateCards()[0]!;
    await user.click(card);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: /view full detail/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(card).toHaveFocus();
  });

  // axe over the full 60-card landing exceeds the 5s default on slow machines.
  it('has no axe violations', { timeout: 60_000 }, async () => {
    const { container } = renderLanding();
    expect(await axe(container)).toHaveNoViolations();
  });
});
