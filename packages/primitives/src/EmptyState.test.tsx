// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { EmptyState } from './EmptyState.js';
import { Button } from './Button.js';

afterEach(cleanup);

describe('EmptyState', () => {
  it('renders as a role=status region containing the title and description', () => {
    render(<EmptyState title="No results" description="Try a different search term." />);
    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('No results');
    expect(region).toHaveTextContent('Try a different search term.');
  });

  it('renders an optional action', () => {
    render(<EmptyState title="No results" action={<Button>Clear filters</Button>} />);
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('icon slot is decorative (aria-hidden)', () => {
    render(<EmptyState title="No results" icon={<span data-testid="icon">i</span>} />);
    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <EmptyState
        title="No results"
        description="Try a different search term."
        action={<Button>Clear filters</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
