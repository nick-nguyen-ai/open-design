import { describe, expect, it } from 'vitest';
import { proposeFill, buildFillModule, buildManifest } from './scaffold.js';

/**
 * The generation half of the ingestion engine. `proposeFill` walks a shipped
 * content shape and emits a Zod schema SKELETON — every cap and bound flagged
 * with an `AUTHOR:` marker so the scaffold cannot ship unfinished (the certifier
 * refuses `AUTHOR:` markers). These tests pin the marker-carrying source it emits.
 */
describe('proposeFill — recursive shape walk', () => {
  it('emits a flagged string cap (floored so a tiny cap is not proposed)', () => {
    const src = proposeFill({ title: 'Hi' });
    expect(src).toContain('title: z.string().min(1).max(/* AUTHOR: cap */ 12)');
  });

  it('caps a long string at ceil(len * 1.3)', () => {
    const src = proposeFill({ headline: 'x'.repeat(30) });
    // ceil(30 * 1.3) = 39, above the floor of 12.
    expect(src).toContain('headline: z.string().min(1).max(/* AUTHOR: cap */ 39)');
  });

  it('emits array bounds flagged with AUTHOR and recurses the element (inline object)', () => {
    const src = proposeFill({ items: [{ label: 'A', value: 3 }] });
    expect(src).toContain(
      'items: z.array(z.object({ label: z.string().min(1).max(/* AUTHOR: cap */ 12), value: z.number() })).min(1).max(/* AUTHOR: bounds */ 2)',
    );
  });

  it('recurses into nested objects', () => {
    const src = proposeFill({ meta: { author: 'Jane Doe' } });
    expect(src).toContain('meta: z.object({ author: z.string().min(1).max(/* AUTHOR: cap */ 12) })');
  });

  it('emits z.number() for numbers and z.boolean() for booleans', () => {
    const src = proposeFill({ count: 3, active: true });
    expect(src).toContain('count: z.number()');
    expect(src).toContain('active: z.boolean()');
  });

  it('emits a flagged z.unknown() for null / undefined values', () => {
    const src = proposeFill({ a: null, b: undefined });
    expect(src).toContain('a: z.unknown() /* AUTHOR: type me */');
    expect(src).toContain('b: z.unknown() /* AUTHOR: type me */');
  });

  it('wraps the top level in a multi-line z.object', () => {
    const src = proposeFill({ title: 'Hi' });
    expect(src.startsWith('z.object({\n')).toBe(true);
    expect(src.trimEnd().endsWith('})')).toBe(true);
  });
});

describe('buildFillModule — the <id>-fill.ts skeleton', () => {
  const module = buildFillModule({
    templateId: 'the-line',
    experienceId: 'home-career-project-timeline',
    shape: { title: 'Hi', chapters: [{ label: 'A' }] },
  });

  it('exports the standard certifier aliases and a PascalCase fill schema', () => {
    expect(module).toContain('export const TheLineFill = z.object({');
    expect(module).toContain('export type TheLineFill = z.infer<typeof TheLineFill>;');
    expect(module).toContain('export const FILL_SCHEMA = TheLineFill;');
    expect(module).toContain('export const SECTIONS = THE_LINE_SECTIONS;');
  });

  it('emits a single page section listing every top-level slot with AUTHOR guidance', () => {
    expect(module).toContain('export const THE_LINE_SECTIONS: SectionSpec[] = [');
    expect(module).toContain("kind: 'page'");
    expect(module).toContain("name: 'title'");
    expect(module).toContain("name: 'chapters'");
    expect(module).toContain("guidance: 'AUTHOR:");
    // the array slot is typed 'items' and the string slot 'text'
    expect(module).toContain("type: 'items'");
    expect(module).toContain("type: 'text'");
  });

  it('imports z and the SectionSpec type', () => {
    expect(module).toContain("import { z } from 'zod';");
    expect(module).toContain("import type { SectionSpec } from '@enterprise-design/contracts';");
  });
});

describe('buildManifest — the <experience-id>.worldtemplate.manifest.ts skeleton', () => {
  const manifest = buildManifest({
    templateId: 'the-line',
    experienceId: 'home-career-project-timeline',
  });

  it('parses as a descriptor shell with ids filled and AUTHOR markers on the craft fields', () => {
    expect(manifest).toContain("schemaVersion: '1.1'");
    expect(manifest).toContain("id: 'the-line'");
    expect(manifest).toContain("experienceId: 'home-career-project-timeline'");
    expect(manifest).toContain('sections: THE_LINE_SECTIONS');
    expect(manifest).toContain('AUTHOR:');
    expect(manifest).toContain("import { THE_LINE_SECTIONS } from './the-line-fill.js';");
  });
});
