/**
 * Grammar-specimen demo route `/demo/spec-precision-grid` — the opendesign-intro
 * bake-off content rendered through the shipped {@link CockpitTemplate} (The
 * Cockpit, precision-grid, dashboard — the grammar's home surface; the quarter
 * deck attempt was retired by the screenshot judge over its hardcoded revenue
 * chrome, see docs/superpowers/specs/grammar-specimens/precision-grid/).
 * NOT a catalogue template. Cockpit locks mood DARK; this route renders
 * outside RootLayout, so it locks the document theme for the page's lifetime.
 */
import { useLayoutEffect } from 'react';
import CockpitTemplate from '../../dashboards/db-model-monitoring-cockpit/CockpitTemplate.js';
import { specPrecisionGridFill } from './fill.js';

export default function SpecPrecisionGridPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <CockpitTemplate fill={specPrecisionGridFill} />;
}
