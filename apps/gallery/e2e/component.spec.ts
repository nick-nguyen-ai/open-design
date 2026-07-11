import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SCREENSHOT_PATH = resolve(process.cwd(), 'e2e/screenshots/component-trend-chart.png');

test('component detail renders a live chart with non-zero size', async ({ page }) => {
  await page.goto('/components/comp.trend-chart');

  await expect(page.getByRole('heading', { level: 1, name: 'Trend Chart' })).toBeVisible();

  const preview = page.getByTestId('live-preview');
  await expect(preview).toBeVisible();

  // The ECharts SVG-renderer mounts a real <svg>; assert it has non-zero size.
  const svg = preview.locator('svg').first();
  await expect(svg).toBeVisible();
  const box = await svg.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);

  mkdirSync(dirname(SCREENSHOT_PATH), { recursive: true });
  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });
});
