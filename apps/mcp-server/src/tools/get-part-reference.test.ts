import { describe, expect, it } from 'vitest';
import { getPartReferenceTool } from './get-part-reference.js';

describe('get_part_reference', () => {
  it('resolves a known part to its implementing files + stylesheets', () => {
    const outcome = getPartReferenceTool({ partId: 'deck-cloud-migration/waves/swimlanes' });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const paths = outcome.data.files.map((f) => f.path);
    expect(paths).toContain('CutoverTemplate.tsx');
    expect(paths.some((p) => p.endsWith('.css'))).toBe(true);
    for (const f of outcome.data.files) {
      expect(f.uri).toBe(`opendesign://parts/deck-cloud-migration/${f.path}`);
    }
  });

  it('resolves a dynamic (template-literal) part id via its tail segment', () => {
    const outcome = getPartReferenceTool({ partId: 'deck-cloud-migration/estate/estate-diagram' });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.data.files.map((f) => f.path)).toContain('CutoverTemplate.tsx');
  });

  it('NOT_FOUND for an unknown part, with nearby part-id suggestions', () => {
    const outcome = getPartReferenceTool({ partId: 'deck-cloud-migration/nope/nothing' });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe('NOT_FOUND');
    expect(outcome.error.details!.join(' ')).toContain('deck-cloud-migration/');
  });

  it('NOT_FOUND for an unknown experience', () => {
    const outcome = getPartReferenceTool({ partId: 'no-such-world/a/b' });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe('NOT_FOUND');
  });
});
