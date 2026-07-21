/**
 * render-host template-map parity.
 *
 * `render_experience` writes a canonical world-template id into that render's
 * own input file, `render-out/<renderId>/input/render-config.json`; the host
 * (pointed at that directory for the build) looks that id up in
 * `TEMPLATES`. A world template added to the registry but not to that map
 * fails at RUNTIME with "unknown templateId" - deep inside a shelled vite
 * build, surfaced only as a build-log tail. This test turns that into a plain
 * red test the moment the registry gains (or loses) a template.
 */
import { describe, expect, it } from 'vitest';
import { TEMPLATES } from '../render-host/src/templates.js';
import { loadRegistryData } from './registry-data.js';

describe('render-host TEMPLATES', () => {
  it('covers exactly the registry world-template ids', () => {
    const registryIds = [...new Set(loadRegistryData().worldTemplates.map((t) => t.id))].sort();
    expect(Object.keys(TEMPLATES).sort()).toEqual(registryIds);
  });

  it('maps every id to a lazy loader', () => {
    for (const [id, entry] of Object.entries(TEMPLATES)) {
      expect(typeof entry.load, id).toBe('function');
    }
  });
});
