// @vitest-environment jsdom
/**
 * Task 13 — specification framing: the 45 non-live template detail pages
 * declare themselves catalogue specifications and point at the nearest live
 * world (their own surface's), so nobody expects liveness and hits a flat
 * page. Live templates keep their primary "Open live template" action.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import '../test/jest-dom-setup.js';
import TemplateDetail from './TemplateDetail.js';

function renderDetail(experienceId: string) {
  window.localStorage.clear();
  return render(
    <MotionProvider reducedMotion>
      <MemoryRouter initialEntries={[`/templates/${experienceId}`]}>
        <Routes>
          <Route path="templates/:experienceId" element={<TemplateDetail />} />
        </Routes>
      </MemoryRouter>
    </MotionProvider>,
  );
}

afterEach(cleanup);

describe('TemplateDetail — specification framing (task 13)', () => {
  it('frames a non-live dashboard as a specification linking to the live cockpit', () => {
    renderDetail('db-ai-risk-command-centre');
    const framing = screen.getByTestId('spec-framing');
    expect(framing).toHaveTextContent(/Catalogue specification — live build pending/i);
    const link = screen.getByRole('link', { name: /see a live template/i });
    expect(link).toHaveAttribute('href', '/live/db-model-monitoring-cockpit');
  });

  // All ten slide decks are live after task 17, so the non-live specification
  // example is an explainer (its surface's live world is the Drawing Office).
  it('frames a non-live explainer as a specification linking to the live drawing office', () => {
    renderDetail('exp-incident-postmortem');
    expect(screen.getByTestId('spec-framing')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /see a live template/i })).toHaveAttribute(
      'href',
      '/live/exp-system-architecture',
    );
  });

  it('a live deck from the task-17 batch carries the primary live action', () => {
    renderDetail('deck-product-vision');
    expect(screen.queryByTestId('spec-framing')).toBeNull();
    expect(screen.getByRole('link', { name: /open live template/i })).toHaveAttribute(
      'href',
      '/live/deck-product-vision',
    );
  });

  it('live templates carry the primary live action and no specification framing', () => {
    renderDetail('proj-ai-model-validation-hub');
    expect(screen.queryByTestId('spec-framing')).toBeNull();
    expect(screen.getByRole('link', { name: /open live template/i })).toHaveAttribute(
      'href',
      '/live/proj-ai-model-validation-hub',
    );
  });
});
