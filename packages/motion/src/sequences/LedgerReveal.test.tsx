// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MotionProvider } from '../MotionProvider.js';
import { LedgerReveal } from './LedgerReveal.js';
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
  { id: 'revenue', content: '$4.2M' },
  { id: 'margin', content: '18.4%' },
  { id: 'headcount', content: '312' },
];

function delayAndDuration(id: string) {
  const el = screen.getByTestId(`ledger-reveal-item-${id}`);
  return {
    delayMs: Number(el.getAttribute('data-delay-ms')),
    durationMs: Number(el.getAttribute('data-duration-ms')),
  };
}

describe('LedgerReveal — full motion', () => {
  it('renders items in reading order with a single-settle, staggered timeline', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={false}>
        <LedgerReveal items={items} />
      </MotionProvider>,
    );

    const container = screen.getByText('$4.2M').closest('[data-motion-sequence="ledger-reveal"]');
    expect(container?.getAttribute('data-motion-variant')).toBe('full');

    // DOM order matches input (reading) order.
    const renderedIds = items.map((i) => screen.getByTestId(`ledger-reveal-item-${i.id}`));
    const containerChildren = Array.from(container?.children ?? []);
    expect(containerChildren).toEqual(renderedIds);

    const revenue = delayAndDuration('revenue');
    const margin = delayAndDuration('margin');
    const headcount = delayAndDuration('headcount');

    expect(revenue.delayMs).toBe(0);
    expect(margin.delayMs).toBeGreaterThan(revenue.delayMs);
    expect(headcount.delayMs).toBeGreaterThan(margin.delayMs);

    const total = Math.max(...[revenue, margin, headcount].map((s) => s.delayMs + s.durationMs));
    expect(total).toBeLessThanOrEqual(SIGNATURE_SEQUENCE_CAP_MS);
  });
});

describe('LedgerReveal — reduced motion', () => {
  it('preserves the same reading order and caps total duration at 400ms', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <LedgerReveal items={items} />
      </MotionProvider>,
    );

    const container = screen.getByText('$4.2M').closest('[data-motion-sequence="ledger-reveal"]');
    expect(container?.getAttribute('data-motion-variant')).toBe('reduced');

    const containerChildren = Array.from(container?.children ?? []);
    const renderedIds = items.map((i) => screen.getByTestId(`ledger-reveal-item-${i.id}`));
    expect(containerChildren).toEqual(renderedIds);

    const revenue = delayAndDuration('revenue');
    const margin = delayAndDuration('margin');
    const headcount = delayAndDuration('headcount');

    expect(revenue.delayMs).toBe(0);
    expect(margin.delayMs).toBeGreaterThan(revenue.delayMs);
    expect(headcount.delayMs).toBeGreaterThan(margin.delayMs);

    const total = Math.max(...[revenue, margin, headcount].map((s) => s.delayMs + s.durationMs));
    expect(total).toBeLessThanOrEqual(REDUCED_MOTION_CAP_MS);
  });
});
