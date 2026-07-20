/**
 * "/demo/harness-engineering" — thin wrapper for the composed gazette tour.
 * Theme lock + render only; the template carries the craft. Demo route:
 * no experience manifest, no live.ts entry, no approval flag.
 */
import { useLayoutEffect } from 'react';
import GazetteDeckTemplate from '../deck-dgm-gazette/GazetteDeckTemplate.js';
import { harnessEngineeringFill } from './fill.js';

export default function HarnessEngineeringPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <GazetteDeckTemplate fill={harnessEngineeringFill} />;
}
