import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright smoke config. Runs against the built app served by `vite preview`
 * so the evidence matches production output. Deterministic: the specs wait for
 * the signature entrance sequences to settle (opacity 1) before asserting or
 * screenshotting, so full-motion rAF animations don't cause flake.
 */
const PORT = 4318;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  outputDir: './e2e/.artifacts/test-results',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `corepack pnpm exec vite preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
