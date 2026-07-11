/**
 * Shared axe wiring (mirrors the packages' convention). Import for the
 * `expect.extend` side effect in any file asserting `toHaveNoViolations()`.
 */
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

declare module 'vitest' {
  // Shape must match Vitest's own `Assertion<T = any>` for declaration merging.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

export { axe } from 'jest-axe';
