// @vitest-environment jsdom
/**
 * Template detail actions — with all 65 worlds live, no detail page frames
 * itself as a pending catalogue specification any more: every template
 * carries the primary "Open live template" action pointing at its own
 * /live route. (TemplateDetail keeps the specification-framing branch for
 * any future spec-only addition; these tests lock that it never renders
 * for the shipped collection.)
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

/** One world per surface, drawn from the formerly spec-only set. */
const NEWLY_LIVE = [
  'db-ai-risk-command-centre',
  'exp-incident-postmortem',
  'proj-vendor-assessment',
] as const;

describe('TemplateDetail — live actions across the full collection', () => {
  it.each(NEWLY_LIVE)('"%s" carries the primary live action and no specification framing', (id) => {
    renderDetail(id);
    expect(screen.queryByTestId('spec-framing')).toBeNull();
    expect(screen.getByRole('link', { name: /open live template/i })).toHaveAttribute(
      'href',
      `/live/${id}`,
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
