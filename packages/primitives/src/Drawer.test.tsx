// @vitest-environment jsdom
//
// NOTE ON THE `inert` GAP: jsdom does not enforce `inert`, so a `.focus()`
// inside an inert subtree succeeds here but is a no-op in real browsers. The
// "focus restored on close" assertions can't prove the a11y contract alone;
// the ordering-contract test below asserts the invariant jsdom CAN see (inert
// removed before focus restore). Real-browser coverage is the gallery e2e.
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

  it('on close, removes inert/aria-hidden from the background BEFORE restoring focus to the trigger', async () => {
    // Same ordering-contract regression guard as Dialog (see the file header
    // note on the jsdom inert gap): prove inert/aria-hidden are gone at the
    // moment trigger.focus() runs on close.
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDrawer />);
    const trigger = screen.getByRole('button', { name: 'Open filters' });
    await user.click(trigger);
    expect(trigger.closest('[inert]')).not.toBeNull();
    expect(trigger.closest('[aria-hidden="true"]')).not.toBeNull();

    let inertAncestorAtFocus: boolean | null = null;
    let ariaHiddenAncestorAtFocus: boolean | null = null;
    const focusSpy = vi.spyOn(trigger, 'focus').mockImplementation(() => {
      inertAncestorAtFocus = trigger.closest('[inert]') !== null;
      ariaHiddenAncestorAtFocus = trigger.closest('[aria-hidden="true"]') !== null;
    });

    await user.keyboard('{Escape}');

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(inertAncestorAtFocus).toBe(false);
    expect(ariaHiddenAncestorAtFocus).toBe(false);
  });

  it('has no axe violations when open', async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    render(<TriggerAndDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open filters' }));
    expect(await axe(screen.getByRole('dialog'))).toHaveNoViolations();
  });
});
