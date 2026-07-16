/**
 * Deterministic "hand-drawn" SVG path generators for the sketchnote family.
 * NO Math.random anywhere: every wobble comes from a seeded PRNG (fnv-1a hash
 * → mulberry32), so the same node/edge id always draws the same stroke — a
 * requirement for visual-regression testing and the repo's determinism rule.
 */

function fnv1a(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(state: number): () => number {
  let a = state;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a stable jitter function: index → value in [-1, 1]. */
export function seededJitter(seed: string): (i: number) => number {
  const values: number[] = [];
  const next = mulberry32(fnv1a(seed));
  return (i: number) => {
    while (values.length <= i) values.push(next() * 2 - 1);
    return values[i]!;
  };
}

const round = (v: number): number => Math.round(v * 100) / 100;

/**
 * A hand-drawn line: single pass with a wobbled midpoint (quadratic bezier)
 * plus a faint second pass slightly offset — the classic two-stroke rough look.
 */
export function roughLine(x1: number, y1: number, x2: number, y2: number, seed: string, amp = 2): string {
  const j = seededJitter(`line:${seed}`);
  const mx = (x1 + x2) / 2 + j(0) * amp * 2;
  const my = (y1 + y2) / 2 + j(1) * amp * 2;
  const pass1 = `M${round(x1 + j(2) * amp)} ${round(y1 + j(3) * amp)} Q${round(mx)} ${round(my)} ${round(x2 + j(4) * amp)} ${round(y2 + j(5) * amp)}`;
  const pass2 = `M${round(x1 + j(6) * amp)} ${round(y1 + j(7) * amp)} Q${round(mx + j(8) * amp)} ${round(my + j(9) * amp)} ${round(x2 + j(10) * amp)} ${round(y2 + j(11) * amp)}`;
  return `${pass1} ${pass2}`;
}

/** A hand-drawn rectangle: four rough edges with slight corner overshoot. */
export function roughRect(x: number, y: number, w: number, h: number, seed: string, amp = 2): string {
  const j = seededJitter(`rect:${seed}`);
  const o = amp * 0.8; // corner overshoot
  const edge = (ex1: number, ey1: number, ex2: number, ey2: number, k: number): string => {
    const mx = (ex1 + ex2) / 2 + j(k) * amp * 1.6;
    const my = (ey1 + ey2) / 2 + j(k + 1) * amp * 1.6;
    return `M${round(ex1 + j(k + 2) * amp)} ${round(ey1 + j(k + 3) * amp)} Q${round(mx)} ${round(my)} ${round(ex2 + j(k + 4) * amp)} ${round(ey2 + j(k + 5) * amp)}`;
  };
  return [
    edge(x - o, y, x + w + o, y, 0),
    edge(x + w, y - o, x + w, y + h + o, 6),
    edge(x + w + o, y + h, x - o, y + h, 12),
    edge(x, y + h + o, x, y - o, 18),
  ].join(' ');
}

/** A hand-drawn ellipse: eight cubic segments with radius wobble. */
export function roughEllipse(cx: number, cy: number, rx: number, ry: number, seed: string, amp = 1.5): string {
  const j = seededJitter(`ellipse:${seed}`);
  const segments = 8;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const wob = 1 + (j(i) * amp) / Math.max(rx, ry);
    pts.push([cx + Math.cos(angle) * rx * wob, cy + Math.sin(angle) * ry * wob]);
  }
  let d = `M${round(pts[0]![0])} ${round(pts[0]![1])}`;
  for (let i = 0; i < segments; i += 1) {
    const p0 = pts[i]!;
    const p1 = pts[(i + 1) % segments]!;
    const t = 0.36;
    const a0 = (i / segments) * Math.PI * 2 + Math.PI / 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2 + Math.PI / 2;
    const c1: [number, number] = [p0[0] + Math.cos(a0) * rx * t, p0[1] + Math.sin(a0) * ry * t];
    const c2: [number, number] = [p1[0] - Math.cos(a1) * rx * t, p1[1] - Math.sin(a1) * ry * t];
    d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p1[0])} ${round(p1[1])}`;
  }
  return d;
}
