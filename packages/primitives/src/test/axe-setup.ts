/**
 * Shared axe wiring for a11y assertion tests. `jest-axe` (not `vitest-axe`)
 * was chosen deliberately: `vitest-axe` has been unmaintained since 2022 and
 * pins an old `axe-core` (^4.4.2), while `jest-axe` ships a current
 * `axe-core` (4.10.x) and its matcher API (`expect.extend` + a plain
 * `toHaveNoViolations()` result-object matcher) has no dependency on Jest's
 * runtime — it works against Vitest's `expect` unchanged.
 *
 * Import this module (for its `expect.extend` side effect) in any test file
 * that asserts `toHaveNoViolations()`.
 */
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// `@types/jest-axe` only augments Jest's global `jest.Matchers` interface, not
// Vitest's `Assertion` — declare the matcher's shape for Vitest's own `expect`
// so `toHaveNoViolations()` type-checks here without pulling in `@types/jest`
// as an ambient global.
declare module 'vitest' {
  // The type parameter (name, constraint, and default) must match Vitest's
  // own `Assertion<T = any>` exactly for declaration merging to type-check,
  // hence the narrow exceptions here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

export { axe } from 'jest-axe';
