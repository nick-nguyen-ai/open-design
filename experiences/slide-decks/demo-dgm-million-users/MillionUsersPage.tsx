/**
 * "/demo/million-users" — thin wrapper for the composed circuit tour sample.
 * Theme lock + render only; the template carries the craft. Demo route:
 * no experience manifest, no live.ts entry, no approval flag.
 */
import { useLayoutEffect } from 'react';
import CircuitDeckTemplate from '../deck-dgm-circuit/CircuitDeckTemplate.js';
import { millionUsersFill } from './fill.js';

export default function MillionUsersPage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'dark');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <CircuitDeckTemplate fill={millionUsersFill} />;
}
