/**
 * Initializes (and disposes) an ECharts SVG-renderer instance against a
 * container ref, keeping it in sync with `option`.
 *
 * Zero-size handling: `getBoundingClientRect()` reports an all-zero rect both
 * before a container has been laid out AND, unconditionally, in jsdom (no
 * layout engine). ECharts cannot init into a 0×0 box, so this hook DEFERS
 * init until the container has a non-zero size — a chart mounted inside a
 * container that starts collapsed (an inactive-but-kept-mounted Tabs panel, a
 * Drawer/Dialog whose content mounts before it is sized) must still render
 * once that container is revealed, even if `option` never changes. A
 * `ResizeObserver` on the container drives that: it initializes on the 0→
 * non-zero transition, and calls `.resize()` on every later size change.
 * Environments without `ResizeObserver` (jsdom) fall back to a `window`
 * resize listener and simply never paint if the box stays 0×0 — which is fine,
 * since tests assert DOM/data-table structure, not ECharts pixels.
 */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { echarts } from './echarts-core.js';
import type { ECharts } from './echarts-core.js';
import type { ChartOption } from './types.js';

function hasNonZeroSize(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export function useECharts(containerRef: RefObject<HTMLDivElement | null>, option: ChartOption): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let instance: ECharts | undefined;

    // Initialize on demand: only ever inits once, and only when the container
    // actually has a non-zero box. Returns whether an instance now exists.
    const ensureInitialized = (): boolean => {
      if (instance) return true;
      if (!hasNonZeroSize(container)) return false;
      instance = echarts.init(container, undefined, { renderer: 'svg' });
      instance.setOption(option, true);
      return true;
    };

    // Try immediately (the common case: container is already laid out).
    ensureInitialized();

    // A container that starts 0×0 must still init once it's revealed/sized;
    // later size changes just resize the existing instance.
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        const wasInitialized = instance !== undefined;
        if (ensureInitialized() && wasInitialized) instance?.resize();
      });
      observer.observe(container);
    }

    // Fallback for environments without ResizeObserver: viewport resizes still
    // reflow the container, so re-check size and (re)size accordingly.
    const handleWindowResize = (): void => {
      const wasInitialized = instance !== undefined;
      if (ensureInitialized() && wasInitialized) instance?.resize();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      instance?.dispose();
    };
  }, [containerRef, option]);
}
