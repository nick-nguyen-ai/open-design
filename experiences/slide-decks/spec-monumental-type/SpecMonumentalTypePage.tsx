/**
 * Grammar-specimen demo route `/demo/spec-monumental-type` — the
 * opendesign-intro bake-off content rendered through the shipped
 * {@link TMinusTemplate} (The T-Minus, monumental-type). NOT a catalogue
 * template. T-Minus locks mood DARK; this route renders outside RootLayout,
 * so it locks the document theme for the page's lifetime.
 */
import { useLayoutEffect } from 'react';
import TMinusTemplate from '../deck-product-launch/TMinusTemplate.js';
import { specMonumentalTypeFill } from './fill.js';

export default function SpecMonumentalTypePage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <TMinusTemplate fill={specMonumentalTypeFill} />;
}
