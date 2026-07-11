// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { MotionProvider, useMotionPreference } from './MotionProvider.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

interface FakeMediaQueryList {
  matches: boolean;
  addEventListener: (type: 'change', listener: (event: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: 'change', listener: (event: MediaQueryListEvent) => void) => void;
  dispatch: (matches: boolean) => void;
}

function stubMatchMedia(initialMatches: boolean): FakeMediaQueryList {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql: FakeMediaQueryList = {
    matches: initialMatches,
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
    dispatch: (matches) => {
      mql.matches = matches;
      for (const listener of listeners) listener({ matches } as MediaQueryListEvent);
    },
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue(mql as unknown as MediaQueryList) as typeof window.matchMedia,
  );
  return mql;
}

describe('useMotionPreference', () => {
  it('is false when prefers-reduced-motion does not match and there is no override', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useMotionPreference());
    expect(result.current.reduced).toBe(false);
  });

  it('is true when the prefers-reduced-motion media query matches', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMotionPreference());
    expect(result.current.reduced).toBe(true);
  });

  it('follows live changes to the media query', () => {
    const mql = stubMatchMedia(false);
    const { result } = renderHook(() => useMotionPreference());
    expect(result.current.reduced).toBe(false);
    act(() => mql.dispatch(true));
    expect(result.current.reduced).toBe(true);
  });

  it('is true when MotionProvider forces reducedMotion, even if the media query does not match', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useMotionPreference(), {
      wrapper: ({ children }) => <MotionProvider reducedMotion={true}>{children}</MotionProvider>,
    });
    expect(result.current.reduced).toBe(true);
  });

  it('is false when MotionProvider forces reducedMotion off, even if the media query matches', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMotionPreference(), {
      wrapper: ({ children }) => <MotionProvider reducedMotion={false}>{children}</MotionProvider>,
    });
    expect(result.current.reduced).toBe(false);
  });

  it('defers to the system preference when MotionProvider does not set an override', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMotionPreference(), {
      wrapper: ({ children }) => <MotionProvider>{children}</MotionProvider>,
    });
    expect(result.current.reduced).toBe(true);
  });

  it('scopes the override to the provider subtree via real component rendering', () => {
    stubMatchMedia(false);
    function Probe() {
      const { reduced } = useMotionPreference();
      return <span data-testid="reduced">{String(reduced)}</span>;
    }
    render(
      <MotionProvider reducedMotion={true}>
        <Probe />
      </MotionProvider>,
    );
    expect(screen.getByTestId('reduced').textContent).toBe('true');
  });
});
