/**
 * "/demo/kubernetes-anatomy" — thin wrapper for the composed isometric tour sample.
 * Theme lock + render only; the template carries the craft. Demo route:
 * no experience manifest, no live.ts entry, no approval flag.
 */
import { useLayoutEffect } from 'react';
import IsometricDeckTemplate from '../deck-dgm-isometric/IsometricDeckTemplate.js';
import { kubernetesAnatomyFill } from './fill.js';

export default function KubernetesAnatomyPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <IsometricDeckTemplate fill={kubernetesAnatomyFill} />;
}
