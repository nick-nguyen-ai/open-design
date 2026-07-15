/**
 * Experience-composer goal test (ledger Task 12) — screenshot all five samples
 * as committed evidence.
 *
 * Decks: every slide at 1440x900 (`?slide=1..N`). Single-page surfaces: one
 * 1440x900 viewport shot + one full-page shot. All against the BUILT gallery
 * served by `vite preview` (this script assumes the server is already up).
 *
 * Prereqs: `corepack pnpm --filter gallery build`, then
 * `corepack pnpm --filter gallery exec vite preview --port 4318`.
 *
 * Run from repo root: `node docs/superpowers/specs/goal-samples-shoot.mjs`
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
// Repo root: docs/superpowers/specs -> up three dirs.
const repoRoot = path.resolve(here, '../../..');

const requireFromGallery = createRequire(path.join(repoRoot, 'apps', 'gallery', 'package.json'));
const playwrightCoreEntry = createRequire(requireFromGallery.resolve('@playwright/test')).resolve('playwright-core');
const playwrightCore = await import(pathToFileURL(playwrightCoreEntry).href);
const chromium = playwrightCore.chromium ?? playwrightCore.default.chromium;

const PORT = Number(process.env.PORT ?? 4318);
const BASE = `http://localhost:${PORT}`;

/** slideCount > 0 → deck (per-slide shots); 0 → single page (viewport + full). */
const SAMPLES = [
  { route: '/demo/gitlab-qbr', testid: 'live-quarter', slideCount: 11, dir: 'gitlab-qbr-sample' },
  { route: '/demo/openmodel-cockpit', testid: 'live-cockpit', slideCount: 0, dir: 'openmodel-cockpit-sample' },
  { route: '/demo/moderation-stack', testid: 'live-architecture', slideCount: 0, dir: 'moderation-explainer-sample' },
  { route: '/demo/agent-evals', testid: 'live-programme', slideCount: 0, dir: 'agent-evals-ledger-sample' },
  { route: '/demo/ml-career', testid: 'live-the-line', slideCount: 0, dir: 'ml-career-line-sample' },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    for (const sample of SAMPLES) {
      const outDir = path.join(here, sample.dir);
      if (sample.slideCount > 0) {
        for (let n = 1; n <= sample.slideCount; n += 1) {
          await page.goto(`${BASE}${sample.route}?slide=${n}`, { waitUntil: 'networkidle' });
          await page.waitForSelector(`[data-testid="${sample.testid}"]`, { timeout: 20_000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(900);
          const file = path.join(outDir, `slide-${String(n).padStart(2, '0')}.png`);
          await page.screenshot({ path: file });
          console.log(`shot ${sample.route} slide ${n} → ${file}`);
        }
      } else {
        await page.goto(`${BASE}${sample.route}`, { waitUntil: 'networkidle' });
        await page.waitForSelector(`[data-testid="${sample.testid}"]`, { timeout: 20_000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1200);
        const viewportFile = path.join(outDir, 'viewport.png');
        await page.screenshot({ path: viewportFile });
        console.log(`shot ${sample.route} viewport → ${viewportFile}`);
        const fullFile = path.join(outDir, 'full-page.png');
        await page.screenshot({ path: fullFile, fullPage: true });
        console.log(`shot ${sample.route} full page → ${fullFile}`);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
