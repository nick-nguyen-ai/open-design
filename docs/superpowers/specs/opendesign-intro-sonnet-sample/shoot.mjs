/**
 * open-design COMPOSE run evidence — screenshot every slide of the OpenDesign
 * system intro deck (`/demo/opendesign-intro`, THE LIT BOARD template).
 *
 * Loops `?slide=1..N` against the BUILT gallery served by `vite preview`, at
 * 1440x900, waiting for fonts to load and the deck's stable `live-dgm-circuit`
 * testid before shooting each slide to `slide-NN.png` in this directory.
 *
 * Prereqs (the reproducible chain): `corepack pnpm --filter gallery build`,
 * then a `vite preview --port 4318` serving that build (this script assumes the
 * server is already up on PORT).
 *
 * Run from repo root: `node docs/superpowers/specs/opendesign-intro-sample/shoot.mjs`
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
// Repo root: docs/superpowers/specs/opendesign-intro-sample -> up four dirs.
const repoRoot = path.resolve(here, '../../../..');

// Resolve Playwright from the repo's OWN install, never one accidentally
// hoisted into a parent workspace ABOVE the repo root (a bare
// `import '@playwright/test'` run from repo root would resolve there). The
// gallery package owns the Playwright devDependency, so anchor resolution at
// its manifest, then reach the bundled `playwright-core` it pulls in.
const requireFromGallery = createRequire(path.join(repoRoot, 'apps', 'gallery', 'package.json'));
const playwrightCoreEntry = createRequire(requireFromGallery.resolve('@playwright/test')).resolve('playwright-core');
const playwrightCore = await import(pathToFileURL(playwrightCoreEntry).href);
const chromium = playwrightCore.chromium ?? playwrightCore.default.chromium;

const PORT = Number(process.env.PORT ?? 4318);
const BASE = `http://localhost:${PORT}`;
const ROUTE = '/demo/opendesign-intro-sonnet';
const SLIDE_COUNT = 10;

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    for (let n = 1; n <= SLIDE_COUNT; n += 1) {
      await page.goto(`${BASE}${ROUTE}?slide=${n}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-testid="live-dgm-circuit"]', { timeout: 15_000 });
      await page.evaluate(() => document.fonts.ready);
      // Let the signature entrance sequence settle before shooting.
      await page.waitForTimeout(900);
      const file = path.join(here, `slide-${String(n).padStart(2, '0')}.png`);
      await page.screenshot({ path: file });
      console.log(`shot slide ${n} → ${file}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
