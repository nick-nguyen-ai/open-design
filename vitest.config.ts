import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/src/**/*.{test,spec}.{ts,tsx}', 'apps/*/src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    passWithNoTests: true,
    // 65 live-world suites render full experiences under jsdom + axe; at full
    // CPU parallelism their 15s render timeouts flake from sheer contention.
    maxWorkers: '50%',
  },
});
