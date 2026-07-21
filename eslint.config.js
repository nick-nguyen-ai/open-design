// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.claude/worktrees/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.vite/**',
      '**/storybook-static/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/*.tsbuildinfo',
      '**/.superpowers/**',
      'packages/registry/generated/**',
      'apps/mcp-server/render-out/**',
      'pnpm-lock.yaml',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      // Pinned (not 'detect') so linting the workspace root — where `react`
      // isn't installed as a root dependency — doesn't emit the noisy
      // "React version was set to detect ... react not installed" warning.
      react: { version: '19' },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.flat['recommended-latest'].rules,
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // MOTION-003 (minimal form): literal cubic-bezier(...) easing values are
    // banned outside the motion identity's own packages, so every animation
    // shares one source of truth (packages/design-tokens) via the
    // packages/motion adapter instead of ad-hoc curves.
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    // eslint.config.js itself is exempt: the guard's own rule definitions below
    // necessarily contain the string "cubic-bezier(" (as a regex source and in
    // the error message), which would otherwise self-trigger.
    ignores: ['packages/motion/**', 'packages/design-tokens/**', 'eslint.config.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/cubic-bezier\\(/]',
          message:
            'Literal cubic-bezier(...) values are banned outside packages/motion and packages/design-tokens (MOTION-003). Import easings from @enterprise-design/motion instead.',
        },
        {
          selector: 'TemplateElement[value.raw=/cubic-bezier\\(/]',
          message:
            'Literal cubic-bezier(...) values are banned outside packages/motion and packages/design-tokens (MOTION-003). Import easings from @enterprise-design/motion instead.',
        },
      ],
    },
  },
  {
    // Standalone evidence/asset-generation scripts (the docs/ screenshot
    // runners, the gallery preview shooter, the open-design skill's verify
    // rig) execute in Node and drive a browser page — the rig's probes are
    // additionally SERIALIZED into page context — so they legitimately
    // reference Node + DOM globals.
    files: ['docs/**/*.mjs', 'apps/gallery/scripts/**/*.mjs', '.claude/skills/open-design/scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        document: 'readonly',
        Node: 'readonly',
        getComputedStyle: 'readonly',
      },
    },
  },
  prettierConfig,
);
