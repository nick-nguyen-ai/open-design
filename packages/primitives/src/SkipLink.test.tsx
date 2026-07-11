// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { SkipLink } from './SkipLink.js';

afterEach(cleanup);

describe('SkipLink', () => {
  it('links to the given target id', () => {
    render(
      <>
        <SkipLink targetId="main-content" />
        <main id="main-content">Main content</main>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('is the first Tab stop and is reachable/operable via keyboard', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink targetId="main-content" />
        <a href="/other">Other link</a>
        <main id="main-content">Main content</main>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus();
  });

  it('is visually hidden until focused (sr-only, revealed by focus:not-sr-only)', () => {
    render(<SkipLink targetId="main-content" />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('sr-only');
    expect(link.className).toContain('focus:not-sr-only');
  });

  it('has no axe violations', async () => {
    const { container } = render(<SkipLink targetId="main-content" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
