/**
 * Part inspector — click-to-reveal `data-part-id` anchors on live/demo pages.
 *
 * Mounted ONCE in App.tsx and self-gated by route: it renders nothing outside
 * `/live/*` and `/demo/*`. It never requires per-template wiring — templates
 * only carry `data-part-id` attributes, and the inspector reads them from the
 * DOM via `closest('[data-part-id]')`.
 *
 * Interaction contract:
 *   - Floating toggle (bottom-right), default OFF; `?inspect=1` on entry to a
 *     live/demo route starts it ON. State lives in React, NOT the URL —
 *     useDeckNavigation rewrites search params on every slide turn, so the
 *     param is an entry signal only.
 *   - While ON, clicks are intercepted devtools-style (capture phase,
 *     preventDefault + stopPropagation) so template links/buttons don't fire;
 *     arrow-key deck navigation is untouched. Escape exits.
 *   - Highlight/popover colours are hardcoded (not theme tokens) so they read
 *     identically on both locked moods.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';

const ACCENT = '#4c9ffe';
const POPOVER_WIDTH = 320;
const POPOVER_HEIGHT = 132;
const EDGE = 8;

function borrowInstruction(partId: string): string {
  return `Borrow part ${partId} using the design skill.`;
}

/** The nearest part anchor for an event target, ignoring the inspector's own UI. */
function partFromTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  if (target.closest('[data-part-inspector]')) return null;
  return target.closest<HTMLElement>('[data-part-id]');
}

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

function rectOf(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function PartInspector() {
  const { pathname, search } = useLocation();
  const onInspectableRoute = /^\/(live|demo)\//.test(pathname);
  const { reduced } = useMotionPreference();

  const armedByEntry = () =>
    onInspectableRoute && new URLSearchParams(search).get('inspect') === '1';

  const [active, setActive] = useState(armedByEntry);
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [hoverBox, setHoverBox] = useState<Box | null>(null);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    setHovered(null);
    setSelected(null);
    setHoverBox(null);
    setSelectedBox(null);
    setCopied(false);
  }, []);

  // Entry/exit per PATH change (adjust-state-during-render pattern): a new
  // live/demo path re-reads `?inspect=1`; leaving the zone disarms. Keyed on
  // pathname alone — deck slide turns rewrite only the query string and must
  // not re-arm or disarm the inspector mid-run.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActive(armedByEntry());
    setHovered(null);
    setSelected(null);
    setHoverBox(null);
    setSelectedBox(null);
    setCopied(false);
  }

  // Pointer + click + Escape interception while ON.
  useEffect(() => {
    if (!active) return undefined;

    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const part = partFromTarget(event.target);
        setHovered(part);
        setHoverBox(part ? rectOf(part) : null);
      });
    };

    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-part-inspector]')) {
        return; // our own UI keeps normal behaviour
      }
      event.preventDefault();
      event.stopPropagation();
      const part = partFromTarget(event.target);
      setSelected(part);
      setSelectedBox(part ? rectOf(part) : null);
      setCopied(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActive(false);
        clear();
      }
    };

    document.addEventListener('pointermove', onPointerMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onPointerMove, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [active, clear]);

  // Track the selected element's box every frame while a selection exists:
  // deck slide turns move elements via transforms without scroll/resize
  // events, so event-driven repositioning would leave a stale highlight.
  useEffect(() => {
    if (!active || !selected) return undefined;
    let frame = 0;
    const track = () => {
      if (!selected.isConnected) {
        setSelected(null);
        setSelectedBox(null);
        return;
      }
      setSelectedBox((prev) => {
        const next = rectOf(selected);
        return prev &&
          prev.top === next.top &&
          prev.left === next.left &&
          prev.width === next.width &&
          prev.height === next.height
          ? prev
          : next;
      });
      frame = requestAnimationFrame(track);
    };
    frame = requestAnimationFrame(track);
    return () => cancelAnimationFrame(frame);
  }, [active, selected]);

  // Crosshair cursor everywhere while inspecting.
  useEffect(() => {
    if (!active) return undefined;
    const style = document.createElement('style');
    style.setAttribute('data-part-inspector', 'cursor');
    style.textContent = '* { cursor: crosshair !important; }';
    document.head.appendChild(style);
    return () => style.remove();
  }, [active]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  if (!onInspectableRoute) return null;

  const selectedId = selected?.getAttribute('data-part-id') ?? null;

  const copy = async () => {
    if (!selectedId) return;
    const text = borrowInstruction(selectedId);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('data-part-inspector', 'copy-fallback');
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const boxStyle = (box: Box, emphasis: 'hover' | 'selected'): React.CSSProperties => ({
    position: 'fixed',
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
    pointerEvents: 'none',
    borderRadius: 3,
    border: `2px ${emphasis === 'hover' ? 'dashed' : 'solid'} ${ACCENT}`,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.85)',
    background: emphasis === 'selected' ? 'rgba(76,159,254,0.14)' : 'rgba(76,159,254,0.07)',
    zIndex: 2147483000,
  });

  const popover = () => {
    if (!selectedId || !selectedBox) return null;
    const below = selectedBox.top + selectedBox.height + EDGE;
    const top =
      below + POPOVER_HEIGHT > window.innerHeight
        ? Math.max(EDGE, selectedBox.top - POPOVER_HEIGHT - EDGE)
        : below;
    const left = Math.min(
      Math.max(EDGE, selectedBox.left),
      Math.max(EDGE, window.innerWidth - POPOVER_WIDTH - EDGE),
    );
    return (
      <div
        role="dialog"
        aria-label="Part inspector"
        data-part-inspector="popover"
        style={{
          position: 'fixed',
          top,
          left,
          width: POPOVER_WIDTH,
          zIndex: 2147483001,
          background: '#101827',
          color: '#f8fafc',
          border: '1px solid rgba(148,163,184,0.45)',
          borderRadius: 8,
          padding: '10px 12px',
          fontSize: 12,
          lineHeight: 1.5,
          fontFamily: 'system-ui, sans-serif',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          cursor: 'default',
        }}
      >
        <div style={{ color: '#94a3b8', letterSpacing: '0.08em', fontSize: 10 }}>PART</div>
        <code
          data-testid="part-inspector-id"
          style={{ display: 'block', fontFamily: 'ui-monospace, monospace', fontSize: 12, margin: '2px 0 8px', wordBreak: 'break-all' }}
        >
          {selectedId}
        </code>
        <button
          type="button"
          onClick={copy}
          style={{
            cursor: 'pointer',
            background: copied ? '#1c4b2e' : ACCENT,
            color: copied ? '#b8f0c9' : '#0b1220',
            border: 'none',
            borderRadius: 6,
            padding: '5px 10px',
            fontSize: 12,
            fontWeight: 600,
            transition: reduced ? 'none' : 'background 120ms ease',
          }}
        >
          {copied ? 'Copied' : 'Copy borrow command'}
        </button>
        <div style={{ color: '#94a3b8', marginTop: 8 }}>
          Paste into a Claude session in this repo to borrow this part.
        </div>
      </div>
    );
  };

  return createPortal(
    <div data-part-inspector="root">
      <button
        type="button"
        aria-pressed={active}
        aria-label="Inspect parts (borrow a part)"
        title="Inspect parts (borrow a part)"
        onClick={() => {
          if (active) {
            setActive(false);
            clear();
          } else {
            setActive(true);
          }
        }}
        style={{
          // Right edge, vertically centred: deck templates own the corners
          // (footer nav arrows bottom-right, chrome top) and the toggle must
          // never occlude them — live-decks-g's 'Next slide' click proved it.
          position: 'fixed',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2147483002,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: active ? `2px solid ${ACCENT}` : '1px solid rgba(148,163,184,0.5)',
          background: active ? 'rgba(16,24,39,0.95)' : 'rgba(16,24,39,0.6)',
          color: active ? ACCENT : '#cbd5e1',
          fontSize: 18,
          lineHeight: 1,
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
          transition: reduced ? 'none' : 'border-color 120ms ease, color 120ms ease',
        }}
      >
        <span aria-hidden="true">⌖</span>
      </button>
      {active && hoverBox && hovered !== selected && (
        <div data-part-inspector="hover" style={boxStyle(hoverBox, 'hover')} />
      )}
      {active && selectedBox && (
        <div data-part-inspector="selected" style={boxStyle(selectedBox, 'selected')} />
      )}
      {active && popover()}
    </div>,
    document.body,
  );
}
