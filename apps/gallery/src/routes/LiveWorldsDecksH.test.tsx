// @vitest-environment jsdom
/**
 * Deck batch H — the five diagram-collection grammar-tour decks
 * (`deck-dgm-<family>`). One parameterised contract for all five: ten slides
 * (cover + eight diagram kinds + close), lands on the cover, locks its mood,
 * shows the provenance notice, deep-links to a diagram slide whose family
 * renderer (with its hidden outline mirror) is present, and passes axe.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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

interface TourWorld {
  id: string;
  rootTestId: string;
  prefix: string;
  mood: 'light' | 'dark';
  family: string;
  noticePattern: RegExp;
}

const TOUR_WORLDS: readonly TourWorld[] = [
  {
    id: 'deck-dgm-sketchnote',
    rootTestId: 'live-dgm-sketchnote',
    prefix: 'skd',
    mood: 'light',
    family: 'sketchnote',
    noticePattern: /synthetic teaching content/i,
  },
  {
    id: 'deck-dgm-blueprint',
    rootTestId: 'live-dgm-blueprint',
    prefix: 'bpd',
    mood: 'dark',
    family: 'blueprint',
    noticePattern: /SYNTHETIC SPECIFICATION/i,
  },
  {
    id: 'deck-dgm-circuit',
    rootTestId: 'live-dgm-circuit',
    prefix: 'cxd',
    mood: 'dark',
    family: 'circuit',
    noticePattern: /synthetic platform story/i,
  },
  {
    id: 'deck-dgm-isometric',
    rootTestId: 'live-dgm-isometric',
    prefix: 'isd',
    mood: 'light',
    family: 'isometric',
    noticePattern: /synthetic onboarding tour/i,
  },
  {
    id: 'deck-dgm-gazette',
    rootTestId: 'live-dgm-gazette',
    prefix: 'gzd',
    mood: 'light',
    family: 'gazette',
    noticePattern: /synthetic field manual/i,
  },
];

describe.each(TOUR_WORLDS)('LiveExperience — grammar tour $id', ({ id, rootTestId, prefix, mood, family, noticePattern }) => {
  it('renders ten slides, lands on the cover, locks its mood, shows the notice; cover passes axe', async () => {
    const { container } = renderLive(`/live/${id}`);
    await screen.findByTestId(rootTestId, {}, { timeout: 15000 });

    expect(container.querySelectorAll(`.${prefix}-slide`)).toHaveLength(10);
    expect(screen.getByTestId(`${rootTestId}-counter`)).toHaveTextContent('01 / 10');

    const active = container.querySelector(`.${prefix}-slide[data-state="active"]`);
    expect(active).not.toBeNull();
    expect(active).toHaveAttribute('data-slide-id', 'cover');

    expect(screen.getAllByText(noticePattern).length).toBeGreaterThan(0);
    expect(document.documentElement.getAttribute('data-theme')).toBe(mood);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('deep-links to the flow slide: the family renderer and its outline mirror are present', async () => {
    const { container } = renderLive(`/live/${id}?slide=2`);
    await screen.findByTestId(rootTestId, {}, { timeout: 15000 });

    expect(screen.getByTestId(`${rootTestId}-counter`)).toHaveTextContent('02 / 10');
    const active = container.querySelector(`.${prefix}-slide[data-state="active"]`);
    expect(active).toHaveAttribute('data-slide-id', 'flow-slide');

    const figure = screen.getByTestId(`dgm-${family}-flow`);
    expect(figure).toBeInTheDocument();
    // reduced motion (MotionProvider) reaches the diagram
    expect(figure).toHaveAttribute('data-reduced');
    // the grammar's textual mirror rides along
    expect(figure.querySelector('.dgm-outline')).not.toBeNull();
  });

  it('deep-links to the timeline slide and renders the family timeline', async () => {
    const { container } = renderLive(`/live/${id}?slide=9`);
    await screen.findByTestId(rootTestId, {}, { timeout: 15000 });

    const active = container.querySelector(`.${prefix}-slide[data-state="active"]`);
    expect(active).toHaveAttribute('data-slide-id', 'timeline-slide');
    expect(screen.getByTestId(`dgm-${family}-timeline`)).toBeInTheDocument();
  });
});
