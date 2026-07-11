import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * While `active`, marks every `document.body` child OTHER than the one
 * containing `exceptRef` as `inert` (and `aria-hidden`, for browsers/AT that
 * don't yet honour `inert`) so assistive tech and Tab both skip the
 * background app content behind an open Dialog/Drawer portal.
 */
export function useInertBackground(exceptRef: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const exceptNode = exceptRef.current;
    if (!exceptNode) return;

    const siblings = Array.from(document.body.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && !child.contains(exceptNode),
    );

    const restore = siblings.map((el) => ({
      el,
      hadInert: el.hasAttribute('inert'),
      ariaHidden: el.getAttribute('aria-hidden'),
    }));

    for (const el of siblings) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }

    return () => {
      for (const { el, hadInert, ariaHidden } of restore) {
        if (!hadInert) el.removeAttribute('inert');
        if (ariaHidden === null) el.removeAttribute('aria-hidden');
        else el.setAttribute('aria-hidden', ariaHidden);
      }
    };
  }, [active, exceptRef]);
}
