// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Button } from './Button.js';

afterEach(cleanup);

describe('Button', () => {
  it('renders a native button with an accessible name from its children', () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('fires onClick on both mouse click and keyboard activation (Enter/Space)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    const button = screen.getByRole('button', { name: 'Go' });

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    button.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);

    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('is keyboard-reachable via Tab and shows a focus-visible outline class', async () => {
    const user = userEvent.setup();
    render(<Button>Focus me</Button>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Focus me' }).className).toContain('focus-visible:outline');
  });

  it('disabled: is not operable, not reachable by Tab, and exposes aria-disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button>Before</Button>
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
        <Button>After</Button>
      </>,
    );
    const disabledButton = screen.getByRole('button', { name: 'Disabled' });
    expect(disabledButton).toBeDisabled();
    expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

    await user.click(screen.getByRole('button', { name: 'Before' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'variant=%s has no axe violations',
    async (variant) => {
      const { container } = render(<Button variant={variant}>Action</Button>);
      expect(await axe(container)).toHaveNoViolations();
    },
  );

  it('renders leading/trailing icon slots as decorative (aria-hidden)', () => {
    render(
      <Button leadingIcon={<span data-testid="leading">i</span>} trailingIcon={<span data-testid="trailing">i</span>}>
        Icons
      </Button>,
    );
    expect(screen.getByTestId('leading').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByTestId('trailing').closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
