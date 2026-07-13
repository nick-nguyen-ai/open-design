import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SCREENSHOT_PATH = resolve(process.cwd(), 'e2e/screenshots/landing.png');

/**
 * The signature motion sequences animate opacity via requestAnimationFrame
 * (Framer Motion), which Playwright's screenshot `animations: 'disabled'` does
 * not freeze. Wait until every sequence item has fully settled to opacity 1 so
 * the captured screenshot is deterministic.
 */
async function waitForMotionSettled(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const items = document.querySelectorAll(
      '[data-testid^="horizon-sweep-item"], [data-testid^="ledger-reveal-item"]',
    );
    if (items.length === 0) return false;
    return Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
  });
}

test('landing renders 59 templates, toggles theme + motion, opens a quick preview', async ({
  page,
}) => {
  await page.goto('/');

  // Header + hero + search render.
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('bank-credible templates');
  const search = page.getByRole('searchbox', {
    name: /search templates, components, and grammars/i,
  });
  await expect(search).toBeVisible();

  // The result grid contains all 59 template cards (experiences), even in the
  // default All mode.
  const templateCards = page.locator('button[aria-label^="Template:"]');
  await expect(templateCards).toHaveCount(59);

  // Theme toggle flips the document theme attribute.
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.getByRole('button', { name: /switch to (light|dark) theme/i }).click();
  await expect(html).not.toHaveAttribute('data-theme', before ?? '');

  // Reduced-motion toggle cycles its state.
  const motionButton = page.getByRole('button', { name: /^Motion:/ });
  const motionBefore = await motionButton.getAttribute('aria-label');
  await motionButton.click();
  await expect(motionButton).not.toHaveAttribute('aria-label', motionBefore ?? '');

  // Capture landing-page evidence once the entrance sequences have settled.
  await waitForMotionSettled(page);
  mkdirSync(dirname(SCREENSHOT_PATH), { recursive: true });
  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });

  // Open a quick preview: the drawer traps into a dialog with a detail link.
  await templateCards.first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /view full detail/i })).toBeVisible();

  // Escape closes and returns to the grid.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('search narrows the result set and mode is reflected in the URL', async ({ page }) => {
  await page.goto('/');
  const templateCards = page.locator('button[aria-label^="Template:"]');
  await expect(templateCards).toHaveCount(59);

  await page
    .getByRole('searchbox', { name: /search templates, components, and grammars/i })
    .fill('model risk');

  // Fewer, relevant results after querying.
  await expect(async () => {
    const count = await templateCards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(59);
  }).toPass();

  await expect(page).toHaveURL(/q=model\+risk|q=model%20risk/);
});
