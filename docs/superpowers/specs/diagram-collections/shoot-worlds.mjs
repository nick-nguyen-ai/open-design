/**
 * Diagram-collections run evidence — screenshot every slide of the five
 * grammar-tour worlds against the BUILT gallery served by `vite preview`.
 *
 * Prereqs: `corepack pnpm --filter gallery build`, then
 * `vite preview --port 4318` in apps/gallery. Run from repo root:
 * `node docs/superpowers/specs/diagram-collections/shoot-worlds.mjs [world ...]`
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');

const requireFromGallery = createRequire(path.join(repoRoot, 'apps', 'gallery', 'package.json'));
const playwrightCoreEntry = createRequire(requireFromGallery.resolve('@playwright/test')).resolve('playwright-core');
const playwrightCore = await import(pathToFileURL(playwrightCoreEntry).href);
const chromium = playwrightCore.chromium ?? playwrightCore.default.chromium;

const PORT = Number(process.env.PORT ?? 4318);
const BASE = `http://localhost:${PORT}`;

const ALL_WORLDS = [
  { id: 'deck-dgm-sketchnote', testId: 'live-dgm-sketchnote' },
  { id: 'deck-dgm-blueprint', testId: 'live-dgm-blueprint' },
  { id: 'deck-dgm-circuit', testId: 'live-dgm-circuit' },
  { id: 'deck-dgm-isometric', testId: 'live-dgm-isometric' },
  { id: 'deck-dgm-gazette', testId: 'live-dgm-gazette' },
];

const only = process.argv.slice(2);
const worlds = only.length > 0 ? ALL_WORLDS.filter((w) => only.includes(w.id)) : ALL_WORLDS;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const world of worlds) {
  const outDir = path.join(here, world.id);
  fs.mkdirSync(outDir, { recursive: true });
  for (let slide = 1; slide <= 10; slide += 1) {
    await page.goto(`${BASE}/live/${world.id}?slide=${slide}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(`[data-testid="${world.testId}"]`, { timeout: 15000 });
    await page.waitForTimeout(900); // let entrance motion finish
    const file = path.join(outDir, `slide-${String(slide).padStart(2, '0')}.png`);
    await page.screenshot({ path: file });
    process.stdout.write(`shot ${world.id} slide ${slide}\n`);
  }
}

await browser.close();
process.stdout.write('done\n');
