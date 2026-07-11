// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { FlowDiagram } from './FlowDiagram.js';
import type { FlowDiagramData } from './buildFlowDiagramLayout.js';

function stubMatchMedia() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const DATA: FlowDiagramData = {
  nodes: [
    { id: 'start', label: 'Intake request', kind: 'start' },
    { id: 'validate', label: 'Validate request', kind: 'process' },
    { id: 'route', label: 'Needs approval?', kind: 'decision' },
    { id: 'end', label: 'Close request', kind: 'end' },
  ],
  edges: [
    { id: 'e1', from: 'start', to: 'validate' },
    { id: 'e2', from: 'validate', to: 'route' },
    { id: 'e3', from: 'route', to: 'end', label: 'No' },
  ],
};

describe('FlowDiagram', () => {
  it('renders a figure with the SVG mount and a caption', () => {
    stubMatchMedia();
    render(<FlowDiagram data={DATA} title="Request lifecycle" />);
    const figure = screen.getByRole('figure');
    expect(within(figure).getByText('Request lifecycle', { selector: 'figcaption' })).toBeInTheDocument();
    expect(screen.getByTestId('flow-diagram-svg')).toBeInTheDocument();
  });

  it('renders one SVG node group per node and one edge group per edge, with stable ids', () => {
    stubMatchMedia();
    render(<FlowDiagram data={DATA} title="Request lifecycle" />);
    for (const node of DATA.nodes) {
      expect(screen.getByTestId(`flow-diagram-node-${node.id}`)).toBeInTheDocument();
    }
    for (const edge of DATA.edges) {
      expect(screen.getByTestId(`flow-diagram-edge-${edge.id}`)).toBeInTheDocument();
    }
  });

  it('tags each node with its kind as a data attribute (shape differs per kind, not just colour)', () => {
    stubMatchMedia();
    render(<FlowDiagram data={DATA} title="Request lifecycle" />);
    expect(screen.getByTestId('flow-diagram-node-start')).toHaveAttribute('data-node-kind', 'start');
    expect(screen.getByTestId('flow-diagram-node-route')).toHaveAttribute('data-node-kind', 'decision');
    expect(screen.getByTestId('flow-diagram-node-end')).toHaveAttribute('data-node-kind', 'end');
  });

  it('exposes a textual outline listing every node and edge, always present (not toggled)', () => {
    stubMatchMedia();
    render(<FlowDiagram data={DATA} title="Request lifecycle" />);
    expect(screen.getByText('Intake request (start)')).toBeInTheDocument();
    expect(screen.getByText('Needs approval? (decision)')).toBeInTheDocument();
    expect(screen.getByText('Intake request → Validate request')).toBeInTheDocument();
    expect(screen.getByText('Needs approval? → Close request: No')).toBeInTheDocument();
  });

  it('the SVG mount is aria-hidden; the textual outline is the accessible equivalent', () => {
    stubMatchMedia();
    render(<FlowDiagram data={DATA} title="Request lifecycle" />);
    expect(screen.getByTestId('flow-diagram-svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('loading state renders a Skeleton, no figure', () => {
    stubMatchMedia();
    render(<FlowDiagram data={DATA} title="Request lifecycle" state="loading" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
  });

  it('empty state (no nodes) is auto-detected with no explicit state prop', () => {
    stubMatchMedia();
    render(<FlowDiagram data={{ nodes: [], edges: [] }} title="Request lifecycle" />);
    expect(screen.getByText('No diagram data')).toBeInTheDocument();
  });

  it('error state renders ErrorState and invokes onRetry', () => {
    stubMatchMedia();
    const onRetry = vi.fn();
    render(<FlowDiagram data={DATA} title="Request lifecycle" state="error" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    screen.getByRole('button', { name: /try again/i }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('reduced motion is reflected on the SVG as data-motion-variant', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <FlowDiagram data={DATA} title="Request lifecycle" />
      </MotionProvider>,
    );
    expect(screen.getByTestId('flow-diagram-svg')).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('has no axe violations across default, loading, empty, and error states', async () => {
    stubMatchMedia();
    const { container: def } = render(<FlowDiagram data={DATA} title="Request lifecycle" />);
    expect(await axe(def)).toHaveNoViolations();

    const { container: loading } = render(
      <FlowDiagram data={DATA} title="Request lifecycle" state="loading" />,
    );
    expect(await axe(loading)).toHaveNoViolations();

    const { container: empty } = render(
      <FlowDiagram data={{ nodes: [], edges: [] }} title="Request lifecycle" />,
    );
    expect(await axe(empty)).toHaveNoViolations();

    const { container: error } = render(
      <FlowDiagram data={DATA} title="Request lifecycle" state="error" onRetry={() => {}} />,
    );
    expect(await axe(error)).toHaveNoViolations();
  });
});
