/**
 * Initializes (and disposes) an ECharts SVG-renderer instance against a
 * container ref, keeping it in sync with `option`.
 *
 * Zero-size guard: `getBoundingClientRect()` reports an all-zero rect both
 * before a container has been laid out AND, unconditionally, in jsdom (no
 * layout engine). Rather than fight ECharts-in-jsdom — polyfilling
 * `ResizeObserver`/canvas, suppressing its console warnings about a 0×0
 * container — this hook simply never calls `echarts.init` for a zero-size
 * container. Component tests assert the figure's DOM structure, the
 * visually-hidden data-table equivalent, and (separately, DOM-free) the
 * `buildXxxOption` output; they never depend on ECharts having actually
 * painted anything.
 */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { echarts } from './echarts-core.js';
import type { ChartOption } from './types.js';

export function useECharts(containerRef: RefObject<HTMLDivElement | null>, option: ChartOption): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const instance = echarts.init(container, undefined, { renderer: 'svg' });
    instance.setOption(option, true);

    const handleResize = (): void => instance.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      instance.dispose();
    };
  }, [containerRef, option]);
}
