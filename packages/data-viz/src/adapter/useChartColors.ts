/**
 * Reactive wrapper around the pure `resolveChartColors`: re-resolves the
 * palette whenever the document's theme attributes change (the mechanism
 * `@enterprise-design/themes` uses to swap `[data-theme]`), so a chart
 * mounted before a theme switch still re-colours after one, with no parent
 * re-render required to trigger it.
 */
import { useEffect, useMemo, useState } from 'react';
import { resolveChartColors } from './chartColors.js';
import type { ChartColorScale } from './chartColors.js';

export function useChartColors(scale: ChartColorScale): string[] {
  // `tick` exists only to invalidate the memo below when the external DOM
  // mutation observer fires — the effect SUBSCRIBES to an external system and
  // calls setState from its callback (the recommended pattern), rather than
  // computing colours (a pure function of `scale`) inside the effect body.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
    const observer = new MutationObserver(() => setTick((t) => t + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, []);

  // `tick` is a deliberate invalidation key, not a data dependency the memo
  // body reads — it forces a recompute when the external theme mutation fires.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => resolveChartColors(scale), [scale, tick]);
}
