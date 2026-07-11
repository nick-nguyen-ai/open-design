// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Link } from './Link.js';

afterEach(cleanup);

describe('Link', () => {
  it('renders an anchor with the given href and accessible name', () => {
    render(<Link href="/reports">Reports</Link>);
    const link = screen.getByRole('link', { name: 'Reports' });
    expect(link).toHaveAttribute('href', '/reports');
  });

  it('is keyboard-focusable and shows a focus-visible outline class', async () => {
    const user = userEvent.setup();
    render(<Link href="/reports">Reports</Link>);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveFocus();
    expect(screen.getByRole('link').className).toContain('focus-visible:outline');
  });

  it('external: adds target=_blank, safe rel, and an accessible "opens in new tab" cue', () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    const link = screen.getByRole('link', { name: /Example.*opens in new tab/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('non-external: does not set target or the external rel', () => {
    render(<Link href="/reports">Reports</Link>);
    const link = screen.getByRole('link', { name: 'Reports' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Link href="/reports">Reports</Link>
        <Link href="https://example.com" external>
          Example
        </Link>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
