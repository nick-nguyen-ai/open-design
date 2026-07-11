/**
 * Selector for elements that are reachable by Tab in their default tab order.
 * Deliberately conservative (no `contenteditable`, no custom `tabindex>0`
 * "positive tabindex" support) — good enough for the bounded set of controls
 * that appear inside Dialog/Drawer content.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** All focusable descendants of `container`, in DOM (tab) order. */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('data-focus-guard'),
  );
}
