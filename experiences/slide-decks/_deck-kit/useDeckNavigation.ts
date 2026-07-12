/**
 * Shared deck navigation — the mechanics behind every live slide-deck world
 * (extracted once three decks past "The Morning Board Pack" wanted the exact
 * same keyboard / `?slide=` / leaving-slide behaviour). Deliberately small:
 * it owns ONLY the universal contract (←/→/Home/End, deep-link, the leaving
 * index, the counter string). Each deck keeps its own chrome, its own bespoke
 * keys, and its own rendering — this hook never dictates how a slide looks.
 *
 * The URL search param is the single source of truth; `activeNumberRef` tracks
 * it between commits so a burst of key presses never acts on a stale value.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DeckNavigation {
  /** 0-based index of the active slide. */
  activeIndex: number;
  /** 1-based number of the active slide. */
  activeNumber: number;
  /** The slide currently animating out (null under reduced motion or when idle). */
  leavingIndex: number | null;
  /** Navigate by absolute 1-based number or a function of the current number. */
  goTo: (to: number | ((current: number) => number)) => void;
  /** Zero-padded "03 / 10" counter string. */
  counter: string;
}

export interface UseDeckNavigationOptions {
  /** When true, slide turns collapse to stepped opacity: no leaving pass. */
  reduced: boolean;
  /** How long the leaving slide is retained for its exit animation. */
  leaveMs?: number;
}

function clampSlide(n: number, count: number): number {
  if (Number.isNaN(n)) return 1;
  return Math.min(Math.max(Math.trunc(n), 1), count);
}

export function useDeckNavigation(
  slideCount: number,
  { reduced, leaveMs = 420 }: UseDeckNavigationOptions,
): DeckNavigation {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeIndex = clampSlide(Number(searchParams.get('slide') ?? '1'), slideCount) - 1;
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const activeNumberRef = useRef(activeIndex + 1);

  useEffect(() => {
    activeNumberRef.current = activeIndex + 1;
  }, [activeIndex]);

  const goTo = useCallback(
    (to: number | ((current: number) => number)) => {
      const current = activeNumberRef.current;
      const next = clampSlide(typeof to === 'function' ? to(current) : to, slideCount);
      if (next === current) return;
      if (!reduced) {
        setLeavingIndex(current - 1);
        if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
        leaveTimer.current = window.setTimeout(() => setLeavingIndex(null), leaveMs);
      }
      activeNumberRef.current = next;
      setSearchParams({ slide: String(next) }, { replace: true });
    },
    [reduced, leaveMs, slideCount, setSearchParams],
  );

  useEffect(
    () => () => {
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault();
          goTo((current) => current + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          goTo((current) => current - 1);
          break;
        case 'Home':
          event.preventDefault();
          goTo(1);
          break;
        case 'End':
          event.preventDefault();
          goTo(slideCount);
          break;
        default:
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, slideCount]);

  const counter = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slideCount).padStart(2, '0')}`;

  return { activeIndex, activeNumber: activeIndex + 1, leavingIndex, goTo, counter };
}
