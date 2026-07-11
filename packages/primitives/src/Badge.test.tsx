// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Badge, Tag } from './Badge.js';

afterEach(cleanup);

describe('Badge', () => {
  it('renders its text content as the accessible name', () => {
    render(<Badge>Beta</Badge>);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it.each(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const)(
    'tone=%s has no axe violations',
    async (tone) => {
      const { container } = render(<Badge tone={tone}>Status</Badge>);
      expect(await axe(container)).toHaveNoViolations();
    },
  );

  it('Tag is the same component as Badge, re-exported', () => {
    expect(Tag).toBe(Badge);
  });
});
