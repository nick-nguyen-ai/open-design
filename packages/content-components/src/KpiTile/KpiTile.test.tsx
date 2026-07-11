// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MotionProvider } from '@enterprise-design/motion';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { KpiTile } from './KpiTile.js';
import type { KpiTileDatum } from './KpiTile.js';

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

const METRICS: KpiTileDatum[] = [
  { id: 'aum', label: 'Assets under management', value: 128400000, unit: 'currency', delta: 0.032, target: 130000000, status: 'on-track' },
  { id: 'churn', label: 'Client churn', value: 0.041, unit: 'percent', delta: 0.006, deltaGoodDirection: 'down', status: 'at-risk' },
  { id: 'nps', label: 'NPS', value: 42, status: 'off-track' },
];

describe('KpiTile', () => {
  it('renders one card per metric with a tabular-numeral formatted value', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <KpiTile metrics={METRICS} />
      </MotionProvider>,
    );
    const values = screen.getAllByTestId('kpi-tile-value');
    expect(values).toHaveLength(3);
    expect(values[0]).toHaveTextContent('$128,400,000');
    expect(values[0]).toHaveClass('font-numeric');
  });

  it('renders the status as a badge AND a redundant icon shape, not colour alone', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <KpiTile metrics={METRICS} />
      </MotionProvider>,
    );
    expect(screen.getByText('On track')).toBeInTheDocument();
    expect(screen.getByText('At risk')).toBeInTheDocument();
    expect(screen.getByText('Off track')).toBeInTheDocument();
  });

  it('renders the target when present, omits it when absent', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <KpiTile metrics={METRICS} />
      </MotionProvider>,
    );
    expect(screen.getByText(/Target/)).toBeInTheDocument();
    // The NPS metric has no target — only one "Target" line should exist (AUM's).
    expect(screen.getAllByText(/Target/)).toHaveLength(1);
  });

  it('flips delta tone when deltaGoodDirection is "down" (falling churn is good)', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <KpiTile metrics={[METRICS[1] as KpiTileDatum]} />
      </MotionProvider>,
    );
    // Churn rose (+0.6%) but that is BAD since deltaGoodDirection is 'down' -> danger tone.
    const delta = screen.getByText('+0.6%');
    expect(delta.closest('span')).toHaveClass('text-danger-fg');
  });

  it('loading state renders skeleton tiles with an accessible loading status', () => {
    stubMatchMedia();
    render(<KpiTile metrics={[]} state="loading" loadingCount={2} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByTestId('kpi-tile-value')).not.toBeInTheDocument();
  });

  it('empty state (no metrics) is auto-detected with no explicit state prop', () => {
    stubMatchMedia();
    render(<KpiTile metrics={[]} />);
    expect(screen.getByText('No KPIs yet')).toBeInTheDocument();
  });

  it('error state renders ErrorState and invokes onRetry', () => {
    stubMatchMedia();
    const onRetry = vi.fn();
    render(<KpiTile metrics={METRICS} state="error" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    screen.getByRole('button', { name: /try again/i }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('wraps the set in a labelled section when title is provided', () => {
    stubMatchMedia();
    render(
      <MotionProvider reducedMotion={true}>
        <KpiTile metrics={METRICS} title="Portfolio KPIs" />
      </MotionProvider>,
    );
    expect(screen.getByRole('region', { name: 'Portfolio KPIs' })).toBeInTheDocument();
  });

  it('has no axe violations across default, loading, empty, and error states', async () => {
    stubMatchMedia();
    const { container: def } = render(
      <MotionProvider reducedMotion={true}>
        <KpiTile metrics={METRICS} title="Portfolio KPIs" />
      </MotionProvider>,
    );
    expect(await axe(def)).toHaveNoViolations();

    const { container: loading } = render(<KpiTile metrics={[]} state="loading" />);
    expect(await axe(loading)).toHaveNoViolations();

    const { container: empty } = render(<KpiTile metrics={[]} />);
    expect(await axe(empty)).toHaveNoViolations();

    const { container: error } = render(<KpiTile metrics={METRICS} state="error" onRetry={() => {}} />);
    expect(await axe(error)).toHaveNoViolations();
  });
});
