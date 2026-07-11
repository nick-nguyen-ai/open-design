// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MotionProvider } from '../MotionProvider.js';
import { DATA_INK_DEFAULT_ORDER, DataInkDraw } from './DataInkDraw.js';
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

const groups = DATA_INK_DEFAULT_ORDER.map((id) => ({ id, content: <span>{id}</span> }));

function delayAndDuration(id: string) {
  const el = screen.getByTestId(`data-ink-draw-group-${id}`);
  return {
    delayMs: Number(el.getAttribute('data-delay-ms')),
    durationMs: Number(el.getAttribute('data-duration-ms')),
  };
}

describe('DataInkDraw — full motion', () => {
  it('draws axes, then series, then annotation, in that semantic order, within the 1200ms cap', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={false}>
        <DataInkDraw groups={groups} />
      </MotionProvider>,
    );

    const container = screen
      .getByTestId('data-ink-draw-group-axes')
      .closest('[data-motion-sequence="data-ink-draw"]');
    expect(container?.getAttribute('data-motion-variant')).toBe('full');

    const axes = delayAndDuration('axes');
    const series = delayAndDuration('series');
    const annotation = delayAndDuration('annotation');

    expect(axes.delayMs).toBe(0);
    expect(series.delayMs).toBeGreaterThan(axes.delayMs);
    expect(annotation.delayMs).toBeGreaterThan(series.delayMs);

    const children = Array.from(container?.children ?? []);
    expect(children).toEqual([
      screen.getByTestId('data-ink-draw-group-axes'),
      screen.getByTestId('data-ink-draw-group-series'),
      screen.getByTestId('data-ink-draw-group-annotation'),
    ]);

    const total = Math.max(...[axes, series, annotation].map((s) => s.delayMs + s.durationMs));
    expect(total).toBeLessThanOrEqual(SIGNATURE_SEQUENCE_CAP_MS);
  });

  it('renders as SVG <g> wrappers when as="g", for real chart usage', () => {
    stubMatchMedia();
    const { container } = render(
      <MotionProvider reducedMotion={false}>
        <svg>
          <DataInkDraw groups={groups} as="g" />
        </svg>
      </MotionProvider>,
    );
    const outer = container.querySelector('[data-motion-sequence="data-ink-draw"]');
    expect(outer?.tagName.toLowerCase()).toBe('g');
    const axesGroup = screen.getByTestId('data-ink-draw-group-axes');
    expect(axesGroup.tagName.toLowerCase()).toBe('g');
  });
});

describe('DataInkDraw — reduced motion', () => {
  it('preserves axes -> series -> annotation order as opacity steps, capped at 400ms', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <DataInkDraw groups={groups} />
      </MotionProvider>,
    );

    const container = screen
      .getByTestId('data-ink-draw-group-axes')
      .closest('[data-motion-sequence="data-ink-draw"]');
    expect(container?.getAttribute('data-motion-variant')).toBe('reduced');

    const axes = delayAndDuration('axes');
    const series = delayAndDuration('series');
    const annotation = delayAndDuration('annotation');

    expect(axes.delayMs).toBe(0);
    expect(series.delayMs).toBeGreaterThan(axes.delayMs);
    expect(annotation.delayMs).toBeGreaterThan(series.delayMs);

    const total = Math.max(...[axes, series, annotation].map((s) => s.delayMs + s.durationMs));
    expect(total).toBeLessThanOrEqual(REDUCED_MOTION_CAP_MS);
  });
});
