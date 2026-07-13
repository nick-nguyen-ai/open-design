import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Batch-2 decks D: three live slide-deck worlds — The Planning Wall, The
 * Preprint, and The Campaign Room — each structurally and atmospherically
 * distinct from every shipped deck and from each other. Each test lands on a
 * commanding CONTENT slide (never the title) via ?slide=, exercises the shared
 * deck mechanics, and captures the full-page evidence screenshot.
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
  await page.waitForTimeout(600);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live planning wall: the milestone route, the red-circled dependency, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-project-kickoff');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('wall-counter')).toContainText('01 / 10');

  // Deep-link to the milestone route (the commanding visual): M3 is red-circled
  // and annotated DEPENDENCY UNCONFIRMED — the anomaly.
  await page.goto('/live/deck-project-kickoff?slide=4');
  await expect(page.getByTestId('wall-counter')).toContainText('04 / 10');
  await expect(page.getByTestId('route-flag')).toContainText(
    'DEPENDENCY UNCONFIRMED — DATA PLATFORM SIGN-OFF',
  );

  await settleDeck(page, '.pw-slide');
  await page.screenshot({ path: shot('live-planning-wall.png'), fullPage: true });

  // Keyboard mechanics: End reaches the ask, Home returns to the title.
  await page.keyboard.press('End');
  await expect(page.getByTestId('wall-counter')).toContainText('10 / 10');
  await page.keyboard.press('Home');
  await expect(page.getByTestId('wall-counter')).toContainText('01 / 10');
});

test('live preprint: the confidence-interval plate, the non-replicating finding, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-research-discussion');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('paper-counter')).toContainText('01 / 10');

  // Deep-link to Figure 3, the CI dot-whisker plate (the commanding visual):
  // F3's interval crosses zero.
  await page.goto('/live/deck-research-discussion?slide=6');
  await expect(page.getByTestId('paper-counter')).toContainText('06 / 10');
  await expect(page.getByTestId('ci-plate')).toContainText('DOES NOT REPLICATE (n=12)');

  await settleDeck(page, '.pp-slide');
  await page.screenshot({ path: shot('live-preprint.png'), fullPage: true });

  // The R key jumps to the replication page.
  await page.keyboard.press('r');
  await expect(page.getByTestId('paper-counter')).toContainText('07 / 10');
  await expect(page.getByTestId('replication-stamp')).toContainText('DOES NOT REPLICATE (n=12)');
});

test('live campaign room: the funnel, the cut channel, the interactive channel mix, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-marketing-campaign');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('campaign-counter')).toContainText('01 / 09');

  // Deep-link to the funnel (the spine visual): PAID SOCIAL is struck through.
  await page.goto('/live/deck-marketing-campaign?slide=4');
  await expect(page.getByTestId('campaign-counter')).toContainText('04 / 09');
  await expect(page.getByTestId('funnel-cut')).toContainText('PAID SOCIAL — CUT · CAC 4.1× TARGET');

  await settleDeck(page, '.cr-slide');
  await page.screenshot({ path: shot('live-campaign-room.png'), fullPage: true });

  // The channel-mix slide: focus a segment, arrow to the next, readout mirrors.
  await page.goto('/live/deck-marketing-campaign?slide=5');
  await expect(page.getByTestId('campaign-counter')).toContainText('05 / 09');
  const seg = page.getByTestId('channel-seg-search');
  await seg.focus();
  await expect(page.getByTestId('channel-readout')).toContainText('Search');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByTestId('channel-readout')).toContainText('Partnerships');
});
