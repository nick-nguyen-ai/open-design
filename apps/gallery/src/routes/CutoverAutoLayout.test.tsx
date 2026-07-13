// @vitest-environment jsdom
/**
 * Review-fix coverage for "The Cutover": estate/rollback geometry is now OPTIONAL
 * (content-only fill contract), with a deterministic template-owned auto-layout.
 *
 * Asserts:
 *   • a coordinate-free, schema-valid fill renders every estate node inside the
 *     canvas with no two node rects overlapping (read from the rendered DOM);
 *   • out-of-bounds AUTHORED coords are rejected by the schema;
 *   • the side-derivation for a coordinate-free edge yields a valid facing pair.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import '../test/jest-dom-setup.js';
import CutoverTemplate, {
  deriveSides,
} from '../../../../experiences/slide-decks/deck-cloud-migration/CutoverTemplate.js';
import { CutoverFill } from '../../../../experiences/slide-decks/deck-cloud-migration/cutover-fill.js';
import { cutoverFill } from '../../../../experiences/slide-decks/deck-cloud-migration/content.js';

vi.setConfig({ testTimeout: 30_000 });

const ESTATE_W = 1020;
const ESTATE_H = 560;

function omit<T extends object>(obj: T, keys: readonly string[]): T {
  const clone: Record<string, unknown> = { ...obj };
  for (const key of keys) delete clone[key];
  return clone as T;
}

/** The shipped fill with every authored coordinate / side stripped out. */
const coordinateFreeFill = CutoverFill.parse({
  ...cutoverFill,
  nodes: cutoverFill.nodes.map((n) => omit(n, ['cx', 'cy', 'tx', 'ty'])),
  currentEdges: cutoverFill.currentEdges.map((e) => omit(e, ['fromSide', 'toSide'])),
  targetEdges: cutoverFill.targetEdges.map((e) => omit(e, ['fromSide', 'toSide'])),
  rollback: {
    ...cutoverFill.rollback,
    nodes: cutoverFill.rollback.nodes.map((n) => omit(n, ['x', 'y'])),
  },
});

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function nodeRects(testid: string): Rect[] {
  const svg = screen.getByTestId(testid);
  return Array.from(svg.querySelectorAll('rect.cu-node-box')).map((r) => ({
    x: Number.parseFloat(r.getAttribute('x')!),
    y: Number.parseFloat(r.getAttribute('y')!),
    w: Number.parseFloat(r.getAttribute('width')!),
    h: Number.parseFloat(r.getAttribute('height')!),
  }));
}

function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('The Cutover — deterministic estate auto-layout', () => {
  it('lays a coordinate-free fill out inside the canvas with no overlaps', () => {
    render(
      <MotionProvider reducedMotion>
        <MemoryRouter>
          <CutoverTemplate fill={coordinateFreeFill} />
        </MemoryRouter>
      </MotionProvider>,
    );

    for (const testid of ['current-estate', 'target-estate']) {
      const rects = nodeRects(testid);
      expect(rects).toHaveLength(coordinateFreeFill.nodes.length);

      for (const r of rects) {
        expect(r.x).toBeGreaterThanOrEqual(0);
        expect(r.y).toBeGreaterThanOrEqual(0);
        expect(r.x + r.w).toBeLessThanOrEqual(ESTATE_W);
        expect(r.y + r.h).toBeLessThanOrEqual(ESTATE_H);
      }

      for (let i = 0; i < rects.length; i += 1) {
        for (let j = i + 1; j < rects.length; j += 1) {
          expect(overlaps(rects[i]!, rects[j]!)).toBe(false);
        }
      }
    }
  });

  it('rejects out-of-bounds authored estate coords', () => {
    const offCanvas = {
      ...cutoverFill,
      nodes: cutoverFill.nodes.map((n, i) => (i === 0 ? { ...n, cx: 1000 } : n)),
    };
    expect(CutoverFill.safeParse(offCanvas).success).toBe(false);

    const belowCanvas = {
      ...cutoverFill,
      nodes: cutoverFill.nodes.map((n, i) => (i === 0 ? { ...n, ty: 560 } : n)),
    };
    expect(CutoverFill.safeParse(belowCanvas).success).toBe(false);
  });

  it('derives a valid facing side pair for a coordinate-free edge', () => {
    const valid: readonly string[] = ['l', 'r', 't', 'b'];

    // target to the right → leaves right, enters left
    expect(deriveSides({ x: 0, y: 0 }, { x: 400, y: 0 })).toEqual({ fromSide: 'r', toSide: 'l' });
    // target below → leaves bottom, enters top
    expect(deriveSides({ x: 0, y: 0 }, { x: 0, y: 400 })).toEqual({ fromSide: 'b', toSide: 't' });

    // any relative placement yields a valid, non-equal facing pair on one axis
    const s = deriveSides({ x: 100, y: 100 }, { x: 50, y: 300 });
    expect(valid).toContain(s.fromSide);
    expect(valid).toContain(s.toSide);
    expect(s.fromSide).not.toBe(s.toSide);
  });
});
