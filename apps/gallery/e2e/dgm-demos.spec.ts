/**
 * Diagram-collections goal e2e — the five composed samples at /demo/* click
 * through end to end against the BUILT gallery: the route loads, the deck
 * advances via the template's real next button to a diagram slide (the
 * family renderer with its outline mirror is in the DOM), and the console
 * stays clean of errors.
 */
import { expect, test } from '@playwright/test';

const SAMPLES = [
  { route: '/demo/https-handshake', rootTestId: 'live-dgm-sketchnote', family: 'sketchnote' },
  { route: '/demo/payment-rails', rootTestId: 'live-dgm-blueprint', family: 'blueprint' },
  { route: '/demo/million-users', rootTestId: 'live-dgm-circuit', family: 'circuit' },
  { route: '/demo/kubernetes-anatomy', rootTestId: 'live-dgm-isometric', family: 'isometric' },
  { route: '/demo/caching-field-guide', rootTestId: 'live-dgm-gazette', family: 'gazette' },
] as const;

const KINDS = ['flow', 'sequence', 'layers', 'zones', 'cycle', 'compare', 'cells', 'timeline'] as const;

for (const sample of SAMPLES) {
  test(`${sample.route} clicks through all ten slides of the ${sample.family} tour`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto(sample.route);
    const root = page.getByTestId(sample.rootTestId);
    await expect(root).toBeVisible();

    const counter = page.getByTestId(`${sample.rootTestId}-counter`);
    await expect(counter).toHaveText('01 / 10');

    const next = page.getByRole('button', { name: 'Next slide' });
    for (let slide = 2; slide <= 10; slide += 1) {
      await next.click();
      await expect(counter).toHaveText(`${String(slide).padStart(2, '0')} / 10`);
      if (slide >= 2 && slide <= 9) {
        const kind = KINDS[slide - 2]!;
        const figure = page.getByTestId(`dgm-${sample.family}-${kind}`);
        await expect(figure).toBeVisible();
        // the grammar's textual mirror rides along inside the figure
        await expect(figure.locator('.dgm-outline')).toBeAttached();
      }
    }

    await expect(next).toBeDisabled();
    expect(errors, `console errors on ${sample.route}: ${errors.join('\n')}`).toEqual([]);
  });
}
