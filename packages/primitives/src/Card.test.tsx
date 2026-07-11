// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Card } from './Card.js';

afterEach(cleanup);

describe('Card', () => {
  it('static (no href/onClick): renders a plain, non-interactive div', () => {
    render(<Card data-testid="card">Static content</Card>);
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('href: renders a real anchor, reachable and operable via keyboard, no nested interactive', async () => {
    const user = userEvent.setup();
    render(<Card href="/reports/42">Q3 report</Card>);
    const link = screen.getByRole('link', { name: 'Q3 report' });
    expect(link).toHaveAttribute('href', '/reports/42');
    await user.tab();
    expect(link).toHaveFocus();
  });

  it('onClick (no href): renders a real button, operable with Enter/Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Open filters</Card>);
    const button = screen.getByRole('button', { name: 'Open filters' });
    button.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('has no axe violations in both static and interactive form', async () => {
    const { container: staticContainer } = render(<Card>Static</Card>);
    expect(await axe(staticContainer)).toHaveNoViolations();

    const { container: linkContainer } = render(<Card href="/x">Linked</Card>);
    expect(await axe(linkContainer)).toHaveNoViolations();
  });
});
