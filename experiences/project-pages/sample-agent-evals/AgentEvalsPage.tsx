/**
 * PROJECT-PAGE sample OUTPUT for the five-surface MCP quality test: an AGENT
 * EVALUATION PROGRAMME rendered through "The Validation Ledger" world-template
 * (`proj-ai-model-validation-hub`). NOT a catalogue experience (no manifest, no
 * live.ts entry) — a demo route.
 *
 * A thin wrapper. The CONTENT-ONLY {@link agentEvalsFill} (authored against
 * `LedgerFill`) is handed to the shipped {@link LedgerTemplate}, which carries
 * the whole craft; no design edits sit between the fill and this render. The
 * ledger world-template's mood is LIGHT (per its worldtemplate manifest), and
 * this route renders outside RootLayout, so it locks the document theme to light
 * for the page's lifetime — mirroring how the OpenWiki sample locks its world's
 * dark mood.
 */
import { useLayoutEffect } from 'react';
import LedgerTemplate from '../proj-ai-model-validation-hub/LedgerTemplate.js';
import { agentEvalsFill } from './fill.js';

export default function AgentEvalsPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <LedgerTemplate fill={agentEvalsFill} />;
}
