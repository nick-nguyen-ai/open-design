// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MotionProvider } from '@enterprise-design/motion';
import {
  CELLS_FIXTURE,
  COMPARE_FIXTURE,
  CYCLE_FIXTURE,
  FLOW_FIXTURE,
  LAYERS_FIXTURE,
  SEQUENCE_FIXTURE,
  TIMELINE_FIXTURE,
  ZONES_FIXTURE,
} from '@enterprise-design/diagram-grammar';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { SketchnoteFlow } from './SketchnoteFlow.js';
import { SketchnoteSequence } from './SketchnoteSequence.js';
import { SketchnoteLayers } from './SketchnoteLayers.js';
import { SketchnoteZones } from './SketchnoteZones.js';
import { SketchnoteCycle } from './SketchnoteCycle.js';
import { SketchnoteCompare } from './SketchnoteCompare.js';
import { SketchnoteCells } from './SketchnoteCells.js';
import { SketchnoteTimeline } from './SketchnoteTimeline.js';

function stubMatchMedia(reduced = false) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const CASES = [
  ['flow', <SketchnoteFlow key="f" spec={FLOW_FIXTURE} />, 'Request lifecycle', 'Validate payload'],
  ['sequence', <SketchnoteSequence key="s" spec={SEQUENCE_FIXTURE} />, 'Token exchange', 'fetch signing key'],
  ['layers', <SketchnoteLayers key="l" spec={LAYERS_FIXTURE} />, 'Service stack', 'CDN and WAF'],
  ['zones', <SketchnoteZones key="z" spec={ZONES_FIXTURE} />, 'Deployment estate', 'Ledger DB'],
  ['cycle', <SketchnoteCycle key="c" spec={CYCLE_FIXTURE} />, 'Deploy loop', 'Unit and e2e gates'],
  ['compare', <SketchnoteCompare key="v" spec={COMPARE_FIXTURE} />, 'REST vs GraphQL', 'client-selected'],
  ['cells', <SketchnoteCells key="g" spec={CELLS_FIXTURE} />, 'Caching strategies', 'App owns the read path'],
  ['timeline', <SketchnoteTimeline key="t" spec={TIMELINE_FIXTURE} />, 'Cloud eras', 'Consolidation era'],
] as const;

describe('sketchnote family', () => {
  it.each(CASES.map(([kind, el, title, detail]) => [kind, el, title, detail] as const))(
    '%s renders the frame, title and full outline mirror; axe-clean',
    async (kind, element, title, outlineDetail) => {
      stubMatchMedia(false);
      const { container } = render(element);
      const figure = screen.getByTestId(`dgm-sketchnote-${kind}`);
      expect(figure).not.toHaveAttribute('data-reduced');
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
      // the outline mirror carries every editorial string — spot-check one detail
      expect(screen.getAllByText(new RegExp(outlineDetail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).length).toBeGreaterThan(0);
      expect(await axe(container)).toHaveNoViolations();
    },
  );

  it('honours reduced motion via MotionProvider (data-reduced set, no entrance delays)', () => {
    stubMatchMedia(false);
    render(
      <MotionProvider reducedMotion>
        <SketchnoteFlow spec={FLOW_FIXTURE} />
      </MotionProvider>,
    );
    const figure = screen.getByTestId('dgm-sketchnote-flow');
    expect(figure).toHaveAttribute('data-reduced');
    const delayed = figure.querySelectorAll('[style*="animation-delay"]');
    expect(delayed.length).toBe(0);
  });

  it('honours the system prefers-reduced-motion media query', () => {
    stubMatchMedia(true);
    render(<SketchnoteCycle spec={CYCLE_FIXTURE} />);
    expect(screen.getByTestId('dgm-sketchnote-cycle')).toHaveAttribute('data-reduced');
  });

  it('distinguishes node kinds by shape, not colour (distinct silhouettes per kind)', () => {
    stubMatchMedia(false);
    render(<SketchnoteFlow spec={FLOW_FIXTURE} />);
    const figure = screen.getByTestId('dgm-sketchnote-flow');
    const kinds = new Set(
      [...figure.querySelectorAll('[data-node-kind]')].map((el) => el.getAttribute('data-node-kind')),
    );
    expect(kinds).toContain('start');
    expect(kinds).toContain('decision');
    expect(kinds).toContain('data');
    expect(kinds).toContain('end');
    // decision renders a diamond path, start an ellipse — different silhouettes
    const decision = figure.querySelector('[data-node-kind="decision"] path')!.getAttribute('d')!;
    const start = figure.querySelector('[data-node-kind="start"] path')!.getAttribute('d')!;
    expect(decision).not.toBe(start);
    expect(decision).toContain('L'); // diamond = line segments
    expect(start).toContain('C'); // ellipse = curves
  });

  it('draws deterministically: two renders produce identical SVG markup', () => {
    stubMatchMedia(false);
    const a = render(<SketchnoteZones spec={ZONES_FIXTURE} />);
    const svgA = a.container.querySelector('svg')!.innerHTML;
    a.unmount();
    const b = render(<SketchnoteZones spec={ZONES_FIXTURE} />);
    const svgB = b.container.querySelector('svg')!.innerHTML;
    expect(svgA).toBe(svgB);
  });
});
