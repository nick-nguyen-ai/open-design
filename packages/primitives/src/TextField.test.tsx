// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { TextField } from './TextField.js';

afterEach(cleanup);

describe('TextField', () => {
  it('associates a visible label with the input via htmlFor/id', () => {
    render(<TextField label="Account name" />);
    expect(screen.getByLabelText('Account name')).toBeInTheDocument();
  });

  it('falls back to aria-label when no visible label is given', () => {
    render(<TextField aria-label="Account name" />);
    expect(screen.getByRole('textbox', { name: 'Account name' })).toBeInTheDocument();
  });

  it('is keyboard-typeable and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Account name" onChange={onChange} />);
    await user.type(screen.getByLabelText('Account name'), 'Acme');
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('description is exposed via aria-describedby', () => {
    render(<TextField label="Amount" description="In USD" />);
    const input = screen.getByLabelText('Amount');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(screen.getByText('In USD').id).toBe(describedBy);
  });

  it('error sets aria-invalid and is announced via role=alert, also included in aria-describedby', () => {
    render(<TextField label="Amount" error="Required" />);
    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Required');
    expect(input.getAttribute('aria-describedby')).toContain(alert.id);
  });

  it('has no axe violations (labelled, with description and error)', async () => {
    const { container } = render(
      <TextField label="Amount" description="In USD" error="Required" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
