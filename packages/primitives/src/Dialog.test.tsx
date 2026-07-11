// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Dialog } from './Dialog.js';

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
  document.body.innerHTML = '';
});

function TriggerAndDialog() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete report">
        <p>This cannot be undone.</p>
        <button onClick={() => setOpen(false)}>Cancel</button>
        <button onClick={() => setOpen(false)}>Confirm</button>
      </Dialog>
    </div>
  );
}

describe('Dialog', () => {
  it('is not in the document when closed', () => {
    stubMatchMedia();
    render(<TriggerAndDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens with role=dialog, aria-modal, and is labelled by its title', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete report' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus into the dialog on open', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('traps Tab focus cycling within the dialog', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    await user.click(screen.getByRole('button', { name: 'Open dialog' }));

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    expect(cancel).toHaveFocus();

    await user.tab();
    expect(confirm).toHaveFocus();

    await user.tab();
    expect(cancel).toHaveFocus();

    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();
  });

  it('Escape closes the dialog and restores focus to the trigger', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closing via a button inside the dialog also restores focus to the trigger', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('locks background scroll while open and restores it on close', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    expect(document.body.style.overflow).not.toBe('hidden');
    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('marks background siblings inert while open', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    const triggerButton = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(triggerButton);
    // `inert` is applied to the body-level sibling containing the trigger
    // (not the trigger's immediate parent) — assert via the nearest inert
    // ANCESTOR, which is how a real browser/AT would observe the effect.
    expect(triggerButton.closest('[inert]')).not.toBeNull();
    await user.keyboard('{Escape}');
    expect(triggerButton.closest('[inert]')).toBeNull();
  });

  it('has no axe violations when open', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDialog />);
    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = screen.getByRole('dialog');
    expect(await axe(dialog)).toHaveNoViolations();
  });
});
