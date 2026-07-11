/**
 * Side-effect import: registers `@testing-library/jest-dom`'s matchers on
 * Vitest's `expect`. See `packages/primitives/src/test/jest-dom-setup.ts`
 * for the full rationale; identical wiring, duplicated per-package since
 * each package's tests run in isolation.
 */
import '@testing-library/jest-dom/vitest';
