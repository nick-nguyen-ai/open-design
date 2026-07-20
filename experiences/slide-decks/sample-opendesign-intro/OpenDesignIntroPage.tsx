/**
 * open-design skill COMPOSE output — the OpenDesign system intro deck rendered
 * content-only through the shipped {@link CircuitDeckTemplate} (THE LIT BOARD).
 * NOT a catalogue template (no experience manifest, no live.ts entry) — the
 * demo route `/demo/opendesign-intro`.
 *
 * A thin wrapper: the circuit world-template's mood is DARK, and this route
 * renders OUTSIDE RootLayout, so it locks the document theme to dark for the
 * page's lifetime (mirroring the mcp-sample demo route's light lock).
 */
import { useLayoutEffect } from 'react';
import CircuitDeckTemplate from '../deck-dgm-circuit/CircuitDeckTemplate.js';
import { openDesignIntroFill } from './fill.js';

export default function OpenDesignIntroPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <CircuitDeckTemplate fill={openDesignIntroFill} />;
}
