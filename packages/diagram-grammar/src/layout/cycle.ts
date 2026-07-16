import type { CycleSpecT } from '../specs.js';
import { PADDING } from './flow.js';

/**
 * Cycle layout: stage centres sit on a ring, first stage at 12 o'clock,
 * clockwise in spec order. Arcs connect consecutive stages (wrapping last →
 * first); each arc's endpoints are pulled in by a fixed angular inset so the
 * drawn arc clears the stage plates. All trig is rounded to integers for
 * cross-platform determinism.
 */

const STAGE_W = 128;
const STAGE_H = 60;
const ARC_INSET_DEG = 26;

export interface CycleLayout {
  width: number;
  height: number;
  centre: [number, number];
  radius: number;
  stages: Array<{ id: string; cx: number; cy: number; w: number; h: number; label: string; detail?: string; index: number }>;
  arcs: Array<{ fromIndex: number; toIndex: number; x1: number; y1: number; x2: number; y2: number; sweep: 1 }>;
  hubLabel?: string;
}

function pointAt(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [Math.round(cx + r * Math.sin(rad)), Math.round(cy - r * Math.cos(rad))];
}

export function layoutCycle(spec: CycleSpecT): CycleLayout {
  const n = spec.stages.length;
  const radius = 96 + n * 14;
  const cx = PADDING + STAGE_W / 2 + radius;
  const cy = PADDING + STAGE_H / 2 + radius;

  const stages = spec.stages.map((s, index) => {
    const deg = (360 / n) * index;
    const [px, py] = pointAt(cx, cy, radius, deg);
    return { id: s.id, cx: px, cy: py, w: STAGE_W, h: STAGE_H, label: s.label, detail: s.detail, index };
  });

  const arcs: CycleLayout['arcs'] = spec.stages.map((_, index) => {
    const next = (index + 1) % n;
    const fromDeg = (360 / n) * index + ARC_INSET_DEG;
    const toDeg = (360 / n) * next - ARC_INSET_DEG;
    const [x1, y1] = pointAt(cx, cy, radius, fromDeg);
    const [x2, y2] = pointAt(cx, cy, radius, toDeg);
    return { fromIndex: index, toIndex: next, x1, y1, x2, y2, sweep: 1 as const };
  });

  return {
    width: (cx + STAGE_W / 2 + radius + PADDING) - 0,
    height: (cy + STAGE_H / 2 + radius + PADDING) - 0,
    centre: [cx, cy],
    radius,
    stages,
    arcs,
    hubLabel: spec.hubLabel,
  };
}
