// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Tabs } from './Tabs.js';

afterEach(cleanup);

function Controlled({ initial = 'overview' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <Tabs value={value} onChange={setValue}>
      <Tabs.List aria-label="Report sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="detail">Detail</Tabs.Tab>
        <Tabs.Tab value="export">Export</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="detail">Detail content</Tabs.Panel>
      <Tabs.Panel value="export">Export content</Tabs.Panel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tablist of tabs, aria-selected on the active one, and a matching visible tabpanel', () => {
    render(<Controlled />);
    expect(screen.getByRole('tablist', { name: 'Report sections' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Detail' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview content');
    // Only the selected panel is rendered.
    expect(screen.queryByText('Detail content')).not.toBeInTheDocument();
  });

  it('aria-controls on the tab matches the id of its tabpanel', () => {
    render(<Controlled />);
    const tab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel', { name: 'Overview' });
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
  });

  it('uses roving tabindex: only the selected tab is a Tab stop', () => {
    render(<Controlled />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Detail' })).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight moves focus and activates the next tab, wrapping at the end', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    screen.getByRole('tab', { name: 'Overview' }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Detail' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Detail' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Detail content')).toBeInTheDocument();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Export' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('Home/End jump to the first/last tab', async () => {
    const user = userEvent.setup();
    render(<Controlled initial="detail" />);
    screen.getByRole('tab', { name: 'Detail' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Export' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Controlled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
