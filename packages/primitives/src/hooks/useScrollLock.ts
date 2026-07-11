import { useEffect } from 'react';

/** Locks `document.body` scrolling while `active`, restoring the prior value on cleanup. */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
