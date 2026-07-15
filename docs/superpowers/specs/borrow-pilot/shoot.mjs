/**
 * Borrow-pilot run evidence — screenshot the borrowed swimlanes next to their
 * source.
 *
 * Shoots three states against the BUILT gallery served by `vite preview`:
 *   1. the target: /demo/borrow-pilot (the borrowed, re-inked swimlanes);
 *   2. the source: /live/deck-cloud-migration?slide=5 (the waves slide);
 *   3. the source with the part inspector armed, for the anchor's presence.
 *
 * Prereqs: `corepack pnpm --filter gallery build`, then
 * `vite preview --port 4318`. Run from repo root:
 * `node docs/superpowers/specs/borrow-pilot/shoot.mjs`
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');

const requireFromGallery = createRequire(path.join(repoRoot, 'apps', 'gallery', 'package.json'));
const playwrightCoreEntry = createRequire(requireFromGallery.resolve('@playwright/test')).resolve('playwright-core');
const playwrightCore = await import(pathToFileURL(playwrightCoreEntry).href);
const chromium = playwrightCore.chromium ?? playwrightCore.default.chromium;

const PORT = Number(process.env.PORT ?? 4318);
const BASE = `http://localhost:${PORT}`;

const SHOTS = [
  {
    route: '/demo/borrow-pilot',
    waitFor: '[data-testid="borrowed-swimlanes"]',
    file: 'target-borrowed-swimlanes.png',
  },
  {
    route: '/live/deck-cloud-migration?slide=5',
    waitFor: '[data-part-id="deck-cloud-migration/waves/swimlanes"]',
    file: 'source-waves-slide.png',
  },
  {
    route: '/live/deck-cloud-migration?slide=5&inspect=1',
    waitFor: '[data-part-id="deck-cloud-migration/waves/swimlanes"]',
    file: 'source-waves-inspecting.png',
  },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    for (const shot of SHOTS) {
      await page.goto(`${BASE}${shot.route}`, { waitUntil: 'networkidle' });
      await page.waitForSelector(shot.waitFor, { timeout: 15_000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(900);
      const file = path.join(here, shot.file);
      await page.screenshot({ path: file });
      console.log(`shot ${shot.route} → ${file}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
