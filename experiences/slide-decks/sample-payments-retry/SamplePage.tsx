/**
 * "The Cutover" — MCP-generated SAMPLE deck: a payments retry pipeline and its
 * Q3 cloud migration. NOT a catalogue template (no experience manifest, no
 * live.ts entry) — the demo route `/demo/mcp-sample`.
 *
 * This is the rendered proof of the Phase B quality loop (ledger T30): the brief
 * was run through the real MCP path (`compose_slide_deck` → `deck-cloud-migration`),
 * and the CONTENT-ONLY {@link sampleFill} authored against `CutoverFill` is handed
 * to the shipped {@link CutoverTemplate}, which carries the whole craft. No design
 * edits sit between the MCP output and this render — the template auto-lays every
 * node (the fill omits all geometry).
 *
 * A thin wrapper: the Cutover world-template's mood is LIGHT, and this route
 * renders OUTSIDE RootLayout, so it locks the document theme to light for the
 * page's lifetime (mirroring the DeepAgents demo route's dark lock).
 */
import { useLayoutEffect } from 'react';
import CutoverTemplate from '../deck-cloud-migration/CutoverTemplate.js';
import { sampleFill } from './fill.js';

export default function SamplePage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <CutoverTemplate fill={sampleFill} />;
}
