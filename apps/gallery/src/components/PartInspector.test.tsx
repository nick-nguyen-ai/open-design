// @vitest-environment jsdom
/**
 * Part inspector — route gating, closest-anchor selection, click swallowing,
 * the copy contract string, Escape, and `?inspect=1` deep-link arming.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MotionProvider } from '@enterprise-design/motion';
import '../test/jest-dom-setup.js';
import { PartInspector } from './PartInspector.js';

/** A miniature live page: nested anchors plus an interactive control. */
function FakeLivePage({ onDeepClick }: { onDeepClick?: () => void }) {
  return (
    <main data-part-id="fake-world/hero">
      <div data-part-id="fake-world/hero/diagram">
        <button type="button" onClick={onDeepClick}>
          deep control
        </button>
      </div>
    </main>
  );
}

function renderAt(path: string, onDeepClick?: () => void) {
  return render(
    <MotionProvider reducedMotion>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="live/:experienceId" element={<FakeLivePage onDeepClick={onDeepClick} />} />
          <Route path="demo/:demoId" element={<FakeLivePage />} />
          <Route path="browse" element={<div>catalogue</div>} />
        </Routes>
        <PartInspector />
      </MemoryRouter>
    </MotionProvider>,
  );
}

const toggle = () => screen.getByRole('button', { name: 'Inspect parts (borrow a part)' });

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});

afterEach(() => {
  cleanup();
});

describe('PartInspector — route gating', () => {
  it('renders nothing outside /live and /demo', () => {
    renderAt('/browse');
    expect(
      screen.queryByRole('button', { name: 'Inspect parts (borrow a part)' }),
    ).not.toBeInTheDocument();
  });

  it('shows the toggle on /live/* and /demo/*, default OFF', () => {
    const live = renderAt('/live/fake-world');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByRole('dialog', { name: 'Part inspector' })).not.toBeInTheDocument();
    live.unmount();

    renderAt('/demo/fake-demo');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  it('?inspect=1 arms the inspector on entry', () => {
    renderAt('/live/fake-world?inspect=1');
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('PartInspector — selection and copy', () => {
  it('clicking a nested element selects the closest ancestor part and swallows the click', () => {
    const onDeepClick = vi.fn();
    renderAt('/live/fake-world', onDeepClick);
    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'deep control' }));

    // The template's own handler must NOT fire while inspecting.
    expect(onDeepClick).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Part inspector' })).toBeInTheDocument();
    expect(screen.getByTestId('part-inspector-id')).toHaveTextContent('fake-world/hero/diagram');
  });

  it('copies the exact borrow instruction', async () => {
    renderAt('/live/fake-world');
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole('button', { name: 'deep control' }));

    fireEvent.click(screen.getByRole('button', { name: 'Copy borrow command' }));
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Borrow part fake-world/hero/diagram using the design-borrow skill.',
    );
  });

  it('a no-part click closes the popover but stays in inspect mode', () => {
    renderAt('/live/fake-world');
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole('button', { name: 'deep control' }));
    expect(screen.getByRole('dialog', { name: 'Part inspector' })).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByRole('dialog', { name: 'Part inspector' })).not.toBeInTheDocument();
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });

  it('Escape exits inspect mode and template clicks work again', () => {
    const onDeepClick = vi.fn();
    renderAt('/live/fake-world', onDeepClick);
    fireEvent.click(toggle());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'deep control' }));
    expect(onDeepClick).toHaveBeenCalledTimes(1);
  });
});
