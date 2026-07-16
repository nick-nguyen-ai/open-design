/**
 * The Showcase contract: every sample has a real route in App.tsx and a
 * committed preview image — and every LIVE world has one too, so the
 * shoot-previews script cannot silently drift from data/live.ts.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SHOWCASE_SAMPLES } from './samples.js';
import { LIVE_EXPERIENCE_IDS } from './live.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const appSource = readFileSync(path.resolve(here, '..', 'App.tsx'), 'utf8');
const previewsDir = path.resolve(here, '..', '..', 'public', 'previews');

describe('showcase samples', () => {
  it('slugs and preview ids are unique', () => {
    const slugs = SHOWCASE_SAMPLES.map((s) => s.slug);
    const previews = SHOWCASE_SAMPLES.map((s) => s.previewId);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(previews).size).toBe(previews.length);
  });

  for (const sample of SHOWCASE_SAMPLES) {
    it(`${sample.slug}: has a /demo route in App.tsx and a committed preview`, () => {
      expect(appSource, `App.tsx must route demo/${sample.slug}`).toContain(
        `path="demo/${sample.slug}"`,
      );
      expect(
        existsSync(path.join(previewsDir, `${sample.previewId}.jpg`)),
        `missing public/previews/${sample.previewId}.jpg — run scripts/shoot-previews.mjs`,
      ).toBe(true);
    });
  }
});

describe('live-world previews', () => {
  for (const id of LIVE_EXPERIENCE_IDS) {
    it(`${id} has a committed preview image`, () => {
      expect(
        existsSync(path.join(previewsDir, `${id}.jpg`)),
        `missing public/previews/${id}.jpg — run scripts/shoot-previews.mjs`,
      ).toBe(true);
    });
  }
});
