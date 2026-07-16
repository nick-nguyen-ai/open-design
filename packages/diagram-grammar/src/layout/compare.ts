import type { CompareSpecT } from '../specs.js';
import { PADDING } from './flow.js';

/**
 * Compare (versus) layout: a fixed row-label gutter, then one equal column
 * per compared thing; header row, one row per contrast, optional verdict
 * strip across the full width at the bottom.
 */

const LABEL_W = 150;
const COL_W = 200;
const COL_GAP = 14;
const HEADER_H = 52;
const ROW_H = 64;
const ROW_GAP = 10;
const VERDICT_H = 52;

export interface CompareLayout {
  width: number;
  height: number;
  labelW: number;
  columns: Array<{ id: string; x: number; w: number; label: string; tone: 'base' | 'accent'; index: number }>;
  rows: Array<{ label: string; y: number; h: number; cells: Array<{ x: number; w: number; value: string }> }>;
  verdictAt: { x: number; y: number; w: number; h: number } | null;
  headerH: number;
}

export function layoutCompare(spec: CompareSpecT): CompareLayout {
  const columns = spec.columns.map((c, index) => ({
    id: c.id,
    x: PADDING + LABEL_W + COL_GAP + index * (COL_W + COL_GAP),
    w: COL_W,
    label: c.label,
    tone: c.tone ?? ('base' as const),
    index,
  }));

  const rows = spec.rows.map((r, i) => ({
    label: r.label,
    y: PADDING + HEADER_H + ROW_GAP + i * (ROW_H + ROW_GAP),
    h: ROW_H,
    cells: r.values.map((value, j) => ({ x: columns[j]!.x, w: COL_W, value })),
  }));

  const width = PADDING * 2 + LABEL_W + COL_GAP + columns.length * (COL_W + COL_GAP) - COL_GAP;
  const rowsBottom = PADDING + HEADER_H + ROW_GAP + spec.rows.length * (ROW_H + ROW_GAP);
  const verdictAt =
    spec.verdict !== undefined
      ? { x: PADDING, y: rowsBottom, w: width - PADDING * 2, h: VERDICT_H }
      : null;

  return {
    width,
    height: rowsBottom + (verdictAt ? VERDICT_H + ROW_GAP : 0) + PADDING,
    labelW: LABEL_W,
    columns,
    rows,
    verdictAt,
    headerH: HEADER_H,
  };
}
