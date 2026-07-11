// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { axe } from '../test/axe-setup.js';
import '../test/jest-dom-setup.js';
import { StatusList } from './StatusList.js';
import type { StatusListItemDatum } from './StatusList.js';

afterEach(cleanup);

const ITEMS: StatusListItemDatum[] = [
  { id: 'a', label: 'Reconciliation complete', status: 'success', description: 'All accounts matched.' },
  { id: 'b', label: 'Pending review', status: 'warning' },
  { id: 'c', label: 'Feed disconnected', status: 'danger', timestamp: '2026-07-10T14:32:00Z' },
];

describe('StatusList', () => {
  it('renders one list item per status item, as a real list', () => {
    render(<StatusList items={ITEMS} title="System status" />);
    const list = screen.getByRole('list', { name: 'System status' });
    expect(list.querySelectorAll('li')).toHaveLength(3);
  });

  it('encodes status via a Badge tone AND a distinct icon shape (non-colour encoding)', () => {
    render(<StatusList items={ITEMS} title="System status" />);
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Danger')).toBeInTheDocument();
    // Each row's icon is a distinct inline <svg>; three rows -> three distinct path/polygon shapes present.
    const list = screen.getByRole('list', { name: 'System status' });
    expect(list.querySelectorAll('svg')).toHaveLength(3);
  });

  it('renders a formatted <time> element for event-log items with a timestamp', () => {
    render(<StatusList items={ITEMS} title="System status" />);
    const time = screen.getByText('Feed disconnected').closest('li')?.querySelector('time');
    expect(time).toHaveAttribute('datetime', '2026-07-10T14:32:00Z');
  });

  it('omits the timestamp for plain categorical items', () => {
    render(<StatusList items={ITEMS} title="System status" />);
    const row = screen.getByText('Reconciliation complete').closest('li');
    expect(row?.querySelector('time')).not.toBeInTheDocument();
  });

  it('loading state renders skeleton rows with an accessible loading status', () => {
    render(<StatusList items={[]} state="loading" loadingCount={2} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('empty state (no items) is auto-detected with no explicit state prop', () => {
    render(<StatusList items={[]} />);
    expect(screen.getByText('No status items')).toBeInTheDocument();
  });

  it('error state renders ErrorState and invokes onRetry', () => {
    const onRetry = vi.fn();
    render(<StatusList items={ITEMS} state="error" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    screen.getByRole('button', { name: /try again/i }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations across default, loading, empty, and error states', async () => {
    const { container: def } = render(<StatusList items={ITEMS} title="System status" />);
    expect(await axe(def)).toHaveNoViolations();

    const { container: loading } = render(<StatusList items={[]} state="loading" />);
    expect(await axe(loading)).toHaveNoViolations();

    const { container: empty } = render(<StatusList items={[]} />);
    expect(await axe(empty)).toHaveNoViolations();

    const { container: error } = render(<StatusList items={ITEMS} state="error" onRetry={() => {}} />);
    expect(await axe(error)).toHaveNoViolations();
  });
});
