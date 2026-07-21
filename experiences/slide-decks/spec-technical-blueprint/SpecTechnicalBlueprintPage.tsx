/**
 * Grammar-specimen demo route `/demo/spec-technical-blueprint` — the
 * opendesign-intro bake-off content rendered through the shipped
 * {@link CutoverTemplate} (The Cutover, technical-blueprint). NOT a catalogue
 * template. Cutover locks mood LIGHT; this route renders outside RootLayout,
 * so it locks the document theme for the page's lifetime.
 */
import { useLayoutEffect } from 'react';
import CutoverTemplate from '../deck-cloud-migration/CutoverTemplate.js';
import { specTechnicalBlueprintFill } from './fill.js';

export default function SpecTechnicalBlueprintPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <CutoverTemplate fill={specTechnicalBlueprintFill} />;
}
