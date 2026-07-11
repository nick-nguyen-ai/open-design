// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { useRef } from 'react';
import '../test/jest-dom-setup.js';
import type { ChartOption } from './types.js';

// Mock the module-registration point so we can spy on the init path without
// ECharts actually painting into jsdom (which has no layout engine).
// `vi.hoisted` is required because `vi.mock`'s factory is hoisted above every
// import — a plain top-level const would not yet be initialized when it runs.
const { initMock } = vi.hoisted(() => ({ initMock: vi.fn() }));
vi.mock('./echarts-core.js', () => ({ echarts: { init: initMock } }));

import { useECharts } from './useECharts.js';

// A controllable size the stubbed getBoundingClientRect reports for the container.
let containerSize = { width: 0, height: 0 };
// The most-recently-constructed ResizeObserver's callback, so a test can fire it.
let resizeCallback: ResizeObserverCallback | undefined;
const observeSpy = vi.fn();
const disconnectSpy = vi.fn();

function makeInstance() {
  return { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
}

function Harness({ option }: { option: ChartOption }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useECharts(ref, option);
  return <div data-testid="chart-container" ref={ref} />;
}

beforeEach(() => {
  containerSize = { width: 0, height: 0 };
  resizeCallback = undefined;
  initMock.mockReset();
  initMock.mockImplementation(() => makeInstance());
  observeSpy.mockClear();
  disconnectSpy.mockClear();

  class FakeResizeObserver {
    constructor(cb: ResizeObserverCallback) {
      resizeCallback = cb;
    }
    observe = observeSpy;
    unobserve = vi.fn();
    disconnect = disconnectSpy;
  }
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);

  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ): DOMRect {
    return {
      width: containerSize.width,
      height: containerSize.height,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: containerSize.width,
      bottom: containerSize.height,
      toJSON: () => ({}),
    } as DOMRect;
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const OPTION = {} as ChartOption;

describe('useECharts', () => {
  it('does NOT init when the container mounts at 0×0, but observes it for later sizing', () => {
    render(<Harness option={OPTION} />);
    expect(initMock).not.toHaveBeenCalled();
    // The container is still observed, so a later size change can drive init.
    expect(observeSpy).toHaveBeenCalledTimes(1);
  });

  it('inits once the container transitions 0→non-zero (ResizeObserver fires with a real size)', () => {
    render(<Harness option={OPTION} />);
    expect(initMock).not.toHaveBeenCalled();

    // Simulate the container becoming visible/sized, then the RO firing.
    containerSize = { width: 480, height: 280 };
    resizeCallback?.([], {} as ResizeObserver);

    expect(initMock).toHaveBeenCalledTimes(1);
  });

  it('does not double-init on subsequent resizes — it resizes the existing instance instead', () => {
    render(<Harness option={OPTION} />);
    containerSize = { width: 480, height: 280 };
    resizeCallback?.([], {} as ResizeObserver);
    expect(initMock).toHaveBeenCalledTimes(1);
    const instance = initMock.mock.results[0]?.value as ReturnType<typeof makeInstance>;

    // A later resize (still non-zero) must call .resize(), not init again.
    containerSize = { width: 600, height: 300 };
    resizeCallback?.([], {} as ResizeObserver);
    expect(initMock).toHaveBeenCalledTimes(1);
    expect(instance.resize).toHaveBeenCalledTimes(1);
  });

  it('inits immediately when the container already has a non-zero size at mount', () => {
    containerSize = { width: 480, height: 280 };
    render(<Harness option={OPTION} />);
    expect(initMock).toHaveBeenCalledTimes(1);
  });

  it('disconnects the observer and disposes the instance on unmount', () => {
    containerSize = { width: 480, height: 280 };
    const { unmount } = render(<Harness option={OPTION} />);
    const instance = initMock.mock.results[0]?.value as ReturnType<typeof makeInstance>;
    unmount();
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
    expect(instance.dispose).toHaveBeenCalledTimes(1);
  });
});
