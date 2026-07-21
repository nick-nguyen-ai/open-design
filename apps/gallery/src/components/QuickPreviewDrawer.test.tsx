// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { SearchResult } from '@enterprise-design/search';
import '../test/jest-dom-setup.js';
import { documentById } from '../data/registry.js';
import { QuickPreviewDrawer } from './QuickPreviewDrawer.js';

afterEach(cleanup);

function resultFor(id: string): SearchResult {
  const doc = documentById.get(id);
  if (!doc) throw new Error(`no search document for ${id}`);
  return { ...doc, score: 0, matchedTerms: [], matchedFields: [] };
}

describe('QuickPreviewDrawer — grammar entity', () => {
  it('shows the grammar specimen in the top image slot', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <QuickPreviewDrawer result={resultFor('print-gazette')} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    expect(
      baseElement.querySelector('img[src="/previews/grammar-print-gazette.jpg"]'),
    ).not.toBeNull();
  });
});
