/**
 * DOM probes for the design verify rig — the mechanical half of the quality
 * gates that used to be eyeballed on screenshots (quality-gates.md A–F).
 *
 * Each probe is a SELF-CONTAINED function (no imports, no shared closures) so
 * a driver can hand it to Playwright's `page.evaluate(fn)` verbatim; the same
 * functions are unit-testable in any browser context (see
 * `apps/gallery/e2e/verify-rig.spec.ts`, which runs them against the planted
 * fixture in `fixtures/probe-fixture.html`).
 *
 * Every probe returns plain JSON-serializable findings:
 *   { probe, selector, detail } — selector is a best-effort human locator
 * (tag#id.class · text snippet), not a guaranteed-unique query.
 *
 * Heuristics, deliberately conservative (the screenshot judge owns taste):
 * - text overflow: an element whose own text is wider than its box AND whose
 *   computed overflow-x is not an intentional scroller (`auto`/`scroll`).
 * - text overlap: two visible text leaves, neither an ancestor of the other,
 *   whose rects intersect by more than 8×8 px.
 * - contrast: WCAG 2.1 ratio of computed color vs the effective background,
 *   walking ancestors to the first opaque background; any hop that carries a
 *   background-image marks the pair `unverifiable` (reported, never guessed).
 */

/** Gate F1: does the document scroll horizontally at this viewport? */
export function probeRootOverflow() {
  const doc = document.documentElement;
  const overflow = Math.max(doc.scrollWidth - doc.clientWidth, document.body.scrollWidth - doc.clientWidth);
  return overflow > 1
    ? [{ probe: 'root-overflow', selector: 'html', detail: `scrollWidth exceeds clientWidth by ${overflow}px` }]
    : [];
}

/** Clipped/ellipsized text: own text wider than the box, not a deliberate scroller. */
export function probeTextOverflow() {
  const findings = [];
  const locate = (el) => {
    const cls = typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls} · "${text}"`;
  };
  for (const el of document.querySelectorAll('body *')) {
    const hasOwnText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim().length > 0,
    );
    if (!hasOwnText) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    if (style.overflowX === 'auto' || style.overflowX === 'scroll') continue; // intentional scroller
    const rect0 = el.getBoundingClientRect();
    if (rect0.width < 4 || rect0.height < 4) continue; // sr-only / collapsed
    if (style.clip !== 'auto' || (style.clipPath && style.clipPath !== 'none')) continue; // clipped a11y mirror
    const clipped = el.scrollWidth - el.clientWidth;
    if (el.clientWidth > 0 && clipped > 1) {
      const ellipsized = style.textOverflow === 'ellipsis';
      findings.push({
        probe: 'text-overflow',
        selector: locate(el),
        detail: `text exceeds box by ${clipped}px${ellipsized ? ' (ellipsized)' : ' (clipped)'}`,
      });
    }
  }
  return findings;
}

/** Overlapping text leaves: rect intersection > 8×8 px between unrelated visible text elements. */
export function probeTextOverlap() {
  const findings = [];
  const locate = (el) => {
    const cls = typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls} · "${text}"`;
  };
  const leaves = [];
  for (const el of document.querySelectorAll('body *')) {
    if (leaves.length >= 600) break; // bound the O(n²) pass
    const hasOwnText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim().length > 0,
    );
    if (!hasOwnText) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
    if (style.clip !== 'auto' || (style.clipPath && style.clipPath !== 'none')) continue; // clipped a11y mirror
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    leaves.push({ el, rect });
  }
  for (let i = 0; i < leaves.length; i += 1) {
    for (let j = i + 1; j < leaves.length; j += 1) {
      const a = leaves[i];
      const b = leaves[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const w = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
      const h = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
      if (w > 8 && h > 8) {
        findings.push({
          probe: 'text-overlap',
          selector: `${locate(a.el)} × ${locate(b.el)}`,
          detail: `text rects intersect ${Math.round(w)}×${Math.round(h)}px`,
        });
      }
    }
  }
  return findings;
}

/** Gate C1: WCAG 2.1 contrast of text vs its effective background (unverifiable over images/gradients). */
export function probeContrast() {
  const findings = [];
  const locate = (el) => {
    const cls = typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls} · "${text}"`;
  };
  const parse = (color) => {
    const m = color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] === undefined ? 1 : Number(m[4]) };
  };
  const luminance = ({ r, g, b }) => {
    const chan = (v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
  };
  for (const el of document.querySelectorAll('body *')) {
    const hasOwnText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim().length > 0,
    );
    if (!hasOwnText) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
    if (style.clip !== 'auto' || (style.clipPath && style.clipPath !== 'none')) continue; // clipped a11y mirror
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;

    const fg = parse(style.color);
    if (!fg) continue;

    // Walk up to the effective background.
    let bg = null;
    let unverifiable = false;
    let node = el;
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node);
      if (s.backgroundImage && s.backgroundImage !== 'none') {
        unverifiable = true;
        break;
      }
      const candidate = parse(s.backgroundColor);
      if (candidate && candidate.a >= 0.99) {
        bg = candidate;
        break;
      }
      node = node.parentElement;
    }
    if (unverifiable) {
      findings.push({ probe: 'contrast-unverifiable', selector: locate(el), detail: 'background carries an image/gradient — verify by eye' });
      continue;
    }
    if (!bg) continue; // no opaque background found up the tree — skip rather than guess

    const l1 = luminance(fg);
    const l2 = luminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const px = parseFloat(style.fontSize);
    const bold = Number(style.fontWeight) >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const floor = large ? 3 : 4.5;
    if (ratio < floor) {
      findings.push({
        probe: 'contrast',
        selector: locate(el),
        detail: `ratio ${ratio.toFixed(2)} below ${floor}:1 (${Math.round(px)}px${bold ? ' bold' : ''})`,
      });
    }
  }
  return findings;
}
