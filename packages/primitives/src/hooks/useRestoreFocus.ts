import { useEffect, useRef } from 'react';

/**
 * Captures whatever element had focus the moment `active` becomes `true`,
 * and restores focus to it the moment `active` becomes `false` again (or the
 * consuming component unmounts while still active). Used by Dialog/Drawer so
 * closing returns focus to the trigger that opened them.
 */
export function useRestoreFocus(active: boolean): void {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    return () => {
      const toRestore = previouslyFocused.current;
      if (toRestore && typeof toRestore.focus === 'function') {
        toRestore.focus();
      }
    };
  }, [active]);
}
