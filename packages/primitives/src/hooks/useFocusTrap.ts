import { useEffect } from 'react';
import type { RefObject } from 'react';
import { getFocusableElements } from './focusable.js';

/**
 * Traps Tab/Shift+Tab focus cycling within `containerRef` while `active`, and
 * moves initial focus into the container on activation (first focusable
 * descendant, or the container itself if none — the container must then
 * carry `tabIndex={-1}` so it's programmatically focusable).
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const focusable = getFocusableElements(container);
    const initial = focusable[0] ?? container;
    initial.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !container) return;
      const elements = getFocusableElements(container);
      if (elements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = elements[0]!;
      const last = elements[elements.length - 1]!;
      const current = document.activeElement;

      if (event.shiftKey) {
        if (current === first || !container.contains(current)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (current === last || !container.contains(current)) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef]);
}
