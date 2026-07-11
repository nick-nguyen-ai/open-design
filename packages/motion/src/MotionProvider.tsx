import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MotionContextValue {
  /** Explicit override from the nearest `MotionProvider` ancestor, if any. */
  override?: boolean;
}

const MotionContext = createContext<MotionContextValue>({});

export interface MotionProviderProps {
  /**
   * Force reduced motion on/off regardless of the system
   * `prefers-reduced-motion` media query — e.g. the gallery's reduced-motion
   * toggle. Leave `undefined` to defer entirely to the system preference.
   */
  reducedMotion?: boolean;
  children?: ReactNode;
}

/** Scopes an explicit reduced-motion override to its subtree. */
export function MotionProvider({ reducedMotion, children }: MotionProviderProps) {
  return (
    <MotionContext.Provider value={{ override: reducedMotion }}>{children}</MotionContext.Provider>
  );
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getSystemPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Resolves the EFFECTIVE reduced-motion preference for the calling
 * component: an explicit `MotionProvider` override wins; otherwise the
 * system `prefers-reduced-motion` media query decides.
 */
export function useMotionPreference(): { reduced: boolean } {
  const { override } = useContext(MotionContext);
  const [systemReduced, setSystemReduced] = useState(getSystemPreference);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    // The useState initializer above already read mql.matches synchronously
    // at mount, so this listener only needs to subscribe to future changes.
    const handleChange = (event: MediaQueryListEvent) => setSystemReduced(event.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return { reduced: override ?? systemReduced };
}
