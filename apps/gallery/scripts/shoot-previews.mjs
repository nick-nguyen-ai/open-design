/**
 * Preview pipeline — shoots every LIVE world and every demo sample into the
 * committed card previews at `apps/gallery/public/previews/<id>.jpg`.
 *
 * The gallery must be running (dev or preview build):
 *   corepack pnpm --filter gallery dev            # or: build && vite preview
 *   node apps/gallery/scripts/shoot-previews.mjs  # from anywhere
 *
 * Options via env: BASE (default http://localhost:5173); ONLY (comma-separated
 * id list — shoot just those, e.g. ONLY=db-regulatory-control-hub,demo-openwiki).
 * Re-run whenever a template's look changes; the images are the gallery's
 * "framed print" pixels, so stale previews are a design bug.
 */
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(here, '..', 'public', 'previews');
const BASE = process.env.BASE ?? 'http://localhost:5173';

/** Mirrors LIVE_EXPERIENCE_IDS (apps/gallery/src/data/live.ts). */
const LIVE_IDS = [
  'db-model-monitoring-cockpit',
  'exp-system-architecture',
  'deck-ai-strategy',
  'proj-ai-model-validation-hub',
  'home-data-scientist-studio',
  'deck-executive-decision-proposal',
  'deck-genai-model-validation-report',
  'deck-ai-governance-and-controls',
  'deck-transformation-roadmap',
  'deck-experiment-results',
  'deck-innovation-showcase',
  'deck-product-vision',
  'deck-technical-architecture-explanation',
  'deck-technical-training',
  'home-technical-leadership-portfolio',
  'home-ai-experiment-notebook',
  'home-internal-ai-tool-laboratory',
  'home-career-project-timeline',
  'home-team-contribution-impact-page',
  'home-mentoring-tutorial-hub',
  'home-knowledge-atlas',
  'home-research-publication-portfolio',
  'home-talks-presentation-archive',
  'deck-project-kickoff',
  'deck-research-discussion',
  'deck-marketing-campaign',
  'deck-product-launch',
  'deck-team-retrospective',
  'deck-cloud-migration',
  'deck-quarterly-business-review',
  'deck-sales-pitch',
  'deck-budget-planning',
  'deck-analytics-deep-dive',
  'deck-dgm-sketchnote',
  'deck-dgm-blueprint',
  'deck-dgm-circuit',
  'deck-dgm-isometric',
  'deck-dgm-gazette',
  'db-ai-risk-command-centre',
  'db-delivery-control-tower',
  'db-regulatory-control-hub',
  'db-data-quality-operations',
  'db-dependency-network-explorer',
  'db-experiment-analysis-workspace',
  'db-incident-remediation-centre',
  'db-portfolio-performance-explorer',
  'db-scenario-stress-simulator',
  'exp-api-integration-contract',
  'exp-architecture-decision-record',
  'exp-coding-agent-implementation-plan',
  'exp-agent-workflow',
  'exp-algorithm-explanation',
  'exp-data-lineage-map',
  'exp-incident-postmortem',
  'exp-migration-plan',
  'exp-testing-validation-strategy',
  'proj-enterprise-transformation-programme',
  'proj-operating-model-redesign',
  'proj-regulatory-remediation-programme',
  'proj-cloud-migration-programme',
  'proj-data-modernisation-programme',
  'proj-platform-product-launch',
];

/** Demo samples (mirrors data/samples.ts + the /demo/* routes). */
const DEMO_SLUGS = [
  'gitlab-qbr',
  'openmodel-cockpit',
  'moderation-stack',
  'agent-evals',
  'ml-career',
  'openwiki',
  'mcp-sample',
  'deepagents',
  'borrow-pilot',
  'https-handshake',
  'payment-rails',
  'million-users',
  'kubernetes-anatomy',
  'caching-field-guide',
];

/**
 * Per-id route overrides — e.g. a deck whose most representative view is not
 * its title slide.
 */
const ROUTE_OVERRIDES = {
  'deck-cloud-migration': '/live/deck-cloud-migration?slide=2',
};

const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',')) : null;

const SHOTS = [
  ...LIVE_IDS.map((id) => ({ id, route: ROUTE_OVERRIDES[id] ?? `/live/${id}` })),
  ...DEMO_SLUGS.map((slug) => ({ id: `demo-${slug}`, route: `/demo/${slug}` })),
].filter((shot) => !ONLY || ONLY.has(shot.id));

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // The part-inspector toggle is gallery chrome, not template pixels — keep it
  // out of the framed prints.
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = '[aria-label="Inspect parts (borrow a part)"] { display: none !important; }';
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  });

  let failures = 0;
  for (const shot of SHOTS) {
    const url = `${BASE}${shot.route}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
      await page.evaluate(() => document.fonts.ready);
      // Let entrance choreography settle (worlds animate on arrival).
      await page.waitForTimeout(1600);
      const file = path.join(OUT_DIR, `${shot.id}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: 75 });
      console.log(`shot ${shot.route} → previews/${shot.id}.jpg`);
    } catch (error) {
      failures += 1;
      console.error(`FAILED ${url}: ${error.message}`);
    }
  }

  await browser.close();
  if (failures > 0) {
    console.error(`${failures} preview(s) failed`);
    process.exit(1);
  }
  console.log(`done — ${SHOTS.length} previews in ${OUT_DIR}`);
}

await main();
