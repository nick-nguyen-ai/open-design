/**
 * "The Quarter" — experience-composer SAMPLE deck: GitLab's Q1 FY27 quarter in
 * review, from public filings (goal-test sample 1/5). NOT a catalogue template
 * (no experience manifest, no live.ts entry) — the demo route `/demo/gitlab-qbr`.
 *
 * The brief ran through the real compose path (`compose_slide_deck` →
 * `deck-quarterly-business-review`), and the CONTENT-ONLY {@link gitlabQbrFill}
 * authored against `QuarterFill` is handed to the shipped {@link QuarterTemplate},
 * which carries the whole craft. No design edits sit between the tool output and
 * this render.
 *
 * A thin wrapper: the Quarter world-template's mood is LIGHT, and this route
 * renders OUTSIDE RootLayout, so it locks the document theme to light for the
 * page's lifetime (mirroring the payments-retry sample route).
 */
import { useLayoutEffect } from 'react';
import QuarterTemplate from '../deck-quarterly-business-review/QuarterTemplate.js';
import { gitlabQbrFill } from './fill.js';

export default function GitlabQbrPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <QuarterTemplate fill={gitlabQbrFill} />;
}
