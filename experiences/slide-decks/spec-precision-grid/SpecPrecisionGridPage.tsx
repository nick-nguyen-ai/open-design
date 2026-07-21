/**
 * Grammar-specimen demo route `/demo/spec-precision-grid` — the opendesign-intro
 * bake-off content rendered through the shipped {@link QuarterTemplate} (The
 * Quarter, precision-grid). NOT a catalogue template. The quarter world locks
 * mood LIGHT; this route renders outside RootLayout, so it locks the document
 * theme for the page's lifetime (mirroring the opendesign-intro demo route).
 */
import { useLayoutEffect } from 'react';
import QuarterTemplate from '../deck-quarterly-business-review/QuarterTemplate.js';
import { specPrecisionGridFill } from './fill.js';

export default function SpecPrecisionGridPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <QuarterTemplate fill={specPrecisionGridFill} />;
}
