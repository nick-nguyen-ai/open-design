// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { SegmentedControl } from './SegmentedControl.js';

afterEach(cleanup);

const options = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map' },
];

function Controlled({ initial = 'grid' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <SegmentedControl aria-label="Browse mode" options={options} value={value} onChange={setValue} />
  );
}

describe('SegmentedControl', () => {
  it('renders a radiogroup with radio options and the correct aria-checked state', () => {
    render(<Controlled />);
    expect(screen.getByRole('radiogroup', { name: 'Browse mode' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'false');
  });

  it('uses roving tabindex: only the selected option is a Tab stop', () => {
    render(<Controlled />);
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight moves focus and selection to the next option, wrapping at the end', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    screen.getByRole('radio', { name: 'Grid' }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'true');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
  });

  it('ArrowLeft wraps to the last option from the first', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    screen.getByRole('radio', { name: 'Grid' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveAttribute('aria-checked', 'true');
  });

  it('Home/End jump to the first/last option', async () => {
    const user = userEvent.setup();
    render(<Controlled initial="list" />);
    screen.getByRole('radio', { name: 'List' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Controlled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
