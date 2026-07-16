import type { ComponentType } from 'react';
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
  type CellsSpecT,
  type CompareSpecT,
  type CycleSpecT,
  type FlowSpecT,
  type LayersSpecT,
  type SequenceSpecT,
  type TimelineSpecT,
  type ZonesSpecT,
} from '@enterprise-design/diagram-grammar';
import { axe } from './axe-setup.js';
import './jest-dom-setup.js';

export interface FamilyComponents {
  flow: ComponentType<{ spec: FlowSpecT }>;
  sequence: ComponentType<{ spec: SequenceSpecT }>;
  layers: ComponentType<{ spec: LayersSpecT }>;
  zones: ComponentType<{ spec: ZonesSpecT }>;
  cycle: ComponentType<{ spec: CycleSpecT }>;
  compare: ComponentType<{ spec: CompareSpecT }>;
  cells: ComponentType<{ spec: CellsSpecT }>;
  timeline: ComponentType<{ spec: TimelineSpecT }>;
}

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

/**
 * The contract every collection family must honour, run identically for all
 * five: frame + title + full outline mirror, axe-clean, both reduced-motion
 * legs, shape (not colour) node-kind encoding, and deterministic markup.
 */
export function runFamilySuite(family: string, c: FamilyComponents): void {
  const CASES = [
    ['flow', <c.flow key="f" spec={FLOW_FIXTURE} />, 'Request lifecycle', 'Validate payload'],
    ['sequence', <c.sequence key="s" spec={SEQUENCE_FIXTURE} />, 'Token exchange', 'fetch signing key'],
    ['layers', <c.layers key="l" spec={LAYERS_FIXTURE} />, 'Service stack', 'CDN and WAF'],
    ['zones', <c.zones key="z" spec={ZONES_FIXTURE} />, 'Deployment estate', 'Ledger DB'],
    ['cycle', <c.cycle key="c" spec={CYCLE_FIXTURE} />, 'Deploy loop', 'Unit and e2e gates'],
    ['compare', <c.compare key="v" spec={COMPARE_FIXTURE} />, 'REST vs GraphQL', 'client-selected'],
    ['cells', <c.cells key="g" spec={CELLS_FIXTURE} />, 'Caching strategies', 'App owns the read path'],
    ['timeline', <c.timeline key="t" spec={TIMELINE_FIXTURE} />, 'Cloud eras', 'Consolidation era'],
  ] as const;

  describe(`${family} family`, () => {
    afterEach(() => {
      cleanup();
      vi.unstubAllGlobals();
    });

    it.each(CASES.map(([kind, el, title, detail]) => [kind, el, title, detail] as const))(
      '%s renders the frame, title and outline mirror; axe-clean',
      async (kind, element, title, outlineDetail) => {
        stubMatchMedia(false);
        const { container } = render(element);
        const figure = screen.getByTestId(`dgm-${family}-${kind}`);
        expect(figure).not.toHaveAttribute('data-reduced');
        expect(screen.getAllByText(title).length).toBeGreaterThan(0);
        const pattern = new RegExp(outlineDetail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        expect(screen.getAllByText(pattern).length).toBeGreaterThan(0);
        expect(await axe(container)).toHaveNoViolations();
      },
    );

    it('honours reduced motion via MotionProvider (data-reduced set, no entrance delays)', () => {
      stubMatchMedia(false);
      render(
        <MotionProvider reducedMotion>
          <c.flow spec={FLOW_FIXTURE} />
        </MotionProvider>,
      );
      const figure = screen.getByTestId(`dgm-${family}-flow`);
      expect(figure).toHaveAttribute('data-reduced');
      expect(figure.querySelectorAll('[style*="animation-delay"]').length).toBe(0);
    });

    it('honours the system prefers-reduced-motion media query', () => {
      stubMatchMedia(true);
      render(<c.cycle spec={CYCLE_FIXTURE} />);
      expect(screen.getByTestId(`dgm-${family}-cycle`)).toHaveAttribute('data-reduced');
    });

    it('distinguishes node kinds by silhouette, not colour', () => {
      stubMatchMedia(false);
      render(<c.flow spec={FLOW_FIXTURE} />);
      const figure = screen.getByTestId(`dgm-${family}-flow`);
      const kinds = new Set(
        [...figure.querySelectorAll('[data-node-kind]')].map((el) => el.getAttribute('data-node-kind')),
      );
      for (const expected of ['start', 'process', 'decision', 'data', 'end'])
        expect(kinds).toContain(expected);
      const decision = figure.querySelector('[data-node-kind="decision"]')!.innerHTML;
      const start = figure.querySelector('[data-node-kind="start"]')!.innerHTML;
      expect(decision).not.toBe(start);
    });

    it('renders deterministically: two renders produce identical SVG markup', () => {
      stubMatchMedia(false);
      const a = render(<c.zones spec={ZONES_FIXTURE} />);
      const svgA = a.container.querySelector('svg')!.innerHTML;
      a.unmount();
      const b = render(<c.zones spec={ZONES_FIXTURE} />);
      expect(b.container.querySelector('svg')!.innerHTML).toBe(svgA);
    });
  });
}
