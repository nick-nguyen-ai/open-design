// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MotionProvider } from '../MotionProvider.js';
import { HorizonSweep } from './HorizonSweep.js';
import { REDUCED_MOTION_CAP_MS, SIGNATURE_SEQUENCE_CAP_MS } from '../adapter.js';

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

const items = [
  { id: 'headline', content: 'Q3 performance' },
  { id: 'subhead', content: 'Ahead of plan' },
];

function delayAndDuration(testId: string) {
  const el = screen.getByTestId(testId);
  return {
    delayMs: Number(el.getAttribute('data-delay-ms')),
    durationMs: Number(el.getAttribute('data-duration-ms')),
  };
}

describe('HorizonSweep — full motion', () => {
  it('draws the baseline first, then registers content onto it in order, within the 1200ms cap', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={false}>
        <HorizonSweep items={items} />
      </MotionProvider>,
    );

    const container = screen
      .getByTestId('horizon-sweep-baseline')
      .closest('[data-motion-sequence="horizon-sweep"]');
    expect(container?.getAttribute('data-motion-variant')).toBe('full');

    const baseline = delayAndDuration('horizon-sweep-baseline');
    const headline = delayAndDuration('horizon-sweep-item-headline');
    const subhead = delayAndDuration('horizon-sweep-item-subhead');

    // Baseline starts first, at t=0.
    expect(baseline.delayMs).toBe(0);
    // Content registers only once the baseline has finished drawing.
    expect(headline.delayMs).toBeGreaterThanOrEqual(baseline.delayMs + baseline.durationMs);
    // Content itself stays in semantic (reading) order.
    expect(subhead.delayMs).toBeGreaterThan(headline.delayMs);

    // DOM order: baseline node precedes content nodes.
    const children = Array.from(container?.children ?? []);
    expect(children[0]).toBe(screen.getByTestId('horizon-sweep-baseline'));
    expect(children[1]).toBe(screen.getByTestId('horizon-sweep-item-headline'));
    expect(children[2]).toBe(screen.getByTestId('horizon-sweep-item-subhead'));

    const total = Math.max(
      baseline.delayMs + baseline.durationMs,
      headline.delayMs + headline.durationMs,
      subhead.delayMs + subhead.durationMs,
    );
    expect(total).toBeLessThanOrEqual(SIGNATURE_SEQUENCE_CAP_MS);
  });
});

describe('HorizonSweep — reduced motion', () => {
  it('preserves baseline-then-content order as opacity steps, capped at 400ms', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <HorizonSweep items={items} />
      </MotionProvider>,
    );

    const container = screen
      .getByTestId('horizon-sweep-baseline')
      .closest('[data-motion-sequence="horizon-sweep"]');
    expect(container?.getAttribute('data-motion-variant')).toBe('reduced');

    const baseline = delayAndDuration('horizon-sweep-baseline');
    const headline = delayAndDuration('horizon-sweep-item-headline');
    const subhead = delayAndDuration('horizon-sweep-item-subhead');

    expect(baseline.delayMs).toBe(0);
    expect(headline.delayMs).toBeGreaterThanOrEqual(baseline.delayMs + baseline.durationMs);
    expect(subhead.delayMs).toBeGreaterThan(headline.delayMs);

    const total = Math.max(
      baseline.delayMs + baseline.durationMs,
      headline.delayMs + headline.durationMs,
      subhead.delayMs + subhead.durationMs,
    );
    expect(total).toBeLessThanOrEqual(REDUCED_MOTION_CAP_MS);
  });
});
