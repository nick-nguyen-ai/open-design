import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

/**
 * Live pages settle when (a) every data-ink-draw group has faded to opacity
 * 1, (b) the self-hosted fonts are loaded, and (c) ECharts has painted. The
 * cockpit's continuous sweep/halo/clock are then HELD via the page's own
 * pause affordance so full-page screenshots are deterministic.
 */
async function settleLive(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const groups = document.querySelectorAll('[data-testid^="data-ink-draw-group-"]');
    if (groups.length === 0) return false;
    return Array.from(groups).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.locator('[data-testid="chart-mount"] canvas, [data-testid="chart-mount"] svg').first().waitFor();
  await page.waitForTimeout(600);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live cockpit: full-bleed world renders, holds, and screenshots', async ({ page }) => {
  await page.goto('/live/db-model-monitoring-cockpit');

  // The page owns the viewport: no gallery banner, its own h1 statement.
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Twelve models');
  await expect(page.getByTestId('drift-scope')).toBeVisible();

  // The scope's accessible mirror carries the breaching model + threshold.
  const watchlist = page.getByTestId('fleet-watchlist');
  await expect(watchlist).toContainText('card-fraud-v4');
  await expect(watchlist).toContainText('0.250');

  // Chrome affordances: return link + live clock.
  await expect(page.getByRole('link', { name: '◄ GALLERY' })).toBeVisible();
  await expect(page.getByTestId('watch-clock')).toBeVisible();

  await settleLive(page);

  // Hold the sweep via the page's own affordance (deterministic evidence).
  await page.getByRole('button', { name: /hold sweep/i }).click();
  await expect(page.getByText('SCOPE HELD ◦')).toBeVisible();

  await page.screenshot({ path: shot('live-cockpit.png'), fullPage: true });
});

test('live architecture: the drawing office renders and screenshots', async ({ page }) => {
  await page.goto('/live/exp-system-architecture');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('as built');
  await expect(page.getByTestId('architecture-drawing')).toBeVisible();

  // Title block + schedule of parts (the drawing's accessible equivalents).
  const titleBlock = page.getByTestId('title-block');
  await expect(titleBlock).toContainText('EDI-ARCH-004');
  await expect(titleBlock).toContainText('ISSUED AS BUILT');
  const schedule = page.getByTestId('schedule-of-parts');
  await expect(schedule).toContainText('FEATURE STORE');
  await expect(schedule).toContainText('DRIFT & MONITORING');

  await settleLive(page);
  await page.screenshot({ path: shot('live-architecture.png'), fullPage: true });
});

test('landing Live affordance navigates to the live cockpit', async ({ page }) => {
  await page.goto('/');
  const liveLink = page.getByRole('link', { name: 'Open live template: Model Monitoring Cockpit' });
  await liveLink.scrollIntoViewIfNeeded();
  await liveLink.click();
  await expect(page).toHaveURL(/\/live\/db-model-monitoring-cockpit/);
  await expect(page.getByTestId('drift-scope')).toBeVisible();

  // The discreet chrome affordance returns to the gallery.
  await page.getByRole('link', { name: '◄ GALLERY' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('banner')).toBeVisible();
});
