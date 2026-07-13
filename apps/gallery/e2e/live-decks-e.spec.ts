import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Batch-2 decks E: three live slide-deck worlds — T-Minus, The Whiteboard, and
 * The Cutover — each structurally and atmospherically distinct from every
 * shipped deck and from each other. Each test lands on a commanding CONTENT
 * slide (never the title) via ?slide=, exercises the shared deck mechanics, and
 * captures the full-page evidence screenshot.
 */
const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

async function settleDeck(page: Page, slideSelector: string): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction((sel) => {
    if (document.querySelector(`${sel}[data-state="leaving"]`)) return false;
    const active = document.querySelector(`${sel}[data-state="active"]`);
    if (!active) return false;
    const builds = active.querySelectorAll('[class*="-build"]');
    if (builds.length === 0) return true;
    return Array.from(builds).every((el) => getComputedStyle(el).opacity === '1');
  }, slideSelector);
  await page.waitForTimeout(700);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live t-minus: the day-0 runbook, the amber security gate, screenshot', async ({ page }) => {
  await page.goto('/live/deck-product-launch');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('launch-counter')).toContainText('01 / 10');

  // The readiness board (slide 4): the security gate is amber — the anomaly.
  await page.goto('/live/deck-product-launch?slide=4');
  await expect(page.getByTestId('launch-counter')).toContainText('04 / 10');
  await expect(page.getByTestId('readiness-anomaly')).toContainText(
    'SECURITY REVIEW PENDING — BLOCKS T-7',
  );

  // Deep-link to the day-0 runbook (the commanding visual).
  await page.goto('/live/deck-product-launch?slide=7');
  await expect(page.getByTestId('launch-counter')).toContainText('07 / 10');
  await expect(page.getByTestId('runbook')).toBeVisible();

  await settleDeck(page, '.tm-slide');
  await page.screenshot({ path: shot('live-t-minus.png'), fullPage: true });

  // Keyboard mechanics: End reaches the go slide, Home returns to the title.
  await page.keyboard.press('End');
  await expect(page.getByTestId('launch-counter')).toContainText('10 / 10');
  await page.keyboard.press('Home');
  await expect(page.getByTestId('launch-counter')).toContainText('01 / 10');
});

test('live whiteboard: the sticky walls, the red-circled carried action, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-team-retrospective');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('board-counter')).toContainText('01 / 09');

  // The actions board (slide 6): one sticky is circled three times in red.
  await page.goto('/live/deck-team-retrospective?slide=6');
  await expect(page.getByTestId('board-counter')).toContainText('06 / 09');
  await expect(page.getByTestId('actions-anomaly')).toContainText(
    'CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP',
  );

  // Deep-link to the what-went-well sticky wall (the signature visual).
  await page.goto('/live/deck-team-retrospective?slide=3');
  await expect(page.getByTestId('board-counter')).toContainText('03 / 09');
  await expect(page.getByTestId('well-wall')).toBeVisible();

  await settleDeck(page, '.wb-slide');
  await page.screenshot({ path: shot('live-whiteboard.png'), fullPage: true });

  // The A key jumps to the actions board.
  await page.keyboard.press('a');
  await expect(page.getByTestId('board-counter')).toContainText('06 / 09');
});

test('live cutover: the estate diagram, the on-prem ledger, screenshot', async ({ page }) => {
  await page.goto('/live/deck-cloud-migration');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('cutover-counter')).toContainText('01 / 10');

  // Deep-link to the current estate diagram (the commanding visual): the
  // mainframe ledger stays on-prem — the anomaly, badged in the same place on
  // both estates.
  await page.goto('/live/deck-cloud-migration?slide=2');
  await expect(page.getByTestId('cutover-counter')).toContainText('02 / 10');
  await expect(page.getByTestId('current-estate')).toBeVisible();
  await expect(page.getByTestId('current-estate-flag')).toContainText(
    'MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms',
  );

  await settleDeck(page, '.cu-slide');
  await page.screenshot({ path: shot('live-cutover.png'), fullPage: true });

  // The target estate carries the same locked ledger.
  await page.goto('/live/deck-cloud-migration?slide=3');
  await expect(page.getByTestId('cutover-counter')).toContainText('03 / 10');
  await expect(page.getByTestId('target-estate-flag')).toContainText(
    'MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms',
  );
});
