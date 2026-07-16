/**
 * "/demo/https-handshake" — thin wrapper for the composed sketchnote tour sample.
 * Theme lock + render only; the template carries the craft. Demo route:
 * no experience manifest, no live.ts entry, no approval flag.
 */
import { useLayoutEffect } from 'react';
import SketchnoteDeckTemplate from '../deck-dgm-sketchnote/SketchnoteDeckTemplate.js';
import { httpsHandshakeFill } from './fill.js';

export default function HttpsHandshakePage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <SketchnoteDeckTemplate fill={httpsHandshakeFill} />;
}
