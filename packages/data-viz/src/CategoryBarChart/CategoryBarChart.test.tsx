// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { CategoryBarChart } from './CategoryBarChart.js';
import type { CategoryBarDatum } from './buildCategoryBarChartOption.js';

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

const DATA: CategoryBarDatum[] = [
  { id: 'north', category: 'North', value: 42, target: 50 },
  { id: 'south', category: 'South', value: 58 },
];

describe('CategoryBarChart', () => {
  it('renders a figure with the mount node and a caption', () => {
    stubMatchMedia();
    render(<CategoryBarChart data={DATA} title="Regional Volume" />);
    const figure = screen.getByRole('figure');
    expect(screen.getByTestId('chart-mount')).toBeInTheDocument();
    expect(within(figure).getByText('Regional Volume', { selector: 'figcaption' })).toBeInTheDocument();
  });

  it('renders a visually-hidden data table with the real category values, including Target', () => {
    stubMatchMedia();
    render(<CategoryBarChart data={DATA} title="Regional Volume" />);
    const table = screen.getByRole('table');
    expect(within(table).getByText('North')).toBeInTheDocument();
    expect(within(table).getByText('42')).toBeInTheDocument();
    expect(within(table).getByText('50')).toBeInTheDocument();
    expect(within(table).getByText('—')).toBeInTheDocument(); // South has no target
  });

  it('loading state renders a Skeleton, no figure', () => {
    stubMatchMedia();
    render(<CategoryBarChart data={DATA} title="Regional Volume" state="loading" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
  });

  it('empty state (no data) is auto-detected with no explicit state prop', () => {
    stubMatchMedia();
    render(<CategoryBarChart data={[]} title="Regional Volume" />);
    expect(screen.getByText('No category data')).toBeInTheDocument();
  });

  it('error state renders ErrorState and invokes onRetry', () => {
    stubMatchMedia();
    const onRetry = vi.fn();
    render(<CategoryBarChart data={DATA} title="Regional Volume" state="error" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    screen.getByRole('button', { name: /try again/i }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations in the default, loading, empty, and error states', async () => {
    stubMatchMedia();
    const { container: def } = render(<CategoryBarChart data={DATA} title="Regional Volume" />);
    expect(await axe(def)).toHaveNoViolations();

    const { container: loading } = render(
      <CategoryBarChart data={DATA} title="Regional Volume" state="loading" />,
    );
    expect(await axe(loading)).toHaveNoViolations();

    const { container: empty } = render(<CategoryBarChart data={[]} title="Regional Volume" />);
    expect(await axe(empty)).toHaveNoViolations();

    const { container: error } = render(
      <CategoryBarChart data={DATA} title="Regional Volume" state="error" onRetry={() => {}} />,
    );
    expect(await axe(error)).toHaveNoViolations();
  });
});
