// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { TrendChart } from './TrendChart.js';
import type { TrendChartSeriesInput } from './buildTrendChartOption.js';

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

const SERIES: TrendChartSeriesInput[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    points: [
      { x: '2026-01', y: 100 },
      { x: '2026-02', y: 120 },
    ],
  },
];

describe('TrendChart', () => {
  it('renders a figure with a caption and the mount node', () => {
    stubMatchMedia();
    render(<TrendChart series={SERIES} title="Quarterly Revenue" />);
    const figure = screen.getByRole('figure');
    expect(within(figure).getByText('Quarterly Revenue', { selector: 'figcaption' })).toBeInTheDocument();
    expect(screen.getByTestId('chart-mount')).toBeInTheDocument();
  });

  it('renders a visually-hidden data table with the real series values', () => {
    stubMatchMedia();
    render(<TrendChart series={SERIES} title="Quarterly Revenue" />);
    const table = screen.getByRole('table');
    expect(within(table).getByText('Revenue')).toBeInTheDocument();
    expect(within(table).getByText('100')).toBeInTheDocument();
    expect(within(table).getByText('120')).toBeInTheDocument();
  });

  it('includes the source note in the caption when provided', () => {
    stubMatchMedia();
    render(<TrendChart series={SERIES} title="Quarterly Revenue" sourceNote="Synthetic data" />);
    expect(screen.getByText(/Synthetic data/)).toBeInTheDocument();
  });

  it('loading state renders a Skeleton and an accessible loading status, no figure', () => {
    stubMatchMedia();
    render(<TrendChart series={SERIES} title="Quarterly Revenue" state="loading" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
  });

  it('empty state (no series) renders EmptyState, auto-detected with no explicit state prop', () => {
    stubMatchMedia();
    render(<TrendChart series={[]} title="Quarterly Revenue" />);
    expect(screen.getByText('No trend data')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
  });

  it('error state renders ErrorState and invokes onRetry', () => {
    stubMatchMedia();
    const onRetry = vi.fn();
    render(<TrendChart series={SERIES} title="Quarterly Revenue" state="error" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    screen.getByRole('button', { name: /try again/i }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('partial-data state renders the chart plus a partial-data note', () => {
    stubMatchMedia();
    render(<TrendChart series={SERIES} title="Quarterly Revenue" state="partial-data" />);
    expect(screen.getByRole('figure')).toBeInTheDocument();
    expect(screen.getByTestId('trend-chart-partial-note')).toBeInTheDocument();
  });

  it('reduced motion is reflected on the chart mount as data-motion-variant', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <TrendChart series={SERIES} title="Quarterly Revenue" />
      </MotionProvider>,
    );
    expect(screen.getByTestId('chart-mount')).toHaveAttribute('data-motion-variant', 'reduced');
  });

  it('full motion is reflected on the chart mount as data-motion-variant', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={false}>
        <TrendChart series={SERIES} title="Quarterly Revenue" />
      </MotionProvider>,
    );
    expect(screen.getByTestId('chart-mount')).toHaveAttribute('data-motion-variant', 'full');
  });

  it('has no axe violations in the default state', async () => {
    stubMatchMedia();
    const { container } = render(<TrendChart series={SERIES} title="Quarterly Revenue" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in the loading, empty, and error states', async () => {
    stubMatchMedia();
    const { container: loading } = render(
      <TrendChart series={SERIES} title="Quarterly Revenue" state="loading" />,
    );
    expect(await axe(loading)).toHaveNoViolations();

    const { container: empty } = render(<TrendChart series={[]} title="Quarterly Revenue" />);
    expect(await axe(empty)).toHaveNoViolations();

    const { container: error } = render(
      <TrendChart series={SERIES} title="Quarterly Revenue" state="error" onRetry={() => {}} />,
    );
    expect(await axe(error)).toHaveNoViolations();
  });
});
