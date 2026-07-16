/**
 * Shared axe wiring. See `packages/primitives/src/test/axe-setup.ts` for the
 * full rationale (`jest-axe` over `vitest-axe`); identical wiring, duplicated
 * per-package since each package's tests run in isolation.
 */
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

export { axe } from 'jest-axe';
