import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

/** Fonts loaded + every DataInkDraw group fully opaque + a beat for the draw. */
async function settleDraw(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const groups = document.querySelectorAll('[data-testid^="data-ink-draw-group"]');
    return groups.length > 0 && Array.from(groups).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(1200);
}

/** Fonts loaded + every HorizonSweep item fully opaque + a beat. */
async function settleSweep(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('[data-testid^="horizon-sweep-item"]');
    return items.length > 0 && Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(700);
}

/** Fonts loaded + every LedgerReveal item fully opaque + a beat. */
async function settleReveal(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('[data-testid^="ledger-reveal-item"]');
    return items.length > 0 && Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(600);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live personal: The Line draws the career as one line and keeps the switchback', async ({
  page,
}) => {
  await page.goto('/live/home-career-project-timeline');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('twelve years');
  await expect(page.getByTestId('synthetic-mark')).toContainText('ILLUSTRATIVE PROFILE');

  // The switchback anomaly is drawn and labelled; the station table mirrors it.
  await expect(page.getByTestId('switchback')).toContainText('REVERSED OUT');
  await expect(page.getByTestId('station-table')).toContainText('switchback, reversed out');

  await settleDraw(page);
  await page.screenshot({ path: shot('live-the-line.png'), fullPage: true });
});

test('live personal: The Dawn Wall flows the confluence and credits the departed stream', async ({
  page,
}) => {
  await page.goto('/live/home-team-contribution-impact-page');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('confluence');

  await expect(page.getByTestId('lead-card')).toContainText('measures the team, not me');
  await expect(page.getByTestId('the-confluence')).toBeVisible();
  await expect(page.getByTestId('contributions-table')).toContainText('Wei Zhang');

  await settleSweep(page);
  await page.screenshot({ path: shot('live-dawn-wall.png'), fullPage: true });
});

test('live personal: The Reading Room stands the shelf and opens a volume in place', async ({
  page,
}) => {
  await page.goto('/live/home-mentoring-tutorial-hub');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('synthetic-mark')).toContainText('ILLUSTRATIVE PROFILE');

  // Open the first volume so the screenshot shows a disclosed table of contents.
  const firstVolume = page.locator('.rr-volume').first();
  await firstVolume.locator('summary').click();
  await expect(firstVolume).toHaveAttribute('open', '');

  // The retired volume is honestly labelled.
  await expect(page.getByTestId('retired-volume')).toBeVisible();

  await settleReveal(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: shot('live-reading-room.png'), fullPage: true });
});
