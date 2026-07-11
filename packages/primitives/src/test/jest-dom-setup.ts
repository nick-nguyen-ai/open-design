/**
 * Side-effect import: registers `@testing-library/jest-dom`'s matchers
 * (`toBeInTheDocument`, `toHaveFocus`, `toBeDisabled`, `toHaveAttribute`, …)
 * on Vitest's `expect`. The `/vitest` entry point extends `expect` AND
 * supplies its own `declare module 'vitest'` typings, so no manual type
 * augmentation is needed here (unlike `jest-axe`; see `axe-setup.ts`).
 */
import '@testing-library/jest-dom/vitest';
