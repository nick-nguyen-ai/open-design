// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { ErrorState } from './ErrorState.js';

afterEach(cleanup);

describe('ErrorState', () => {
  it('renders as a role=alert region with a default title', () => {
    render(<ErrorState />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('accepts a custom title/description', () => {
    render(<ErrorState title="Failed to load report" description="Check your connection." />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Failed to load report');
    expect(alert).toHaveTextContent('Check your connection.');
  });

  it('retry action is a real, keyboard-operable button that calls onRetry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} retryLabel="Reload" />);
    const button = screen.getByRole('button', { name: 'Reload' });
    await user.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('omits the retry button when onRetry is not provided', () => {
    render(<ErrorState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ErrorState title="Failed to load report" description="Check your connection." onRetry={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
