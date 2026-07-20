/**
 * open-design skill COMPOSE output — the internal OpenDesign system intro deck
 * rendered content-only through the shipped {@link CircuitDeckTemplate} (THE
 * LIT BOARD). NOT a catalogue template (no experience manifest, no live.ts
 * entry) — the demo route `/demo/opendesign-intro-sonnet`.
 *
 * A thin wrapper: the circuit world-template's mood is dark, so this route
 * (rendered OUTSIDE RootLayout) locks the document theme to dark for the
 * page's lifetime, mirroring the other demo routes' theme-lock pattern.
 */
import { useLayoutEffect } from 'react';
import CircuitDeckTemplate from '../deck-dgm-circuit/CircuitDeckTemplate.js';
import { openDesignIntroSonnetFill } from './fill.js';

export default function OpenDesignIntroSonnetPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <CircuitDeckTemplate fill={openDesignIntroSonnetFill} />;
}
