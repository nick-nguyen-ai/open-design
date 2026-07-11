import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useFocusTrap } from './hooks/useFocusTrap.js';
import { useRestoreFocus } from './hooks/useRestoreFocus.js';
import { useScrollLock } from './hooks/useScrollLock.js';
import { useInertBackground } from './hooks/useInertBackground.js';

export interface UseModalBehaviorOptions {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
}

/**
 * The shared a11y contract for Dialog and Drawer: focus moves into the
 * container on open and is trapped there, Escape closes, focus returns to
 * the trigger on close, background scroll is locked, and everything outside
 * the container is `inert`/`aria-hidden` while open.
 */
export function useModalBehavior({ open, onClose, containerRef }: UseModalBehaviorOptions): void {
  useRestoreFocus(open);
  useFocusTrap(containerRef, open);
  useScrollLock(open);
  useInertBackground(containerRef, open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);
}
