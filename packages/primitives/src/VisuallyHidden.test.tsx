// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { VisuallyHidden } from './VisuallyHidden.js';

afterEach(cleanup);

describe('VisuallyHidden', () => {
  it('renders its content, still queryable/accessible in the DOM', () => {
    render(<VisuallyHidden>Opens in new tab</VisuallyHidden>);
    expect(screen.getByText('Opens in new tab')).toBeInTheDocument();
  });

  it('applies the sr-only utility class', () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>);
    expect(screen.getByText('Hidden').className).toContain('sr-only');
  });

  it('contributes to an ancestor button/link accessible name', () => {
    render(
      <button>
        <span aria-hidden="true">×</span>
        <VisuallyHidden>Close</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
