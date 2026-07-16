/**
 * "/demo/caching-field-guide" — thin wrapper for the composed gazette tour sample.
 * Theme lock + render only; the template carries the craft. Demo route:
 * no experience manifest, no live.ts entry, no approval flag.
 */
import { useLayoutEffect } from 'react';
import GazetteDeckTemplate from '../deck-dgm-gazette/GazetteDeckTemplate.js';
import { cachingFieldGuideFill } from './fill.js';

export default function CachingFieldGuidePage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <GazetteDeckTemplate fill={cachingFieldGuideFill} />;
}
