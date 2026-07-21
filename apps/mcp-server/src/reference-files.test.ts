// apps/mcp-server/src/reference-files.test.ts
import { describe, expect, it } from 'vitest';
import {
  experienceDir,
  listExperienceFiles,
  partFileUri,
  readExperienceFile,
  templateSourceUri,
} from './reference-files.js';

describe('reference-files', () => {
  it('resolves an experience dir across surface dirs', () => {
    expect(experienceDir('db-model-monitoring-cockpit')).toMatch(/dashboards[\\/]db-model-monitoring-cockpit$/);
    expect(experienceDir('deck-cloud-migration')).toMatch(/slide-decks[\\/]deck-cloud-migration$/);
    expect(experienceDir('nope-not-real')).toBeUndefined();
  });

  it('lists source files with byte sizes, posix paths, sorted', () => {
    const files = listExperienceFiles('db-model-monitoring-cockpit')!;
    const paths = files.map((f) => f.path);
    expect(paths).toContain('CockpitTemplate.tsx');
    expect(paths).toContain('cockpit.css');
    expect(paths.every((p) => !p.includes('\\'))).toBe(true);
    expect(files.every((f) => f.bytes > 0)).toBe(true);
    expect([...paths].sort()).toEqual(paths);
  });

  it('reads a file and refuses traversal', () => {
    expect(readExperienceFile('db-model-monitoring-cockpit', 'CockpitTemplate.tsx')).toContain('CockpitTemplate');
    expect(readExperienceFile('db-model-monitoring-cockpit', '../../package.json')).toBeUndefined();
    expect(readExperienceFile('db-model-monitoring-cockpit', 'missing.tsx')).toBeUndefined();
  });

  it('refuses an experienceId that is itself a traversal', () => {
    // The id is client-controlled (opendesign://parts/{experienceId}/{+file}).
    // Joined unchecked, each of these escapes experiences/ BEFORE the relPath
    // guard runs - `../../apps/mcp-server` resolves to a real directory whose
    // package.json would then be readable.
    for (const id of ['..', '../..', '../slide-decks', '../../apps/mcp-server', 'a/../..', 'a\\..\\..', '']) {
      expect(experienceDir(id)).toBeUndefined();
      expect(listExperienceFiles(id)).toBeUndefined();
      expect(readExperienceFile(id, 'package.json')).toBeUndefined();
    }
    // The legitimate neighbour of that escape still resolves exactly as before.
    expect(experienceDir('deck-cloud-migration')).toBeDefined();
    expect(readExperienceFile('db-model-monitoring-cockpit', 'CockpitTemplate.tsx')).toBeDefined();
  });

  it('builds the spec URI shapes', () => {
    expect(templateSourceUri('cockpit', 'CockpitTemplate.tsx')).toBe(
      'opendesign://templates/cockpit/source/CockpitTemplate.tsx',
    );
    expect(partFileUri('deck-cloud-migration', 'CutoverTemplate.tsx')).toBe(
      'opendesign://parts/deck-cloud-migration/CutoverTemplate.tsx',
    );
  });
});
