/**
 * SAMPLE (experience-composer skill OUTPUT): a real-time TRUST & SAFETY
 * content-moderation decisioning stack, rendered as "The Drawing Office"
 * signed-engineering-drawing world-template. NOT a catalogue experience (no
 * manifest, no live.ts entry) — the five-surface quality-test TECHNICAL-EXPLAINER
 * sample route.
 *
 * A thin wrapper: the CONTENT-ONLY {@link moderationStackFill} (authored against
 * `DrawingOfficeFill`) is handed to the shipped {@link DrawingOfficeTemplate},
 * which carries the whole craft. No design edits sit between the fill and the
 * render.
 *
 * The Drawing Office world-template's mood is LIGHT (see
 * `exp-system-architecture.worldtemplate.manifest.ts`), and this route renders
 * OUTSIDE RootLayout, so it locks the document theme to light for the page's
 * lifetime (mirroring `sample-openwiki/OpenWikiPage.tsx`'s dark lock).
 */
import { useLayoutEffect } from 'react';
import DrawingOfficeTemplate from '../exp-system-architecture/DrawingOfficeTemplate.js';
import { moderationStackFill } from './fill.js';

export default function ModerationStackPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <DrawingOfficeTemplate fill={moderationStackFill} />;
}
