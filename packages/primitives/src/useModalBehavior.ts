import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useFocusTrap } from './hooks/useFocusTrap.js';
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
 *
 * ORDERING CONTRACT (the subtle part). Two invariants pull in opposite
 * directions across mount vs unmount:
 *   1. On OPEN, the trigger must be captured (`document.activeElement`) BEFORE
 *      the focus trap moves focus into the dialog — else we'd "restore" focus
 *      to a dialog descendant instead of the real trigger.
 *   2. On CLOSE, `inert`/`aria-hidden` must be removed from the background
 *      BEFORE focus is restored to the trigger — because in real browsers
 *      `element.focus()` on a node inside an `inert` subtree is a NO-OP, so
 *      restoring focus while the trigger's ancestor is still `inert` silently
 *      drops focus to `<body>`. (jsdom doesn't enforce `inert`, so this can't
 *      be caught by a focus assertion alone — see the ordering-spy regression
 *      test in Dialog.test.tsx / Drawer.test.tsx.)
 *
 * A single `useRestoreFocus`-style hook (capture in setup, restore in cleanup)
 * can't satisfy both: its declaration position fixes setup AND cleanup order
 * together. So capture and restore are DECOUPLED here — capture runs in an
 * early effect (before `useFocusTrap`), and restore runs in the cleanup of a
 * LATE effect declared after `useInertBackground`, so React fires the inert
 * cleanup first and the focus restore last (React runs effect cleanups in
 * declaration order).
 */
export function useModalBehavior({ open, onClose, containerRef }: UseModalBehaviorOptions): void {
  const triggerRef = useRef<HTMLElement | null>(null);

  // (1) Capture the trigger BEFORE the focus trap runs. Declared first, no
  // cleanup — restoring focus is orchestrated by the late effect below.
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
  }, [open]);

  useFocusTrap(containerRef, open);
  useScrollLock(open);
  useInertBackground(containerRef, open);

  // (2) Restore focus on close, in the cleanup of an effect declared AFTER
  // useInertBackground — so the inert/aria-hidden removal cleanup has already
  // run and the trigger is focusable again by the time we call `.focus()`.
  useEffect(() => {
    if (!open) return;
    return () => {
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    };
  }, [open]);

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
