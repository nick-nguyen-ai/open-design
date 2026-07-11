// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Skeleton } from './Skeleton.js';

function stubMatchMedia() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Skeleton', () => {
  it('is hidden from assistive tech (role=presentation, aria-hidden)', () => {
    stubMatchMedia();
    render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveAttribute('role', 'presentation');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the shimmer animation class when motion is not reduced', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={false}>
        <Skeleton data-testid="skeleton" />
      </MotionProvider>,
    );
    expect(screen.getByTestId('skeleton').className).toContain('animate-skeleton-shimmer');
  });

  it('omits the shimmer animation class when motion is reduced', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <Skeleton data-testid="skeleton" />
      </MotionProvider>,
    );
    expect(screen.getByTestId('skeleton').className).not.toContain('animate-skeleton-shimmer');
  });

  it('has no axe violations', async () => {
    stubMatchMedia();
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
