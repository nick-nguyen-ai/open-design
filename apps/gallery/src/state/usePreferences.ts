/**
 * App-level presentation preferences: colour theme and reduced-motion.
 *
 * - Theme defaults to the system `prefers-color-scheme`, is user-overridable,
 *   persists in localStorage, and is applied as `data-theme` on `<html>` (the
 *   attribute the themes package keys its dark layer off).
 * - Reduced motion is tri-state: `'system'` defers to the OS media query
 *   (passed as `undefined` to `MotionProvider`); an explicit boolean forces it.
 */
import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage } from './safeStorage.js';

export type ThemeChoice = 'light' | 'dark';
export type MotionChoice = 'system' | 'reduced' | 'full';

const THEME_KEY = 'gallery.theme';
const MOTION_KEY = 'gallery.motion';

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

function initialTheme(): ThemeChoice {
  const stored = readStorage(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return systemPrefersDark() ? 'dark' : 'light';
}

function initialMotion(): MotionChoice {
  const stored = readStorage(MOTION_KEY);
  if (stored === 'reduced' || stored === 'full' || stored === 'system') return stored;
  return 'system';
}

export interface Preferences {
  theme: ThemeChoice;
  toggleTheme: () => void;
  motion: MotionChoice;
  /** Resolved value for `MotionProvider.reducedMotion` (`undefined` = defer to OS). */
  reducedMotion: boolean | undefined;
  toggleReducedMotion: () => void;
}

export function usePreferences(): Preferences {
  const [theme, setTheme] = useState<ThemeChoice>(initialTheme);
  const [motion, setMotion] = useState<MotionChoice>(initialMotion);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeStorage(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    writeStorage(MOTION_KEY, motion);
  }, [motion]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    // Cycle system-effective → the opposite explicit state → back to system.
    setMotion((m) => {
      if (m === 'system') return 'reduced';
      if (m === 'reduced') return 'full';
      return 'system';
    });
  }, []);

  const reducedMotion = motion === 'system' ? undefined : motion === 'reduced';

  return { theme, toggleTheme, motion, reducedMotion, toggleReducedMotion };
}
