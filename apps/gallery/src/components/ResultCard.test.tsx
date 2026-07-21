// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { SearchResult } from '@enterprise-design/search';
import '../test/jest-dom-setup.js';
import { documentById } from '../data/registry.js';
import { ResultCard } from './ResultCard.js';

afterEach(cleanup);

function resultFor(id: string): SearchResult {
  const doc = documentById.get(id);
  if (!doc) throw new Error(`no search document for ${id}`);
  return { ...doc, score: 0, matchedTerms: [], matchedFields: [] };
}

function renderCard(id: string) {
  return render(
    <MemoryRouter>
      <ResultCard result={resultFor(id)} onOpen={vi.fn()} />
    </MemoryRouter>,
  );
}

describe('ResultCard — grammar entity', () => {
  it('renders the grammar specimen image in the preview frame', () => {
    const { container } = renderCard('neon-circuit');
    const img = container.querySelector('img[src="/previews/grammar-neon-circuit.jpg"]');
    expect(img).not.toBeNull();
  });

  it('counts example templates in the footer instead of the static label', () => {
    renderCard('executive-editorial');
    expect(screen.getByText(/example templates/)).toBeInTheDocument();
    expect(screen.queryByText('Design grammar')).not.toBeInTheDocument();
  });
});
