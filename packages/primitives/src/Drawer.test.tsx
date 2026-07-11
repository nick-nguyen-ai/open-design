// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/axe-setup.js';
import './test/jest-dom-setup.js';
import { Drawer } from './Drawer.js';

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

function TriggerAndDrawer({ side }: { side?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open filters</button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters" side={side}>
        <button onClick={() => setOpen(false)}>Apply</button>
      </Drawer>
    </div>
  );
}

describe('Drawer', () => {
  it('is not in the document when closed', () => {
    stubMatchMedia();
    render(<TriggerAndDrawer />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens with role=dialog, aria-modal, labelled, and moves focus in', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open filters' }));
    const drawer = screen.getByRole('dialog', { name: 'Filters' });
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus();
  });

  it('Escape closes and restores focus to the trigger', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDrawer />);
    const trigger = screen.getByRole('button', { name: 'Open filters' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports left/right side anchoring', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDrawer side="left" />);
    await user.click(screen.getByRole('button', { name: 'Open filters' }));
    expect(screen.getByRole('dialog').className).toContain('left-0');
  });

  it('has no axe violations when open', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open filters' }));
    expect(await axe(screen.getByRole('dialog'))).toHaveNoViolations();
  });
});
