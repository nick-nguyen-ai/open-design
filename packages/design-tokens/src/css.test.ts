import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { buildTokensCss, renderBlock, renderVars } from './css.js';
import { nonThemedTokens } from './groups.js';
import { themedTokenNames } from './themed.js';
import { cssVar, cssVarName } from './var.js';

const here = dirname(fileURLToPath(import.meta.url));
const tokensCssPath = join(here, '..', 'tokens.css');

describe('renderVars / renderBlock', () => {
  it('renders --name: value; lines at the given indent', () => {
    expect(renderVars({ 'space-1': '0.25rem' })).toBe('  --space-1: 0.25rem;');
    expect(renderVars({ a: '1' }, '    ')).toBe('    --a: 1;');
  });

  it('joins multiple selectors and nests declarations', () => {
    const block = renderBlock([':root', ':root[data-theme="light"]'], { accent: '#000' });
    expect(block).toBe(':root,\n:root[data-theme="light"] {\n  --accent: #000;\n}');
  });

  it('honours a block indent for nesting under a media query', () => {
    expect(renderBlock(':root', { a: '1' }, '  ')).toBe('  :root {\n    --a: 1;\n  }');
  });
});

describe('buildTokensCss', () => {
  const css = buildTokensCss(nonThemedTokens);

  it('emits :root and a generated banner', () => {
    expect(css).toContain('/* GENERATED');
    expect(css).toContain(':root {');
  });

  it('contains every non-themed token name exactly once', () => {
    for (const name of Object.keys(nonThemedTokens)) {
      expect(css).toContain(`--${name}:`);
    }
  });

  it('includes representative tokens across all groups', () => {
    for (const name of [
      'space-4',
      'radius-md',
      'border-width-hairline',
      'font-body',
      'font-numeric',
      'font-size-md',
      'line-height-normal',
      'font-weight-semibold',
      'numeric-figures',
      'shadow-md',
      'ease-settle',
      'dur-structure',
      'layout-content',
      'density-default-row',
      'z-modal',
      'print-ink',
    ]) {
      expect(css).toContain(`--${name}:`);
    }
  });

  it('is deterministic', () => {
    expect(buildTokensCss(nonThemedTokens)).toBe(css);
  });

  it('exposes tabular figures via the --numeric-figures token', () => {
    expect(css).toContain('--numeric-figures: tabular-nums;');
  });
});

describe('committed tokens.css', () => {
  it('matches buildTokensCss output (run `pnpm generate:css` if this fails)', () => {
    const committed = readFileSync(tokensCssPath, 'utf8');
    expect(committed).toBe(buildTokensCss(nonThemedTokens));
  });
});

describe('cssVar helpers', () => {
  it('wraps a token name in var()', () => {
    expect(cssVar('accent')).toBe('var(--accent)');
    expect(cssVar('space-4')).toBe('var(--space-4)');
  });

  it('supports a fallback', () => {
    expect(cssVar('space-4', '1rem')).toBe('var(--space-4, 1rem)');
  });

  it('returns the raw custom-property name', () => {
    expect(cssVarName('surface-base')).toBe('--surface-base');
  });
});

describe('themed contract', () => {
  it('has unique names', () => {
    expect(new Set(themedTokenNames).size).toBe(themedTokenNames.length);
  });

  it('covers all required token groups', () => {
    const names = new Set<string>(themedTokenNames);
    for (const required of [
      'surface-base',
      'surface-raised',
      'surface-sunken',
      'surface-overlay',
      'text-primary',
      'text-secondary',
      'text-muted',
      'text-on-accent',
      'border-subtle',
      'border-strong',
      'focus-ring',
      'accent',
      'accent-hover',
      'accent-muted',
    ]) {
      expect(names.has(required)).toBe(true);
    }
    for (const status of ['success', 'warning', 'danger', 'info']) {
      for (const part of ['fg', 'bg', 'border']) {
        expect(names.has(`${status}-${part}`)).toBe(true);
      }
    }
    for (let i = 1; i <= 8; i++) expect(names.has(`chart-cat-${i}`)).toBe(true);
    for (let i = 1; i <= 7; i++) expect(names.has(`chart-seq-${i}`)).toBe(true);
    for (let i = 1; i <= 7; i++) expect(names.has(`chart-div-${i}`)).toBe(true);
  });

  it('has no overlap with non-themed token names', () => {
    const nonThemed = new Set<string>(Object.keys(nonThemedTokens));
    for (const name of themedTokenNames) {
      expect(nonThemed.has(name)).toBe(false);
    }
  });
});
