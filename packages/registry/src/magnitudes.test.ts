import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { deriveAllShippedMagnitudes, deriveShippedMagnitudes, deriveSlotMagnitude } from './magnitudes.js';
import type { Diagnostic } from './types.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, '..', '..', '..');

describe('deriveSlotMagnitude', () => {
  it('measures a string slot', () => {
    expect(deriveSlotMagnitude('One system, five surfaces')).toEqual({ chars: 25 });
  });

  it('measures a string array by max element length', () => {
    expect(deriveSlotMagnitude(['ab', 'abcd', 'a'])).toEqual({ itemChars: 4 });
  });

  it('measures object arrays per string field, max across elements', () => {
    const magnitude = deriveSlotMagnitude([
      { id: 'a', label: 'Segment', detail: 'short' },
      { id: 'bb', label: 'Manifest', detail: 'a much longer detail line' },
    ]);
    expect(magnitude).toEqual({ fields: { id: 2, label: 8, detail: 25 } });
  });

  it('measures one nested level of string-array fields (tableRows values)', () => {
    const magnitude = deriveSlotMagnitude([
      { label: 'Latency', values: ['3-30s', 'sub-second'] },
      { label: 'Reach', values: ['everywhere Apple', 'browsers'] },
    ]);
    expect(magnitude?.fields?.values).toBe('everywhere Apple'.length);
  });

  it('returns undefined for numbers, booleans, and content-free arrays', () => {
    expect(deriveSlotMagnitude(4)).toBeUndefined();
    expect(deriveSlotMagnitude(true)).toBeUndefined();
    expect(deriveSlotMagnitude([])).toBeUndefined();
    expect(deriveSlotMagnitude([1, 2, 3])).toBeUndefined();
    expect(deriveSlotMagnitude(undefined)).toBeUndefined();
  });
});

describe('deriveShippedMagnitudes', () => {
  const descriptor = {
    sections: [
      {
        kind: 'cover',
        purpose: 'p',
        slots: [
          { name: 'deck.title', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'g' },
          { name: 'deck.count', type: 'number', required: true, limits: {}, guidance: 'g' },
          { name: 'missing.slot', type: 'text', required: false, limits: {}, guidance: 'g' },
        ],
      },
    ],
  } as never;

  it('maps slot dot-paths to magnitudes, skipping unmeasurable and unresolved slots', () => {
    const fill = { deck: { title: 'Hello deck', count: 7 } };
    const derived = deriveShippedMagnitudes(descriptor, fill);
    expect(derived).toEqual({ 'deck.title': { chars: 10 } });
  });
});

describe('deriveAllShippedMagnitudes — real workspace', () => {
  it('derives magnitudes for the shipped dgm-circuit world, incl. the cells detail field', async () => {
    const manifestPath = path.join(
      REPO_ROOT,
      'experiences',
      'slide-decks',
      'deck-dgm-circuit',
      'dgm-circuit.worldtemplate.manifest.ts',
    );
    const mod = (await import(/* @vite-ignore */ `file://${manifestPath.replace(/\\/g, '/')}`)) as {
      default: never;
    };
    const diagnostics: Diagnostic[] = [];
    const all = await deriveAllShippedMagnitudes([{ manifest: mod.default, path: manifestPath }], diagnostics);
    expect(diagnostics).toEqual([]);

    const circuit = all['dgm-circuit'];
    expect(circuit).toBeDefined();
    // The motivating case: the shipped cells details are ~25-40 chars while the
    // descriptor cap is far looser — the derived magnitude is what validate_fill
    // will budget against.
    const detail = circuit?.['cells.cells']?.fields?.detail;
    expect(detail).toBeGreaterThan(10);
    expect(detail).toBeLessThan(80);
    // A plain string slot is measured too.
    expect(circuit?.['deck.title']?.chars).toBeGreaterThan(0);
  });

  it('reports a broken world as an error diagnostic, never throws', async () => {
    const diagnostics: Diagnostic[] = [];
    const bogus = {
      manifest: { id: 'bogus', sections: [] } as never,
      path: path.join(REPO_ROOT, 'experiences', 'no-such-world', 'bogus.worldtemplate.manifest.ts'),
    };
    const all = await deriveAllShippedMagnitudes([bogus], diagnostics);
    expect(all.bogus).toBeUndefined();
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.ruleId).toBe('MAGNITUDE_DERIVATION_FAILED');
    expect(diagnostics[0]?.severity).toBe('error');
  });
});
