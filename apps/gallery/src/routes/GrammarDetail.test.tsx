// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '../test/jest-dom-setup.js';
import { grammars } from '../data/registry.js';
import GrammarDetail from './GrammarDetail.js';

afterEach(cleanup);

function renderDetail(grammarId: string) {
  return render(
    <MemoryRouter initialEntries={[`/grammars/${grammarId}`]}>
      <Routes>
        <Route path="/grammars/:grammarId" element={<GrammarDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('GrammarDetail', () => {
  it('renders the specimen hero image', () => {
    const { container } = renderDetail('neon-circuit');
    expect(
      container.querySelector('img[src="/previews/grammar-neon-circuit.jpg"]'),
    ).not.toBeNull();
  });

  it('renders a sibling strip linking every other grammar, not itself', () => {
    renderDetail('neon-circuit');
    const strip = screen.getByRole('list', { name: /same design in other grammars/i });
    const links = strip.querySelectorAll('a');
    expect(links).toHaveLength(grammars.length - 1);
    expect(strip.querySelector('a[href="/grammars/neon-circuit"]')).toBeNull();
  });

  it('renders example templates as image cards linking to template detail', () => {
    renderDetail('neon-circuit');
    const grid = screen.getByRole('list', { name: /example templates/i });
    expect(grid.querySelector('a[href="/templates/deck-dgm-circuit"]')).not.toBeNull();
    expect(grid.querySelector('img[src="/previews/deck-dgm-circuit.jpg"]')).not.toBeNull();
  });
});
