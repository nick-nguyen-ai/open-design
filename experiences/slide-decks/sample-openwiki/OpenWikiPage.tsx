/**
 * "The T-Minus" — deck-composer skill OUTPUT: introducing LangChain OpenWiki
 * as a launch-countdown deck. NOT a catalogue template (no experience manifest,
 * no live.ts entry) — the demo route `/demo/openwiki`.
 *
 * Produced by the `.claude/skills/deck-composer` pipeline (ledger T33): the
 * brief ran through the real MCP path (`compose_slide_deck` → `tminus` /
 * `deck-product-launch`), and the CONTENT-ONLY {@link openwikiFill} authored
 * against `TMinusFill` is handed to the shipped {@link TMinusTemplate}, which
 * carries the whole craft. No design edits sit between the MCP output and this
 * render.
 *
 * A thin wrapper: the T-Minus world-template's mood is DARK, and this route
 * renders OUTSIDE RootLayout, so it locks the document theme to dark for the
 * page's lifetime (mirroring the `/demo/mcp-sample` light lock).
 */
import { useLayoutEffect } from 'react';
import TMinusTemplate from '../deck-product-launch/TMinusTemplate.js';
import { openwikiFill } from './fill.js';

export default function OpenWikiPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <TMinusTemplate fill={openwikiFill} />;
}
