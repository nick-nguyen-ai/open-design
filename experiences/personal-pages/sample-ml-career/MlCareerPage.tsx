/**
 * SAMPLE personal-page render for the five-surface quality test — the
 * experience-composer pipeline's PERSONAL-PAGE output.
 *
 * A thin wrapper: the content-only {@link mlCareerFill} (authored against
 * `TheLineFill`) is handed to the shipped {@link TheLineTemplate}, which carries
 * the whole craft. No design edits sit between the fill and this render.
 *
 * The `the-line` world-template's mood is DARK (per its worldtemplate manifest);
 * this sample route renders OUTSIDE RootLayout, so — mirroring
 * `../slide-decks/sample-openwiki/OpenWikiPage.tsx` — it locks the document
 * theme to dark for the page's lifetime.
 */
import { useLayoutEffect } from 'react';
import TheLineTemplate from '../home-career-project-timeline/TheLineTemplate.js';
import { mlCareerFill } from './fill.js';

export default function MlCareerPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <TheLineTemplate fill={mlCareerFill} />;
}
