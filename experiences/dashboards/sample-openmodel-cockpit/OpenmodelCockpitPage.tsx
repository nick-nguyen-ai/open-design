/**
 * "The Cockpit" — experience-composer skill OUTPUT: an ML-platform team's
 * overnight drift watch over the fleet of OPEN-WEIGHT models they serve in
 * production. NOT a catalogue experience (no manifest, no live.ts entry) — a
 * demo route.
 *
 * A thin wrapper: the CONTENT-ONLY {@link openmodelCockpitFill} authored against
 * `CockpitFill` is handed to the shipped {@link CockpitTemplate}, which carries
 * the whole craft. No design edits sit between the fill and this render.
 *
 * The Cockpit world-template's mood is DARK (read from
 * `db-model-monitoring-cockpit.worldtemplate.manifest.ts`), and this route
 * renders OUTSIDE RootLayout, so it locks the document theme to dark for the
 * page's lifetime (mirroring `/demo/openwiki`).
 */
import { useLayoutEffect } from 'react';
import CockpitTemplate from '../db-model-monitoring-cockpit/CockpitTemplate.js';
import { openmodelCockpitFill } from './fill.js';

export default function OpenmodelCockpitPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <CockpitTemplate fill={openmodelCockpitFill} />;
}
