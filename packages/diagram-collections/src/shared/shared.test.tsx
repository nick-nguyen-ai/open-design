// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ComponentManifest } from '@enterprise-design/contracts';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { seededJitter, roughLine, roughRect, roughEllipse } from './rough.js';
import { isoProject, isoBoxFaces } from './iso.js';
import { DiagramFrame } from './DiagramFrame.js';
import { makeCollectionManifest } from './manifest-factory.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('seededJitter', () => {
  it('is deterministic for a seed and bounded to [-1, 1]', () => {
    const a = seededJitter('node-alpha');
    const b = seededJitter('node-alpha');
    for (let i = 0; i < 32; i += 1) {
      expect(a(i)).toBe(b(i));
      expect(Math.abs(a(i))).toBeLessThanOrEqual(1);
    }
    const other = seededJitter('node-beta');
    expect([0, 1, 2, 3].map(a)).not.toEqual([0, 1, 2, 3].map(other));
  });
});

describe('rough path generators', () => {
  it('produce seed-stable, well-formed SVG path data', () => {
    const line1 = roughLine(0, 0, 100, 40, 'edge-1');
    expect(line1).toBe(roughLine(0, 0, 100, 40, 'edge-1'));
    expect(line1).toMatch(/^M[-\d. ]+/);
    const rect = roughRect(10, 10, 120, 48, 'node-1');
    expect(rect).toBe(roughRect(10, 10, 120, 48, 'node-1'));
    expect(rect.startsWith('M')).toBe(true);
    const ellipse = roughEllipse(50, 50, 40, 24, 'blob');
    expect(ellipse).toBe(roughEllipse(50, 50, 40, 24, 'blob'));
    expect(ellipse).toContain('C');
  });
});

describe('isoProject', () => {
  it('projects the unit axes to the 30° isometric plane', () => {
    const [x, y] = isoProject(1, 0, 0);
    expect(x).toBeCloseTo(Math.cos(Math.PI / 6), 5);
    expect(y).toBeCloseTo(Math.sin(Math.PI / 6), 5);
    const [x2, y2] = isoProject(0, 1, 0);
    expect(x2).toBeCloseTo(-Math.cos(Math.PI / 6), 5);
    expect(y2).toBeCloseTo(Math.sin(Math.PI / 6), 5);
    const [, yUp] = isoProject(0, 0, 1);
    expect(yUp).toBeCloseTo(-1, 5);
  });

  it('isoBoxFaces returns three closed polygons', () => {
    const faces = isoBoxFaces(0, 0, 0, 40, 40, 30);
    for (const face of [faces.top, faces.left, faces.right]) {
      expect(face.split(' ').length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('DiagramFrame', () => {
  it('renders title, hidden outline, testid and reduced flag; axe-clean', async () => {
    const { container } = render(
      <DiagramFrame
        family="sketchnote"
        kind="flow"
        title="Request lifecycle"
        outline={['Flow: Request lifecycle', 'Receive request (start)']}
        reduced
      >
        <svg viewBox="0 0 100 100" role="presentation" aria-hidden />
      </DiagramFrame>,
    );
    const figure = screen.getByTestId('dgm-sketchnote-flow');
    expect(figure).toHaveAttribute('data-reduced');
    expect(screen.getByText('Request lifecycle')).toBeInTheDocument();
    expect(screen.getByText('Receive request (start)')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('omits data-reduced when motion is allowed', () => {
    render(
      <DiagramFrame family="gazette" kind="cells" title="Grid" outline={['Grid: Grid']} reduced={false}>
        <svg viewBox="0 0 10 10" role="presentation" aria-hidden />
      </DiagramFrame>,
    );
    expect(screen.getByTestId('dgm-gazette-cells')).not.toHaveAttribute('data-reduced');
  });
});

describe('makeCollectionManifest', () => {
  it('produces a contract-valid manifest with the fixed collection fields', () => {
    const manifest = makeCollectionManifest({
      family: 'sketchnote',
      familyName: 'Sketchnote',
      kind: 'flow',
      description: 'Hand-drawn flow diagram.',
      searchText: 'sketchnote hand drawn excalidraw flow diagram steps arrows',
      grammarId: 'sketchnote-journal',
      sourceFile: 'packages/diagram-collections/src/sketchnote/SketchnoteFlow.tsx',
      exportName: 'SketchnoteFlow',
      motionLevel: 1,
      themeModes: ['light'],
      knownLimitations: ['Entrance reveal only.'],
    });
    expect(() => ComponentManifest.parse(manifest)).not.toThrow();
    expect(manifest.id).toBe('comp.dgm.sketchnote.flow');
    expect(manifest.category).toBe('diagram');
    expect(manifest.subcategory).toBe('flow');
    expect(manifest.compatibleSurfaces).toEqual([
      'dashboard',
      'personal-page',
      'project-page',
      'technical-explainer',
      'slide-deck',
    ]);
    expect(manifest.designGrammars).toEqual(['sketchnote-journal']);
    expect(manifest.approval.state).toBe('approved');
  });
});
