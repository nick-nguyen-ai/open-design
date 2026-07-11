// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Chip, RemovableChip } from './Chip.js';

afterEach(cleanup);

describe('Chip', () => {
  it('toggles aria-pressed via click and keyboard activation', async () => {
    const user = userEvent.setup();
    function Toggle() {
      const [selected, setSelected] = useState(false);
      return (
        <Chip selected={selected} onClick={() => setSelected((s) => !s)}>
          Motion: full
        </Chip>
      );
    }
    render(<Toggle />);
    const chip = screen.getByRole('button', { name: 'Motion: full' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    chip.focus();
    await user.keyboard('{Enter}');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Chip>Filter</Chip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('RemovableChip', () => {
  it('remove button has an accessible label and fires onRemove without affecting other chips', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <RemovableChip removeLabel="Remove Revenue" onRemove={onRemove}>
        Revenue
      </RemovableChip>,
    );
    const removeButton = screen.getByRole('button', { name: 'Remove Revenue' });
    expect(removeButton).toBeInTheDocument();
    await user.click(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('remove button is keyboard-operable', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <RemovableChip removeLabel="Remove Margin" onRemove={onRemove}>
        Margin
      </RemovableChip>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Remove Margin' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <RemovableChip removeLabel="Remove Headcount" onRemove={vi.fn()}>
        Headcount
      </RemovableChip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
