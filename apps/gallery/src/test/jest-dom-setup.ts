/**
 * Side-effect import: registers `@testing-library/jest-dom`'s matchers on
 * Vitest's `expect`. Import once per test file (the monorepo convention — no
 * global setupFiles, so each file declares its own environment + matchers).
 */
import '@testing-library/jest-dom/vitest';
