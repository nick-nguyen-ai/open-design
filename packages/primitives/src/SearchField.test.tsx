// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { SearchField } from './SearchField.js';

afterEach(cleanup);

function ControlledSearchField() {
  const [value, setValue] = useState('');
  return (
    <SearchField
      label="Search components"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
    />
  );
}

describe('SearchField', () => {
  it('exposes the implicit searchbox role and a search landmark wrapper', () => {
    render(<ControlledSearchField />);
    expect(screen.getByRole('searchbox', { name: 'Search components' })).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('is keyboard-typeable', async () => {
    const user = userEvent.setup();
    render(<ControlledSearchField />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'button');
    expect(input).toHaveValue('button');
  });

  it('shows a clear button once there is a value, which clears the field and returns focus to it', async () => {
    const user = userEvent.setup();
    render(<ControlledSearchField />);
    const input = screen.getByRole('searchbox');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    await user.type(input, 'button');
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    await user.click(clearButton);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ControlledSearchField />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
