/**
 * The canonical verify rig for the open-design skill — ONE driver shared by
 * COMPOSE Phase 6, BORROW verify, and AUDIT Phase 0 (replaces the hand-copied
 * shoot.mjs pattern).
 *
 * Per state (each slide for decks; the page for single-page surfaces):
 *   - 1440×900 evidence screenshot (the run's visual record),
 *   - 1280×800 + 375×812 screenshots for the audit viewports,
 *   - DOM probes (see probes.mjs): root overflow (F1) at EVERY viewport;
 *     text-overflow, text-overlap, and contrast at the probe viewports
 *     (default 1440 + 1280 — worlds are desktop art-directed; 375 stays
 *     screenshot + F1 only unless --probe-viewports says otherwise).
 *
 * Output: PNGs + findings.json in --out. Exit 0 by default (findings are the
 * caller's to read); --strict exits 1 when any finding survives.
 *
 * KNOWN LIMITS (the screenshot judge owns these): chrome CROWDING (two text
 * boxes flush with zero gap read as a collision but never geometrically
 * overlap — the dgm 375px footer case), taste/composition calls, and
 * contrast over gradients/images (reported as `unverifiable`, never guessed).
 *
 * Usage (from repo root, against a BUILT gallery served by vite preview):
 *   corepack pnpm --filter gallery build
 *   corepack pnpm --filter gallery exec vite preview --port 4318   # background
 *   node .claude/skills/open-design/scripts/verify.mjs \
 *     --route /demo/my-deck --testid live-dgm-circuit --slides 10 \
 *     --out docs/superpowers/specs/my-deck-sample [--strict]
 */
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { probeContrast, probeRootOverflow, probeTextOverflow, probeTextOverlap } from './probes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
// .claude/skills/open-design/scripts -> repo root is four levels up.
const repoRoot = path.resolve(here, '..', '..', '..', '..');

// ---- args -------------------------------------------------------------------
function arg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value === undefined || value.startsWith('--') ? true : value;
}

/**
 * Normalize the route argument. Git Bash (MSYS) rewrites a leading-slash arg
 * like `/demo/x` into a Windows path (`C:/Program Files/Git/demo/x`) before
 * Node ever sees it — recover the `/demo/*` or `/live/*` tail, and accept the
 * slash-less form (`demo/x`) as a first-class spelling.
 */
function normalizeRoute(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return undefined;
  let route = raw.replace(/\\/g, '/');
  const mangled = route.match(/\/((?:demo|live)\/.*)$/);
  if (mangled && route.includes(':')) route = `/${mangled[1]}`;
  if (!route.startsWith('/')) route = `/${route}`;
  return route;
}

const ROUTE = normalizeRoute(arg('route'));
const TESTID = arg('testid');
const SLIDES = Number(arg('slides', 0)); // 0 = single-page surface
const PORT = Number(arg('port', process.env.PORT ?? 4318));
const BASE = arg('url', `http://localhost:${PORT}`);
const OUT = path.resolve(repoRoot, String(arg('out', 'verify-out')));
const STRICT = arg('strict', false) === true;
const PROBE_VIEWPORTS = String(arg('probe-viewports', '1440,1280'))
  .split(',')
  .map((s) => Number(s.trim()))
  .filter((n) => Number.isFinite(n) && n > 0);

if (!ROUTE || !TESTID || typeof ROUTE !== 'string' || typeof TESTID !== 'string') {
  console.error('usage: node verify.mjs --route </demo/slug> --testid <live-xxx> [--slides N] [--out dir] [--port 4318] [--url base] [--probe-viewports 1440,1280] [--strict]');
  process.exit(2);
}

// ---- stale-dist warning (GUIDANCE §7d) -------------------------------------
function newestMtime(dir) {
  let newest = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) newest = Math.max(newest, newestMtime(p));
    else newest = Math.max(newest, statSync(p).mtimeMs);
  }
  return newest;
}
try {
  const distIndex = path.join(repoRoot, 'apps', 'gallery', 'dist', 'index.html');
  if (existsSync(distIndex)) {
    const distTime = statSync(distIndex).mtimeMs;
    const srcTime = Math.max(
      newestMtime(path.join(repoRoot, 'apps', 'gallery', 'src')),
      newestMtime(path.join(repoRoot, 'experiences')),
    );
    if (srcTime > distTime) {
      console.warn('⚠ apps/gallery/dist is OLDER than the sources — rebuild before trusting these pixels (corepack pnpm --filter gallery build).');
    }
  } else {
    console.warn('⚠ apps/gallery/dist not found — build first, the preview server serves dist/.');
  }
} catch {
  // Best-effort warning only.
}

// ---- playwright, resolved through the gallery's own manifest ---------------
const requireFromGallery = createRequire(path.join(repoRoot, 'apps', 'gallery', 'package.json'));
const playwrightCoreEntry = createRequire(requireFromGallery.resolve('@playwright/test')).resolve('playwright-core');
const playwrightCore = await import(pathToFileURL(playwrightCoreEntry).href);
const chromium = playwrightCore.chromium ?? playwrightCore.default.chromium;

// ---- run --------------------------------------------------------------------
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 375, height: 812 },
];

async function settle(page) {
  await page.waitForSelector(`[data-testid="${TESTID}"]`, { timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const findings = [];
  const states = SLIDES > 0 ? Array.from({ length: SLIDES }, (_, i) => i + 1) : [null];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const probeHere = PROBE_VIEWPORTS.includes(viewport.width);

    for (const state of states) {
      const url = state === null ? `${BASE}${ROUTE}` : `${BASE}${ROUTE}?slide=${state}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await settle(page);

      const label = state === null ? 'page' : `slide-${String(state).padStart(2, '0')}`;
      await page.screenshot({ path: path.join(OUT, `${label}-${viewport.width}.png`) });
      if (state === null) {
        await page.screenshot({ path: path.join(OUT, `${label}-${viewport.width}-full.png`), fullPage: true });
      }

      const tag = (list) =>
        list.map((f) => ({ ...f, viewport: viewport.width, state: label }));

      // F1 runs at EVERY viewport (the 375 chrome-collision class lives here).
      findings.push(...tag(await page.evaluate(probeRootOverflow)));
      if (probeHere) {
        findings.push(...tag(await page.evaluate(probeTextOverflow)));
        findings.push(...tag(await page.evaluate(probeTextOverlap)));
        findings.push(...tag(await page.evaluate(probeContrast)));
      }
    }
    await context.close();
  }
  await browser.close();

  const unverifiable = findings.filter((f) => f.probe === 'contrast-unverifiable');
  const actionable = findings.filter((f) => f.probe !== 'contrast-unverifiable');
  const report = {
    route: ROUTE,
    generatedAt: new Date().toISOString(),
    viewports: VIEWPORTS.map((v) => v.width),
    probeViewports: PROBE_VIEWPORTS,
    states: SLIDES > 0 ? SLIDES : 'single-page',
    findings: actionable,
    unverifiable,
  };
  const reportPath = path.join(OUT, 'findings.json');
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`verify: ${actionable.length} finding(s), ${unverifiable.length} unverifiable contrast region(s)`);
  for (const f of actionable.slice(0, 30)) {
    console.log(`  [${f.state} @${f.viewport}] ${f.probe}: ${f.selector} — ${f.detail}`);
  }
  if (actionable.length > 30) console.log(`  … and ${actionable.length - 30} more (see findings.json)`);
  console.log(`report: ${reportPath}`);

  process.exit(STRICT && actionable.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
